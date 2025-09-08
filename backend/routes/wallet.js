const express = require('express');
const { body, validationResult } = require('express-validator');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { authenticateToken, requireVerification } = require('../middleware/auth');

const router = express.Router();

// Get wallet details
router.get('/', authenticateToken, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    
    if (!wallet) {
      // Create wallet if it doesn't exist
      const newWallet = new Wallet({ userId: req.user._id });
      await newWallet.save();
      return res.json({
        success: true,
        data: { wallet: newWallet }
      });
    }

    res.json({
      success: true,
      data: { wallet }
    });

  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wallet information'
    });
  }
});

// Get transaction history
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const type = req.query.type;
    const status = req.query.status;

    const query = { userId: req.user._id };
    if (type) query.type = type;
    if (status) query.status = status;

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('relatedOrderId', 'orderId platform orderAmount')
      .populate('relatedAdId', 'title')
      .populate('relatedOfferId', 'title merchant');

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transaction history'
    });
  }
});

// Request withdrawal
router.post('/withdraw', [
  authenticateToken,
  requireVerification,
  body('amount').isFloat({ min: 100 }).withMessage('Minimum withdrawal amount is ₹100'),
  body('method').isIn(['bank_transfer', 'upi', 'paypal']).withMessage('Invalid withdrawal method'),
  body('accountDetails').isObject().withMessage('Account details are required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { amount, method, accountDetails } = req.body;

    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Check if user can withdraw
    if (!wallet.canWithdraw(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance or withdrawal conditions not met'
      });
    }

    // Create withdrawal transaction
    const transaction = new Transaction({
      userId: req.user._id,
      walletId: wallet._id,
      type: 'withdrawal',
      amount: -amount,
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance - amount,
      description: `Withdrawal request via ${method}`,
      status: 'pending',
      withdrawalDetails: {
        method,
        accountDetails,
        netAmount: amount // Processing fee would be calculated here
      },
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        source: 'web'
      }
    });

    await transaction.save();

    // Update wallet
    await wallet.requestWithdrawal(amount);

    res.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: {
        transaction,
        wallet
      }
    });

  } catch (error) {
    console.error('Withdrawal request error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process withdrawal request'
    });
  }
});

// Get withdrawal history
router.get('/withdrawals', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;

    const query = {
      userId: req.user._id,
      type: 'withdrawal'
    };
    
    if (status) query.status = status;

    const withdrawals = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: {
        withdrawals,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });

  } catch (error) {
    console.error('Get withdrawals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get withdrawal history'
    });
  }
});

// Add funds (for testing or manual top-up)
router.post('/add-funds', [
  authenticateToken,
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be positive'),
  body('description').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { amount, description = 'Funds added' } = req.body;

    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Create credit transaction
    const transaction = new Transaction({
      userId: req.user._id,
      walletId: wallet._id,
      type: 'deposit',
      amount,
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance + amount,
      description,
      status: 'completed',
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        source: 'web'
      }
    });

    await transaction.save();

    // Update wallet
    await wallet.addFunds(amount, description);

    res.json({
      success: true,
      message: 'Funds added successfully',
      data: {
        transaction,
        wallet
      }
    });

  } catch (error) {
    console.error('Add funds error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add funds'
    });
  }
});

// Get wallet statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const period = req.query.period || '30d';
    
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Get transaction stats
    const transactionStats = await Transaction.getTransactionStats(req.user._id, period);

    res.json({
      success: true,
      data: {
        wallet,
        transactionStats,
        monthlyStats: wallet.monthlyStats
      }
    });

  } catch (error) {
    console.error('Get wallet stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wallet statistics'
    });
  }
});

// Set wallet PIN
router.post('/set-pin', [
  authenticateToken,
  body('pin').isLength({ min: 4, max: 6 }).withMessage('PIN must be 4-6 digits'),
  body('confirmPin').custom((value, { req }) => {
    if (value !== req.body.pin) {
      throw new Error('PIN confirmation does not match');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { pin } = req.body;

    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // In production, hash the PIN
    wallet.pin = pin;
    wallet.pinAttempts = 0;
    wallet.pinLockedUntil = undefined;
    await wallet.save();

    res.json({
      success: true,
      message: 'Wallet PIN set successfully'
    });

  } catch (error) {
    console.error('Set PIN error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set wallet PIN'
    });
  }
});

// Verify wallet PIN
router.post('/verify-pin', [
  authenticateToken,
  body('pin').isLength({ min: 4, max: 6 }).withMessage('PIN must be 4-6 digits')
], async (req, res) => {
  try {
    const { pin } = req.body;

    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    const isValid = await wallet.verifyPin(pin);

    res.json({
      success: true,
      message: 'PIN verified successfully',
      data: { verified: isValid }
    });

  } catch (error) {
    console.error('Verify PIN error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'PIN verification failed'
    });
  }
});

module.exports = router;

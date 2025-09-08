const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { authenticateToken: protect } = require('../middleware/auth');
const config = require('../config');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || config.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET || config.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/payments/razorpay/create-order
// @access  Private
router.post('/razorpay/create-order', protect, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be at least ₹1'
      });
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: receipt || `order_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID || config.RAZORPAY_KEY_ID
      }
    });

  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
});

// @desc    Verify Razorpay payment
// @route   POST /api/payments/razorpay/verify
// @access  Private
router.post('/razorpay/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification data'
      });
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || config.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Payment verified successfully
    // TODO: Update user wallet, create transaction record, etc.
    console.log('Payment verified:', { razorpay_order_id, razorpay_payment_id });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        status: 'completed'
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
});

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Private
router.get('/methods', protect, async (req, res) => {
  try {
    const paymentMethods = [
      {
        id: 'razorpay',
        name: 'Razorpay',
        description: 'Cards, UPI, Net Banking, Wallets',
        fees: '2.5%',
        enabled: true
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Direct bank transfer',
        fees: 'Free',
        enabled: true
      },
      {
        id: 'upi',
        name: 'UPI',
        description: 'Pay using UPI apps',
        fees: 'Free',
        enabled: true
      }
    ];

    res.json({
      success: true,
      data: paymentMethods
    });

  } catch (error) {
    console.error('Payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment methods'
    });
  }
});

// @desc    Add payment method for user
// @route   POST /api/payments/methods
// @access  Private
router.post('/methods', protect, async (req, res) => {
  try {
    const { type, details } = req.body;
    const userId = req.user.id;

    // TODO: Implement adding payment method to user profile
    console.log('Adding payment method:', { userId, type, details });

    res.json({
      success: true,
      message: 'Payment method added successfully',
      data: {
        id: `pm_${Date.now()}`,
        type,
        details,
        userId
      }
    });

  } catch (error) {
    console.error('Add payment method error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add payment method'
    });
  }
});

// @desc    Delete payment method
// @route   DELETE /api/payments/methods/:id
// @access  Private
router.delete('/methods/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // TODO: Implement deleting payment method from user profile
    console.log('Deleting payment method:', { userId, methodId: id });

    res.json({
      success: true,
      message: 'Payment method deleted successfully'
    });

  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete payment method'
    });
  }
});

// @desc    Get Razorpay public key
// @route   GET /api/payments/razorpay/key
// @access  Public
router.get('/razorpay/key', (req, res) => {
  res.json({
    success: true,
    keyId: process.env.RAZORPAY_KEY_ID || config.RAZORPAY_KEY_ID
  });
});

module.exports = router;

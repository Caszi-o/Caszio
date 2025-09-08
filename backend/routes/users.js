const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Order = require('../models/Order');
const { authenticateToken, requireVerification } = require('../middleware/auth');
const { uploadToCloudinary } = require('../utils/cloudinary');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('referredBy', 'firstName lastName')
      .select('-password -refreshTokens -twoFactorSecret');

    const wallet = await Wallet.findOne({ userId: req.user._id });

    res.json({
      success: true,
      data: {
        user,
        wallet
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
});

// Update user profile
router.put('/profile', [
  authenticateToken,
  body('firstName').optional().trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').optional().trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  body('dateOfBirth').optional().isISO8601().withMessage('Valid date required'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender')
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

    const updateFields = ['firstName', 'lastName', 'phone', 'dateOfBirth', 'gender'];
    const updates = {};

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -refreshTokens -twoFactorSecret');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Update user address
router.put('/address', [
  authenticateToken,
  body('street').optional().trim().isLength({ min: 5 }).withMessage('Street address must be at least 5 characters'),
  body('city').optional().trim().isLength({ min: 2 }).withMessage('City must be at least 2 characters'),
  body('state').optional().trim().isLength({ min: 2 }).withMessage('State must be at least 2 characters'),
  body('country').optional().trim().isLength({ min: 2 }).withMessage('Country must be at least 2 characters'),
  body('pincode').optional().trim().isLength({ min: 5, max: 10 }).withMessage('Valid pincode required')
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

    const { street, city, state, country, pincode } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        address: {
          street,
          city,
          state,
          country,
          pincode
        }
      },
      { new: true, runValidators: true }
    ).select('-password -refreshTokens -twoFactorSecret');

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update address'
    });
  }
});

// Upload profile picture
router.post('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Upload to cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer, {
      folder: 'casyoro/avatars',
      transformation: [
        { width: 200, height: 200, crop: 'fill' },
        { quality: 'auto', format: 'auto' }
      ]
    });

    // Update user avatar
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: uploadResult.secure_url },
      { new: true }
    ).select('-password -refreshTokens -twoFactorSecret');

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      data: {
        user,
        avatarUrl: uploadResult.secure_url
      }
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar'
    });
  }
});

// Get user dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    
    // Get recent orders
    const recentOrders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get order statistics
    const orderStats = await Order.getOrderStats(req.user._id);

    // Get monthly earnings
    const currentMonth = new Date().toISOString().substring(0, 7);
    const monthlyEarnings = wallet?.monthlyStats?.find(stat => stat.month === currentMonth);

    res.json({
      success: true,
      data: {
        wallet,
        recentOrders,
        orderStats: orderStats[0] || {
          totalOrders: 0,
          totalAmount: 0,
          totalCashback: 0,
          pendingCashback: 0,
          creditedCashback: 0
        },
        monthlyEarnings: monthlyEarnings || {
          earnings: 0,
          withdrawals: 0,
          transactions: 0
        }
      }
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data'
    });
  }
});

// Get user orders
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const platform = req.query.platform;

    const query = { userId: req.user._id };
    
    if (status) query.status = status;
    if (platform) query.platform = platform;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders'
    });
  }
});

// Link ecommerce account
router.post('/link-account', [
  authenticateToken,
  requireVerification,
  body('platform').isIn(['amazon', 'flipkart', 'myntra', 'ajio', 'nykaa', 'tatacliq', 'firstcry']).withMessage('Invalid platform'),
  body('accountId').notEmpty().withMessage('Account ID is required'),
  body('accessToken').optional().isString()
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

    const { platform, accountId, accessToken, refreshToken } = req.body;

    // Check if account is already linked
    const existingAccount = req.user.ecommerceAccounts.find(
      acc => acc.platform === platform && acc.accountId === accountId
    );

    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: 'Account is already linked'
      });
    }

    // Add new account
    req.user.ecommerceAccounts.push({
      platform,
      accountId,
      accessToken,
      refreshToken,
      linkedAt: new Date()
    });

    await req.user.save();

    res.json({
      success: true,
      message: 'Account linked successfully'
    });

  } catch (error) {
    console.error('Link account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to link account'
    });
  }
});

// Unlink ecommerce account
router.delete('/unlink-account/:platform/:accountId', authenticateToken, async (req, res) => {
  try {
    const { platform, accountId } = req.params;

    req.user.ecommerceAccounts = req.user.ecommerceAccounts.filter(
      acc => !(acc.platform === platform && acc.accountId === accountId)
    );

    await req.user.save();

    res.json({
      success: true,
      message: 'Account unlinked successfully'
    });

  } catch (error) {
    console.error('Unlink account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unlink account'
    });
  }
});

// Update notification preferences
router.put('/preferences', [
  authenticateToken,
  body('emailNotifications').optional().isBoolean(),
  body('smsNotifications').optional().isBoolean(),
  body('marketingEmails').optional().isBoolean()
], async (req, res) => {
  try {
    const { emailNotifications, smsNotifications, marketingEmails } = req.body;

    const preferences = {};
    if (emailNotifications !== undefined) preferences.emailNotifications = emailNotifications;
    if (smsNotifications !== undefined) preferences.smsNotifications = smsNotifications;
    if (marketingEmails !== undefined) preferences.marketingEmails = marketingEmails;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferences },
      { new: true }
    ).select('-password -refreshTokens -twoFactorSecret');

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences'
    });
  }
});

// Update bank details
router.put('/bank-details', [
  authenticateToken,
  body('accountNumber').isLength({ min: 9, max: 18 }).withMessage('Valid account number required'),
  body('ifscCode').matches(/^[A-Z]{4}0[A-Z0-9]{6}$/).withMessage('Valid IFSC code required'),
  body('bankName').trim().isLength({ min: 2 }).withMessage('Bank name is required'),
  body('accountHolderName').trim().isLength({ min: 2 }).withMessage('Account holder name is required')
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

    const { accountNumber, ifscCode, bankName, accountHolderName } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        bankDetails: {
          accountNumber,
          ifscCode,
          bankName,
          accountHolderName,
          isVerified: false // Admin verification required
        }
      },
      { new: true }
    ).select('-password -refreshTokens -twoFactorSecret');

    res.json({
      success: true,
      message: 'Bank details updated successfully. Verification pending.',
      data: { user }
    });

  } catch (error) {
    console.error('Update bank details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update bank details'
    });
  }
});

// Delete user account
router.delete('/account', [
  authenticateToken,
  body('password').notEmpty().withMessage('Password is required'),
  body('confirmation').equals('DELETE').withMessage('Type DELETE to confirm account deletion')
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

    const { password } = req.body;

    // Verify password
    if (!await req.user.comparePassword(password)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Check for pending withdrawals or positive balance
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (wallet && (wallet.balance > 0 || wallet.pendingWithdrawals > 0)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete account with pending funds. Please withdraw all funds first.'
      });
    }

    // Soft delete - mark as deleted
    req.user.isActive = false;
    req.user.deletedAt = new Date();
    req.user.email = `deleted_${Date.now()}_${req.user.email}`;
    await req.user.save();

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
});

module.exports = router;

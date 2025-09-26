const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Publisher = require('../models/Publisher');
const Ad = require('../models/Ad');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const Offer = require('../models/Offer');
const Partnership = require('../models/Partnership');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply admin authorization to all routes
router.use(authenticateToken);
router.use(authorize('admin'));

// Dashboard Overview
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // User statistics
    const totalUsers = await User.countDocuments();
    const newUsersToday = await User.countDocuments({ createdAt: { $gte: startOfDay } });
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const activeUsers = await User.countDocuments({ 
      lastLoginAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
    });

    // Publisher statistics
    const totalPublishers = await Publisher.countDocuments();
    const approvedPublishers = await Publisher.countDocuments({ verificationStatus: 'verified' });
    const pendingPublishers = await Publisher.countDocuments({ verificationStatus: 'pending' });

    // Partnership statistics
    const totalPartnerships = await Partnership.countDocuments();
    const pendingPartnerships = await Partnership.countDocuments({ status: 'pending' });
    const approvedPartnerships = await Partnership.countDocuments({ status: 'approved' });

    // Ad statistics
    const totalAds = await Ad.countDocuments();
    const activeAds = await Ad.countDocuments({ status: 'active' });
    const pendingAds = await Ad.countDocuments({ status: 'pending_review' });

    // Financial statistics
    const totalRevenue = await Transaction.aggregate([
      { $match: { status: 'completed', type: { $in: ['subscription_fee', 'ad_revenue'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const monthlyRevenue = await Transaction.aggregate([
      { $match: { 
        status: 'completed', 
        type: { $in: ['subscription_fee', 'ad_revenue'] },
        createdAt: { $gte: startOfMonth }
      }},
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalCashback = await Order.aggregate([
      { $match: { cashbackStatus: 'credited' } },
      { $group: { _id: null, total: { $sum: '$cashbackAmount' } } }
    ]);

    // Recent activities
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email createdAt role');

    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'firstName lastName email');

    // Growth metrics (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const revenueGrowth = await Transaction.aggregate([
      {
        $match: {
          status: 'completed',
          type: { $in: ['subscription_fee', 'ad_revenue'] },
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          users: {
            total: totalUsers,
            newToday: newUsersToday,
            verified: verifiedUsers,
            active: activeUsers
          },
          publishers: {
            total: totalPublishers,
            approved: approvedPublishers,
            pending: pendingPublishers
          },
          partnerships: {
            total: totalPartnerships,
            pending: pendingPartnerships,
            approved: approvedPartnerships
          },
          ads: {
            total: totalAds,
            active: activeAds,
            pending: pendingAds
          },
          financials: {
            totalRevenue: totalRevenue[0]?.total || 0,
            monthlyRevenue: monthlyRevenue[0]?.total || 0,
            totalCashback: totalCashback[0]?.total || 0
          }
        },
        recentActivities: {
          users: recentUsers,
          transactions: recentTransactions
        },
        growth: {
          users: userGrowth,
          revenue: revenueGrowth,
          period: last7Days
        }
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data'
    });
  }
});

// User Management
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search;
    const role = req.query.role;
    const status = req.query.status;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) query.role = role;
    if (status === 'verified') query.isVerified = true;
    if (status === 'unverified') query.isVerified = false;
    if (status === 'blocked') query.isBlocked = true;

    const users = await User.find(query)
      .sort({ [sortBy]: sortOrder })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('-password -refreshToken');

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
});

// Update user
router.put('/users/:id', [
  body('role').optional().isIn(['user', 'publisher', 'admin']),
  body('isVerified').optional().isBoolean(),
  body('isBlocked').optional().isBoolean()
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

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { role, isVerified, isBlocked, notes } = req.body;

    if (role !== undefined) user.role = role;
    if (isVerified !== undefined) user.isVerified = isVerified;
    if (isBlocked !== undefined) user.isBlocked = isBlocked;
    if (notes !== undefined) user.adminNotes = notes;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

// Publisher Management
router.get('/publishers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const search = req.query.search;

    const query = {};
    if (status) query.verificationStatus = status;
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { businessEmail: { $regex: search, $options: 'i' } }
      ];
    }

    const publishers = await Publisher.find(query)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Publisher.countDocuments(query);

    res.json({
      success: true,
      data: {
        publishers,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });

  } catch (error) {
    console.error('Get publishers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get publishers'
    });
  }
});

// Approve/Reject publisher
router.patch('/publishers/:id/verification', [
  body('status').isIn(['verified', 'rejected']).withMessage('Invalid status'),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const { status, notes } = req.body;

    const publisher = await Publisher.findById(req.params.id);
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher not found'
      });
    }

    publisher.verificationStatus = status;
    publisher.verifiedBy = req.user._id;
    publisher.verifiedAt = new Date();
    if (notes) publisher.verificationNotes = notes;

    await publisher.save();

    // Update user role if approved
    if (status === 'verified') {
      await User.findByIdAndUpdate(publisher.userId, { role: 'publisher' });
    }

    res.json({
      success: true,
      message: `Publisher ${status} successfully`,
      data: { publisher }
    });

  } catch (error) {
    console.error('Publisher verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update publisher verification'
    });
  }
});


// Ad Management
router.get('/ads', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const search = req.query.search;

    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const ads = await Ad.find(query)
      .populate('publisherId', 'businessName userId')
      .populate('publisherId.userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Ad.countDocuments(query);

    res.json({
      success: true,
      data: {
        ads,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });

  } catch (error) {
    console.error('Get ads error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get ads'
    });
  }
});

// Approve/Reject ad
router.patch('/ads/:id/review', [
  body('status').isIn(['approved', 'rejected']).withMessage('Invalid status'),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const { status, notes } = req.body;

    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    ad.status = status === 'approved' ? 'active' : 'rejected';
    ad.reviewedBy = req.user._id;
    ad.reviewedAt = new Date();
    if (notes) ad.rejectionReason = notes;

    await ad.save();

    res.json({
      success: true,
      message: `Ad ${status} successfully`,
      data: { ad }
    });

  } catch (error) {
    console.error('Ad review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to review ad'
    });
  }
});

// Financial Management
router.get('/transactions', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const type = req.query.type;
    const status = req.query.status;
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;

    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const transactions = await Transaction.find(query)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(query);

    // Get summary statistics
    const summary = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          completedAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0]
            }
          },
          pendingAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0]
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        transactions,
        summary: summary[0] || {
          totalAmount: 0,
          completedAmount: 0,
          pendingAmount: 0,
          count: 0
        },
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
      message: 'Failed to get transactions'
    });
  }
});


// Content Management - Offers
router.get('/offers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const search = req.query.search;

    const query = {};
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { store: { $regex: search, $options: 'i' } }
      ];
    }

    const offers = await Offer.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Offer.countDocuments(query);

    res.json({
      success: true,
      data: {
        offers,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });

  } catch (error) {
    console.error('Get offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get offers'
    });
  }
});

// Create offer
router.post('/offers', [
  body('title').trim().isLength({ min: 3 }).withMessage('Title is required'),
  body('store').trim().isLength({ min: 2 }).withMessage('Store is required'),
  body('discountType').isIn(['percentage', 'fixed']).withMessage('Invalid discount type'),
  body('discountValue').isFloat({ min: 0 }).withMessage('Discount value must be positive')
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

    const offer = new Offer({
      ...req.body,
      createdBy: req.user._id
    });

    await offer.save();

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: { offer }
    });

  } catch (error) {
    console.error('Create offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create offer'
    });
  }
});

// Update offer
router.put('/offers/:id', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user._id },
      { new: true, runValidators: true }
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    res.json({
      success: true,
      message: 'Offer updated successfully',
      data: { offer }
    });

  } catch (error) {
    console.error('Update offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update offer'
    });
  }
});

// System Analytics
router.get('/analytics', async (req, res) => {
  try {
    const period = req.query.period || '30d';
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // User registration trends
    const userTrends = await User.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Revenue trends
    const revenueTrends = await Transaction.aggregate([
      {
        $match: {
          status: 'completed',
          type: { $in: ['subscription_fee', 'ad_revenue'] },
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top performing ads
    const topAds = await Ad.aggregate([
      {
        $match: {
          status: 'active',
          'metrics.clicks': { $gt: 0 }
        }
      },
      {
        $addFields: {
          ctr: {
            $multiply: [
              { $divide: ['$metrics.clicks', '$metrics.impressions'] },
              100
            ]
          }
        }
      },
      {
        $sort: { ctr: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'publishers',
          localField: 'publisherId',
          foreignField: '_id',
          as: 'publisher'
        }
      }
    ]);

    // Platform distribution
    const platformStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        userTrends,
        revenueTrends,
        topAds,
        platformStats,
        period
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics data'
    });
  }
});

// System Settings
router.get('/settings', async (req, res) => {
  try {
    // In a real implementation, this would come from a settings collection
    const settings = {
      platform: {
        name: 'Caszio',
        version: '1.0.0',
        maintenanceMode: false,
        registrationEnabled: true
      },
      cashback: {
        defaultRate: 2.0,
        maxRate: 10.0,
        minPayout: 100
      },
      publishers: {
        verificationRequired: true,
        autoApproval: false,
        maxAdsPerAccount: 50
      },
      security: {
        twoFactorRequired: false,
        sessionTimeout: 24,
        maxLoginAttempts: 5
      }
    };

    res.json({
      success: true,
      data: { settings }
    });

  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get settings'
    });
  }
});

module.exports = router;

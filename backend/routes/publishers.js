const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const Publisher = require('../models/Publisher');
const Ad = require('../models/Ad');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Offer = require('../models/Offer');
const { authenticateToken, authorize, requireKYC } = require('../middleware/auth');
const { uploadToCloudinary } = require('../utils/cloudinary');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'), false);
    }
  }
});

// Apply for publisher account
router.post('/apply', [
  authenticateToken,
  requireKYC,
  body('businessName').trim().isLength({ min: 2 }).withMessage('Business name is required'),
  body('businessType').isIn(['individual', 'partnership', 'private_limited', 'llp', 'other']).withMessage('Invalid business type'),
  body('industry').trim().isLength({ min: 2 }).withMessage('Industry is required'),
  body('website').optional().isURL().withMessage('Valid website URL required'),
  body('businessEmail').isEmail().withMessage('Valid business email required'),
  body('businessPhone').isMobilePhone().withMessage('Valid business phone required')
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

    // Check if user already has publisher account
    const existingPublisher = await Publisher.findOne({ userId: req.user._id });
    if (existingPublisher) {
      return res.status(400).json({
        success: false,
        message: 'Publisher account already exists'
      });
    }

    const {
      businessName,
      businessType,
      industry,
      website,
      description,
      businessEmail,
      businessPhone,
      contactPerson,
      businessAddress
    } = req.body;

    const publisher = new Publisher({
      userId: req.user._id,
      businessName,
      businessType,
      industry,
      website,
      description,
      businessEmail,
      businessPhone,
      contactPerson,
      businessAddress,
      verificationStatus: 'pending'
    });

    await publisher.save();

    res.status(201).json({
      success: true,
      message: 'Publisher application submitted successfully',
      data: { publisher }
    });

  } catch (error) {
    console.error('Publisher application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit publisher application'
    });
  }
});

// Get publisher profile
router.get('/profile', [authenticateToken, authorize('publisher', 'admin')], async (req, res) => {
  try {
    const publisher = await Publisher.findOne({ userId: req.user._id })
      .populate('userId', 'firstName lastName email phone')
      .populate('verifiedBy', 'firstName lastName');

    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher account not found'
      });
    }

    res.json({
      success: true,
      data: { publisher }
    });

  } catch (error) {
    console.error('Get publisher profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get publisher profile'
    });
  }
});

// Update publisher profile
router.put('/profile', [
  authenticateToken,
  authorize('publisher', 'admin'),
  body('businessName').optional().trim().isLength({ min: 2 }),
  body('website').optional().isURL(),
  body('businessEmail').optional().isEmail(),
  body('businessPhone').optional().isMobilePhone()
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

    const publisher = await Publisher.findOne({ userId: req.user._id });
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher account not found'
      });
    }

    const updateFields = [
      'businessName', 'website', 'description', 'businessEmail', 
      'businessPhone', 'contactPerson', 'businessAddress'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        publisher[field] = req.body[field];
      }
    });

    await publisher.save();

    res.json({
      success: true,
      message: 'Publisher profile updated successfully',
      data: { publisher }
    });

  } catch (error) {
    console.error('Update publisher profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update publisher profile'
    });
  }
});

// Upload documents
router.post('/documents', [
  authenticateToken,
  authorize('publisher'),
  upload.array('documents', 5)
], async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No documents provided'
      });
    }

    const publisher = await Publisher.findOne({ userId: req.user._id });
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher account not found'
      });
    }

    const uploadedDocs = [];

    for (const file of req.files) {
      const uploadResult = await uploadToCloudinary(file.buffer, {
        folder: 'caszio/publisher-documents',
        resource_type: 'auto'
      });

      const document = {
        type: req.body.type || 'other',
        number: req.body.number || '',
        url: uploadResult.secure_url,
        uploadedAt: new Date()
      };

      publisher.documents.push(document);
      uploadedDocs.push(document);
    }

    await publisher.save();

    res.json({
      success: true,
      message: 'Documents uploaded successfully',
      data: { documents: uploadedDocs }
    });

  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload documents'
    });
  }
});

// Get publisher dashboard
router.get('/dashboard', [authenticateToken, authorize('publisher')], async (req, res) => {
  try {
    const publisher = await Publisher.findOne({ userId: req.user._id });
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher account not found'
      });
    }

    // Get recent ads
    const recentAds = await Ad.find({ publisherId: publisher._id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get active ads count
    const activeAdsCount = await Ad.countDocuments({
      publisherId: publisher._id,
      status: 'active'
    });

    // Get today's metrics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayMetrics = await Ad.aggregate([
      {
        $match: {
          publisherId: publisher._id,
          'dailyMetrics.date': { $gte: today }
        }
      },
      {
        $unwind: '$dailyMetrics'
      },
      {
        $match: {
          'dailyMetrics.date': { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          impressions: { $sum: '$dailyMetrics.impressions' },
          clicks: { $sum: '$dailyMetrics.clicks' },
          conversions: { $sum: '$dailyMetrics.conversions' },
          cost: { $sum: '$dailyMetrics.cost' }
        }
      }
    ]);

    // Get package info
    const packageInfo = {
      current: publisher.currentPackage,
      startDate: publisher.packageStartDate,
      endDate: publisher.packageEndDate,
      status: publisher.packageStatus,
      features: publisher.packageFeatures
    };

    res.json({
      success: true,
      data: {
        publisher,
        recentAds,
        activeAdsCount,
        todayMetrics: todayMetrics[0] || {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          cost: 0
        },
        packageInfo
      }
    });

  } catch (error) {
    console.error('Get publisher dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get publisher dashboard'
    });
  }
});

// Get all ads
router.get('/ads', [authenticateToken, authorize('publisher')], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const type = req.query.type;

    const publisher = await Publisher.findOne({ userId: req.user._id });
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher account not found'
      });
    }

    const query = { publisherId: publisher._id };
    if (status) query.status = status;
    if (type) query.type = type;

    const ads = await Ad.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
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

// Create new ad
router.post('/ads', [
  authenticateToken,
  authorize('publisher'),
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('type').isIn(['banner', 'text', 'video', 'native', 'popup', 'interstitial']).withMessage('Invalid ad type'),
  body('landingPage.url').isURL().withMessage('Valid landing page URL required'),
  body('budget.amount').isFloat({ min: 100 }).withMessage('Minimum budget is ₹100'),
  body('bidding.amount').isFloat({ min: 0.10 }).withMessage('Minimum bid is ₹0.10')
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

    const publisher = await Publisher.findOne({ userId: req.user._id });
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher account not found'
      });
    }

    // Check if publisher can create ad
    if (!publisher.canCreateAd()) {
      return res.status(403).json({
        success: false,
        message: 'Cannot create ad. Check verification status, package limits, or account status.'
      });
    }

    const {
      title,
      description,
      type,
      format,
      creatives,
      targeting,
      budget,
      bidding,
      schedule,
      landingPage,
      cta,
      allowedSlots,
      frequencyCap,
      category,
      tags
    } = req.body;

    const ad = new Ad({
      publisherId: publisher._id,
      title,
      description,
      type,
      format,
      creatives,
      targeting,
      budget: {
        ...budget,
        remaining: budget.amount
      },
      bidding,
      schedule,
      landingPage,
      cta,
      allowedSlots,
      frequencyCap,
      category,
      tags,
      status: 'pending_review'
    });

    await ad.save();

    // Update publisher stats
    publisher.stats.totalAds += 1;
    await publisher.save();

    res.status(201).json({
      success: true,
      message: 'Ad created successfully and submitted for review',
      data: { ad }
    });

  } catch (error) {
    console.error('Create ad error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create ad'
    });
  }
});

// Get single ad
router.get('/ads/:id', [authenticateToken, authorize('publisher')], async (req, res) => {
  try {
    const publisher = await Publisher.findOne({ userId: req.user._id });
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher account not found'
      });
    }

    const ad = await Ad.findOne({
      _id: req.params.id,
      publisherId: publisher._id
    });

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    res.json({
      success: true,
      data: { ad }
    });

  } catch (error) {
    console.error('Get ad error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get ad'
    });
  }
});

// Update ad
router.put('/ads/:id', [
  authenticateToken,
  authorize('publisher'),
  body('title').optional().trim().isLength({ min: 3 }),
  body('landingPage.url').optional().isURL(),
  body('budget.amount').optional().isFloat({ min: 100 }),
  body('bidding.amount').optional().isFloat({ min: 0.10 })
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

    const publisher = await Publisher.findOne({ userId: req.user._id });
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher account not found'
      });
    }

    const ad = await Ad.findOne({
      _id: req.params.id,
      publisherId: publisher._id
    });

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Only allow updates for draft or paused ads
    if (!['draft', 'paused', 'rejected'].includes(ad.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update ad in current status'
      });
    }

    const updateFields = [
      'title', 'description', 'format', 'creatives', 'targeting',
      'budget', 'bidding', 'schedule', 'landingPage', 'cta',
      'allowedSlots', 'frequencyCap', 'category', 'tags'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        ad[field] = req.body[field];
      }
    });

    // Reset to pending review if was rejected
    if (ad.status === 'rejected') {
      ad.status = 'pending_review';
      ad.rejectionReason = undefined;
    }

    await ad.save();

    res.json({
      success: true,
      message: 'Ad updated successfully',
      data: { ad }
    });

  } catch (error) {
    console.error('Update ad error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ad'
    });
  }
});

// Pause/Resume ad
router.patch('/ads/:id/status', [
  authenticateToken,
  authorize('publisher'),
  body('action').isIn(['pause', 'resume']).withMessage('Invalid action')
], async (req, res) => {
  try {
    const { action } = req.body;

    const publisher = await Publisher.findOne({ userId: req.user._id });
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher account not found'
      });
    }

    const ad = await Ad.findOne({
      _id: req.params.id,
      publisherId: publisher._id
    });

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    if (action === 'pause' && ad.status === 'active') {
      ad.status = 'paused';
    } else if (action === 'resume' && ad.status === 'paused') {
      ad.status = 'active';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid status transition'
      });
    }

    await ad.save();

    res.json({
      success: true,
      message: `Ad ${action}d successfully`,
      data: { ad }
    });

  } catch (error) {
    console.error('Update ad status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ad status'
    });
  }
});

// Delete ad
router.delete('/ads/:id', [authenticateToken, authorize('publisher')], async (req, res) => {
  try {
    const publisher = await Publisher.findOne({ userId: req.user._id });
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher account not found'
      });
    }

    const ad = await Ad.findOne({
      _id: req.params.id,
      publisherId: publisher._id
    });

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Only allow deletion of draft, rejected, or completed ads
    if (!['draft', 'rejected', 'completed'].includes(ad.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete ad in current status'
      });
    }

    await Ad.findByIdAndDelete(req.params.id);

    // Update publisher stats
    publisher.stats.totalAds = Math.max(0, publisher.stats.totalAds - 1);
    await publisher.save();

    res.json({
      success: true,
      message: 'Ad deleted successfully'
    });

  } catch (error) {
    console.error('Delete ad error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete ad'
    });
  }
});

// Get ad metrics
router.get('/ads/:id/metrics', [authenticateToken, authorize('publisher')], async (req, res) => {
  try {
    const period = req.query.period || '7d';
    const granularity = req.query.granularity || 'daily';

    const publisher = await Publisher.findOne({ userId: req.user._id });
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher account not found'
      });
    }

    const ad = await Ad.findOne({
      _id: req.params.id,
      publisherId: publisher._id
    });

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let metrics;
    if (granularity === 'hourly') {
      metrics = ad.hourlyMetrics.filter(m => m.hour >= startDate);
    } else {
      metrics = ad.dailyMetrics.filter(m => m.date >= startDate);
    }

    res.json({
      success: true,
      data: {
        ad: {
          title: ad.title,
          status: ad.status,
          metrics: ad.metrics
        },
        timeSeriesMetrics: metrics,
        period,
        granularity
      }
    });

  } catch (error) {
    console.error('Get ad metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get ad metrics'
    });
  }
});

// Get wallet/financial info
router.get('/wallet', [authenticateToken, authorize('publisher')], async (req, res) => {
  try {
    const publisher = await Publisher.findOne({ userId: req.user._id });
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher account not found'
      });
    }

    res.json({
      success: true,
      data: {
        walletBalance: publisher.walletBalance,
        totalSpent: publisher.totalSpent,
        monthlyMetrics: publisher.monthlyMetrics,
        nextBillingDate: publisher.nextBillingDate
      }
    });

  } catch (error) {
    console.error('Get publisher wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wallet information'
    });
  }
});

// Top up wallet
router.post('/wallet/topup', [
  authenticateToken,
  authorize('publisher'),
  body('amount').isFloat({ min: 500 }).withMessage('Minimum top-up amount is ₹500'),
  body('paymentMethod').isIn(['razorpay', 'stripe', 'bank_transfer']).withMessage('Invalid payment method')
], async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;

    const publisher = await Publisher.findOne({ userId: req.user._id });
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher account not found'
      });
    }

    // In a real implementation, this would integrate with payment gateway
    // For now, we'll create a pending transaction
    const transaction = new Transaction({
      userId: req.user._id,
      type: 'deposit',
      amount,
      status: 'pending',
      description: `Wallet top-up via ${paymentMethod}`,
      paymentDetails: {
        gateway: paymentMethod,
        paymentMethod
      },
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        source: 'publisher_dashboard'
      }
    });

    await transaction.save();

    res.json({
      success: true,
      message: 'Top-up request created. Complete payment to add funds.',
      data: {
        transaction,
        paymentDetails: {
          amount,
          currency: 'INR',
          transactionId: transaction.transactionId
        }
      }
    });

  } catch (error) {
    console.error('Wallet top-up error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process wallet top-up'
    });
  }
});

// Get payment history
router.get('/payments', [authenticateToken, authorize('publisher')], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const publisher = await Publisher.findOne({ userId: req.user._id });
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher account not found'
      });
    }

    const payments = await Transaction.find({
      userId: req.user._id,
      type: { $in: ['deposit', 'publisher_payment'] }
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Transaction.countDocuments({
      userId: req.user._id,
      type: { $in: ['deposit', 'publisher_payment'] }
    });

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment history'
    });
  }
});

// Get packages info
router.get('/packages', async (req, res) => {
  try {
    const packages = {
      basic: {
        name: 'Basic',
        price: 2999,
        billing: 'monthly',
        features: {
          adsPerMonth: 10,
          featuredListings: 2,
          analyticsAccess: true,
          prioritySupport: false,
          customBranding: false
        },
        limits: {
          dailyBudget: 1000,
          monthlyBudget: 25000,
          targeting: 'basic'
        }
      },
      standard: {
        name: 'Standard',
        price: 7999,
        billing: 'monthly',
        features: {
          adsPerMonth: 50,
          featuredListings: 10,
          analyticsAccess: true,
          prioritySupport: true,
          customBranding: false
        },
        limits: {
          dailyBudget: 5000,
          monthlyBudget: 100000,
          targeting: 'advanced'
        }
      },
      premium: {
        name: 'Premium',
        price: 19999,
        billing: 'monthly',
        features: {
          adsPerMonth: 'unlimited',
          featuredListings: 'unlimited',
          analyticsAccess: true,
          prioritySupport: true,
          customBranding: true
        },
        limits: {
          dailyBudget: 'unlimited',
          monthlyBudget: 'unlimited',
          targeting: 'advanced'
        }
      }
    };

    res.json({
      success: true,
      data: { packages }
    });

  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get packages information'
    });
  }
});

// ==================== PUBLISHER OFFER MANAGEMENT ====================

// Get publisher's offers
router.get('/offers', [authenticateToken, authorize('publisher')], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const type = req.query.type;
    const search = req.query.search;

    const publisher = await Publisher.findOne({ userId: req.user._id });
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher account not found'
      });
    }

    const filters = { publisher: publisher._id };
    
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (search) {
      filters.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { 'merchant.name': new RegExp(search, 'i') }
      ];
    }

    const offers = await Offer.find(filters)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('approvedBy', 'firstName lastName');

    const total = await Offer.countDocuments(filters);

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
    console.error('Get publisher offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get offers'
    });
  }
});

// Create new offer
router.post('/offers', [
  authenticateToken,
  authorize('publisher'),
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('type').isIn(['coupon', 'cashback', 'deal', 'bundle']).withMessage('Invalid offer type'),
  body('merchant.name').trim().isLength({ min: 2 }).withMessage('Merchant name is required'),
  body('startDate').isISO8601().withMessage('Valid start date required'),
  body('endDate').isISO8601().withMessage('Valid end date required'),
  body('categories').isArray({ min: 1 }).withMessage('At least one category required')
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

    const publisher = await Publisher.findOne({ userId: req.user._id });
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher account not found'
      });
    }

    const {
      title,
      description,
      shortDescription,
      type,
      merchant,
      couponCode,
      cashbackPercentage,
      flatCashback,
      maxCashback,
      minOrderValue,
      discountType,
      discountValue,
      maxDiscount,
      categories,
      startDate,
      endDate,
      totalUsageLimit,
      userUsageLimit,
      dailyUsageLimit,
      terms,
      exclusions,
      trackingUrl,
      deepLink,
      images,
      bannerImage,
      thumbnailImage
    } = req.body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    const offer = new Offer({
      title,
      description,
      shortDescription,
      type,
      merchant,
      couponCode,
      cashbackPercentage,
      flatCashback,
      maxCashback,
      minOrderValue,
      discountType,
      discountValue,
      maxDiscount,
      categories,
      startDate: start,
      endDate: end,
      totalUsageLimit,
      userUsageLimit,
      dailyUsageLimit,
      terms,
      exclusions,
      trackingUrl,
      deepLink,
      images,
      bannerImage,
      thumbnailImage,
      createdBy: req.user._id,
      publisher: publisher._id,
      status: 'active', // Publisher offers are automatically approved
      approvedBy: req.user._id, // Auto-approved by the publisher
      approvedAt: new Date() // Set approval timestamp
    });

    await offer.save();

    res.status(201).json({
      success: true,
      message: 'Offer created successfully and submitted for approval',
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

// Get single offer
router.get('/offers/:id', [authenticateToken, authorize('publisher')], async (req, res) => {
  try {
    const publisher = await Publisher.findOne({ userId: req.user._id });
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher account not found'
      });
    }

    const offer = await Offer.findOne({
      _id: req.params.id,
      publisher: publisher._id
    }).populate('approvedBy', 'firstName lastName');

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    res.json({
      success: true,
      data: { offer }
    });

  } catch (error) {
    console.error('Get offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get offer'
    });
  }
});

// Update offer
router.put('/offers/:id', [
  authenticateToken,
  authorize('publisher'),
  body('title').optional().trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('startDate').optional().isISO8601().withMessage('Valid start date required'),
  body('endDate').optional().isISO8601().withMessage('Valid end date required')
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

    const publisher = await Publisher.findOne({ userId: req.user._id });
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher account not found'
      });
    }

    const offer = await Offer.findOne({
      _id: req.params.id,
      publisher: publisher._id
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    // Only allow editing if offer is in draft or pending approval
    if (!['draft', 'pending_approval'].includes(offer.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit approved or active offers'
      });
    }

    // Update fields
    const allowedFields = [
      'title', 'description', 'shortDescription', 'merchant', 'couponCode',
      'cashbackPercentage', 'flatCashback', 'maxCashback', 'minOrderValue',
      'discountType', 'discountValue', 'maxDiscount', 'categories',
      'startDate', 'endDate', 'totalUsageLimit', 'userUsageLimit',
      'dailyUsageLimit', 'terms', 'exclusions', 'trackingUrl', 'deepLink',
      'images', 'bannerImage', 'thumbnailImage'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        offer[field] = req.body[field];
      }
    });

    // If dates are being updated, validate them
    if (req.body.startDate || req.body.endDate) {
      const start = new Date(offer.startDate);
      const end = new Date(offer.endDate);
      if (start >= end) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }
    }

    // Reset to pending approval if significant changes made
    if (offer.status === 'draft') {
      offer.status = 'pending_approval';
    }

    await offer.save();

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

// Delete offer
router.delete('/offers/:id', [authenticateToken, authorize('publisher')], async (req, res) => {
  try {
    const publisher = await Publisher.findOne({ userId: req.user._id });
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher account not found'
      });
    }

    const offer = await Offer.findOne({
      _id: req.params.id,
      publisher: publisher._id
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    // Only allow deletion if offer is in draft or pending approval
    if (!['draft', 'pending_approval'].includes(offer.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete approved or active offers'
      });
    }

    await Offer.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Offer deleted successfully'
    });

  } catch (error) {
    console.error('Delete offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete offer'
    });
  }
});

// Get offer analytics
router.get('/offers/:id/analytics', [authenticateToken, authorize('publisher')], async (req, res) => {
  try {
    const publisher = await Publisher.findOne({ userId: req.user._id });
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher account not found'
      });
    }

    const offer = await Offer.findOne({
      _id: req.params.id,
      publisher: publisher._id
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    // Get daily metrics for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyMetrics = await Offer.aggregate([
      {
        $match: {
          _id: offer._id,
          'dailyMetrics.date': { $gte: thirtyDaysAgo }
        }
      },
      {
        $unwind: '$dailyMetrics'
      },
      {
        $match: {
          'dailyMetrics.date': { $gte: thirtyDaysAgo }
        }
      },
      {
        $sort: { 'dailyMetrics.date': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        offer: {
          _id: offer._id,
          title: offer.title,
          status: offer.status,
          metrics: offer.metrics
        },
        dailyMetrics: dailyMetrics.map(doc => doc.dailyMetrics)
      }
    });

  } catch (error) {
    console.error('Get offer analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get offer analytics'
    });
  }
});

module.exports = router;

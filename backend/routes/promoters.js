const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const Promoter = require('../models/Promoter');
const Ad = require('../models/Ad');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { authenticateToken, authorize, requireKYC } = require('../middleware/auth');
const { uploadToCloudinary } = require('../utils/cloudinary');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'), false);
    }
  }
});

// Apply for promoter account
router.post('/apply', [
  authenticateToken,
  requireKYC,
  body('displayName').trim().isLength({ min: 2 }).withMessage('Display name is required'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
  body('platforms').isArray().withMessage('Platforms must be an array'),
  body('monthlyTraffic').isInt({ min: 1000 }).withMessage('Monthly traffic must be at least 1000')
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

    // Check if user already has promoter account
    const existingPromoter = await Promoter.findOne({ userId: req.user._id });
    if (existingPromoter) {
      return res.status(400).json({
        success: false,
        message: 'Promoter account already exists'
      });
    }

    const {
      displayName,
      bio,
      platforms,
      monthlyTraffic,
      audienceDemographics,
      paymentMethod,
      paymentDetails
    } = req.body;

    const promoter = new Promoter({
      userId: req.user._id,
      displayName,
      bio,
      platforms,
      monthlyTraffic,
      audienceDemographics,
      paymentMethod,
      paymentDetails,
      applicationStatus: 'pending'
    });

    await promoter.save();

    res.status(201).json({
      success: true,
      message: 'Promoter application submitted successfully',
      data: { promoter }
    });

  } catch (error) {
    console.error('Promoter application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit promoter application'
    });
  }
});

// Get promoter profile
router.get('/profile', [authenticateToken, authorize('promoter', 'admin')], async (req, res) => {
  try {
    const promoter = await Promoter.findOne({ userId: req.user._id })
      .populate('userId', 'firstName lastName email phone')
      .populate('approvedBy', 'firstName lastName');

    if (!promoter) {
      return res.status(404).json({
        success: false,
        message: 'Promoter account not found'
      });
    }

    res.json({
      success: true,
      data: { promoter }
    });

  } catch (error) {
    console.error('Get promoter profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get promoter profile'
    });
  }
});

// Update promoter profile
router.put('/profile', [
  authenticateToken,
  authorize('promoter', 'admin'),
  body('displayName').optional().trim().isLength({ min: 2 }),
  body('bio').optional().trim().isLength({ max: 500 }),
  body('monthlyTraffic').optional().isInt({ min: 1000 })
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

    const promoter = await Promoter.findOne({ userId: req.user._id });
    if (!promoter) {
      return res.status(404).json({
        success: false,
        message: 'Promoter account not found'
      });
    }

    const updateFields = [
      'displayName', 'bio', 'platforms', 'monthlyTraffic', 
      'audienceDemographics', 'paymentMethod', 'paymentDetails'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        promoter[field] = req.body[field];
      }
    });

    await promoter.save();

    res.json({
      success: true,
      message: 'Promoter profile updated successfully',
      data: { promoter }
    });

  } catch (error) {
    console.error('Update promoter profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update promoter profile'
    });
  }
});

// Get promoter dashboard
router.get('/dashboard', [authenticateToken, authorize('promoter')], async (req, res) => {
  try {
    const promoter = await Promoter.findOne({ userId: req.user._id });
    if (!promoter) {
      return res.status(404).json({
        success: false,
        message: 'Promoter account not found'
      });
    }

    // Get today's metrics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEarnings = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: { $in: ['ad_revenue', 'promoter_payment'] },
          createdAt: { $gte: today },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$amount' },
          totalClicks: { $sum: 1 }
        }
      }
    ]);

    // Get available ads for promotion
    const availableAds = await Ad.find({
      status: 'active',
      'budget.remaining': { $gt: 0 }
    })
    .populate('publisherId', 'businessName')
    .limit(10)
    .sort({ 'bidding.amount': -1 });

    // Get recent earnings
    const recentEarnings = await Transaction.find({
      userId: req.user._id,
      type: { $in: ['ad_revenue', 'promoter_payment'] },
      status: 'completed'
    })
    .sort({ createdAt: -1 })
    .limit(10);

    res.json({
      success: true,
      data: {
        promoter,
        todayEarnings: todayEarnings[0] || { totalEarnings: 0, totalClicks: 0 },
        availableAds,
        recentEarnings
      }
    });

  } catch (error) {
    console.error('Get promoter dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get promoter dashboard'
    });
  }
});

// Get ad scripts
router.get('/scripts', [authenticateToken, authorize('promoter')], async (req, res) => {
  try {
    const promoter = await Promoter.findOne({ userId: req.user._id });
    if (!promoter || promoter.applicationStatus !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Promoter account not approved'
      });
    }

    const { category, format = 'all' } = req.query;

    // Get available ads for promotion
    const query = {
      status: 'active',
      'budget.remaining': { $gt: 0 }
    };

    if (category) {
      query.category = category;
    }

    const ads = await Ad.find(query)
      .populate('publisherId', 'businessName qualityScore')
      .sort({ 'bidding.amount': -1, qualityScore: -1 })
      .limit(50);

    // Generate scripts for each ad
    const adScripts = ads.map(ad => ({
      adId: ad._id,
      title: ad.title,
      type: ad.type,
      bidAmount: ad.bidding.amount,
      biddingModel: ad.bidding.model,
      publisher: ad.publisherId.businessName,
      scripts: {
        html: generateHTMLScript(ad, promoter),
        javascript: generateJavaScriptScript(ad, promoter),
        iframe: generateIframeScript(ad, promoter)
      },
      earnings: {
        perClick: calculateEarnings(ad.bidding.amount, ad.bidding.model, 'click'),
        perImpression: calculateEarnings(ad.bidding.amount, ad.bidding.model, 'impression'),
        perConversion: calculateEarnings(ad.bidding.amount, ad.bidding.model, 'conversion')
      }
    }));

    res.json({
      success: true,
      data: {
        adScripts,
        promoterCode: promoter.referralCode,
        totalAds: ads.length
      }
    });

  } catch (error) {
    console.error('Get ad scripts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get ad scripts'
    });
  }
});

// Get earnings
router.get('/earnings', [authenticateToken, authorize('promoter')], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const period = req.query.period || '30d';
    const type = req.query.type;

    const promoter = await Promoter.findOne({ userId: req.user._id });
    if (!promoter) {
      return res.status(404).json({
        success: false,
        message: 'Promoter account not found'
      });
    }

    // Calculate date range
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const query = {
      userId: req.user._id,
      type: { $in: ['ad_revenue', 'promoter_payment'] },
      createdAt: { $gte: startDate },
      status: 'completed'
    };

    if (type) query.type = type;

    const earnings = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('relatedAdId', 'title type');

    const total = await Transaction.countDocuments(query);

    // Get earnings summary
    const summary = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$amount' },
          totalTransactions: { $sum: 1 },
          averageEarning: { $avg: '$amount' }
        }
      }
    ]);

    // Get daily earnings for chart
    const dailyEarnings = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          earnings: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        earnings,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        },
        summary: summary[0] || {
          totalEarnings: 0,
          totalTransactions: 0,
          averageEarning: 0
        },
        dailyEarnings,
        period
      }
    });

  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get earnings'
    });
  }
});

// Request withdrawal
router.post('/withdraw', [
  authenticateToken,
  authorize('promoter'),
  body('amount').isFloat({ min: 100 }).withMessage('Minimum withdrawal amount is ₹100'),
  body('method').isIn(['bank_transfer', 'paypal', 'upi', 'crypto']).withMessage('Invalid withdrawal method')
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

    const { amount, method } = req.body;

    const promoter = await Promoter.findOne({ userId: req.user._id });
    if (!promoter) {
      return res.status(404).json({
        success: false,
        message: 'Promoter account not found'
      });
    }

    // Check if promoter can withdraw
    if (!promoter.canWithdraw(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance or withdrawal conditions not met'
      });
    }

    // Create withdrawal request
    const withdrawal = {
      amount,
      method,
      status: 'pending',
      requestedAt: new Date()
    };

    promoter.withdrawals.push(withdrawal);
    await promoter.requestWithdrawal(amount, method);

    res.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: {
        withdrawal,
        remainingBalance: promoter.earnings.currentBalance
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

// Get withdrawals
router.get('/withdrawals', [authenticateToken, authorize('promoter')], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;

    const promoter = await Promoter.findOne({ userId: req.user._id });
    if (!promoter) {
      return res.status(404).json({
        success: false,
        message: 'Promoter account not found'
      });
    }

    let withdrawals = promoter.withdrawals;
    
    if (status) {
      withdrawals = withdrawals.filter(w => w.status === status);
    }

    // Sort by request date (newest first)
    withdrawals = withdrawals.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));

    // Paginate
    const total = withdrawals.length;
    const startIndex = (page - 1) * limit;
    const paginatedWithdrawals = withdrawals.slice(startIndex, startIndex + limit);

    res.json({
      success: true,
      data: {
        withdrawals: paginatedWithdrawals,
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
      message: 'Failed to get withdrawals'
    });
  }
});

// Get metrics and analytics
router.get('/metrics', [authenticateToken, authorize('promoter')], async (req, res) => {
  try {
    const period = req.query.period || '30d';
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const promoter = await Promoter.findOne({ userId: req.user._id });
    if (!promoter) {
      return res.status(404).json({
        success: false,
        message: 'Promoter account not found'
      });
    }

    // Performance metrics
    const performanceMetrics = {
      totalClicks: promoter.stats.totalClicks,
      totalImpressions: promoter.stats.totalImpressions,
      totalConversions: promoter.stats.totalConversions,
      ctr: promoter.stats.ctr,
      conversionRate: promoter.stats.conversionRate,
      averageEarningsPerClick: promoter.stats.averageEarningsPerClick
    };

    // Monthly performance
    const currentMonth = new Date().toISOString().substring(0, 7);
    const monthlyData = promoter.monthlyMetrics.find(m => m.month === currentMonth) || {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      earnings: 0
    };

    // Top performing ads (mock data - would come from tracking)
    const topAds = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: 'ad_revenue',
          createdAt: { $gte: startDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$relatedAdId',
          earnings: { $sum: '$amount' },
          clicks: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'ads',
          localField: '_id',
          foreignField: '_id',
          as: 'ad'
        }
      },
      {
        $unwind: '$ad'
      },
      {
        $sort: { earnings: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      data: {
        promoter: {
          qualityScore: promoter.qualityScore,
          earnings: promoter.earnings,
          commissionRates: promoter.commissionRates
        },
        performanceMetrics,
        monthlyData,
        topAds,
        period
      }
    });

  } catch (error) {
    console.error('Get metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get metrics'
    });
  }
});

// Track click/conversion (called by ad scripts)
router.post('/track/:action/:adId', async (req, res) => {
  try {
    const { action, adId } = req.params;
    const { promoterCode, userAgent, ipAddress, referrer } = req.body;

    if (!['click', 'impression', 'conversion'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action'
      });
    }

    // Find promoter by referral code
    const promoter = await Promoter.findOne({ referralCode: promoterCode });
    if (!promoter || promoter.applicationStatus !== 'approved') {
      return res.status(404).json({
        success: false,
        message: 'Promoter not found or not approved'
      });
    }

    // Find ad
    const ad = await Ad.findById(adId);
    if (!ad || ad.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Ad not found or not active'
      });
    }

    // Calculate earnings
    const earnings = calculateEarnings(ad.bidding.amount, ad.bidding.model, action);
    
    if (earnings > 0) {
      // Create earning transaction
      const transaction = new Transaction({
        userId: promoter.userId,
        type: 'ad_revenue',
        amount: earnings,
        description: `Earnings from ${action} on ad: ${ad.title}`,
        status: 'completed',
        relatedAdId: ad._id,
        metadata: {
          action,
          promoterCode,
          userAgent,
          ipAddress,
          referrer
        }
      });

      await transaction.save();

      // Update promoter earnings
      await promoter.addEarnings(earnings, ad.bidding.model);

      // Update ad metrics
      if (action === 'click') {
        await ad.recordClick();
      } else if (action === 'impression') {
        await ad.recordImpression();
      } else if (action === 'conversion') {
        await ad.recordConversion();
      }
    }

    res.json({
      success: true,
      message: `${action} tracked successfully`,
      data: {
        earnings,
        action,
        adId
      }
    });

  } catch (error) {
    console.error('Track action error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track action'
    });
  }
});

// Upload KYC documents
router.post('/documents', [
  authenticateToken,
  authorize('promoter'),
  upload.array('documents', 5)
], async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No documents provided'
      });
    }

    const promoter = await Promoter.findOne({ userId: req.user._id });
    if (!promoter) {
      return res.status(404).json({
        success: false,
        message: 'Promoter account not found'
      });
    }

    const uploadedDocs = [];

    for (const file of req.files) {
      const uploadResult = await uploadToCloudinary(file.buffer, {
        folder: 'casyoro/promoter-documents',
        resource_type: 'auto'
      });

      const document = {
        type: req.body.type || 'other',
        number: req.body.number || '',
        url: uploadResult.secure_url,
        uploadedAt: new Date()
      };

      promoter.kycDocuments.push(document);
      uploadedDocs.push(document);
    }

    await promoter.save();

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

// Helper functions
function generateHTMLScript(ad, promoter) {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  return `
<!-- Casyoro Promoter Ad: ${ad.title} -->
<div class="casyoro-promoter-ad" data-ad-id="${ad._id}" data-promoter="${promoter.referralCode}">
  <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; background: white; font-family: Arial, sans-serif; max-width: ${ad.format?.width || 300}px;">
    ${ad.type === 'banner' && ad.creatives[0] ? `
      <img src="${ad.creatives[0].url}" alt="${ad.title}" style="width: 100%; height: auto; border-radius: 4px; margin-bottom: 12px;" />
    ` : ''}
    
    <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${ad.title}</h3>
    
    ${ad.description ? `
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #666; line-height: 1.4;">${ad.description}</p>
    ` : ''}
    
    <a href="#" onclick="casyoroTrackClick('${ad._id}', '${promoter.referralCode}'); window.open('${ad.landingPage.url}', '_blank'); return false;" 
       style="display: inline-block; background: #3b82f6; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-size: 14px;">
      ${ad.cta?.text || 'Learn More'}
    </a>
    
    <div style="margin-top: 8px; font-size: 10px; color: #999;">Promoted Content</div>
  </div>
</div>

<script>
function casyoroTrackClick(adId, promoterCode) {
  fetch('${baseUrl}/api/promoters/track/click/' + adId, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      promoterCode: promoterCode,
      userAgent: navigator.userAgent,
      referrer: document.referrer
    })
  });
}

// Track impression
fetch('${baseUrl}/api/promoters/track/impression/${ad._id}', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    promoterCode: '${promoter.referralCode}',
    userAgent: navigator.userAgent,
    referrer: document.referrer
  })
});
</script>
`;
}

function generateJavaScriptScript(ad, promoter) {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  return `
(function() {
  var casyoroPromoterAd = {
    adId: '${ad._id}',
    promoterCode: '${promoter.referralCode}',
    
    render: function(containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;
      
      container.innerHTML = this.getHTML();
      this.trackImpression();
    },
    
    getHTML: function() {
      return '<div class="casyoro-promoter-ad">' +
        '<div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;background:white;font-family:Arial,sans-serif;">' +
        '<h3 style="margin:0 0 8px 0;font-size:16px;font-weight:600;">${ad.title}</h3>' +
        '<p style="margin:0 0 12px 0;font-size:14px;color:#666;">${ad.description || ''}</p>' +
        '<a href="#" onclick="casyoroPromoterAd.trackClick(); window.open(\'${ad.landingPage.url}\', \'_blank\'); return false;" ' +
        'style="display:inline-block;background:#3b82f6;color:white;padding:8px 16px;text-decoration:none;border-radius:4px;">' +
        '${ad.cta?.text || 'Learn More'}</a>' +
        '<div style="margin-top:8px;font-size:10px;color:#999;">Promoted Content</div>' +
        '</div></div>';
    },
    
    trackImpression: function() {
      fetch('${baseUrl}/api/promoters/track/impression/' + this.adId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promoterCode: this.promoterCode,
          userAgent: navigator.userAgent,
          referrer: document.referrer
        })
      });
    },
    
    trackClick: function() {
      fetch('${baseUrl}/api/promoters/track/click/' + this.adId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promoterCode: this.promoterCode,
          userAgent: navigator.userAgent,
          referrer: document.referrer
        })
      });
    }
  };
  
  window.CasyoroPromoterAd_${ad._id} = casyoroPromoterAd;
})();
`;
}

function generateIframeScript(ad, promoter) {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  return `<iframe src="${baseUrl}/ad-frame/${ad._id}?promoter=${promoter.referralCode}" 
          width="${ad.format?.width || 300}" 
          height="${ad.format?.height || 250}" 
          frameborder="0" 
          scrolling="no">
         </iframe>`;
}

function calculateEarnings(bidAmount, biddingModel, action) {
  const commissionRate = 0.7; // 70% of bid amount goes to promoter
  
  switch (biddingModel) {
    case 'cpc':
      return action === 'click' ? bidAmount * commissionRate : 0;
    case 'cpm':
      return action === 'impression' ? (bidAmount / 1000) * commissionRate : 0;
    case 'cpa':
      return action === 'conversion' ? bidAmount * commissionRate : 0;
    default:
      return 0;
  }
}

module.exports = router;

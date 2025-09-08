const express = require('express');
const { body, validationResult } = require('express-validator');
const Offer = require('../models/Offer');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all offers (public route with optional auth)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const merchant = req.query.merchant;
    const type = req.query.type;
    const search = req.query.search;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const filters = {
      status: 'active',
      isPublic: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    };

    if (category) filters.categories = category;
    if (merchant) filters['merchant.name'] = new RegExp(merchant, 'i');
    if (type) filters.type = type;
    if (search) {
      filters.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { 'merchant.name': new RegExp(search, 'i') }
      ];
    }

    const offers = await Offer.find(filters)
      .sort({ [sortBy]: sortOrder })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'firstName lastName');

    const total = await Offer.countDocuments(filters);

    // Get categories for filtering
    const categories = await Offer.distinct('categories', { status: 'active', isPublic: true });
    const merchants = await Offer.distinct('merchant.name', { status: 'active', isPublic: true });

    res.json({
      success: true,
      data: {
        offers,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        },
        filters: {
          categories,
          merchants
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

// Get featured offers
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const offers = await Offer.getFeaturedOffers(limit);

    res.json({
      success: true,
      data: { offers }
    });

  } catch (error) {
    console.error('Get featured offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get featured offers'
    });
  }
});

// Get offers by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const offers = await Offer.find({
      categories: category,
      status: 'active',
      isPublic: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    })
    .sort({ isFeatured: -1, priority: -1, createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Offer.countDocuments({
      categories: category,
      status: 'active',
      isPublic: true
    });

    res.json({
      success: true,
      data: {
        offers,
        category,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });

  } catch (error) {
    console.error('Get offers by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get offers by category'
    });
  }
});

// Get single offer
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate('createdBy', 'firstName lastName');

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    // Check if offer is accessible
    if (!offer.isPublic && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Offer not accessible'
      });
    }

    // Track view (don't await to avoid slowing response)
    offer.trackView().catch(console.error);

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

// Track offer click
router.post('/:id/click', optionalAuth, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    // Track click
    await offer.trackClick();

    res.json({
      success: true,
      message: 'Click tracked successfully',
      data: {
        redirectUrl: offer.trackingUrl || offer.deepLink
      }
    });

  } catch (error) {
    console.error('Track offer click error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track offer click'
    });
  }
});

// Use offer/coupon (authenticated route)
router.post('/:id/use', [
  authenticateToken,
  body('orderDetails').optional().isObject()
], async (req, res) => {
  try {
    const { orderDetails } = req.body;
    
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    // Check if user can use the offer
    const canUse = offer.canUse(req.user._id);
    if (!canUse.canUse) {
      return res.status(400).json({
        success: false,
        message: canUse.reason
      });
    }

    // For coupons, return coupon code
    if (offer.type === 'coupon' && offer.couponCode) {
      // Track usage
      await offer.incrementUsage(req.user._id);

      return res.json({
        success: true,
        message: 'Coupon code retrieved successfully',
        data: {
          couponCode: offer.couponCode,
          offer: {
            title: offer.title,
            description: offer.description,
            discountType: offer.discountType,
            discountValue: offer.discountValue,
            maxDiscount: offer.maxDiscount,
            minOrderValue: offer.minOrderValue,
            terms: offer.terms
          }
        }
      });
    }

    // For other offer types (cashback, deals)
    res.json({
      success: true,
      message: 'Offer activated successfully',
      data: {
        offer: {
          title: offer.title,
          description: offer.description,
          cashbackPercentage: offer.cashbackPercentage,
          trackingUrl: offer.trackingUrl,
          deepLink: offer.deepLink
        }
      }
    });

  } catch (error) {
    console.error('Use offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to use offer'
    });
  }
});

// Get trending offers
router.get('/trending', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const period = parseInt(req.query.period) || 7; // days

    const offers = await Offer.getTopPerforming(period, limit);

    res.json({
      success: true,
      data: { offers }
    });

  } catch (error) {
    console.error('Get trending offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get trending offers'
    });
  }
});

// Search offers
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const searchRegex = new RegExp(query, 'i');
    
    const offers = await Offer.find({
      status: 'active',
      isPublic: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { 'merchant.name': searchRegex },
        { tags: searchRegex }
      ]
    })
    .sort({ 'metrics.conversions': -1, isFeatured: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Offer.countDocuments({
      status: 'active',
      isPublic: true,
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { 'merchant.name': searchRegex },
        { tags: searchRegex }
      ]
    });

    res.json({
      success: true,
      data: {
        offers,
        query,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });

  } catch (error) {
    console.error('Search offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search offers'
    });
  }
});

// Get offer categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Offer.aggregate([
      {
        $match: {
          status: 'active',
          isPublic: true
        }
      },
      {
        $unwind: '$categories'
      },
      {
        $group: {
          _id: '$categories',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: { categories }
    });

  } catch (error) {
    console.error('Get offer categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get offer categories'
    });
  }
});

// Get merchants
router.get('/meta/merchants', async (req, res) => {
  try {
    const merchants = await Offer.aggregate([
      {
        $match: {
          status: 'active',
          isPublic: true
        }
      },
      {
        $group: {
          _id: '$merchant.name',
          count: { $sum: 1 },
          logo: { $first: '$merchant.logo' },
          platform: { $first: '$merchant.platform' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: { merchants }
    });

  } catch (error) {
    console.error('Get merchants error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get merchants'
    });
  }
});

module.exports = router;

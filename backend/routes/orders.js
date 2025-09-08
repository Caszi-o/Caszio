const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const { authenticateToken, authorize, requireVerification } = require('../middleware/auth');

const router = express.Router();

// Get user orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const platform = req.query.platform;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const query = { userId: req.user._id };
    
    if (status) query.status = status;
    if (platform) query.platform = platform;
    if (startDate || endDate) {
      query.orderDate = {};
      if (startDate) query.orderDate.$gte = new Date(startDate);
      if (endDate) query.orderDate.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .sort({ orderDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    // Get order statistics
    const stats = await Order.aggregate([
      {
        $match: { userId: req.user._id }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: '$orderAmount' },
          totalCashback: { $sum: '$cashbackAmount' },
          pendingCashback: {
            $sum: {
              $cond: [
                { $eq: ['$cashbackStatus', 'pending'] },
                '$cashbackAmount',
                0
              ]
            }
          },
          creditedCashback: {
            $sum: {
              $cond: [
                { $eq: ['$cashbackStatus', 'credited'] },
                '$cashbackAmount',
                0
              ]
            }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        },
        stats: stats[0] || {
          totalOrders: 0,
          totalAmount: 0,
          totalCashback: 0,
          pendingCashback: 0,
          creditedCashback: 0
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

// Get single order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order'
    });
  }
});

// Track order manually (for testing or manual entry)
router.post('/track', [
  authenticateToken,
  requireVerification,
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('platform').isIn(['amazon', 'flipkart', 'myntra', 'ajio', 'nykaa', 'tatacliq', 'firstcry']).withMessage('Invalid platform'),
  body('orderAmount').isFloat({ min: 0 }).withMessage('Order amount must be positive'),
  body('orderDate').isISO8601().withMessage('Valid order date required')
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

    const {
      orderId,
      platform,
      orderAmount,
      orderDate,
      products,
      externalOrderId
    } = req.body;

    // Check if order already exists
    const existingOrder = await Order.findOne({
      $or: [
        { orderId },
        { externalOrderId, platform, userId: req.user._id }
      ]
    });

    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: 'Order already tracked'
      });
    }

    // Calculate cashback percentage based on platform and amount
    const cashbackPercentage = calculateCashbackPercentage(platform, orderAmount);
    const cashbackAmount = (orderAmount * cashbackPercentage) / 100;

    const order = new Order({
      userId: req.user._id,
      orderId,
      externalOrderId,
      platform,
      orderAmount,
      orderDate: new Date(orderDate),
      products: products || [],
      cashbackPercentage,
      cashbackAmount,
      trackingMethod: 'manual',
      status: 'confirmed'
    });

    await order.save();

    // Update user's pending cashback
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (wallet) {
      await wallet.addPendingCashback(cashbackAmount);
    }

    res.status(201).json({
      success: true,
      message: 'Order tracked successfully',
      data: { order }
    });

  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track order'
    });
  }
});

// Sync orders from platform API (webhook endpoint)
router.post('/sync/:platform', [
  body('orders').isArray().withMessage('Orders must be an array'),
  body('userId').isMongoId().withMessage('Valid user ID required')
], async (req, res) => {
  try {
    const { platform } = req.params;
    const { orders, userId } = req.body;

    // Verify API key or signature here
    // For now, we'll skip authentication for webhook

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const syncedOrders = [];
    const errors = [];

    for (const orderData of orders) {
      try {
        // Check if order already exists
        const existingOrder = await Order.findOne({
          externalOrderId: orderData.externalOrderId,
          platform,
          userId
        });

        if (existingOrder) {
          // Update existing order
          Object.assign(existingOrder, {
            status: orderData.status || existingOrder.status,
            orderAmount: orderData.orderAmount || existingOrder.orderAmount,
            products: orderData.products || existingOrder.products,
            deliveryDate: orderData.deliveryDate || existingOrder.deliveryDate
          });

          // Recalculate cashback if amount changed
          if (orderData.orderAmount && orderData.orderAmount !== existingOrder.orderAmount) {
            existingOrder.cashbackPercentage = calculateCashbackPercentage(platform, orderData.orderAmount);
            existingOrder.cashbackAmount = (orderData.orderAmount * existingOrder.cashbackPercentage) / 100;
          }

          await existingOrder.save();
          syncedOrders.push(existingOrder);
        } else {
          // Create new order
          const cashbackPercentage = calculateCashbackPercentage(platform, orderData.orderAmount);
          const cashbackAmount = (orderData.orderAmount * cashbackPercentage) / 100;

          const newOrder = new Order({
            userId,
            orderId: `${platform}_${orderData.externalOrderId}_${Date.now()}`,
            externalOrderId: orderData.externalOrderId,
            platform,
            orderAmount: orderData.orderAmount,
            orderDate: new Date(orderData.orderDate),
            deliveryDate: orderData.deliveryDate ? new Date(orderData.deliveryDate) : undefined,
            status: orderData.status || 'confirmed',
            products: orderData.products || [],
            cashbackPercentage,
            cashbackAmount,
            trackingMethod: 'api',
            rawData: orderData
          });

          await newOrder.save();

          // Update user's pending cashback
          const wallet = await Wallet.findOne({ userId });
          if (wallet) {
            await wallet.addPendingCashback(cashbackAmount);
          }

          syncedOrders.push(newOrder);
        }
      } catch (orderError) {
        console.error('Error processing order:', orderData.externalOrderId, orderError);
        errors.push({
          orderId: orderData.externalOrderId,
          error: orderError.message
        });
      }
    }

    res.json({
      success: true,
      message: `Synced ${syncedOrders.length} orders`,
      data: {
        syncedCount: syncedOrders.length,
        errorCount: errors.length,
        errors
      }
    });

  } catch (error) {
    console.error('Sync orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync orders'
    });
  }
});

// Update order status (admin only)
router.patch('/:id/status', [
  authenticateToken,
  authorize('admin'),
  body('status').isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned']).withMessage('Invalid status'),
  body('cashbackStatus').optional().isIn(['pending', 'approved', 'credited', 'rejected']).withMessage('Invalid cashback status')
], async (req, res) => {
  try {
    const { status, cashbackStatus, notes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    if (cashbackStatus) order.cashbackStatus = cashbackStatus;
    if (notes) order.adminNotes = notes;

    await order.save();

    // If cashback is credited, update wallet
    if (cashbackStatus === 'credited' && order.cashbackStatus !== 'credited') {
      const wallet = await Wallet.findOne({ userId: order.userId });
      if (wallet) {
        await wallet.creditPendingCashback(order.cashbackAmount);
        
        // Create transaction record
        const transaction = new Transaction({
          userId: order.userId,
          walletId: wallet._id,
          type: 'cashback_credited',
          amount: order.cashbackAmount,
          balanceBefore: wallet.balance - order.cashbackAmount,
          balanceAfter: wallet.balance,
          description: `Cashback credited for order ${order.orderId}`,
          status: 'completed',
          relatedOrderId: order._id
        });
        await transaction.save();
      }
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

// Get order analytics
router.get('/analytics/summary', authenticateToken, async (req, res) => {
  try {
    const period = parseInt(req.query.period) || 30; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    const analytics = await Order.aggregate([
      {
        $match: {
          userId: req.user._id,
          orderDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$orderDate'
            }
          },
          orders: { $sum: 1 },
          totalAmount: { $sum: '$orderAmount' },
          totalCashback: { $sum: '$cashbackAmount' },
          platforms: { $addToSet: '$platform' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Platform breakdown
    const platformBreakdown = await Order.aggregate([
      {
        $match: {
          userId: req.user._id,
          orderDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$platform',
          orders: { $sum: 1 },
          totalAmount: { $sum: '$orderAmount' },
          totalCashback: { $sum: '$cashbackAmount' }
        }
      },
      {
        $sort: { totalAmount: -1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        dailyAnalytics: analytics,
        platformBreakdown,
        period
      }
    });

  } catch (error) {
    console.error('Get order analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order analytics'
    });
  }
});

// Helper function to calculate cashback percentage
function calculateCashbackPercentage(platform, orderAmount) {
  // Base cashback rates by platform
  const baseCashbackRates = {
    amazon: 2.0,
    flipkart: 2.5,
    myntra: 3.0,
    ajio: 3.5,
    nykaa: 4.0,
    tatacliq: 2.5,
    firstcry: 3.0
  };

  let cashbackPercentage = baseCashbackRates[platform] || 1.0;

  // Tier-based bonus cashback
  if (orderAmount >= 10000) {
    cashbackPercentage += 1.0; // +1% for orders above ₹10,000
  } else if (orderAmount >= 5000) {
    cashbackPercentage += 0.5; // +0.5% for orders above ₹5,000
  }

  // Cap maximum cashback percentage
  return Math.min(cashbackPercentage, 10.0);
}

module.exports = router;

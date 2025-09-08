const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Order Details
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  externalOrderId: String, // Platform's order ID
  
  // Platform Info
  platform: {
    type: String,
    enum: ['amazon', 'flipkart', 'myntra', 'ajio', 'nykaa', 'tatacliq', 'firstcry'],
    required: true
  },
  
  // Order Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  
  // Financial Details
  orderAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  
  // Cashback Details
  cashbackPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  cashbackAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  cashbackStatus: {
    type: String,
    enum: ['pending', 'approved', 'credited', 'rejected'],
    default: 'pending'
  },
  
  // Product Details
  products: [{
    productId: String,
    name: String,
    category: String,
    brand: String,
    price: Number,
    quantity: Number,
    image: String,
    url: String,
    sku: String
  }],
  
  // Tracking Details
  trackingMethod: {
    type: String,
    enum: ['api', 'extension', 'email', 'manual'],
    required: true
  },
  
  // Dates
  orderDate: {
    type: Date,
    required: true
  },
  deliveryDate: Date,
  returnPeriodEnds: Date,
  cashbackCreditedAt: Date,
  
  // Affiliate Details
  affiliateCommission: Number,
  affiliateTrackingId: String,
  
  // Additional Info
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String
  },
  
  // Metadata
  rawData: mongoose.Schema.Types.Mixed, // Store original API response
  notes: String,
  
  // Fraud Detection
  riskScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  flaggedReason: String,
  
  // Admin Actions
  adminNotes: String,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ externalOrderId: 1 });
orderSchema.index({ platform: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ cashbackStatus: 1 });
orderSchema.index({ orderDate: -1 });
orderSchema.index({ deliveryDate: 1 });
orderSchema.index({ returnPeriodEnds: 1 });

// Pre-save middleware
orderSchema.pre('save', function(next) {
  // Calculate cashback amount if not set
  if (this.isModified('orderAmount') || this.isModified('cashbackPercentage')) {
    this.cashbackAmount = (this.orderAmount * this.cashbackPercentage) / 100;
  }
  
  // Set return period (30 days from delivery)
  if (this.isModified('deliveryDate') && this.deliveryDate && !this.returnPeriodEnds) {
    this.returnPeriodEnds = new Date(this.deliveryDate.getTime() + (30 * 24 * 60 * 60 * 1000));
  }
  
  next();
});

// Methods
orderSchema.methods.canCreditCashback = function() {
  return this.status === 'delivered' && 
         this.cashbackStatus === 'approved' && 
         this.returnPeriodEnds && 
         new Date() > this.returnPeriodEnds;
};

orderSchema.methods.calculateRiskScore = function() {
  let score = 0;
  
  // High order amount
  if (this.orderAmount > 50000) score += 20;
  else if (this.orderAmount > 20000) score += 10;
  
  // Quick delivery
  if (this.deliveryDate && this.orderDate) {
    const deliveryDays = (this.deliveryDate - this.orderDate) / (1000 * 60 * 60 * 24);
    if (deliveryDays < 1) score += 30;
    else if (deliveryDays < 2) score += 15;
  }
  
  // High cashback percentage
  if (this.cashbackPercentage > 10) score += 25;
  else if (this.cashbackPercentage > 5) score += 10;
  
  this.riskScore = Math.min(score, 100);
  return this.riskScore;
};

// Static methods
orderSchema.statics.getOrderStats = function(userId, period = '30d') {
  const startDate = new Date();
  const days = parseInt(period);
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate }
      }
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
};

module.exports = mongoose.model('Order', orderSchema);

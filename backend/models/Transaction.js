const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Wallet Reference
  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true
  },
  
  // Transaction Details
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  
  type: {
    type: String,
    enum: [
      'cashback_earned',
      'cashback_credited',
      'referral_bonus',
      'ad_revenue',
      'publisher_payment',
      'withdrawal',
      'refund',
      'penalty',
      'bonus',
      'deposit',
      'adjustment'
    ],
    required: true
  },
  
  // Amount Details
  amount: {
    type: Number,
    required: true
  },
  
  currency: {
    type: String,
    default: 'INR'
  },
  
  // Balance tracking
  balanceBefore: {
    type: Number,
    required: true
  },
  
  balanceAfter: {
    type: Number,
    required: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'reversed'],
    default: 'pending'
  },
  
  // Description
  description: {
    type: String,
    required: true
  },
  
  notes: String,
  
  // Related References
  relatedOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  
  relatedAdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ad'
  },
  
  relatedOfferId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer'
  },
  
  // For withdrawals
  withdrawalDetails: {
    method: {
      type: String,
      enum: ['bank_transfer', 'upi', 'paypal', 'crypto']
    },
    accountDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      upiId: String,
      paypalEmail: String,
      walletAddress: String
    },
    processingFee: Number,
    netAmount: Number,
    externalTransactionId: String,
    expectedCompletionDate: Date
  },
  
  // For deposits/payments
  paymentDetails: {
    gateway: {
      type: String,
      enum: ['razorpay', 'stripe', 'paypal', 'paytm']
    },
    gatewayTransactionId: String,
    paymentMethod: String,
    gatewayFee: Number,
    netAmount: Number
  },
  
  // Metadata
  metadata: {
    ipAddress: String,
    userAgent: String,
    source: String, // web, mobile, api
    referenceId: String,
    tags: [String]
  },
  
  // Processing Details
  processedAt: Date,
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  failureReason: String,
  retryCount: {
    type: Number,
    default: 0
  },
  
  // Fraud Detection
  riskScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  fraudFlags: [String],
  
  // Reversal Info
  reversalTransaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },
  
  originalTransaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },
  
  // Admin tracking
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
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ walletId: 1 });
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ amount: -1 });
transactionSchema.index({ processedAt: -1 });
transactionSchema.index({ riskScore: -1 });

// Pre-save middleware
transactionSchema.pre('save', function(next) {
  // Generate transaction ID if not exists
  if (this.isNew && !this.transactionId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    this.transactionId = `TXN_${timestamp}_${random}`.toUpperCase();
  }
  
  // Set processed date when status changes to completed
  if (this.isModified('status') && this.status === 'completed' && !this.processedAt) {
    this.processedAt = new Date();
  }
  
  // Calculate risk score for certain transaction types
  if (this.isNew && ['withdrawal', 'deposit'].includes(this.type)) {
    this.calculateRiskScore();
  }
  
  next();
});

// Methods
transactionSchema.methods.calculateRiskScore = function() {
  let score = 0;
  
  // High amount transactions
  if (this.amount > 50000) score += 30;
  else if (this.amount > 20000) score += 20;
  else if (this.amount > 10000) score += 10;
  
  // Off-hours transactions (9 PM to 6 AM)
  const hour = new Date().getHours();
  if (hour >= 21 || hour <= 6) score += 15;
  
  // Weekend transactions
  const day = new Date().getDay();
  if (day === 0 || day === 6) score += 10;
  
  // Multiple transactions in short time (would need additional logic)
  // This is a placeholder - in real implementation, you'd check recent transactions
  
  this.riskScore = Math.min(score, 100);
  return this.riskScore;
};

transactionSchema.methods.markCompleted = function(processedBy = null) {
  this.status = 'completed';
  this.processedAt = new Date();
  if (processedBy) {
    this.processedBy = processedBy;
  }
  return this.save();
};

transactionSchema.methods.markFailed = function(reason, processedBy = null) {
  this.status = 'failed';
  this.failureReason = reason;
  this.processedAt = new Date();
  if (processedBy) {
    this.processedBy = processedBy;
  }
  return this.save();
};

transactionSchema.methods.reverse = function(reason, processedBy) {
  // Create reversal transaction
  const reversalData = {
    userId: this.userId,
    walletId: this.walletId,
    type: 'adjustment',
    amount: -this.amount,
    currency: this.currency,
    balanceBefore: 0, // Will be set when wallet balance is known
    balanceAfter: 0,  // Will be set when wallet balance is known
    description: `Reversal of transaction ${this.transactionId}: ${reason}`,
    originalTransaction: this._id,
    processedBy: processedBy,
    status: 'completed',
    metadata: {
      source: 'reversal',
      referenceId: this.transactionId
    }
  };
  
  return mongoose.model('Transaction').create(reversalData);
};

transactionSchema.methods.retry = function() {
  if (this.status !== 'failed') {
    throw new Error('Can only retry failed transactions');
  }
  
  if (this.retryCount >= 3) {
    throw new Error('Maximum retry attempts exceeded');
  }
  
  this.status = 'pending';
  this.retryCount += 1;
  this.failureReason = undefined;
  
  return this.save();
};

transactionSchema.methods.addFraudFlag = function(flag) {
  if (!this.fraudFlags.includes(flag)) {
    this.fraudFlags.push(flag);
    this.riskScore = Math.min(this.riskScore + 20, 100);
  }
  return this.save();
};

// Static methods
transactionSchema.statics.getTransactionStats = function(userId, period = '30d') {
  const startDate = new Date();
  const days = parseInt(period);
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate },
        status: 'completed'
      }
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        avgAmount: { $avg: '$amount' }
      }
    },
    {
      $sort: { totalAmount: -1 }
    }
  ]);
};

transactionSchema.statics.getDailyTransactionVolume = function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: 'completed'
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt'
          }
        },
        count: { $sum: 1 },
        volume: { $sum: '$amount' },
        avgAmount: { $avg: '$amount' }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

transactionSchema.statics.getHighRiskTransactions = function(threshold = 70) {
  return this.find({
    riskScore: { $gte: threshold },
    status: { $in: ['pending', 'processing'] }
  })
  .populate('userId', 'firstName lastName email')
  .sort({ riskScore: -1, createdAt: -1 });
};

transactionSchema.statics.getPendingWithdrawals = function() {
  return this.find({
    type: 'withdrawal',
    status: { $in: ['pending', 'processing'] }
  })
  .populate('userId', 'firstName lastName email')
  .sort({ createdAt: 1 });
};

transactionSchema.statics.getRevenueReport = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: 'completed',
        type: { $in: ['cashback_earned', 'ad_revenue', 'publisher_payment'] }
      }
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);
};

module.exports = mongoose.model('Transaction', transactionSchema);

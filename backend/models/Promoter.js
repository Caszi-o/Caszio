const mongoose = require('mongoose');

const promoterSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Application Details
  applicationStatus: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  approvedAt: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: String,
  
  // Profile Info
  displayName: String,
  bio: String,
  profileImage: String,
  
  // Platform Presence
  platforms: [{
    name: {
      type: String,
      enum: ['website', 'youtube', 'instagram', 'facebook', 'twitter', 'tiktok', 'blog', 'other']
    },
    url: String,
    followers: Number,
    verified: {
      type: Boolean,
      default: false
    }
  }],
  
  // Traffic & Audience
  monthlyTraffic: Number,
  audienceDemographics: {
    ageGroups: [{
      range: String, // e.g., "18-24"
      percentage: Number
    }],
    genderSplit: {
      male: Number,
      female: Number,
      other: Number
    },
    topCountries: [String],
    interests: [String]
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: false
  },
  isSuspended: {
    type: Boolean,
    default: false
  },
  suspensionReason: String,
  
  // Payment Details
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'paypal', 'upi', 'crypto'],
    default: 'bank_transfer'
  },
  paymentDetails: {
    // Bank Transfer
    bankAccount: String,
    ifscCode: String,
    bankName: String,
    
    // PayPal
    paypalEmail: String,
    
    // UPI
    upiId: String,
    
    // Crypto
    walletAddress: String,
    cryptoType: String
  },
  
  // Earnings & Statistics
  earnings: {
    totalEarnings: {
      type: Number,
      default: 0
    },
    pendingEarnings: {
      type: Number,
      default: 0
    },
    withdrawnEarnings: {
      type: Number,
      default: 0
    },
    currentBalance: {
      type: Number,
      default: 0
    }
  },
  
  // Performance Metrics
  stats: {
    totalClicks: {
      type: Number,
      default: 0
    },
    totalImpressions: {
      type: Number,
      default: 0
    },
    totalConversions: {
      type: Number,
      default: 0
    },
    ctr: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    },
    averageEarningsPerClick: {
      type: Number,
      default: 0
    }
  },
  
  // Commission Structure
  commissionRates: {
    cpc: {
      type: Number,
      default: 0.10 // ₹0.10 per click
    },
    cpa: {
      type: Number,
      default: 10 // ₹10 per action/conversion
    },
    revenueShare: {
      type: Number,
      default: 5 // 5% of revenue generated
    }
  },
  
  // Ad Scripts
  adScripts: [{
    scriptId: String,
    name: String,
    type: {
      type: String,
      enum: ['banner', 'popup', 'native', 'video', 'text']
    },
    code: String,
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Quality Score
  qualityScore: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },
  
  // Compliance
  policyViolations: [{
    type: String,
    description: String,
    date: {
      type: Date,
      default: Date.now
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    resolved: {
      type: Boolean,
      default: false
    }
  }],
  
  // Fraud Detection
  fraudScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  suspiciousActivity: [{
    type: String,
    description: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  }],
  
  // Monthly Performance
  monthlyMetrics: [{
    month: String, // YYYY-MM format
    impressions: Number,
    clicks: Number,
    conversions: Number,
    earnings: Number,
    ctr: Number,
    conversionRate: Number,
    topPerformingAds: [String]
  }],
  
  // Withdrawal History
  withdrawals: [{
    amount: Number,
    method: String,
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    processedAt: Date,
    transactionId: String,
    notes: String
  }],
  
  // Referral Program
  referralCode: String,
  referredPromoters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Promoter'
  }],
  referralEarnings: {
    type: Number,
    default: 0
  },
  
  // Notifications Preferences
  notifications: {
    newAds: {
      type: Boolean,
      default: true
    },
    earningsUpdates: {
      type: Boolean,
      default: true
    },
    paymentAlerts: {
      type: Boolean,
      default: true
    },
    policyUpdates: {
      type: Boolean,
      default: true
    }
  },
  
  // KYC Documents
  kycDocuments: [{
    type: {
      type: String,
      enum: ['pan', 'aadhar', 'passport', 'driving_license', 'bank_statement']
    },
    number: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    verifiedAt: Date,
    isVerified: {
      type: Boolean,
      default: false
    }
  }],
  
  // Admin Notes
  adminNotes: String,
  
  // Activity Tracking
  lastLoginAt: Date,
  lastActivityAt: Date,
  ipHistory: [{
    ip: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    userAgent: String
  }]
}, {
  timestamps: true
});

// Indexes
promoterSchema.index({ userId: 1 });
promoterSchema.index({ applicationStatus: 1 });
promoterSchema.index({ isActive: 1 });
promoterSchema.index({ qualityScore: -1 });
promoterSchema.index({ 'earnings.totalEarnings': -1 });
promoterSchema.index({ createdAt: -1 });

// Pre-save middleware
promoterSchema.pre('save', function(next) {
  // Generate referral code if new promoter
  if (this.isNew && !this.referralCode) {
    this.referralCode = 'PROM' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }
  
  // Update current balance
  this.earnings.currentBalance = this.earnings.totalEarnings - this.earnings.withdrawnEarnings;
  
  // Calculate CTR and conversion rate
  if (this.stats.totalImpressions > 0) {
    this.stats.ctr = (this.stats.totalClicks / this.stats.totalImpressions) * 100;
  }
  
  if (this.stats.totalClicks > 0) {
    this.stats.conversionRate = (this.stats.totalConversions / this.stats.totalClicks) * 100;
    this.stats.averageEarningsPerClick = this.earnings.totalEarnings / this.stats.totalClicks;
  }
  
  // Update last activity
  if (this.isModified()) {
    this.lastActivityAt = new Date();
  }
  
  next();
});

// Methods
promoterSchema.methods.canWithdraw = function(amount) {
  return this.isActive && 
         !this.isSuspended && 
         this.applicationStatus === 'approved' &&
         this.earnings.currentBalance >= amount &&
         amount >= 100; // Minimum withdrawal amount
};

promoterSchema.methods.requestWithdrawal = function(amount, method) {
  if (!this.canWithdraw(amount)) {
    throw new Error('Cannot process withdrawal request');
  }
  
  this.withdrawals.push({
    amount,
    method,
    status: 'pending'
  });
  
  this.earnings.pendingEarnings += amount;
  this.earnings.currentBalance -= amount;
  
  return this.save();
};

promoterSchema.methods.addEarnings = function(amount, type = 'cpc') {
  this.earnings.totalEarnings += amount;
  this.earnings.currentBalance += amount;
  
  // Update stats based on type
  if (type === 'cpc') {
    this.stats.totalClicks += 1;
  } else if (type === 'cpa') {
    this.stats.totalConversions += 1;
  }
  
  return this.save();
};

promoterSchema.methods.updateQualityScore = function() {
  let score = 50; // Base score
  
  // CTR factor
  if (this.stats.ctr > 2) score += 20;
  else if (this.stats.ctr > 1) score += 10;
  else if (this.stats.ctr < 0.5) score -= 10;
  
  // Conversion rate factor
  if (this.stats.conversionRate > 5) score += 15;
  else if (this.stats.conversionRate > 2) score += 10;
  else if (this.stats.conversionRate < 1) score -= 5;
  
  // Policy violations penalty
  const activeViolations = this.policyViolations.filter(v => !v.resolved);
  score -= activeViolations.length * 10;
  
  // Fraud score penalty
  score -= this.fraudScore * 0.5;
  
  this.qualityScore = Math.max(0, Math.min(100, score));
  return this.save();
};

promoterSchema.methods.addMonthlyMetric = function(month, metrics) {
  const existingIndex = this.monthlyMetrics.findIndex(m => m.month === month);
  if (existingIndex !== -1) {
    this.monthlyMetrics[existingIndex] = { month, ...metrics };
  } else {
    this.monthlyMetrics.push({ month, ...metrics });
  }
  return this.save();
};

promoterSchema.methods.canWithdraw = function(amount) {
  return this.earnings.currentBalance >= amount && 
         amount >= 100 && // Minimum withdrawal
         this.applicationStatus === 'approved';
};

promoterSchema.methods.requestWithdrawal = function(amount, method) {
  if (!this.canWithdraw(amount)) {
    throw new Error('Withdrawal not allowed');
  }

  // Add withdrawal record
  const withdrawal = {
    amount,
    method,
    status: 'pending',
    requestedAt: new Date()
  };

  this.withdrawals.push(withdrawal);
  
  // Update earnings
  this.earnings.currentBalance -= amount;
  this.earnings.totalWithdrawn += amount;

  return this.save();
};

promoterSchema.methods.addEarnings = function(amount, type = 'cpc') {
  this.earnings.currentBalance += amount;
  this.earnings.totalEarnings += amount;
  
  // Update stats based on type
  if (type === 'cpc') {
    this.stats.totalClicks += 1;
  }
  
  // Update monthly metrics
  const currentMonth = new Date().toISOString().substring(0, 7);
  let monthlyMetric = this.monthlyMetrics.find(m => m.month === currentMonth);
  
  if (!monthlyMetric) {
    monthlyMetric = {
      month: currentMonth,
      earnings: 0,
      clicks: 0,
      impressions: 0,
      conversions: 0
    };
    this.monthlyMetrics.push(monthlyMetric);
  }
  
  monthlyMetric.earnings += amount;
  if (type === 'cpc') monthlyMetric.clicks += 1;
  if (type === 'cpm') monthlyMetric.impressions += 1;
  if (type === 'cpa') monthlyMetric.conversions += 1;

  return this.save();
};

// Static methods
promoterSchema.statics.getTopPerformers = function(limit = 10) {
  return this.aggregate([
    {
      $match: {
        isActive: true,
        applicationStatus: 'approved'
      }
    },
    {
      $sort: {
        'earnings.totalEarnings': -1,
        qualityScore: -1
      }
    },
    {
      $limit: limit
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        displayName: 1,
        'earnings.totalEarnings': 1,
        'stats.totalClicks': 1,
        'stats.ctr': 1,
        qualityScore: 1,
        'user.firstName': 1,
        'user.lastName': 1
      }
    }
  ]);
};

module.exports = mongoose.model('Promoter', promoterSchema);

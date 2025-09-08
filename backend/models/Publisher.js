const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Business Info
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  businessType: {
    type: String,
    enum: ['individual', 'partnership', 'private_limited', 'llp', 'other'],
    required: true
  },
  industry: {
    type: String,
    required: true
  },
  website: String,
  description: String,
  
  // Contact Info
  contactPerson: String,
  businessEmail: String,
  businessPhone: String,
  
  // Address
  businessAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String
  },
  
  // Legal Documents
  documents: [{
    type: {
      type: String,
      enum: ['gst', 'pan', 'incorporation', 'trade_license', 'other']
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
  
  // Verification Status
  verificationStatus: {
    type: String,
    enum: ['pending', 'under_review', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationNotes: String,
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isSuspended: {
    type: Boolean,
    default: false
  },
  suspensionReason: String,
  
  // Package Details
  currentPackage: {
    type: String,
    enum: ['basic', 'standard', 'premium'],
    default: 'basic'
  },
  packageStartDate: Date,
  packageEndDate: Date,
  packageFeatures: {
    adsPerMonth: Number,
    featuredListings: Number,
    analyticsAccess: Boolean,
    prioritySupport: Boolean,
    customBranding: Boolean
  },
  
  // Financial Details
  walletBalance: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  
  // Ad Statistics
  stats: {
    totalAds: {
      type: Number,
      default: 0
    },
    activeAds: {
      type: Number,
      default: 0
    },
    totalImpressions: {
      type: Number,
      default: 0
    },
    totalClicks: {
      type: Number,
      default: 0
    },
    totalSpend: {
      type: Number,
      default: 0
    },
    averageCTR: {
      type: Number,
      default: 0
    },
    averageCPC: {
      type: Number,
      default: 0
    }
  },
  
  // Payment Method
  paymentMethod: {
    type: String,
    enum: ['wallet', 'card', 'upi', 'netbanking'],
    default: 'wallet'
  },
  
  // Billing Details
  billingCycle: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
  nextBillingDate: Date,
  
  // API Access
  apiKey: String,
  apiSecret: String,
  apiQuota: {
    monthly: {
      type: Number,
      default: 1000
    },
    used: {
      type: Number,
      default: 0
    },
    resetDate: Date
  },
  
  // Notifications
  notifications: {
    adApproval: {
      type: Boolean,
      default: true
    },
    budgetAlerts: {
      type: Boolean,
      default: true
    },
    performanceReports: {
      type: Boolean,
      default: true
    },
    paymentReminders: {
      type: Boolean,
      default: true
    }
  },
  
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
  
  // Performance Metrics
  monthlyMetrics: [{
    month: String, // YYYY-MM format
    impressions: Number,
    clicks: Number,
    spend: Number,
    conversions: Number,
    revenue: Number,
    ctr: Number,
    cpc: Number,
    roas: Number
  }],
  
  // Notes
  adminNotes: String,
  
  // Timestamps
  lastLoginAt: Date,
  lastActivityAt: Date
}, {
  timestamps: true
});

// Indexes
publisherSchema.index({ userId: 1 });
publisherSchema.index({ verificationStatus: 1 });
publisherSchema.index({ isActive: 1 });
publisherSchema.index({ currentPackage: 1 });
publisherSchema.index({ packageEndDate: 1 });
publisherSchema.index({ createdAt: -1 });

// Virtual for package status
publisherSchema.virtual('packageStatus').get(function() {
  if (!this.packageEndDate) return 'inactive';
  return new Date() > this.packageEndDate ? 'expired' : 'active';
});

// Pre-save middleware
publisherSchema.pre('save', function(next) {
  // Generate API credentials if new publisher
  if (this.isNew && !this.apiKey) {
    this.apiKey = 'pub_' + Math.random().toString(36).substring(2, 15);
    this.apiSecret = Math.random().toString(36).substring(2, 25);
  }
  
  // Update last activity
  if (this.isModified()) {
    this.lastActivityAt = new Date();
  }
  
  next();
});

// Methods
publisherSchema.methods.canCreateAd = function() {
  return this.isActive && 
         !this.isSuspended && 
         this.verificationStatus === 'verified' &&
         this.packageStatus === 'active' &&
         this.stats.activeAds < this.packageFeatures.adsPerMonth;
};

publisherSchema.methods.deductFromWallet = function(amount) {
  if (this.walletBalance < amount) {
    throw new Error('Insufficient wallet balance');
  }
  this.walletBalance -= amount;
  this.totalSpent += amount;
  return this.save();
};

publisherSchema.methods.addToWallet = function(amount) {
  this.walletBalance += amount;
  return this.save();
};

publisherSchema.methods.updateStats = function(statsUpdate) {
  Object.keys(statsUpdate).forEach(key => {
    if (this.stats[key] !== undefined) {
      this.stats[key] += statsUpdate[key];
    }
  });
  
  // Recalculate averages
  if (this.stats.totalClicks > 0) {
    this.stats.averageCTR = (this.stats.totalClicks / this.stats.totalImpressions) * 100;
    this.stats.averageCPC = this.stats.totalSpend / this.stats.totalClicks;
  }
  
  return this.save();
};

publisherSchema.methods.addMonthlyMetric = function(month, metrics) {
  const existingIndex = this.monthlyMetrics.findIndex(m => m.month === month);
  if (existingIndex !== -1) {
    this.monthlyMetrics[existingIndex] = { month, ...metrics };
  } else {
    this.monthlyMetrics.push({ month, ...metrics });
  }
  return this.save();
};

// Static methods
publisherSchema.statics.getTopPerformers = function(limit = 10) {
  return this.aggregate([
    {
      $match: {
        isActive: true,
        verificationStatus: 'verified'
      }
    },
    {
      $sort: {
        'stats.totalClicks': -1,
        'stats.averageCTR': -1
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
        businessName: 1,
        'stats.totalImpressions': 1,
        'stats.totalClicks': 1,
        'stats.averageCTR': 1,
        'stats.averageCPC': 1,
        'user.firstName': 1,
        'user.lastName': 1,
        'user.email': 1
      }
    }
  ]);
};

// Ensure virtual fields are serialized
publisherSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Publisher', publisherSchema);

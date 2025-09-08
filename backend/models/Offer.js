const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  // Basic Info
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  shortDescription: String,
  
  // Offer Type
  type: {
    type: String,
    enum: ['coupon', 'cashback', 'deal', 'bundle'],
    required: true
  },
  
  // Platform/Merchant Info
  merchant: {
    name: {
      type: String,
      required: true
    },
    logo: String,
    website: String,
    platform: {
      type: String,
      enum: ['amazon', 'flipkart', 'myntra', 'ajio', 'nykaa', 'tatacliq', 'firstcry', 'other']
    }
  },
  
  // Offer Details
  couponCode: String,
  cashbackPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  flatCashback: Number,
  maxCashback: Number,
  minOrderValue: Number,
  
  // Discount Details
  discountType: {
    type: String,
    enum: ['percentage', 'flat', 'bogo', 'free_shipping']
  },
  discountValue: Number,
  maxDiscount: Number,
  
  // Categories
  categories: [{
    type: String,
    enum: ['electronics', 'fashion', 'beauty', 'home', 'books', 'sports', 'automotive', 'food', 'travel', 'other']
  }],
  
  // Target Audience
  targetAudience: {
    newUsers: Boolean,
    existingUsers: Boolean,
    premiumUsers: Boolean,
    ageGroups: [String],
    genders: [String]
  },
  
  // Validity
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  timezone: {
    type: String,
    default: 'Asia/Kolkata'
  },
  
  // Usage Limits
  totalUsageLimit: Number,
  userUsageLimit: {
    type: Number,
    default: 1
  },
  dailyUsageLimit: Number,
  
  // Current Usage
  currentUsage: {
    type: Number,
    default: 0
  },
  uniqueUsers: {
    type: Number,
    default: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'pending_approval', 'active', 'paused', 'expired', 'cancelled'],
    default: 'draft'
  },
  
  // Visibility
  isPublic: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  
  // Media
  images: [String],
  bannerImage: String,
  thumbnailImage: String,
  
  // Terms & Conditions
  terms: [String],
  exclusions: [String],
  
  // SEO
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Affiliate Details
  affiliateNetwork: String,
  affiliateId: String,
  trackingUrl: String,
  deepLink: String,
  
  // Performance Metrics
  metrics: {
    views: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    },
    conversions: {
      type: Number,
      default: 0
    },
    revenue: {
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
    }
  },
  
  // Daily Metrics
  dailyMetrics: [{
    date: Date,
    views: Number,
    clicks: Number,
    conversions: Number,
    revenue: Number
  }],
  
  // Creator Info
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Approval Workflow
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectionReason: String,
  
  // Source
  source: {
    type: String,
    enum: ['manual', 'api_sync', 'import', 'bulk_upload'],
    default: 'manual'
  },
  sourceId: String, // External ID from API
  
  // Tags
  tags: [String],
  
  // Admin Notes
  adminNotes: String,
  
  // Auto-sync settings
  autoSync: {
    enabled: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['hourly', 'daily', 'weekly'],
      default: 'daily'
    },
    lastSyncAt: Date,
    syncErrors: [String]
  }
}, {
  timestamps: true
});

// Indexes
offerSchema.index({ status: 1, endDate: 1 });
offerSchema.index({ merchant: 1 });
offerSchema.index({ categories: 1 });
offerSchema.index({ startDate: 1, endDate: 1 });
offerSchema.index({ isFeatured: 1, priority: -1 });
offerSchema.index({ slug: 1 });
offerSchema.index({ createdAt: -1 });
offerSchema.index({ 'metrics.ctr': -1 });
offerSchema.index({ 'metrics.conversions': -1 });

// Virtual for active status
offerSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.status === 'active' && 
         this.startDate <= now && 
         this.endDate >= now &&
         (this.totalUsageLimit ? this.currentUsage < this.totalUsageLimit : true);
});

// Virtual for usage percentage
offerSchema.virtual('usagePercentage').get(function() {
  if (!this.totalUsageLimit) return 0;
  return (this.currentUsage / this.totalUsageLimit) * 100;
});

// Pre-save middleware
offerSchema.pre('save', function(next) {
  // Generate slug if not exists
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') +
      '-' + Math.random().toString(36).substring(2, 8);
  }
  
  // Calculate CTR and conversion rate
  if (this.metrics.views > 0) {
    this.metrics.ctr = (this.metrics.clicks / this.metrics.views) * 100;
  }
  
  if (this.metrics.clicks > 0) {
    this.metrics.conversionRate = (this.metrics.conversions / this.metrics.clicks) * 100;
  }
  
  // Auto-expire if past end date
  if (this.endDate < new Date() && this.status === 'active') {
    this.status = 'expired';
  }
  
  next();
});

// Methods
offerSchema.methods.canUse = function(userId) {
  const now = new Date();
  
  // Check basic validity
  if (this.status !== 'active' || 
      this.startDate > now || 
      this.endDate < now) {
    return { canUse: false, reason: 'Offer not active or expired' };
  }
  
  // Check total usage limit
  if (this.totalUsageLimit && this.currentUsage >= this.totalUsageLimit) {
    return { canUse: false, reason: 'Usage limit exceeded' };
  }
  
  // TODO: Check user-specific usage limit
  // This would require tracking user usage in a separate collection
  
  return { canUse: true };
};

offerSchema.methods.incrementUsage = function(userId) {
  this.currentUsage += 1;
  
  // Add to daily metrics
  const today = new Date().toISOString().split('T')[0];
  const todayMetric = this.dailyMetrics.find(m => 
    m.date.toISOString().split('T')[0] === today
  );
  
  if (todayMetric) {
    todayMetric.conversions += 1;
  } else {
    this.dailyMetrics.push({
      date: new Date(),
      views: 0,
      clicks: 0,
      conversions: 1,
      revenue: 0
    });
  }
  
  return this.save();
};

offerSchema.methods.trackView = function() {
  this.metrics.views += 1;
  
  // Add to daily metrics
  const today = new Date().toISOString().split('T')[0];
  const todayMetric = this.dailyMetrics.find(m => 
    m.date.toISOString().split('T')[0] === today
  );
  
  if (todayMetric) {
    todayMetric.views += 1;
  } else {
    this.dailyMetrics.push({
      date: new Date(),
      views: 1,
      clicks: 0,
      conversions: 0,
      revenue: 0
    });
  }
  
  return this.save();
};

offerSchema.methods.trackClick = function() {
  this.metrics.clicks += 1;
  
  // Add to daily metrics
  const today = new Date().toISOString().split('T')[0];
  const todayMetric = this.dailyMetrics.find(m => 
    m.date.toISOString().split('T')[0] === today
  );
  
  if (todayMetric) {
    todayMetric.clicks += 1;
  } else {
    this.dailyMetrics.push({
      date: new Date(),
      views: 0,
      clicks: 1,
      conversions: 0,
      revenue: 0
    });
  }
  
  return this.save();
};

// Static methods
offerSchema.statics.getActiveOffers = function(filters = {}) {
  const now = new Date();
  const query = {
    status: 'active',
    startDate: { $lte: now },
    endDate: { $gte: now },
    isPublic: true,
    ...filters
  };
  
  return this.find(query)
    .sort({ isFeatured: -1, priority: -1, createdAt: -1 })
    .populate('createdBy', 'firstName lastName');
};

offerSchema.statics.getFeaturedOffers = function(limit = 10) {
  const now = new Date();
  return this.find({
    status: 'active',
    startDate: { $lte: now },
    endDate: { $gte: now },
    isPublic: true,
    isFeatured: true
  })
  .sort({ priority: -1, 'metrics.conversions': -1 })
  .limit(limit);
};

offerSchema.statics.getTopPerforming = function(period = 30, limit = 10) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - period);
  
  return this.aggregate([
    {
      $match: {
        status: 'active',
        createdAt: { $gte: startDate }
      }
    },
    {
      $sort: {
        'metrics.conversions': -1,
        'metrics.ctr': -1
      }
    },
    {
      $limit: limit
    }
  ]);
};

// Ensure virtual fields are serialized
offerSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Offer', offerSchema);

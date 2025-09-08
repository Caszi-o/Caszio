const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  // Publisher Reference
  publisherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publisher',
    required: true
  },
  
  // Basic Info
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  
  // Ad Type
  type: {
    type: String,
    enum: ['banner', 'text', 'video', 'native', 'popup', 'interstitial'],
    required: true
  },
  
  // Ad Format
  format: {
    width: Number,
    height: Number,
    aspectRatio: String,
    responsive: {
      type: Boolean,
      default: false
    }
  },
  
  // Creative Assets
  creatives: [{
    type: {
      type: String,
      enum: ['image', 'video', 'html', 'text']
    },
    url: String,
    content: String, // For text/HTML content
    alt: String,
    size: Number, // File size in bytes
    dimensions: {
      width: Number,
      height: Number
    }
  }],
  
  // Targeting
  targeting: {
    // Demographic
    ageGroups: [{
      type: String,
      enum: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
    }],
    genders: [{
      type: String,
      enum: ['male', 'female', 'other']
    }],
    
    // Geographic
    countries: [String],
    states: [String],
    cities: [String],
    
    // Interest-based
    interests: [String],
    categories: [String],
    
    // Behavioral
    deviceTypes: [{
      type: String,
      enum: ['desktop', 'mobile', 'tablet']
    }],
    browsers: [String],
    operatingSystems: [String],
    
    // Contextual
    keywords: [String],
    placements: [String], // Specific website placements
    
    // Custom
    customAudiences: [String]
  },
  
  // Budget & Pricing
  budget: {
    type: {
      type: String,
      enum: ['daily', 'total', 'monthly'],
      default: 'daily'
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    spent: {
      type: Number,
      default: 0
    },
    remaining: {
      type: Number,
      default: 0
    }
  },
  
  // Bidding
  bidding: {
    model: {
      type: String,
      enum: ['cpc', 'cpm', 'cpa', 'cps'],
      default: 'cpc'
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    maxBid: Number,
    autoBidding: {
      type: Boolean,
      default: false
    }
  },
  
  // Schedule
  schedule: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    },
    dayParting: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      startTime: String, // HH:MM format
      endTime: String    // HH:MM format
    }]
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'pending_review', 'approved', 'active', 'paused', 'completed', 'rejected', 'cancelled'],
    default: 'draft'
  },
  
  // Review Process
  reviewNotes: String,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  rejectionReason: String,
  
  // Performance Metrics
  metrics: {
    impressions: {
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
    cost: {
      type: Number,
      default: 0
    },
    ctr: {
      type: Number,
      default: 0
    },
    cpc: {
      type: Number,
      default: 0
    },
    cpm: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    },
    roas: {
      type: Number,
      default: 0
    }
  },
  
  // Hourly Metrics for detailed analytics
  hourlyMetrics: [{
    hour: Date, // Rounded to hour
    impressions: Number,
    clicks: Number,
    conversions: Number,
    cost: Number
  }],
  
  // Daily Metrics
  dailyMetrics: [{
    date: Date,
    impressions: Number,
    clicks: Number,
    conversions: Number,
    cost: Number,
    revenue: Number
  }],
  
  // Landing Page
  landingPage: {
    url: {
      type: String,
      required: true
    },
    title: String,
    description: String,
    screenshot: String
  },
  
  // Call to Action
  cta: {
    text: {
      type: String,
      default: 'Click Here'
    },
    color: String,
    backgroundColor: String
  },
  
  // Ad Slots (where this ad can appear)
  allowedSlots: [{
    type: String,
    enum: ['header', 'sidebar', 'footer', 'content', 'popup', 'native']
  }],
  
  // Quality Score
  qualityScore: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },
  
  // Frequency Capping
  frequencyCap: {
    impressionsPerUser: Number,
    timeWindow: {
      type: String,
      enum: ['hour', 'day', 'week', 'month']
    }
  },
  
  // A/B Testing
  variations: [{
    name: String,
    trafficSplit: Number, // Percentage
    creative: mongoose.Schema.Types.Mixed,
    metrics: {
      impressions: Number,
      clicks: Number,
      conversions: Number,
      ctr: Number
    }
  }],
  
  // Fraud Detection
  fraudMetrics: {
    suspiciousClicks: {
      type: Number,
      default: 0
    },
    invalidTraffic: {
      type: Number,
      default: 0
    },
    fraudScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  
  // Attribution
  attributionModel: {
    type: String,
    enum: ['first_click', 'last_click', 'linear', 'time_decay', 'position_based'],
    default: 'last_click'
  },
  
  // Tags and Categories
  tags: [String],
  category: {
    type: String,
    enum: ['technology', 'fashion', 'beauty', 'home', 'food', 'travel', 'finance', 'health', 'education', 'entertainment']
  },
  
  // Compliance
  compliance: {
    isCompliant: {
      type: Boolean,
      default: true
    },
    violations: [String],
    lastChecked: Date
  },
  
  // External Tracking
  trackingPixels: [String],
  thirdPartyTracking: [{
    provider: String,
    trackingId: String,
    events: [String]
  }],
  
  // Notes
  notes: String,
  adminNotes: String
}, {
  timestamps: true
});

// Indexes
adSchema.index({ publisherId: 1, status: 1 });
adSchema.index({ status: 1, 'schedule.startDate': 1 });
adSchema.index({ 'targeting.interests': 1 });
adSchema.index({ 'targeting.categories': 1 });
adSchema.index({ type: 1 });
adSchema.index({ qualityScore: -1 });
adSchema.index({ 'metrics.ctr': -1 });
adSchema.index({ createdAt: -1 });

// Virtual for active status
adSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.status === 'active' && 
         this.schedule.startDate <= now && 
         (!this.schedule.endDate || this.schedule.endDate >= now) &&
         this.budget.remaining > 0;
});

// Virtual for completion percentage
adSchema.virtual('completionPercentage').get(function() {
  if (this.budget.amount === 0) return 0;
  return (this.budget.spent / this.budget.amount) * 100;
});

// Pre-save middleware
adSchema.pre('save', function(next) {
  // Calculate remaining budget
  this.budget.remaining = Math.max(0, this.budget.amount - this.budget.spent);
  
  // Calculate performance metrics
  if (this.metrics.impressions > 0) {
    this.metrics.ctr = (this.metrics.clicks / this.metrics.impressions) * 100;
    this.metrics.cpm = (this.metrics.cost / this.metrics.impressions) * 1000;
  }
  
  if (this.metrics.clicks > 0) {
    this.metrics.cpc = this.metrics.cost / this.metrics.clicks;
    this.metrics.conversionRate = (this.metrics.conversions / this.metrics.clicks) * 100;
  }
  
  if (this.metrics.cost > 0) {
    this.metrics.roas = (this.metrics.revenue / this.metrics.cost) * 100;
  }
  
  // Auto-pause if budget exhausted
  if (this.budget.remaining <= 0 && this.status === 'active') {
    this.status = 'completed';
  }
  
  // Auto-complete if end date passed
  if (this.schedule.endDate && this.schedule.endDate < new Date() && this.status === 'active') {
    this.status = 'completed';
  }
  
  next();
});

// Methods
adSchema.methods.recordImpression = function(targetingData = {}) {
  this.metrics.impressions += 1;
  
  // Record hourly metric
  const currentHour = new Date();
  currentHour.setMinutes(0, 0, 0);
  
  const hourlyMetric = this.hourlyMetrics.find(h => 
    h.hour.getTime() === currentHour.getTime()
  );
  
  if (hourlyMetric) {
    hourlyMetric.impressions += 1;
  } else {
    this.hourlyMetrics.push({
      hour: currentHour,
      impressions: 1,
      clicks: 0,
      conversions: 0,
      cost: 0
    });
  }
  
  // Calculate cost for CPM
  if (this.bidding.model === 'cpm') {
    const cost = this.bidding.amount / 1000;
    this.metrics.cost += cost;
    this.budget.spent += cost;
    
    if (hourlyMetric) {
      hourlyMetric.cost += cost;
    }
  }
  
  return this.save();
};

adSchema.methods.recordClick = function(targetingData = {}) {
  this.metrics.clicks += 1;
  
  // Record hourly metric
  const currentHour = new Date();
  currentHour.setMinutes(0, 0, 0);
  
  const hourlyMetric = this.hourlyMetrics.find(h => 
    h.hour.getTime() === currentHour.getTime()
  );
  
  if (hourlyMetric) {
    hourlyMetric.clicks += 1;
  } else {
    this.hourlyMetrics.push({
      hour: currentHour,
      impressions: 0,
      clicks: 1,
      conversions: 0,
      cost: 0
    });
  }
  
  // Calculate cost for CPC
  if (this.bidding.model === 'cpc') {
    const cost = this.bidding.amount;
    this.metrics.cost += cost;
    this.budget.spent += cost;
    
    if (hourlyMetric) {
      hourlyMetric.cost += cost;
    }
  }
  
  return this.save();
};

adSchema.methods.recordConversion = function(value = 0) {
  this.metrics.conversions += 1;
  this.metrics.revenue += value;
  
  // Record hourly metric
  const currentHour = new Date();
  currentHour.setMinutes(0, 0, 0);
  
  const hourlyMetric = this.hourlyMetrics.find(h => 
    h.hour.getTime() === currentHour.getTime()
  );
  
  if (hourlyMetric) {
    hourlyMetric.conversions += 1;
  }
  
  // Calculate cost for CPA
  if (this.bidding.model === 'cpa') {
    const cost = this.bidding.amount;
    this.metrics.cost += cost;
    this.budget.spent += cost;
    
    if (hourlyMetric) {
      hourlyMetric.cost += cost;
    }
  }
  
  return this.save();
};

adSchema.methods.updateQualityScore = function() {
  let score = 50; // Base score
  
  // CTR factor (40% weight)
  if (this.metrics.ctr > 3) score += 20;
  else if (this.metrics.ctr > 1.5) score += 15;
  else if (this.metrics.ctr > 0.8) score += 10;
  else if (this.metrics.ctr < 0.5) score -= 15;
  
  // Conversion rate factor (30% weight)
  if (this.metrics.conversionRate > 5) score += 15;
  else if (this.metrics.conversionRate > 2) score += 10;
  else if (this.metrics.conversionRate > 1) score += 5;
  else if (this.metrics.conversionRate < 0.5) score -= 10;
  
  // Landing page quality (20% weight)
  // This would require additional analysis
  
  // Compliance factor (10% weight)
  if (!this.compliance.isCompliant) score -= 20;
  if (this.compliance.violations.length > 0) score -= this.compliance.violations.length * 5;
  
  // Fraud score penalty
  score -= this.fraudMetrics.fraudScore * 0.3;
  
  this.qualityScore = Math.max(0, Math.min(100, score));
  return this.save();
};

// Static methods
adSchema.statics.getEligibleAds = function(criteria = {}) {
  const now = new Date();
  const query = {
    status: 'active',
    'schedule.startDate': { $lte: now },
    'budget.remaining': { $gt: 0 },
    $or: [
      { 'schedule.endDate': { $exists: false } },
      { 'schedule.endDate': { $gte: now } }
    ]
  };
  
  // Add targeting criteria
  if (criteria.interests) {
    query['targeting.interests'] = { $in: criteria.interests };
  }
  
  if (criteria.categories) {
    query['targeting.categories'] = { $in: criteria.categories };
  }
  
  if (criteria.deviceType) {
    query['targeting.deviceTypes'] = criteria.deviceType;
  }
  
  return this.find(query)
    .populate('publisherId', 'businessName qualityScore')
    .sort({ qualityScore: -1, 'bidding.amount': -1 });
};

// Ensure virtual fields are serialized
adSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Ad', adSchema);

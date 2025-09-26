const mongoose = require('mongoose');

const partnershipSchema = new mongoose.Schema({
  // Company Information
  companyName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  websiteUrl: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
      message: 'Please enter a valid website URL'
    }
  },
  
  // Contact Information
  contactPersonName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[\+]?[1-9][\d]{0,15}$/.test(v.replace(/[\s\-\(\)]/g, ''));
      },
      message: 'Please enter a valid phone number'
    }
  },
  
  // Application Details
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Admin Response
  adminNotes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  
  // Additional Metadata
  ipAddress: String,
  userAgent: String,
  referrerUrl: String,
  
  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
partnershipSchema.index({ status: 1 });
partnershipSchema.index({ email: 1 });
partnershipSchema.index({ submittedAt: -1 });
partnershipSchema.index({ companyName: 'text', message: 'text' });

// Pre-save middleware to normalize data
partnershipSchema.pre('save', function(next) {
  // Normalize website URL
  if (this.websiteUrl && !this.websiteUrl.startsWith('http')) {
    this.websiteUrl = 'https://' + this.websiteUrl;
  }
  
  // Normalize phone number
  if (this.phone) {
    this.phone = this.phone.replace(/[\s\-\(\)]/g, '');
  }
  
  next();
});

// Instance methods
partnershipSchema.methods.approve = function(adminId, notes) {
  this.status = 'approved';
  this.reviewedBy = adminId;
  this.reviewedAt = new Date();
  if (notes) this.adminNotes = notes;
  return this.save();
};

partnershipSchema.methods.reject = function(adminId, reason) {
  this.status = 'rejected';
  this.reviewedBy = adminId;
  this.reviewedAt = new Date();
  this.adminNotes = reason;
  return this.save();
};

partnershipSchema.methods.setUnderReview = function(adminId) {
  this.status = 'under_review';
  this.reviewedBy = adminId;
  this.reviewedAt = new Date();
  return this.save();
};

// Static methods
partnershipSchema.statics.getByStatus = function(status, page = 1, limit = 20) {
  return this.find({ status })
    .sort({ submittedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('reviewedBy', 'firstName lastName');
};

partnershipSchema.statics.searchApplications = function(query, page = 1, limit = 20) {
  const searchQuery = {
    $or: [
      { companyName: { $regex: query, $options: 'i' } },
      { contactPersonName: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
      { message: { $regex: query, $options: 'i' } }
    ]
  };
  
  return this.find(searchQuery)
    .sort({ submittedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('reviewedBy', 'firstName lastName');
};

partnershipSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('Partnership', partnershipSchema);

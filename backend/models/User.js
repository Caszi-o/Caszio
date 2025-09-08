const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Info
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.oauthProvider;
    }
  },
  
  // OAuth
  oauthProvider: {
    type: String,
    enum: ['google', 'facebook', null],
    default: null
  },
  oauthId: String,
  
  // Profile
  avatar: String,
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', null],
    default: null
  },
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String
  },
  
  // Account Status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'publisher', 'promoter', 'admin'],
    default: 'user'
  },
  
  // KYC
  kycStatus: {
    type: String,
    enum: ['pending', 'submitted', 'verified', 'rejected'],
    default: 'pending'
  },
  kycDocuments: [{
    type: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Security
  twoFactorSecret: String,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  refreshTokens: [String],
  
  // Ecommerce Accounts
  ecommerceAccounts: [{
    platform: {
      type: String,
      enum: ['amazon', 'flipkart', 'myntra', 'ajio', 'nykaa', 'tatacliq', 'firstcry']
    },
    accountId: String,
    accessToken: String,
    refreshToken: String,
    isActive: {
      type: Boolean,
      default: true
    },
    linkedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Wallet
  walletBalance: {
    type: Number,
    default: 0
  },
  pendingCashback: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  
  // Bank Details
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolderName: String,
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  
  // UPI Details
  upiId: String,
  
  // Referral
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  referralEarnings: {
    type: Number,
    default: 0
  },
  
  // Preferences
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: true
    },
    marketingEmails: {
      type: Boolean,
      default: false
    }
  },
  
  // Analytics
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  },
  ipAddress: String,
  userAgent: String,
  
  // Timestamps
  emailVerifiedAt: Date,
  phoneVerifiedAt: Date,
  deletedAt: Date
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ referralCode: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware
userSchema.pre('save', async function(next) {
  // Hash password if modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  
  // Generate referral code if new user
  if (this.isNew && !this.referralCode) {
    this.referralCode = this.firstName.substring(0, 3).toUpperCase() + 
                       Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  
  next();
});

// Methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.refreshTokens;
  delete userObject.twoFactorSecret;
  delete userObject.ecommerceAccounts;
  delete userObject.bankDetails;
  return userObject;
};

userSchema.methods.addRefreshToken = function(token) {
  this.refreshTokens.push(token);
  // Keep only last 5 refresh tokens
  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }
  return this.save();
};

userSchema.methods.removeRefreshToken = function(token) {
  this.refreshTokens = this.refreshTokens.filter(rt => rt !== token);
  return this.save();
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.refreshTokens;
    delete ret.twoFactorSecret;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);

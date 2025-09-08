const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Balance
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Pending amounts
  pendingCashback: {
    type: Number,
    default: 0,
    min: 0
  },
  
  pendingWithdrawals: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Lifetime totals
  totalEarned: {
    type: Number,
    default: 0
  },
  
  totalWithdrawn: {
    type: Number,
    default: 0
  },
  
  totalSpent: {
    type: Number,
    default: 0
  },
  
  // Currency
  currency: {
    type: String,
    default: 'INR'
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  isFrozen: {
    type: Boolean,
    default: false
  },
  
  freezeReason: String,
  
  // Withdrawal settings
  minimumWithdrawal: {
    type: Number,
    default: 100
  },
  
  autoWithdrawal: {
    enabled: {
      type: Boolean,
      default: false
    },
    threshold: Number,
    method: {
      type: String,
      enum: ['bank_transfer', 'upi', 'paypal']
    }
  },
  
  // Security
  pin: String, // For transaction verification
  pinAttempts: {
    type: Number,
    default: 0
  },
  
  pinLockedUntil: Date,
  
  // Notifications
  notifications: {
    lowBalance: {
      enabled: {
        type: Boolean,
        default: true
      },
      threshold: {
        type: Number,
        default: 50
      }
    },
    transactions: {
      type: Boolean,
      default: true
    },
    withdrawals: {
      type: Boolean,
      default: true
    }
  },
  
  // Analytics
  monthlyStats: [{
    month: String, // YYYY-MM format
    earnings: Number,
    withdrawals: Number,
    spending: Number,
    balance: Number,
    transactions: Number
  }],
  
  // Last transaction info
  lastTransaction: {
    amount: Number,
    type: String,
    date: Date,
    description: String
  }
}, {
  timestamps: true
});

// Indexes
walletSchema.index({ userId: 1 });
walletSchema.index({ isActive: 1 });
walletSchema.index({ balance: -1 });

// Virtual for available balance (excluding pending amounts)
walletSchema.virtual('availableBalance').get(function() {
  return Math.max(0, this.balance - this.pendingWithdrawals);
});

// Virtual for total pending
walletSchema.virtual('totalPending').get(function() {
  return this.pendingCashback + this.pendingWithdrawals;
});

// Pre-save middleware
walletSchema.pre('save', function(next) {
  // Ensure balance is not negative
  if (this.balance < 0) {
    this.balance = 0;
  }
  
  // Update last transaction info if balance changed
  if (this.isModified('balance') && !this.isNew) {
    this.lastTransaction.date = new Date();
  }
  
  next();
});

// Methods
walletSchema.methods.addFunds = function(amount, description = 'Funds added') {
  if (amount <= 0) {
    throw new Error('Amount must be positive');
  }
  
  this.balance += amount;
  this.totalEarned += amount;
  this.lastTransaction = {
    amount,
    type: 'credit',
    date: new Date(),
    description
  };
  
  return this.save();
};

walletSchema.methods.deductFunds = function(amount, description = 'Funds deducted') {
  if (amount <= 0) {
    throw new Error('Amount must be positive');
  }
  
  if (this.availableBalance < amount) {
    throw new Error('Insufficient balance');
  }
  
  this.balance -= amount;
  this.totalSpent += amount;
  this.lastTransaction = {
    amount: -amount,
    type: 'debit',
    date: new Date(),
    description
  };
  
  return this.save();
};

walletSchema.methods.addPendingCashback = function(amount) {
  if (amount <= 0) {
    throw new Error('Amount must be positive');
  }
  
  this.pendingCashback += amount;
  return this.save();
};

walletSchema.methods.creditPendingCashback = function(amount) {
  if (amount <= 0) {
    throw new Error('Amount must be positive');
  }
  
  if (this.pendingCashback < amount) {
    throw new Error('Insufficient pending cashback');
  }
  
  this.pendingCashback -= amount;
  this.balance += amount;
  this.totalEarned += amount;
  
  this.lastTransaction = {
    amount,
    type: 'cashback_credit',
    date: new Date(),
    description: 'Cashback credited'
  };
  
  return this.save();
};

walletSchema.methods.requestWithdrawal = function(amount) {
  if (amount <= 0) {
    throw new Error('Amount must be positive');
  }
  
  if (amount < this.minimumWithdrawal) {
    throw new Error(`Minimum withdrawal amount is ${this.minimumWithdrawal}`);
  }
  
  if (this.availableBalance < amount) {
    throw new Error('Insufficient balance');
  }
  
  if (this.isFrozen) {
    throw new Error('Wallet is frozen');
  }
  
  this.pendingWithdrawals += amount;
  return this.save();
};

walletSchema.methods.completeWithdrawal = function(amount) {
  if (amount <= 0) {
    throw new Error('Amount must be positive');
  }
  
  if (this.pendingWithdrawals < amount) {
    throw new Error('Insufficient pending withdrawals');
  }
  
  this.pendingWithdrawals -= amount;
  this.balance -= amount;
  this.totalWithdrawn += amount;
  
  this.lastTransaction = {
    amount: -amount,
    type: 'withdrawal',
    date: new Date(),
    description: 'Withdrawal completed'
  };
  
  return this.save();
};

walletSchema.methods.cancelWithdrawal = function(amount) {
  if (amount <= 0) {
    throw new Error('Amount must be positive');
  }
  
  if (this.pendingWithdrawals < amount) {
    throw new Error('Insufficient pending withdrawals');
  }
  
  this.pendingWithdrawals -= amount;
  return this.save();
};

walletSchema.methods.verifyPin = function(pin) {
  if (this.pinLockedUntil && new Date() < this.pinLockedUntil) {
    throw new Error('PIN is temporarily locked');
  }
  
  // In a real implementation, you'd hash the PIN
  const isValid = this.pin === pin;
  
  if (!isValid) {
    this.pinAttempts += 1;
    
    // Lock PIN after 3 failed attempts for 30 minutes
    if (this.pinAttempts >= 3) {
      this.pinLockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    }
    
    this.save();
    throw new Error('Invalid PIN');
  }
  
  // Reset attempts on successful verification
  this.pinAttempts = 0;
  this.pinLockedUntil = undefined;
  this.save();
  
  return true;
};

walletSchema.methods.updateMonthlyStats = function() {
  const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
  
  // Get transactions for current month (would need Transaction model)
  // This is a placeholder - in real implementation, you'd aggregate from transactions
  
  const existingStatIndex = this.monthlyStats.findIndex(stat => stat.month === currentMonth);
  
  const monthlyData = {
    month: currentMonth,
    earnings: 0, // Calculate from transactions
    withdrawals: 0, // Calculate from transactions
    spending: 0, // Calculate from transactions
    balance: this.balance,
    transactions: 0 // Count from transactions
  };
  
  if (existingStatIndex !== -1) {
    this.monthlyStats[existingStatIndex] = monthlyData;
  } else {
    this.monthlyStats.push(monthlyData);
  }
  
  // Keep only last 12 months
  if (this.monthlyStats.length > 12) {
    this.monthlyStats = this.monthlyStats.slice(-12);
  }
  
  return this.save();
};

walletSchema.methods.freeze = function(reason) {
  this.isFrozen = true;
  this.freezeReason = reason;
  return this.save();
};

walletSchema.methods.unfreeze = function() {
  this.isFrozen = false;
  this.freezeReason = undefined;
  return this.save();
};

// Static methods
walletSchema.statics.getTotalWalletValue = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalBalance: { $sum: '$balance' },
        totalPendingCashback: { $sum: '$pendingCashback' },
        totalPendingWithdrawals: { $sum: '$pendingWithdrawals' },
        totalEarned: { $sum: '$totalEarned' },
        totalWithdrawn: { $sum: '$totalWithdrawn' },
        activeWallets: {
          $sum: {
            $cond: [{ $eq: ['$isActive', true] }, 1, 0]
          }
        }
      }
    }
  ]);
};

walletSchema.statics.getTopEarners = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ totalEarned: -1 })
    .limit(limit)
    .populate('userId', 'firstName lastName email');
};

walletSchema.statics.getLowBalanceWallets = function(threshold = 50) {
  return this.find({
    isActive: true,
    balance: { $lt: threshold },
    'notifications.lowBalance.enabled': true
  })
  .populate('userId', 'firstName lastName email');
};

// Ensure virtual fields are serialized
walletSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.pin; // Never expose PIN
    return ret;
  }
});

module.exports = mongoose.model('Wallet', walletSchema);

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const { authenticateToken, authenticateRefreshToken } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');
const { sendSMS } = require('../utils/sms');

const router = express.Router();

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m'
  });
  
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
  });
  
  return { accessToken, refreshToken };
};

// Register
router.post('/register', [
  body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('phone').optional().isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits')
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

    const { firstName, lastName, email, password, phone, referralCode } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Handle referral
    let referredBy = null;
    if (referralCode) {
      referredBy = await User.findOne({ referralCode });
      if (!referredBy) {
        return res.status(400).json({
          success: false,
          message: 'Invalid referral code'
        });
      }
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      referredBy: referredBy?._id
    });

    await user.save();

    // Create wallet
    const wallet = new Wallet({
      userId: user._id
    });
    await wallet.save();

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    // Send verification email (skip if email not configured)
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await sendEmail({
          to: email,
          subject: 'Verify Your Casyoro Account',
          template: 'verification',
          data: {
            name: firstName,
            verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
          }
        });
      } else {
        console.log('Email not configured, skipping verification email');
      }
    } catch (emailError) {
      console.log('Email sending failed:', emailError.message);
      // Continue with registration even if email fails
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    await user.addRefreshToken(refreshToken);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      data: {
        user: user.getPublicProfile(),
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
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

    const { email, password, twoFactorCode } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user || !await user.comparePassword(password)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check 2FA if enabled
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return res.status(200).json({
          success: true,
          requiresTwoFactor: true,
          message: 'Two-factor authentication code required'
        });
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorCode,
        window: 2
      });

      if (!verified) {
        return res.status(401).json({
          success: false,
          message: 'Invalid two-factor authentication code'
        });
      }
    }

    // Update login info
    user.lastLogin = new Date();
    user.loginCount += 1;
    user.ipAddress = req.ip;
    user.userAgent = req.get('User-Agent');
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    await user.addRefreshToken(refreshToken);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.getPublicProfile(),
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// OAuth Google login
router.post('/oauth/google', async (req, res) => {
  try {
    const { googleToken, userInfo } = req.body;
    
    // Verify Google token (in real implementation, verify with Google API)
    // For now, we'll trust the frontend verification
    
    const { email, firstName, lastName, picture } = userInfo;
    
    let user = await User.findOne({ email });
    
    if (user) {
      // Update OAuth info if user exists
      user.oauthProvider = 'google';
      user.avatar = picture;
      user.isVerified = true;
      user.lastLogin = new Date();
      user.loginCount += 1;
      await user.save();
    } else {
      // Create new user
      user = new User({
        firstName,
        lastName,
        email,
        oauthProvider: 'google',
        avatar: picture,
        isVerified: true
      });
      await user.save();
      
      // Create wallet
      const wallet = new Wallet({ userId: user._id });
      await wallet.save();
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    await user.addRefreshToken(refreshToken);

    res.json({
      success: true,
      message: 'OAuth login successful',
      data: {
        user: user.getPublicProfile(),
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('OAuth login error:', error);
    res.status(500).json({
      success: false,
      message: 'OAuth login failed'
    });
  }
});

// Refresh token
router.post('/refresh-token', authenticateRefreshToken, async (req, res) => {
  try {
    const { user, refreshToken } = req;

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
    
    // Replace old refresh token with new one
    await user.removeRefreshToken(refreshToken);
    await user.addRefreshToken(newRefreshToken);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken,
        refreshToken: newRefreshToken
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
});

// Logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      await req.user.removeRefreshToken(refreshToken);
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// Verify email
router.post('/verify-email', [
  body('token').notEmpty().withMessage('Verification token is required')
], async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    user.isVerified = true;
    user.emailVerifiedAt = new Date();
    user.verificationToken = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed'
    });
  }
});

// Resend verification email
router.post('/resend-verification', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    // Send verification email
    await sendEmail({
      to: email,
      subject: 'Verify Your Casyoro Account',
      template: 'verification',
      data: {
        name: user.firstName,
        verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
      }
    });

    res.json({
      success: true,
      message: 'Verification email sent successfully'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification email'
    });
  }
});

// Forgot password
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Send reset email
    await sendEmail({
      to: email,
      subject: 'Reset Your Casyoro Password',
      template: 'password-reset',
      data: {
        name: user.firstName,
        resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
      }
    });

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request'
    });
  }
});

// Reset password
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
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

    const { token, password } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokens = []; // Invalidate all refresh tokens
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset failed'
    });
  }
});

// Setup 2FA
router.post('/setup-2fa', authenticateToken, async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `Casyoro (${req.user.email})`,
      issuer: 'Casyoro'
    });

    // Generate QR code
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    // Temporarily store secret (not saved until verified)
    req.user.tempTwoFactorSecret = secret.base32;
    await req.user.save();

    res.json({
      success: true,
      message: '2FA setup initiated',
      data: {
        qrCode: qrCodeUrl,
        secret: secret.base32
      }
    });

  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({
      success: false,
      message: '2FA setup failed'
    });
  }
});

// Verify and enable 2FA
router.post('/verify-2fa', [
  body('code').isLength({ min: 6, max: 6 }).withMessage('2FA code must be 6 digits')
], authenticateToken, async (req, res) => {
  try {
    const { code } = req.body;

    if (!req.user.tempTwoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: '2FA setup not initiated'
      });
    }

    const verified = speakeasy.totp.verify({
      secret: req.user.tempTwoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid 2FA code'
      });
    }

    // Enable 2FA
    req.user.twoFactorSecret = req.user.tempTwoFactorSecret;
    req.user.twoFactorEnabled = true;
    req.user.tempTwoFactorSecret = undefined;
    await req.user.save();

    res.json({
      success: true,
      message: '2FA enabled successfully'
    });

  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({
      success: false,
      message: '2FA verification failed'
    });
  }
});

// Disable 2FA
router.post('/disable-2fa', [
  body('password').notEmpty().withMessage('Password is required'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('2FA code must be 6 digits')
], authenticateToken, async (req, res) => {
  try {
    const { password, code } = req.body;

    // Verify password
    if (!await req.user.comparePassword(password)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Verify 2FA code
    const verified = speakeasy.totp.verify({
      secret: req.user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid 2FA code'
      });
    }

    // Disable 2FA
    req.user.twoFactorSecret = undefined;
    req.user.twoFactorEnabled = false;
    await req.user.save();

    res.json({
      success: true,
      message: '2FA disabled successfully'
    });

  } catch (error) {
    console.error('2FA disable error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disable 2FA'
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user information'
    });
  }
});

module.exports = router;

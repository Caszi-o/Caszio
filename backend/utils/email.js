const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email templates
const templates = {
  verification: (data) => ({
    subject: 'Verify Your Casyoro Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Casyoro!</h2>
        <p>Hi ${data.name},</p>
        <p>Thank you for registering with Casyoro. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationLink}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${data.verificationLink}</p>
        <p>This verification link will expire in 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 12px; color: #666;">
          If you didn't create an account with Casyoro, please ignore this email.
        </p>
      </div>
    `
  }),

  'password-reset': (data) => ({
    subject: 'Reset Your Casyoro Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${data.name},</p>
        <p>You requested to reset your password for your Casyoro account. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetLink}" 
             style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${data.resetLink}</p>
        <p>This password reset link will expire in 1 hour.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 12px; color: #666;">
          If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
        </p>
      </div>
    `
  }),

  'cashback-credited': (data) => ({
    subject: 'Cashback Credited to Your Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">Cashback Credited! 🎉</h2>
        <p>Hi ${data.name},</p>
        <p>Great news! Your cashback has been credited to your Casyoro wallet:</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <p><strong>Merchant:</strong> ${data.merchant}</p>
          <p><strong>Cashback Amount:</strong> ₹${data.cashbackAmount}</p>
          <p><strong>New Wallet Balance:</strong> ₹${data.walletBalance}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/dashboard" 
             style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Dashboard
          </a>
        </div>
        <p>Thank you for choosing Casyoro!</p>
      </div>
    `
  }),

  'withdrawal-approved': (data) => ({
    subject: 'Withdrawal Request Approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">Withdrawal Approved ✅</h2>
        <p>Hi ${data.name},</p>
        <p>Your withdrawal request has been approved and processed:</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Amount:</strong> ₹${data.amount}</p>
          <p><strong>Method:</strong> ${data.method}</p>
          <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
          <p><strong>Expected Credit:</strong> ${data.expectedDate}</p>
        </div>
        <p>The amount will be credited to your account within the next 1-3 business days.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/dashboard/withdrawals" 
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Track Withdrawal
          </a>
        </div>
      </div>
    `
  }),

  'publisher-approved': (data) => ({
    subject: 'Publisher Account Approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">Publisher Account Approved! 🎉</h2>
        <p>Hi ${data.name},</p>
        <p>Congratulations! Your publisher account has been approved. You can now start creating and managing your ad campaigns.</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Business Name:</strong> ${data.businessName}</p>
          <p><strong>Verification Date:</strong> ${data.verificationDate}</p>
          <p><strong>Account Type:</strong> ${data.accountType}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/publisher/dashboard" 
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Access Publisher Dashboard
          </a>
        </div>
        <p>Start creating your first ad campaign and reach thousands of potential customers!</p>
      </div>
    `
  }),

  'promoter-approved': (data) => ({
    subject: 'Promoter Application Approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">Promoter Application Approved! 🎉</h2>
        <p>Hi ${data.name},</p>
        <p>Great news! Your promoter application has been approved. You can now start earning by promoting ads on your platforms.</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Display Name:</strong> ${data.displayName}</p>
          <p><strong>Approval Date:</strong> ${data.approvalDate}</p>
          <p><strong>Commission Rate:</strong> ₹${data.cpcRate} per click</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/promoter/dashboard" 
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Access Promoter Dashboard
          </a>
        </div>
        <p>Get your ad scripts and start earning today!</p>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (options) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email configuration not found. Skipping email send.');
      return { success: false, message: 'Email not configured' };
    }

    const transporter = createTransporter();
    
    let emailContent;
    
    if (options.template && templates[options.template]) {
      emailContent = templates[options.template](options.data || {});
    } else {
      emailContent = {
        subject: options.subject,
        html: options.html || options.text
      };
    }

    const mailOptions = {
      from: `"Casyoro" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Send bulk emails
const sendBulkEmails = async (emails) => {
  const results = [];
  
  for (const email of emails) {
    try {
      const result = await sendEmail(email);
      results.push({ email: email.to, result });
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      results.push({ email: email.to, error: error.message });
    }
  }
  
  return results;
};

// Send promotional email
const sendPromotionalEmail = async (users, template, data) => {
  const emails = users.map(user => ({
    to: user.email,
    template,
    data: {
      ...data,
      name: user.firstName,
      unsubscribeLink: `${process.env.FRONTEND_URL}/unsubscribe?token=${user._id}`
    }
  }));
  
  return sendBulkEmails(emails);
};

// Email validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  sendEmail,
  sendBulkEmails,
  sendPromotionalEmail,
  validateEmail,
  templates
};

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
    subject: 'Verify Your Caszio Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Caszio!</h2>
        <p>Hi ${data.name},</p>
        <p>Thank you for registering with Caszio. Please verify your email address by clicking the button below:</p>
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
          If you didn't create an account with Caszio, please ignore this email.
        </p>
      </div>
    `
  }),

  'password-reset': (data) => ({
    subject: 'Reset Your Caszio Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${data.name},</p>
        <p>You requested to reset your password for your Caszio account. Click the button below to reset it:</p>
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
        <p>Great news! Your cashback has been credited to your Caszio wallet:</p>
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
        <p>Thank you for choosing Caszio!</p>
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

  // Partnership application templates
  'partnership-confirmation': (data) => ({
    subject: 'Partnership Application Received - Caszio',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #007bff;">Partnership Application Received! 📋</h2>
        <p>Hi ${data.contactPerson},</p>
        <p>Thank you for your interest in partnering with Caszio! We have successfully received your partnership application for <strong>${data.companyName}</strong>.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Application ID:</strong> ${data.applicationId}</p>
          <p><strong>Company:</strong> ${data.companyName}</p>
          <p><strong>Status:</strong> Under Review</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <h3 style="color: #333;">What's Next?</h3>
        <ul style="color: #666;">
          <li>Our partnership team will review your application within 2-3 business days</li>
          <li>We may reach out for additional information if needed</li>
          <li>You'll receive an email notification once we make a decision</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.statusUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Check Application Status
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          If you have any questions, please contact us at partnerships@caszio.com
        </p>
      </div>
    `
  }),

  'partnership-admin-notification': (data) => ({
    subject: `New Partnership Application - ${data.companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">🔔 New Partnership Application</h2>
        <p>A new partnership application has been submitted and requires review.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Company Details</h3>
          <p><strong>Company Name:</strong> ${data.companyName}</p>
          <p><strong>Website:</strong> <a href="${data.website}" target="_blank">${data.website}</a></p>
          <p><strong>Contact Person:</strong> ${data.contactPerson}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Phone:</strong> ${data.phone}</p>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #856404;">Message/Proposal:</h4>
          <p style="color: #856404; font-style: italic;">"${data.message}"</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.dashboardUrl}" 
             style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Review Application
          </a>
        </div>
        
        <p style="color: #666; font-size: 12px;">
          Application ID: ${data.applicationId}
        </p>
      </div>
    `
  }),

  'partnership-approved': (data) => ({
    subject: 'Partnership Application Approved - Welcome to Caszio! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">Partnership Approved! 🎉</h2>
        <p>Hi ${data.contactPerson},</p>
        <p>Congratulations! We're excited to inform you that your partnership application for <strong>${data.companyName}</strong> has been approved!</p>
        
        <div style="background-color: #d4edda; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
          <h3 style="margin-top: 0; color: #155724;">Welcome to the Caszio Partner Network!</h3>
          <p style="color: #155724; margin-bottom: 0;">You can now start creating advertising campaigns and reaching millions of potential customers through our platform.</p>
        </div>
        
        <h3 style="color: #333;">Next Steps:</h3>
        <ol style="color: #666;">
          <li>Complete your publisher account setup</li>
          <li>Verify your business information</li>
          <li>Create your first advertising campaign</li>
          <li>Start reaching your target audience</li>
        </ol>
        
        ${data.adminNotes ? `
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">Additional Notes:</h4>
            <p style="color: #666; font-style: italic;">${data.adminNotes}</p>
          </div>
        ` : ''}
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.dashboardUrl}" 
             style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Access Your Dashboard
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          Welcome to Caszio! If you have any questions, our support team is here to help at support@caszio.com
        </p>
      </div>
    `
  }),

  'partnership-rejected': (data) => ({
    subject: 'Partnership Application Update - Caszio',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">Partnership Application Update</h2>
        <p>Hi ${data.contactPerson},</p>
        <p>Thank you for your interest in partnering with Caszio. After careful review, we regret to inform you that we cannot approve your partnership application for <strong>${data.companyName}</strong> at this time.</p>
        
        ${data.adminNotes ? `
          <div style="background-color: #f8d7da; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <h3 style="margin-top: 0; color: #721c24;">Feedback:</h3>
            <p style="color: #721c24;">${data.adminNotes}</p>
          </div>
        ` : ''}
        
        <div style="background-color: #d1ecf1; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #17a2b8;">
          <h3 style="margin-top: 0; color: #0c5460;">Alternative Options:</h3>
          <ul style="color: #0c5460;">
            <li>Consider applying again in the future when your business meets our criteria</li>
            <li>Explore our affiliate program as an alternative way to earn with Caszio</li>
            <li>Contact our support team if you have questions about the decision</li>
          </ul>
        </div>
        
        <p style="color: #666;">
          We appreciate your interest in Caszio and encourage you to stay connected with us for future opportunities.
        </p>
        
        <p style="color: #666; font-size: 14px;">
          If you have any questions about this decision, please contact us at partnerships@caszio.com
        </p>
      </div>
    `
  })

};

// Send email function
const sendEmail = async (options) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email configuration not found. EMAIL_USER and EMAIL_PASS must be set in environment variables.');
      return { success: false, error: 'Email configuration missing. Please set EMAIL_USER and EMAIL_PASS environment variables.' };
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
      from: `"Caszio" <${process.env.EMAIL_USER}>`,
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

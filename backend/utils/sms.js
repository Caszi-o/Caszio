const twilio = require('twilio');

// Initialize Twilio client
let twilioClient = null;

const initializeTwilio = () => {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    return true;
  }
  return false;
};

// SMS templates
const smsTemplates = {
  verification: (data) => 
    `Your Caszio verification code is: ${data.code}. Valid for 10 minutes. Do not share this code with anyone.`,
  
  'password-reset': (data) => 
    `Your Caszio password reset code is: ${data.code}. Valid for 10 minutes. Do not share this code.`,
  
  'cashback-credited': (data) => 
    `Great news! ₹${data.amount} cashback credited to your Caszio wallet. Total balance: ₹${data.balance}`,
  
  'withdrawal-approved': (data) => 
    `Your withdrawal of ₹${data.amount} has been approved. Transaction ID: ${data.transactionId}. Expected credit: ${data.expectedDate}`,
  
  'low-balance': (data) => 
    `Your Caszio wallet balance is low (₹${data.balance}). Add funds to continue enjoying cashback benefits.`,
  
  'order-tracked': (data) => 
    `Order ${data.orderId} tracked! Expected cashback: ₹${data.cashback}. Check your dashboard for details.`,
  
  'kyc-approved': (data) => 
    `Your KYC verification is complete! You can now withdraw funds and access all Caszio features.`,
  
  'publisher-approved': (data) => 
    `Your publisher account is approved! Start creating ad campaigns on Caszio dashboard.`,
  
};

// Send SMS function
const sendSMS = async (options) => {
  try {
    if (!twilioClient && !initializeTwilio()) {
      console.warn('Twilio configuration not found. Skipping SMS send.');
      return { success: false, message: 'SMS not configured' };
    }

    const { to, template, data, message } = options;
    
    // Format phone number
    const formattedPhone = formatPhoneNumber(to);
    if (!formattedPhone) {
      throw new Error('Invalid phone number format');
    }

    let smsBody;
    
    if (template && smsTemplates[template]) {
      smsBody = smsTemplates[template](data || {});
    } else {
      smsBody = message;
    }

    const result = await twilioClient.messages.create({
      body: smsBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });

    console.log('SMS sent successfully:', result.sid);
    return { 
      success: true, 
      messageId: result.sid,
      status: result.status 
    };

  } catch (error) {
    console.error('SMS send error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Send OTP SMS
const sendOTP = async (phoneNumber, otp, purpose = 'verification') => {
  const templates = {
    verification: `Your Caszio verification OTP is: ${otp}. Valid for 10 minutes. Do not share this OTP.`,
    'password-reset': `Your Caszio password reset OTP is: ${otp}. Valid for 10 minutes. Do not share this OTP.`,
    login: `Your Caszio login OTP is: ${otp}. Valid for 5 minutes. Do not share this OTP.`,
    withdrawal: `Your Caszio withdrawal OTP is: ${otp}. Valid for 10 minutes. Use this to confirm your withdrawal.`
  };

  return sendSMS({
    to: phoneNumber,
    message: templates[purpose] || templates.verification
  });
};

// Send bulk SMS
const sendBulkSMS = async (messages) => {
  const results = [];
  
  for (const msg of messages) {
    try {
      const result = await sendSMS(msg);
      results.push({ phone: msg.to, result });
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      results.push({ phone: msg.to, error: error.message });
    }
  }
  
  return results;
};

// Format phone number to international format
const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return null;
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Handle Indian phone numbers
  if (cleaned.length === 10 && !cleaned.startsWith('91')) {
    return `+91${cleaned}`;
  }
  
  // Handle international numbers with country code
  if (cleaned.length >= 10 && !cleaned.startsWith('+')) {
    return `+${cleaned}`;
  }
  
  // If already formatted
  if (phoneNumber.startsWith('+')) {
    return phoneNumber;
  }
  
  return null;
};

// Validate phone number
const validatePhoneNumber = (phoneNumber) => {
  const formatted = formatPhoneNumber(phoneNumber);
  if (!formatted) return false;
  
  // Basic validation for international format
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(formatted);
};

// Generate OTP
const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  
  return otp;
};

// Send promotional SMS
const sendPromotionalSMS = async (users, template, data) => {
  const messages = users
    .filter(user => user.phone && user.preferences?.smsNotifications)
    .map(user => ({
      to: user.phone,
      template,
      data: {
        ...data,
        name: user.firstName
      }
    }));
  
  return sendBulkSMS(messages);
};

// Send transactional SMS
const sendTransactionalSMS = async (userId, template, data) => {
  // In a real application, you'd fetch user details from database
  // For now, we'll assume the data includes phone number
  
  if (!data.phone) {
    throw new Error('Phone number required for transactional SMS');
  }
  
  return sendSMS({
    to: data.phone,
    template,
    data
  });
};

// Check SMS delivery status
const checkSMSStatus = async (messageId) => {
  try {
    if (!twilioClient) {
      throw new Error('Twilio not configured');
    }
    
    const message = await twilioClient.messages(messageId).fetch();
    
    return {
      success: true,
      status: message.status,
      errorCode: message.errorCode,
      errorMessage: message.errorMessage,
      dateCreated: message.dateCreated,
      dateSent: message.dateSent,
      dateUpdated: message.dateUpdated
    };
    
  } catch (error) {
    console.error('SMS status check error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get SMS usage statistics
const getSMSUsage = async () => {
  try {
    if (!twilioClient) {
      throw new Error('Twilio not configured');
    }
    
    const usage = await twilioClient.usage.records.list({
      category: 'sms',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      endDate: new Date()
    });
    
    return {
      success: true,
      usage: usage.map(record => ({
        count: record.count,
        usage: record.usage,
        price: record.price,
        date: record.startDate
      }))
    };
    
  } catch (error) {
    console.error('SMS usage fetch error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendSMS,
  sendOTP,
  sendBulkSMS,
  sendPromotionalSMS,
  sendTransactionalSMS,
  formatPhoneNumber,
  validatePhoneNumber,
  generateOTP,
  checkSMSStatus,
  getSMSUsage,
  smsTemplates
};

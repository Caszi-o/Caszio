// Development configuration file
// Copy this to .env in production
module.exports = {
  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/caszio',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_here_change_in_production',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_here_change_in_production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '30d',
  
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Payment Gateways
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_live_REhc069GiulAPd',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'rtnGBktw5tbmP592sIVDVVu2',
  
  // OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID || '',
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET || '',
  
  // Email
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
  
  // SMS
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || '',
  
  // Cloud Storage
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  
  // Affiliate APIs
  AMAZON_ACCESS_KEY: process.env.AMAZON_ACCESS_KEY || '',
  AMAZON_SECRET_KEY: process.env.AMAZON_SECRET_KEY || '',
  AMAZON_PARTNER_TAG: process.env.AMAZON_PARTNER_TAG || '',
  FLIPKART_AFFILIATE_ID: process.env.FLIPKART_AFFILIATE_ID || '',
  FLIPKART_AFFILIATE_TOKEN: process.env.FLIPKART_AFFILIATE_TOKEN || '',
  MYNTRA_API_KEY: process.env.MYNTRA_API_KEY || '',
  AJIO_API_KEY: process.env.AJIO_API_KEY || '',
  NYKAA_API_KEY: process.env.NYKAA_API_KEY || '',
  TATACLIQ_API_KEY: process.env.TATACLIQ_API_KEY || '',
  FIRSTCRY_API_KEY: process.env.FIRSTCRY_API_KEY || '',
  
  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // Security
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'your_32_character_encryption_key_here'
};

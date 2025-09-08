const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload buffer to Cloudinary
const uploadToCloudinary = async (buffer, options = {}) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error('Cloudinary not configured');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: options.folder || 'casyoro',
          transformation: options.transformation || [],
          ...options
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Upload file URL to Cloudinary
const uploadUrlToCloudinary = async (url, options = {}) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error('Cloudinary not configured');
    }

    const result = await cloudinary.uploader.upload(url, {
      resource_type: 'auto',
      folder: options.folder || 'casyoro',
      transformation: options.transformation || [],
      ...options
    });

    return result;

  } catch (error) {
    console.error('Cloudinary URL upload error:', error);
    throw error;
  }
};

// Delete from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error('Cloudinary not configured');
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return result;

  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

// Generate upload signature
const generateUploadSignature = (params) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error('Cloudinary not configured');
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsWithTimestamp = {
      timestamp,
      ...params
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsWithTimestamp,
      process.env.CLOUDINARY_API_SECRET
    );

    return {
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY
    };

  } catch (error) {
    console.error('Cloudinary signature generation error:', error);
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
  uploadUrlToCloudinary,
  deleteFromCloudinary,
  generateUploadSignature,
  cloudinary
};

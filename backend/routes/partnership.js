const express = require('express');
const { body, validationResult } = require('express-validator');
const Partnership = require('../models/Partnership');
const { authenticateToken, authorize, optionalAuth } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

const router = express.Router();

/**
 * @desc    Submit partnership application
 * @route   POST /api/partnership
 * @access  Public
 */
router.post('/', [
  // Validation middleware
  body('companyName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  
  body('websiteUrl')
    .trim()
    .isURL({ require_protocol: false })
    .withMessage('Please enter a valid website URL'),
  
  body('contactPersonName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Contact person name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  
  body('phone')
    .trim()
    .isMobilePhone('any')
    .withMessage('Please enter a valid phone number'),
  
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      companyName,
      websiteUrl,
      contactPersonName,
      email,
      phone,
      message
    } = req.body;

    // Check if application already exists for this email/company
    const existingApplication = await Partnership.findOne({
      $or: [
        { email: email },
        { companyName: companyName.trim() }
      ],
      status: { $in: ['pending', 'under_review'] }
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: 'An application for this company or email is already pending review'
      });
    }

    // Create new partnership application
    const partnership = new Partnership({
      companyName: companyName.trim(),
      websiteUrl: websiteUrl.trim(),
      contactPersonName: contactPersonName.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      message: message.trim(),
      
      // Capture request metadata
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      referrerUrl: req.get('Referer')
    });

    await partnership.save();

    // Send notification email to admin (optional)
    try {
      await sendAdminNotificationEmail(partnership);
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
      // Don't fail the request if email fails
    }

    // Send confirmation email to applicant
    try {
      await sendApplicantConfirmationEmail(partnership);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Partnership application submitted successfully! We will review your application and get back to you within 2-3 business days.',
      data: {
        applicationId: partnership._id,
        status: partnership.status,
        submittedAt: partnership.submittedAt
      }
    });

  } catch (error) {
    console.error('Partnership application error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A partnership application with this information already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit partnership application. Please try again later.'
    });
  }
});

/**
 * @desc    Get partnership application status
 * @route   GET /api/partnership/status/:applicationId
 * @access  Public
 */
router.get('/status/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;

    const partnership = await Partnership.findById(applicationId)
      .select('companyName status submittedAt reviewedAt adminNotes');

    if (!partnership) {
      return res.status(404).json({
        success: false,
        message: 'Partnership application not found'
      });
    }

    res.json({
      success: true,
      data: {
        applicationId: partnership._id,
        companyName: partnership.companyName,
        status: partnership.status,
        submittedAt: partnership.submittedAt,
        reviewedAt: partnership.reviewedAt,
        adminNotes: partnership.status === 'rejected' ? partnership.adminNotes : undefined
      }
    });

  } catch (error) {
    console.error('Get partnership status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get application status'
    });
  }
});

/**
 * @desc    Get all partnership applications (Admin only)
 * @route   GET /api/partnership/admin
 * @access  Private (Admin)
 */
router.get('/admin', [authenticateToken, authorize('admin')], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const search = req.query.search;

    let query = {};
    if (status) query.status = status;

    let partnerships;
    let total;

    if (search) {
      partnerships = await Partnership.searchApplications(search, page, limit);
      total = await Partnership.countDocuments({
        $or: [
          { companyName: { $regex: search, $options: 'i' } },
          { contactPersonName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      });
    } else {
      partnerships = await Partnership.find(query)
        .sort({ submittedAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('reviewedBy', 'firstName lastName');
      
      total = await Partnership.countDocuments(query);
    }

    // Get application statistics
    const stats = await Partnership.getStats();
    const statsObj = stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        partnerships,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        },
        stats: {
          pending: statsObj.pending || 0,
          under_review: statsObj.under_review || 0,
          approved: statsObj.approved || 0,
          rejected: statsObj.rejected || 0,
          total: Object.values(statsObj).reduce((sum, count) => sum + count, 0)
        }
      }
    });

  } catch (error) {
    console.error('Get partnerships error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get partnership applications'
    });
  }
});

/**
 * @desc    Update partnership application status (Admin only)
 * @route   PATCH /api/partnership/admin/:id
 * @access  Private (Admin)
 */
router.patch('/admin/:id', [
  authenticateToken,
  authorize('admin'),
  body('status').isIn(['pending', 'under_review', 'approved', 'rejected']),
  body('adminNotes').optional().trim().isLength({ max: 500 })
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

    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const partnership = await Partnership.findById(id);
    if (!partnership) {
      return res.status(404).json({
        success: false,
        message: 'Partnership application not found'
      });
    }

    const oldStatus = partnership.status;

    // Update application based on new status
    switch (status) {
      case 'approved':
        await partnership.approve(req.user._id, adminNotes);
        break;
      case 'rejected':
        await partnership.reject(req.user._id, adminNotes || 'Application rejected');
        break;
      case 'under_review':
        await partnership.setUnderReview(req.user._id);
        break;
      default:
        partnership.status = status;
        if (adminNotes) partnership.adminNotes = adminNotes;
        await partnership.save();
    }

    // Send email notification to applicant if status changed significantly
    if (oldStatus !== status && ['approved', 'rejected'].includes(status)) {
      try {
        await sendStatusUpdateEmail(partnership);
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
      }
    }

    res.json({
      success: true,
      message: `Partnership application ${status} successfully`,
      data: {
        partnership: await Partnership.findById(id).populate('reviewedBy', 'firstName lastName')
      }
    });

  } catch (error) {
    console.error('Update partnership status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update partnership application'
    });
  }
});

// Helper function to send admin notification email
async function sendAdminNotificationEmail(partnership) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@caszio.com';
  
  await sendEmail({
    to: adminEmail,
    subject: `New Partnership Application - ${partnership.companyName}`,
    template: 'partnership-admin-notification',
    data: {
      companyName: partnership.companyName,
      contactPerson: partnership.contactPersonName,
      email: partnership.email,
      phone: partnership.phone,
      website: partnership.websiteUrl,
      message: partnership.message,
      applicationId: partnership._id,
      dashboardUrl: `${process.env.FRONTEND_URL}/admin/partnerships`
    }
  });
}

// Helper function to send confirmation email to applicant
async function sendApplicantConfirmationEmail(partnership) {
  await sendEmail({
    to: partnership.email,
    subject: 'Partnership Application Received - Caszio',
    template: 'partnership-confirmation',
    data: {
      contactPerson: partnership.contactPersonName,
      companyName: partnership.companyName,
      applicationId: partnership._id,
      statusUrl: `${process.env.FRONTEND_URL}/partnership/status/${partnership._id}`
    }
  });
}

// Helper function to send status update email
async function sendStatusUpdateEmail(partnership) {
  const template = partnership.status === 'approved' 
    ? 'partnership-approved' 
    : 'partnership-rejected';

  await sendEmail({
    to: partnership.email,
    subject: `Partnership Application ${partnership.status === 'approved' ? 'Approved' : 'Update'} - Caszio`,
    template,
    data: {
      contactPerson: partnership.contactPersonName,
      companyName: partnership.companyName,
      status: partnership.status,
      adminNotes: partnership.adminNotes,
      dashboardUrl: `${process.env.FRONTEND_URL}/publisher/dashboard`
    }
  });
}

module.exports = router;

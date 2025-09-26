import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BuildingOfficeIcon,
  GlobeAltIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftEllipsisIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Layout from '../../components/Layout';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function PartnershipApplication() {
  const [formData, setFormData] = useState({
    companyName: '',
    websiteUrl: '',
    contactPersonName: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Company name validation
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    } else if (formData.companyName.trim().length < 2) {
      newErrors.companyName = 'Company name must be at least 2 characters';
    } else if (formData.companyName.trim().length > 100) {
      newErrors.companyName = 'Company name must be less than 100 characters';
    }

    // Website URL validation
    if (!formData.websiteUrl.trim()) {
      newErrors.websiteUrl = 'Website URL is required';
    } else {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(formData.websiteUrl.trim())) {
        newErrors.websiteUrl = 'Please enter a valid website URL';
      }
    }

    // Contact person name validation
    if (!formData.contactPersonName.trim()) {
      newErrors.contactPersonName = 'Contact person name is required';
    } else if (formData.contactPersonName.trim().length < 2) {
      newErrors.contactPersonName = 'Name must be at least 2 characters';
    } else if (formData.contactPersonName.trim().length > 50) {
      newErrors.contactPersonName = 'Name must be less than 50 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
      if (!phonePattern.test(cleanPhone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message/proposal is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/partnership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setSubmissionResult({
          success: true,
          message: result.message,
          applicationId: result.data.applicationId
        });
      } else {
        setSubmissionResult({
          success: false,
          message: result.message || 'Failed to submit application',
          errors: result.errors
        });

        // Set field-specific errors if provided
        if (result.errors) {
          const fieldErrors = {};
          result.errors.forEach(error => {
            if (error.param) {
              fieldErrors[error.param] = error.msg;
            }
          });
          setErrors(fieldErrors);
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionResult({
        success: false,
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success message component
  if (isSubmitted && submissionResult?.success) {
    return (
      <Layout>
        <Head>
          <title>Application Submitted - Partnership - Caszio</title>
          <meta name="description" content="Your partnership application has been successfully submitted." />
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
          <div className="max-w-2xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center"
            >
              <div className="mb-6">
                <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Application Submitted Successfully! 🎉
                </h1>
                <p className="text-gray-600 text-lg">
                  {submissionResult.message}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Application Details</h3>
                <p className="text-sm text-gray-600">
                  <strong>Application ID:</strong> {submissionResult.applicationId}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Company:</strong> {formData.companyName}
                </p>
              </div>

              <div className="space-y-4">
                <Link
                  href={`/partnership/status/${submissionResult.applicationId}`}
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Check Application Status
                </Link>
                
                <div>
                  <Link
                    href="/"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Return to Homepage
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Partnership Application - Caszio</title>
        <meta name="description" content="Apply for partnership with Caszio. Join our platform and reach millions of potential customers through our advertising network." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header Section */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerChildren}
          className="pt-20 pb-12"
        >
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div variants={fadeInUp}>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Partner with <span className="text-blue-600">Caszio</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Join our advertising network and reach millions of potential customers. 
                Fill out the application below to start your partnership journey with us.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Application Form */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerChildren}
          className="pb-20"
        >
          <div className="max-w-2xl mx-auto px-4">
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Form Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white">Partnership Application</h2>
                <p className="text-blue-100 mt-2">
                  Tell us about your company and how you'd like to partner with us.
                </p>
              </div>

              {/* Error Message */}
              {submissionResult && !submissionResult.success && (
                <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                    <p className="text-red-800 font-medium">
                      {submissionResult.message}
                    </p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Company Name */}
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    <BuildingOfficeIcon className="h-4 w-4 inline mr-1" />
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.companyName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your company name"
                    maxLength={100}
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
                  )}
                </div>

                {/* Website URL */}
                <div>
                  <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    <GlobeAltIcon className="h-4 w-4 inline mr-1" />
                    Website URL *
                  </label>
                  <input
                    type="url"
                    id="websiteUrl"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.websiteUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="https://www.yourcompany.com"
                  />
                  {errors.websiteUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.websiteUrl}</p>
                  )}
                </div>

                {/* Contact Person Name */}
                <div>
                  <label htmlFor="contactPersonName" className="block text-sm font-medium text-gray-700 mb-2">
                    <UserIcon className="h-4 w-4 inline mr-1" />
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    id="contactPersonName"
                    name="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.contactPersonName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter contact person's full name"
                    maxLength={50}
                  />
                  {errors.contactPersonName && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactPersonName}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="contact@yourcompany.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    <PhoneIcon className="h-4 w-4 inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Message/Proposal */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    <ChatBubbleLeftEllipsisIcon className="h-4 w-4 inline mr-1" />
                    Message/Proposal *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                      errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Tell us about your company, your target audience, and how you'd like to partner with Caszio..."
                    maxLength={1000}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.message ? (
                      <p className="text-sm text-red-600">{errors.message}</p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Describe your partnership proposal in detail.
                      </p>
                    )}
                    <p className="text-sm text-gray-400">
                      {formData.message.length}/1000
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-lg font-medium text-white transition-all duration-200 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Submitting Application...
                      </div>
                    ) : (
                      'Submit Partnership Application'
                    )}
                  </button>
                </div>

                {/* Disclaimer */}
                <div className="pt-4 text-center">
                  <p className="text-sm text-gray-500">
                    By submitting this application, you agree to our{' '}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}

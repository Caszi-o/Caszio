import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  BuildingOfficeIcon,
  DocumentTextIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { PublicRoute } from '../../lib/auth';
import { publisherAPI } from '../../lib/api';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function PublisherApplication() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const steps = [
    { id: 1, name: 'Business Information', icon: BuildingOfficeIcon },
    { id: 2, name: 'Contact Details', icon: DocumentTextIcon },
    { id: 3, name: 'Verification', icon: CreditCardIcon },
    { id: 4, name: 'Review', icon: CheckCircleIcon }
  ];

  const businessTypes = [
    { value: 'individual', label: 'Individual/Sole Proprietorship' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'private_limited', label: 'Private Limited Company' },
    { value: 'llp', label: 'Limited Liability Partnership (LLP)' },
    { value: 'other', label: 'Other' }
  ];

  const industries = [
    'Technology', 'E-commerce', 'Fashion', 'Beauty & Wellness', 'Food & Beverage',
    'Travel & Tourism', 'Real Estate', 'Education', 'Healthcare', 'Finance',
    'Automotive', 'Sports & Fitness', 'Entertainment', 'Home & Garden', 'Other'
  ];

  const watchedValues = watch();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await publisherAPI.apply(data);
      toast.success('Publisher application submitted successfully!');
      router.push('/publisher/dashboard');
    } catch (error) {
      console.error('Application submission error:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div className="space-y-6" variants={fadeInUp}>
            <div>
              <label className="form-label">Business Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Your business name"
                {...register('businessName', { required: 'Business name is required' })}
              />
              {errors.businessName && <p className="form-error">{errors.businessName.message}</p>}
            </div>

            <div>
              <label className="form-label">Business Type *</label>
              <select
                className="form-select"
                {...register('businessType', { required: 'Business type is required' })}
              >
                <option value="">Select business type</option>
                {businessTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.businessType && <p className="form-error">{errors.businessType.message}</p>}
            </div>

            <div>
              <label className="form-label">Industry *</label>
              <select
                className="form-select"
                {...register('industry', { required: 'Industry is required' })}
              >
                <option value="">Select your industry</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry.toLowerCase()}>
                    {industry}
                  </option>
                ))}
              </select>
              {errors.industry && <p className="form-error">{errors.industry.message}</p>}
            </div>

            <div>
              <label className="form-label">Business Website</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://your-website.com"
                {...register('website', {
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: 'Please enter a valid URL'
                  }
                })}
              />
              {errors.website && <p className="form-error">{errors.website.message}</p>}
            </div>

            <div>
              <label className="form-label">Business Description</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Describe your business and what products/services you offer"
                {...register('description')}
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div className="space-y-6" variants={fadeInUp}>
            <div>
              <label className="form-label">Contact Person Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Full name of primary contact"
                {...register('contactPerson')}
              />
            </div>

            <div>
              <label className="form-label">Business Email *</label>
              <input
                type="email"
                className="form-input"
                placeholder="business@company.com"
                {...register('businessEmail', { 
                  required: 'Business email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.businessEmail && <p className="form-error">{errors.businessEmail.message}</p>}
            </div>

            <div>
              <label className="form-label">Business Phone *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+91 98765 43210"
                {...register('businessPhone', { required: 'Business phone is required' })}
              />
              {errors.businessPhone && <p className="form-error">{errors.businessPhone.message}</p>}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Business Address</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Street Address</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Street address"
                    {...register('businessAddress.street')}
                  />
                </div>
                
                <div>
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="City"
                    {...register('businessAddress.city')}
                  />
                </div>
                
                <div>
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="State"
                    {...register('businessAddress.state')}
                  />
                </div>
                
                <div>
                  <label className="form-label">PIN Code</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="PIN Code"
                    {...register('businessAddress.pincode')}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div className="space-y-6" variants={fadeInUp}>
            <div className="text-center">
              <CreditCardIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Document Verification</h3>
              <p className="text-gray-600">
                To ensure the security and authenticity of our platform, we require business verification documents.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Required Documents:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Business registration certificate or GST certificate</li>
                <li>• PAN card of the business</li>
                <li>• Bank account details and cancelled cheque</li>
                <li>• Address proof of business location</li>
                <li>• ID proof of authorized signatory</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Next Steps</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    After submitting your application, our team will contact you within 24-48 hours to guide you through the document verification process.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Verification Checklist</h4>
              <div className="space-y-2">
                {[
                  'Business is legally registered',
                  'Have all required documents ready',
                  'Bank account is in business name',
                  'Contact person is authorized signatory',
                  'Business address is verifiable'
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" />
                    <label className="ml-2 text-sm text-gray-700">{item}</label>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div className="space-y-6" variants={fadeInUp}>
            <div className="text-center">
              <CheckCircleIcon className="w-16 h-16 text-success-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Review Your Application</h3>
              <p className="text-gray-600">
                Please review your information before submitting your publisher application.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Business Information</h4>
                <div className="mt-2 space-y-1 text-sm">
                  <p><span className="font-medium">Business Name:</span> {watchedValues.businessName}</p>
                  <p><span className="font-medium">Type:</span> {businessTypes.find(t => t.value === watchedValues.businessType)?.label}</p>
                  <p><span className="font-medium">Industry:</span> {watchedValues.industry}</p>
                  {watchedValues.website && (
                    <p><span className="font-medium">Website:</span> {watchedValues.website}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Contact Information</h4>
                <div className="mt-2 space-y-1 text-sm">
                  {watchedValues.contactPerson && (
                    <p><span className="font-medium">Contact Person:</span> {watchedValues.contactPerson}</p>
                  )}
                  <p><span className="font-medium">Email:</span> {watchedValues.businessEmail}</p>
                  <p><span className="font-medium">Phone:</span> {watchedValues.businessPhone}</p>
                </div>
              </div>

              {watchedValues.description && (
                <div>
                  <h4 className="font-medium text-gray-900">Description</h4>
                  <p className="mt-2 text-sm text-gray-700">{watchedValues.description}</p>
                </div>
              )}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">What happens next?</h3>
                  <div className="text-sm text-green-700 mt-1 space-y-1">
                    <p>• Your application will be reviewed within 24-48 hours</p>
                    <p>• Our team will contact you for document verification</p>
                    <p>• Once approved, you can start creating ad campaigns</p>
                    <p>• You'll receive email notifications about your application status</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <PublicRoute>
      <Head>
        <title>Apply for Publisher Account - Casyoro</title>
        <meta name="description" content="Join Casyoro as a publisher and start advertising your business" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-gray-400 hover:text-gray-600">
                  <ArrowLeftIcon className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">Publisher Application</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <nav aria-label="Progress">
              <ol className="flex items-center justify-between">
                {steps.map((step, stepIdx) => (
                  <li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      {stepIdx !== steps.length - 1 && (
                        <div className={`h-0.5 w-full ${step.id <= currentStep ? 'bg-primary-600' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    <div
                      className={`relative w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                        step.id === currentStep
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : step.id < currentStep
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-gray-300 bg-white text-gray-500'
                      }`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-900 text-center">{step.name}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">
                  Step {currentStep}: {steps[currentStep - 1]?.name}
                </h2>
              </div>
              <div className="card-body">
                {renderStepContent()}
              </div>
              <div className="card-footer">
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {currentStep === steps.length ? (
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? (
                        <>
                          <div className="spinner spinner-sm mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn btn-primary"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PublicRoute>
  );
}

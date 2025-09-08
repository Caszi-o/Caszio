import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  UserIcon,
  GlobeAltIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { PublicRoute } from '../../lib/auth';
import { promoterAPI } from '../../lib/api';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function PromoterApplication() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [platforms, setPlatforms] = useState([{ name: '', url: '', followers: '' }]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm();

  const steps = [
    { id: 1, name: 'Personal Information', icon: UserIcon },
    { id: 2, name: 'Platform Details', icon: GlobeAltIcon },
    { id: 3, name: 'Payment Information', icon: BanknotesIcon },
    { id: 4, name: 'Review', icon: CheckCircleIcon }
  ];

  const platformTypes = [
    'website', 'youtube', 'instagram', 'facebook', 'twitter', 'tiktok', 'blog', 'other'
  ];

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'upi', label: 'UPI' },
    { value: 'crypto', label: 'Cryptocurrency' }
  ];

  const watchedValues = watch();

  const addPlatform = () => {
    setPlatforms([...platforms, { name: '', url: '', followers: '' }]);
  };

  const removePlatform = (index) => {
    if (platforms.length > 1) {
      setPlatforms(platforms.filter((_, i) => i !== index));
    }
  };

  const updatePlatform = (index, field, value) => {
    const updated = platforms.map((platform, i) => 
      i === index ? { ...platform, [field]: value } : platform
    );
    setPlatforms(updated);
    setValue('platforms', updated);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const applicationData = {
        ...data,
        platforms: platforms.filter(p => p.name && p.url)
      };

      await promoterAPI.apply(applicationData);
      toast.success('Promoter application submitted successfully!');
      router.push('/promoter/dashboard');
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
              <label className="form-label">Display Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Your public display name"
                {...register('displayName', { required: 'Display name is required' })}
              />
              {errors.displayName && <p className="form-error">{errors.displayName.message}</p>}
              <p className="form-help">This will be shown publicly on your promoter profile</p>
            </div>

            <div>
              <label className="form-label">Bio</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Tell us about yourself and your audience..."
                {...register('bio')}
              />
              <p className="form-help">Describe your content, audience, and why you want to be a promoter</p>
            </div>

            <div>
              <label className="form-label">Monthly Traffic/Reach *</label>
              <input
                type="number"
                min="1000"
                className="form-input"
                placeholder="50000"
                {...register('monthlyTraffic', { 
                  required: 'Monthly traffic is required',
                  min: { value: 1000, message: 'Minimum 1,000 monthly traffic required' }
                })}
              />
              {errors.monthlyTraffic && <p className="form-error">{errors.monthlyTraffic.message}</p>}
              <p className="form-help">Total monthly visitors, views, or reach across all platforms</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Audience Demographics (Optional)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Top Countries</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="India, USA, UK"
                    {...register('audienceDemographics.topCountries')}
                  />
                </div>
                
                <div>
                  <label className="form-label">Main Interests</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Technology, Fashion, Lifestyle"
                    {...register('audienceDemographics.interests')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Male %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="form-input"
                    placeholder="50"
                    {...register('audienceDemographics.genderSplit.male')}
                  />
                </div>
                <div>
                  <label className="form-label">Female %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="form-input"
                    placeholder="45"
                    {...register('audienceDemographics.genderSplit.female')}
                  />
                </div>
                <div>
                  <label className="form-label">Other %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="form-input"
                    placeholder="5"
                    {...register('audienceDemographics.genderSplit.other')}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div className="space-y-6" variants={fadeInUp}>
            <div className="text-center">
              <GlobeAltIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Platform Information</h3>
              <p className="text-gray-600">
                Add your websites, social media accounts, and other platforms where you'll promote ads.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Your Platforms</h4>
                <button
                  type="button"
                  onClick={addPlatform}
                  className="btn btn-sm btn-primary"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Add Platform
                </button>
              </div>

              {platforms.map((platform, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-gray-700">Platform {index + 1}</h5>
                    {platforms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePlatform(index)}
                        className="text-danger-600 hover:text-danger-700"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="form-label">Platform Type</label>
                      <select
                        className="form-select"
                        value={platform.name}
                        onChange={(e) => updatePlatform(index, 'name', e.target.value)}
                        required={index === 0}
                      >
                        <option value="">Select platform</option>
                        {platformTypes.map((type) => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label">URL</label>
                      <input
                        type="url"
                        className="form-input"
                        placeholder="https://example.com"
                        value={platform.url}
                        onChange={(e) => updatePlatform(index, 'url', e.target.value)}
                        required={index === 0}
                      />
                    </div>

                    <div>
                      <label className="form-label">Followers/Visitors</label>
                      <input
                        type="number"
                        min="0"
                        className="form-input"
                        placeholder="10000"
                        value={platform.followers}
                        onChange={(e) => updatePlatform(index, 'followers', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Platform Requirements:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Must have at least 1,000 monthly visitors/followers</li>
                <li>• Content must be family-friendly and comply with our guidelines</li>
                <li>• Platforms will be reviewed for quality and authenticity</li>
                <li>• Fake followers or engagement may result in rejection</li>
              </ul>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div className="space-y-6" variants={fadeInUp}>
            <div className="text-center">
              <BanknotesIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Information</h3>
              <p className="text-gray-600">
                Set up your payment method to receive earnings from promoted ads.
              </p>
            </div>

            <div>
              <label className="form-label">Preferred Payment Method *</label>
              <select
                className="form-select"
                {...register('paymentMethod', { required: 'Payment method is required' })}
              >
                <option value="">Select payment method</option>
                {paymentMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
              {errors.paymentMethod && <p className="form-error">{errors.paymentMethod.message}</p>}
            </div>

            {/* Bank Transfer Details */}
            {watchedValues.paymentMethod === 'bank_transfer' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">Bank Account Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Account Number</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Account number"
                      {...register('paymentDetails.bankAccount', { 
                        required: watchedValues.paymentMethod === 'bank_transfer' ? 'Account number is required' : false 
                      })}
                    />
                    {errors.paymentDetails?.bankAccount && <p className="form-error">{errors.paymentDetails.bankAccount.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">IFSC Code</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="IFSC code"
                      {...register('paymentDetails.ifscCode', { 
                        required: watchedValues.paymentMethod === 'bank_transfer' ? 'IFSC code is required' : false 
                      })}
                    />
                    {errors.paymentDetails?.ifscCode && <p className="form-error">{errors.paymentDetails.ifscCode.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="form-label">Bank Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Bank name"
                      {...register('paymentDetails.bankName', { 
                        required: watchedValues.paymentMethod === 'bank_transfer' ? 'Bank name is required' : false 
                      })}
                    />
                    {errors.paymentDetails?.bankName && <p className="form-error">{errors.paymentDetails.bankName.message}</p>}
                  </div>
                </div>
              </div>
            )}


            {/* UPI Details */}
            {watchedValues.paymentMethod === 'upi' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">UPI Details</h4>
                <div>
                  <label className="form-label">UPI ID</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="yourname@upi"
                    {...register('paymentDetails.upiId', { 
                      required: watchedValues.paymentMethod === 'upi' ? 'UPI ID is required' : false 
                    })}
                  />
                  {errors.paymentDetails?.upiId && <p className="form-error">{errors.paymentDetails.upiId.message}</p>}
                </div>
              </div>
            )}

            {/* Crypto Details */}
            {watchedValues.paymentMethod === 'crypto' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">Cryptocurrency Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Cryptocurrency</label>
                    <select
                      className="form-select"
                      {...register('paymentDetails.cryptoType', { 
                        required: watchedValues.paymentMethod === 'crypto' ? 'Cryptocurrency type is required' : false 
                      })}
                    >
                      <option value="">Select cryptocurrency</option>
                      <option value="bitcoin">Bitcoin (BTC)</option>
                      <option value="ethereum">Ethereum (ETH)</option>
                      <option value="usdt">Tether (USDT)</option>
                    </select>
                    {errors.paymentDetails?.cryptoType && <p className="form-error">{errors.paymentDetails.cryptoType.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Wallet Address</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Wallet address"
                      {...register('paymentDetails.walletAddress', { 
                        required: watchedValues.paymentMethod === 'crypto' ? 'Wallet address is required' : false 
                      })}
                    />
                    {errors.paymentDetails?.walletAddress && <p className="form-error">{errors.paymentDetails.walletAddress.message}</p>}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Payment Information:</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Minimum payout: ₹100</li>
                <li>• Payment frequency: Weekly (every Monday)</li>
                <li>• Processing time: 1-3 business days</li>
                <li>• Commission rate: 70% of advertiser's bid amount</li>
              </ul>
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
                Please review your information before submitting your promoter application.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Personal Information</h4>
                <div className="mt-2 space-y-1 text-sm">
                  <p><span className="font-medium">Display Name:</span> {watchedValues.displayName}</p>
                  <p><span className="font-medium">Monthly Traffic:</span> {watchedValues.monthlyTraffic?.toLocaleString()}</p>
                  {watchedValues.bio && (
                    <p><span className="font-medium">Bio:</span> {watchedValues.bio}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Platforms</h4>
                <div className="mt-2 space-y-2 text-sm">
                  {platforms.filter(p => p.name && p.url).map((platform, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                      <div>
                        <span className="font-medium capitalize">{platform.name}</span>
                        <span className="mx-2">•</span>
                        <span className="text-gray-600">{platform.url}</span>
                      </div>
                      {platform.followers && (
                        <span className="text-gray-500">{parseInt(platform.followers).toLocaleString()} followers</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Payment Method</h4>
                <div className="mt-2 text-sm">
                  <p>{paymentMethods.find(m => m.value === watchedValues.paymentMethod)?.label}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <CheckCircleIcon className="h-5 w-5 text-blue-400 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">What happens next?</h3>
                  <div className="text-sm text-blue-700 mt-1 space-y-1">
                    <p>• Your application will be reviewed within 24-48 hours</p>
                    <p>• We'll verify your platforms and audience quality</p>
                    <p>• Once approved, you can start promoting ads and earning</p>
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
        <title>Apply for Promoter Account - Casyoro</title>
        <meta name="description" content="Join Casyoro as a promoter and start earning by promoting ads" />
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
                <h1 className="text-xl font-semibold text-gray-900">Promoter Application</h1>
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

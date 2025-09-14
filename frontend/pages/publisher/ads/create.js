import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import {
  ArrowLeftIcon,
  PhotoIcon,
  PlayIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  TargetIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { ProtectedRoute } from '../../../lib/auth';
import { publisherAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function CreateAd() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      type: 'banner',
      bidding: { model: 'cpc' },
      budget: { type: 'daily' },
      targeting: {
        ageGroups: [],
        genders: [],
        interests: [],
        deviceTypes: ['desktop', 'mobile']
      }
    }
  });

  const watchedValues = watch();

  const adTypes = [
    { value: 'banner', label: 'Banner Ad', icon: PhotoIcon, description: 'Display banner advertisements' },
    { value: 'text', label: 'Text Ad', icon: DocumentTextIcon, description: 'Simple text-based ads' },
    { value: 'video', label: 'Video Ad', icon: PlayIcon, description: 'Video advertisements' },
    { value: 'native', label: 'Native Ad', icon: GlobeAltIcon, description: 'Ads that blend with content' }
  ];

  const ageGroups = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
  const genders = ['male', 'female', 'other'];
  const interests = [
    'technology', 'fashion', 'beauty', 'sports', 'travel', 'food',
    'health', 'finance', 'education', 'entertainment', 'shopping'
  ];
  const deviceTypes = ['desktop', 'mobile', 'tablet'];

  const steps = [
    { id: 1, name: 'Ad Details', description: 'Basic information about your ad' },
    { id: 2, name: 'Creative', description: 'Upload your ad creative assets' },
    { id: 3, name: 'Targeting', description: 'Define your target audience' },
    { id: 4, name: 'Budget & Bidding', description: 'Set your budget and bidding strategy' },
    { id: 5, name: 'Schedule', description: 'Set campaign schedule' },
    { id: 6, name: 'Review', description: 'Review and submit your ad' }
  ];

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const adData = {
        ...data,
        targeting: {
          ...data.targeting,
          ageGroups: data.targeting.ageGroups || [],
          genders: data.targeting.genders || [],
          interests: data.targeting.interests || [],
          deviceTypes: data.targeting.deviceTypes || ['desktop', 'mobile']
        }
      };

      await publisherAPI.createAd(adData);
      
      toast.success('Ad created successfully and submitted for review!');
      router.push('/publisher/ads');
      
    } catch (error) {
      console.error('Create ad error:', error);
      toast.error('Failed to create ad. Please try again.');
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
              <label className="form-label">Ad Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter a compelling ad title"
                {...register('title', { required: 'Ad title is required' })}
              />
              {errors.title && <p className="form-error">{errors.title.message}</p>}
            </div>

            <div>
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Describe your ad campaign"
                {...register('description')}
              />
            </div>

            <div>
              <label className="form-label">Ad Type *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {adTypes.map((type) => (
                  <label key={type.value} className="cursor-pointer">
                    <input
                      type="radio"
                      value={type.value}
                      className="sr-only"
                      {...register('type', { required: 'Ad type is required' })}
                    />
                    <div className={`p-4 border rounded-lg text-center transition-colors ${
                      watchedValues.type === type.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <type.icon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                      <h3 className="font-medium text-gray-900">{type.label}</h3>
                      <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                    </div>
                  </label>
                ))}
              </div>
              {errors.type && <p className="form-error">{errors.type.message}</p>}
            </div>

            <div>
              <label className="form-label">Landing Page URL *</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://example.com/landing-page"
                {...register('landingPage.url', { 
                  required: 'Landing page URL is required',
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: 'Please enter a valid URL'
                  }
                })}
              />
              {errors.landingPage?.url && <p className="form-error">{errors.landingPage.url.message}</p>}
            </div>

            <div>
              <label className="form-label">Call to Action Text</label>
              <input
                type="text"
                className="form-input"
                placeholder="Click Here"
                {...register('cta.text')}
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div className="space-y-6" variants={fadeInUp}>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Creative Assets</h3>
              <p className="text-gray-600">Upload images, videos, or HTML5 creatives for your ad</p>
            </div>

            {watchedValues.type === 'banner' && (
              <div>
                <label className="form-label">Banner Image *</label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                        <span>Upload banner image</span>
                        <input type="file" className="sr-only" accept="image/*" />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                    <p className="text-xs text-gray-500">Recommended: 728x90, 300x250, 160x600</p>
                  </div>
                </div>
              </div>
            )}

            {watchedValues.type === 'video' && (
              <div>
                <label className="form-label">Video File *</label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <PlayIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                        <span>Upload video</span>
                        <input type="file" className="sr-only" accept="video/*" />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">MP4, WebM up to 50MB</p>
                    <p className="text-xs text-gray-500">Duration: 15-60 seconds</p>
                  </div>
                </div>
              </div>
            )}

            {watchedValues.type === 'text' && (
              <div>
                <label className="form-label">Ad Text Content *</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Enter your ad text content..."
                  {...register('creatives.0.content', { required: 'Ad content is required for text ads' })}
                />
                {errors.creatives?.[0]?.content && <p className="form-error">{errors.creatives[0].content.message}</p>}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Ad Width (px)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="300"
                  {...register('format.width')}
                />
              </div>
              <div>
                <label className="form-label">Ad Height (px)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="250"
                  {...register('format.height')}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600"
                {...register('format.responsive')}
              />
              <label className="ml-2 text-sm text-gray-900">
                Make ad responsive (automatically adjusts to container)
              </label>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div className="space-y-6" variants={fadeInUp}>
            <div className="text-center">
              <TargetIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Define Your Target Audience</h3>
              <p className="text-gray-600">Choose who should see your ads for better performance</p>
            </div>

            <div>
              <label className="form-label">Age Groups</label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {ageGroups.map((age) => (
                  <label key={age} className="flex items-center">
                    <input
                      type="checkbox"
                      value={age}
                      className="h-4 w-4 text-primary-600"
                      {...register('targeting.ageGroups')}
                    />
                    <span className="ml-2 text-sm text-gray-700">{age}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Gender</label>
              <div className="flex space-x-6 mt-2">
                {genders.map((gender) => (
                  <label key={gender} className="flex items-center">
                    <input
                      type="checkbox"
                      value={gender}
                      className="h-4 w-4 text-primary-600"
                      {...register('targeting.genders')}
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{gender}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Interests</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {interests.map((interest) => (
                  <label key={interest} className="flex items-center">
                    <input
                      type="checkbox"
                      value={interest}
                      className="h-4 w-4 text-primary-600"
                      {...register('targeting.interests')}
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Device Types</label>
              <div className="flex space-x-6 mt-2">
                {deviceTypes.map((device) => (
                  <label key={device} className="flex items-center">
                    <input
                      type="checkbox"
                      value={device}
                      className="h-4 w-4 text-primary-600"
                      {...register('targeting.deviceTypes')}
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{device}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Keywords (comma-separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="technology, innovation, software"
                {...register('targeting.keywords')}
              />
              <p className="form-help">Enter keywords related to your product or service</p>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div className="space-y-6" variants={fadeInUp}>
            <div className="text-center">
              <CurrencyRupeeIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Budget & Bidding</h3>
              <p className="text-gray-600">Set your advertising budget and bidding strategy</p>
            </div>

            <div>
              <label className="form-label">Budget Type</label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                {['daily', 'total', 'monthly'].map((type) => (
                  <label key={type} className="cursor-pointer">
                    <input
                      type="radio"
                      value={type}
                      className="sr-only"
                      {...register('budget.type', { required: 'Budget type is required' })}
                    />
                    <div className={`p-3 border rounded-lg text-center transition-colors ${
                      watchedValues.budget?.type === type
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <span className="text-sm font-medium capitalize">{type}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Budget Amount (₹) *</label>
              <input
                type="number"
                min="100"
                className="form-input"
                placeholder="5000"
                {...register('budget.amount', { 
                  required: 'Budget amount is required',
                  min: { value: 100, message: 'Minimum budget is ₹100' }
                })}
              />
              {errors.budget?.amount && <p className="form-error">{errors.budget.amount.message}</p>}
            </div>

            <div>
              <label className="form-label">Bidding Model</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {[
                  { value: 'cpc', label: 'CPC', description: 'Cost per click' },
                  { value: 'cpm', label: 'CPM', description: 'Cost per 1000 impressions' },
                  { value: 'cpa', label: 'CPA', description: 'Cost per action' },
                  { value: 'cps', label: 'CPS', description: 'Cost per sale' }
                ].map((model) => (
                  <label key={model.value} className="cursor-pointer">
                    <input
                      type="radio"
                      value={model.value}
                      className="sr-only"
                      {...register('bidding.model', { required: 'Bidding model is required' })}
                    />
                    <div className={`p-3 border rounded-lg text-center transition-colors ${
                      watchedValues.bidding?.model === model.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <div className="font-medium">{model.label}</div>
                      <div className="text-xs text-gray-500">{model.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Bid Amount (₹) *</label>
              <input
                type="number"
                min="0.10"
                step="0.01"
                className="form-input"
                placeholder="1.50"
                {...register('bidding.amount', { 
                  required: 'Bid amount is required',
                  min: { value: 0.10, message: 'Minimum bid is ₹0.10' }
                })}
              />
              {errors.bidding?.amount && <p className="form-error">{errors.bidding.amount.message}</p>}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600"
                {...register('bidding.autoBidding')}
              />
              <label className="ml-2 text-sm text-gray-900">
                Enable auto-bidding (system optimizes bids automatically)
              </label>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div className="space-y-6" variants={fadeInUp}>
            <div className="text-center">
              <CalendarIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Campaign Schedule</h3>
              <p className="text-gray-600">Set when your ad campaign should run</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Start Date *</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  {...register('schedule.startDate', { required: 'Start date is required' })}
                />
                {errors.schedule?.startDate && <p className="form-error">{errors.schedule.startDate.message}</p>}
              </div>
              <div>
                <label className="form-label">End Date</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  {...register('schedule.endDate')}
                />
                <p className="form-help">Leave empty for continuous campaign</p>
              </div>
            </div>

            <div>
              <label className="form-label">Time Zone</label>
              <select className="form-select" {...register('schedule.timezone')}>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>

            <div>
              <label className="form-label">Day Parting (Optional)</label>
              <p className="text-sm text-gray-600 mb-3">Choose specific days and times when your ads should run</p>
              
              <div className="space-y-3">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <div key={day} className="flex items-center space-x-4">
                    <div className="w-20">
                      <span className="text-sm font-medium capitalize">{day}</span>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input
                        type="time"
                        className="form-input text-sm"
                        placeholder="Start time"
                        {...register(`schedule.dayParting.${day}.startTime`)}
                      />
                      <input
                        type="time"
                        className="form-input text-sm"
                        placeholder="End time"
                        {...register(`schedule.dayParting.${day}.endTime`)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div className="space-y-6" variants={fadeInUp}>
            <div className="text-center">
              <EyeIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Review Your Ad</h3>
              <p className="text-gray-600">Review all details before submitting for approval</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Ad Details</h4>
                <div className="mt-2 space-y-1 text-sm">
                  <p><span className="font-medium">Title:</span> {watchedValues.title}</p>
                  <p><span className="font-medium">Type:</span> {watchedValues.type}</p>
                  <p><span className="font-medium">Landing Page:</span> {watchedValues.landingPage?.url}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Budget & Bidding</h4>
                <div className="mt-2 space-y-1 text-sm">
                  <p><span className="font-medium">Budget:</span> ₹{watchedValues.budget?.amount} ({watchedValues.budget?.type})</p>
                  <p><span className="font-medium">Bidding:</span> ₹{watchedValues.bidding?.amount} ({watchedValues.bidding?.model?.toUpperCase()})</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Targeting</h4>
                <div className="mt-2 space-y-1 text-sm">
                  {watchedValues.targeting?.ageGroups?.length > 0 && (
                    <p><span className="font-medium">Age Groups:</span> {watchedValues.targeting.ageGroups.join(', ')}</p>
                  )}
                  {watchedValues.targeting?.interests?.length > 0 && (
                    <p><span className="font-medium">Interests:</span> {watchedValues.targeting.interests.join(', ')}</p>
                  )}
                  <p><span className="font-medium">Devices:</span> {watchedValues.targeting?.deviceTypes?.join(', ')}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Schedule</h4>
                <div className="mt-2 space-y-1 text-sm">
                  <p><span className="font-medium">Start:</span> {watchedValues.schedule?.startDate}</p>
                  {watchedValues.schedule?.endDate && (
                    <p><span className="font-medium">End:</span> {watchedValues.schedule.endDate}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Review Process</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Your ad will be reviewed by our team within 24 hours. You'll receive an email notification once it's approved or if any changes are needed.
                  </p>
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
    <ProtectedRoute allowedRoles={['publisher']}>
      <Head>
        <title>Create Ad - Publisher Dashboard - Casyoro</title>
        <meta name="description" content="Create a new advertising campaign" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/publisher/dashboard" className="text-gray-400 hover:text-gray-600">
                  <ArrowLeftIcon className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">Create New Ad</h1>
              </div>
              
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="btn btn-secondary"
              >
                <EyeIcon className="w-5 h-5 mr-2" />
                {preview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    <button
                      type="button"
                      onClick={() => setCurrentStep(step.id)}
                      className={`relative w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                        step.id === currentStep
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : step.id < currentStep
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-gray-300 bg-white text-gray-500'
                      }`}
                    >
                      <span className="text-sm font-medium">{step.id}</span>
                    </button>
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-900">{step.name}</p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
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
                              Creating...
                            </>
                          ) : (
                            'Create Ad'
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
              </div>

              {/* Preview Sidebar */}
              {preview && (
                <div className="lg:col-span-1">
                  <div className="card sticky top-8">
                    <div className="card-header">
                      <h3 className="text-lg font-semibold text-gray-900">Ad Preview</h3>
                    </div>
                    <div className="card-body">
                      <div className="border rounded-lg p-4 bg-white">
                        {watchedValues.type === 'banner' && (
                          <div className="text-center">
                            <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center mb-3">
                              <PhotoIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <h4 className="font-medium text-gray-900">{watchedValues.title || 'Ad Title'}</h4>
                            <p className="text-sm text-gray-600 mt-1">{watchedValues.description || 'Ad description...'}</p>
                            <button className="btn btn-primary btn-sm mt-3">
                              {watchedValues.cta?.text || 'Click Here'}
                            </button>
                          </div>
                        )}
                        
                        {watchedValues.type === 'text' && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">{watchedValues.title || 'Ad Title'}</h4>
                            <p className="text-sm text-gray-600 mb-3">
                              {watchedValues.creatives?.[0]?.content || 'Your ad text content will appear here...'}
                            </p>
                            <button className="btn btn-primary btn-sm">
                              {watchedValues.cta?.text || 'Click Here'}
                            </button>
                          </div>
                        )}
                        
                        {watchedValues.type === 'video' && (
                          <div className="text-center">
                            <div className="w-full h-40 bg-gray-200 rounded flex items-center justify-center mb-3">
                              <PlayIcon className="w-12 h-12 text-gray-400" />
                            </div>
                            <h4 className="font-medium text-gray-900">{watchedValues.title || 'Ad Title'}</h4>
                            <p className="text-sm text-gray-600 mt-1">{watchedValues.description || 'Video ad description...'}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Budget:</span>
                          <span className="font-medium">₹{watchedValues.budget?.amount || '0'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bid:</span>
                          <span className="font-medium">₹{watchedValues.bidding?.amount || '0'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Model:</span>
                          <span className="font-medium">{watchedValues.bidding?.model?.toUpperCase() || 'CPC'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}

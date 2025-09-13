import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  ArrowLeftIcon,
  TagIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { ProtectedRoute } from '../../../lib/auth';
import { publisherAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function CreateOffer() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [offerType, setOfferType] = useState('coupon');
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      type: 'coupon',
      categories: [],
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      userUsageLimit: 1,
      isPublic: true
    }
  });

  const watchedType = watch('type');

  const categories = [
    'electronics', 'fashion', 'beauty', 'home', 'books', 
    'sports', 'automotive', 'food', 'travel', 'other'
  ];

  const platforms = [
    'amazon', 'flipkart', 'myntra', 'ajio', 'nykaa', 
    'tatacliq', 'firstcry', 'other'
  ];

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Format dates
      data.startDate = new Date(data.startDate).toISOString();
      data.endDate = new Date(data.endDate).toISOString();
      
      // Convert string values to numbers where needed
      if (data.cashbackPercentage) data.cashbackPercentage = parseFloat(data.cashbackPercentage);
      if (data.flatCashback) data.flatCashback = parseFloat(data.flatCashback);
      if (data.maxCashback) data.maxCashback = parseFloat(data.maxCashback);
      if (data.minOrderValue) data.minOrderValue = parseFloat(data.minOrderValue);
      if (data.discountValue) data.discountValue = parseFloat(data.discountValue);
      if (data.maxDiscount) data.maxDiscount = parseFloat(data.maxDiscount);
      if (data.totalUsageLimit) data.totalUsageLimit = parseInt(data.totalUsageLimit);
      if (data.userUsageLimit) data.userUsageLimit = parseInt(data.userUsageLimit);
      if (data.dailyUsageLimit) data.dailyUsageLimit = parseInt(data.dailyUsageLimit);

      const response = await publisherAPI.createOffer(data);
      
      toast.success('Offer created successfully and is now live!');
      router.push('/publisher/offers');
      
    } catch (error) {
      console.error('Failed to create offer:', error);
      toast.error(error.response?.data?.message || 'Failed to create offer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['publisher', 'admin']}>
      <Head>
        <title>Create Offer - Publisher Dashboard | Casyoro</title>
        <meta name="description" content="Create a new discount offer or cashback deal" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div className="mb-8" variants={fadeInUp}>
            <div className="flex items-center space-x-4 mb-4">
              <Link
                href="/publisher/offers"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create New Offer</h1>
                <p className="mt-2 text-gray-600">
                  Create a discount offer or cashback deal for your customers
                </p>
              </div>
            </div>
          </motion.div>

          {/* Auto-approval Notice */}
          <motion.div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg" variants={fadeInUp}>
            <div className="flex items-center">
              <div className="w-5 h-5 bg-green-400 rounded-full mr-3"></div>
              <div>
                <h3 className="text-sm font-medium text-green-800">
                  Instant Approval
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Your offers will be automatically approved and immediately visible to users. No admin review required.
                </p>
              </div>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <motion.div className="card" variants={fadeInUp}>
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <InformationCircleIcon className="w-6 h-6 mr-2" />
                  Basic Information
                </h2>
              </div>
              <div className="card-body space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offer Title *
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g., Summer Sale 2024"
                      {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Title must be at least 3 characters' } })}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offer Type *
                    </label>
                    <select
                      className="input"
                      {...register('type', { required: 'Offer type is required' })}
                      onChange={(e) => setOfferType(e.target.value)}
                    >
                      <option value="coupon">Coupon Code</option>
                      <option value="cashback">Cashback</option>
                      <option value="deal">Special Deal</option>
                      <option value="bundle">Bundle Offer</option>
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    className="input"
                    rows={4}
                    placeholder="Describe your offer in detail..."
                    {...register('description', { required: 'Description is required', minLength: { value: 10, message: 'Description must be at least 10 characters' } })}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Brief one-line description"
                    {...register('shortDescription')}
                  />
                </div>
              </div>
            </motion.div>

            {/* Merchant Information */}
            <motion.div className="card" variants={fadeInUp}>
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <TagIcon className="w-6 h-6 mr-2" />
                  Merchant Information
                </h2>
              </div>
              <div className="card-body space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Merchant Name *
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g., Amazon, Flipkart"
                      {...register('merchant.name', { required: 'Merchant name is required' })}
                    />
                    {errors.merchant?.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.merchant.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform
                    </label>
                    <select className="input" {...register('merchant.platform')}>
                      <option value="">Select Platform</option>
                      {platforms.map(platform => (
                        <option key={platform} value={platform}>
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    className="input"
                    placeholder="https://example.com"
                    {...register('merchant.website')}
                  />
                </div>
              </div>
            </motion.div>

            {/* Offer Details */}
            <motion.div className="card" variants={fadeInUp}>
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <CurrencyRupeeIcon className="w-6 h-6 mr-2" />
                  Offer Details
                </h2>
              </div>
              <div className="card-body space-y-6">
                {watchedType === 'coupon' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g., SUMMER20"
                      {...register('couponCode')}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Type
                    </label>
                    <select className="input" {...register('discountType')}>
                      <option value="">Select Discount Type</option>
                      <option value="percentage">Percentage</option>
                      <option value="flat">Flat Amount</option>
                      <option value="bogo">Buy One Get One</option>
                      <option value="free_shipping">Free Shipping</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Value
                    </label>
                    <input
                      type="number"
                      className="input"
                      placeholder="e.g., 20 or 100"
                      step="0.01"
                      {...register('discountValue')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cashback Percentage
                    </label>
                    <input
                      type="number"
                      className="input"
                      placeholder="e.g., 5"
                      min="0"
                      max="100"
                      step="0.1"
                      {...register('cashbackPercentage')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Flat Cashback Amount
                    </label>
                    <input
                      type="number"
                      className="input"
                      placeholder="e.g., 50"
                      min="0"
                      step="0.01"
                      {...register('flatCashback')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Cashback
                    </label>
                    <input
                      type="number"
                      className="input"
                      placeholder="e.g., 500"
                      min="0"
                      step="0.01"
                      {...register('maxCashback')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Order Value
                    </label>
                    <input
                      type="number"
                      className="input"
                      placeholder="e.g., 1000"
                      min="0"
                      step="0.01"
                      {...register('minOrderValue')}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Categories & Validity */}
            <motion.div className="card" variants={fadeInUp}>
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <CalendarIcon className="w-6 h-6 mr-2" />
                  Categories & Validity
                </h2>
              </div>
              <div className="card-body space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {categories.map(category => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          value={category}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          {...register('categories', { required: 'At least one category is required' })}
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.categories && (
                    <p className="mt-1 text-sm text-red-600">{errors.categories.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      className="input"
                      {...register('startDate', { required: 'Start date is required' })}
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      className="input"
                      {...register('endDate', { required: 'End date is required' })}
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Usage Limits */}
            <motion.div className="card" variants={fadeInUp}>
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">Usage Limits</h2>
              </div>
              <div className="card-body space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Usage Limit
                    </label>
                    <input
                      type="number"
                      className="input"
                      placeholder="e.g., 1000"
                      min="1"
                      {...register('totalUsageLimit')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Per User Limit
                    </label>
                    <input
                      type="number"
                      className="input"
                      placeholder="e.g., 1"
                      min="1"
                      {...register('userUsageLimit')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Limit
                    </label>
                    <input
                      type="number"
                      className="input"
                      placeholder="e.g., 100"
                      min="1"
                      {...register('dailyUsageLimit')}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Terms & Conditions */}
            <motion.div className="card" variants={fadeInUp}>
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">Terms & Conditions</h2>
              </div>
              <div className="card-body space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Terms & Conditions
                  </label>
                  <textarea
                    className="input"
                    rows={4}
                    placeholder="Enter terms and conditions..."
                    {...register('terms')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exclusions
                  </label>
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="What is excluded from this offer..."
                    {...register('exclusions')}
                  />
                </div>
              </div>
            </motion.div>

            {/* Tracking URLs */}
            <motion.div className="card" variants={fadeInUp}>
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">Tracking URLs</h2>
              </div>
              <div className="card-body space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking URL
                  </label>
                  <input
                    type="url"
                    className="input"
                    placeholder="https://example.com/track"
                    {...register('trackingUrl')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deep Link
                  </label>
                  <input
                    type="url"
                    className="input"
                    placeholder="https://example.com/deep-link"
                    {...register('deepLink')}
                  />
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div className="flex justify-end space-x-4" variants={fadeInUp}>
              <Link href="/publisher/offers" className="btn btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Offer'}
              </button>
            </motion.div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}

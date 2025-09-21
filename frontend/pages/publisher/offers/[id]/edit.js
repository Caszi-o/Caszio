import { useState, useEffect } from 'react';
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
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { ProtectedRoute } from '../../../../lib/auth';
import { publisherAPI } from '../../../../lib/api';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function EditOffer() {
  const router = useRouter();
  const { id } = router.query;
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm();

  const discountType = watch('discountType');

  useEffect(() => {
    if (id) {
      loadOffer();
    }
  }, [id]);

  const loadOffer = async () => {
    try {
      setLoading(true);
      
      // Mock data for now
      const mockOffer = {
        _id: id,
        title: 'Summer Sale - Electronics',
        description: 'Get up to 50% off on all electronics',
        discountType: 'percentage',
        discountValue: 50,
        cashbackPercentage: 5,
        categories: ['electronics'],
        status: 'active',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        merchant: {
          name: 'TechStore',
          logo: null
        },
        terms: 'Valid on all electronics. Cannot be combined with other offers.'
      };

      setOffer(mockOffer);
      
      // Set form values
      setValue('title', mockOffer.title);
      setValue('merchantName', mockOffer.merchant.name);
      setValue('description', mockOffer.description);
      setValue('discountType', mockOffer.discountType);
      setValue('discountValue', mockOffer.discountValue);
      setValue('cashbackPercentage', mockOffer.cashbackPercentage);
      setValue('categories', mockOffer.categories[0]);
      setValue('startDate', mockOffer.startDate);
      setValue('endDate', mockOffer.endDate);
      setValue('terms', mockOffer.terms);
      
    } catch (error) {
      console.error('Failed to load offer:', error);
      toast.error('Failed to load offer');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      
      const offerData = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        categories: [data.categories]
      };

      // Mock API call
      console.log('Updating offer:', offerData);
      
      toast.success('Offer updated successfully!');
      router.push(`/publisher/offers/${id}`);
      
    } catch (error) {
      console.error('Update offer error:', error);
      toast.error('Failed to update offer. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['publisher']}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!offer) {
    return (
      <ProtectedRoute allowedRoles={['publisher']}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Offer Not Found</h2>
            <p className="text-gray-600 mb-6">The offer you're looking for doesn't exist.</p>
            <Link href="/publisher/offers" className="btn btn-primary">
              Back to Offers
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['publisher']}>
      <Head>
        <title>Edit Offer - Publisher Dashboard</title>
        <meta name="description" content="Edit your discount offer" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href={`/publisher/offers/${id}`} className="text-2xl font-bold text-primary-600">
                  Caszio
                </Link>
                <div className="h-6 border-l border-gray-300"></div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Offer</h1>
              </div>

              <Link href={`/publisher/offers/${id}`} className="btn btn-outline">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Offer
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Edit Offer Details</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Update your discount offer information
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offer Title *
                    </label>
                    <input
                      type="text"
                      {...register('title', { required: 'Offer title is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Summer Sale - Electronics"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Merchant Name *
                    </label>
                    <input
                      type="text"
                      {...register('merchantName', { required: 'Merchant name is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., TechStore"
                    />
                    {errors.merchantName && (
                      <p className="mt-1 text-sm text-red-600">{errors.merchantName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your offer in detail..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                {/* Discount Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Discount Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Type *
                      </label>
                      <select
                        {...register('discountType', { required: 'Discount type is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="percentage">Percentage Off</option>
                        <option value="fixed">Fixed Amount Off</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Value *
                      </label>
                      <div className="relative">
                        {discountType === 'percentage' ? (
                          <input
                            type="number"
                            min="1"
                            max="100"
                            {...register('discountValue', { 
                              required: 'Discount value is required',
                              min: { value: 1, message: 'Minimum 1%' },
                              max: { value: 100, message: 'Maximum 100%' }
                            })}
                            className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="50"
                          />
                        ) : (
                          <div className="relative">
                            <CurrencyRupeeIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="number"
                              min="1"
                              {...register('discountValue', { 
                                required: 'Discount value is required',
                                min: { value: 1, message: 'Minimum ₹1' }
                              })}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="500"
                            />
                          </div>
                        )}
                        {discountType === 'percentage' && (
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                        )}
                      </div>
                      {errors.discountValue && (
                        <p className="mt-1 text-sm text-red-600">{errors.discountValue.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cashback Percentage *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="50"
                        {...register('cashbackPercentage', { 
                          required: 'Cashback percentage is required',
                          min: { value: 0, message: 'Minimum 0%' },
                          max: { value: 50, message: 'Maximum 50%' }
                        })}
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="5"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                    </div>
                    {errors.cashbackPercentage && (
                      <p className="mt-1 text-sm text-red-600">{errors.cashbackPercentage.message}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      The percentage of cashback customers will earn on this offer
                    </p>
                  </div>
                </div>

                {/* Category and Dates */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Category & Schedule</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        {...register('categories', { required: 'Category is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion</option>
                        <option value="beauty">Beauty</option>
                        <option value="home">Home & Garden</option>
                        <option value="sports">Sports & Fitness</option>
                        <option value="books">Books & Media</option>
                        <option value="automotive">Automotive</option>
                        <option value="health">Health & Wellness</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        {...register('startDate', { required: 'Start date is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.startDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      {...register('endDate', { required: 'End date is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                    )}
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Terms & Conditions</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Terms & Conditions
                    </label>
                    <textarea
                      {...register('terms')}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter any specific terms and conditions for this offer..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-end space-x-4">
                    <Link
                      href={`/publisher/offers/${id}`}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

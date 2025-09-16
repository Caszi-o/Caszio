import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  CalendarIcon,
  TagIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { ProtectedRoute } from '../../../lib/auth';
import { publisherAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
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

export default function OfferDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOffer();
    }
  }, [id]);

  const loadOffer = async () => {
    try {
      setLoading(true);
      const response = await publisherAPI.getOffer(id);
      setOffer(response.data.data.offer);
    } catch (error) {
      console.error('Failed to load offer:', error);
      toast.error('Failed to load offer details');
      router.push('/publisher/offers');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOffer = async () => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    try {
      await publisherAPI.deleteOffer(id);
      toast.success('Offer deleted successfully');
      router.push('/publisher/offers');
    } catch (error) {
      console.error('Failed to delete offer:', error);
      toast.error('Failed to delete offer');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return CheckCircleIcon;
      case 'pending_approval':
        return ClockIcon;
      case 'draft':
        return ExclamationTriangleIcon;
      case 'paused':
        return XCircleIcon;
      case 'expired':
        return XCircleIcon;
      case 'cancelled':
        return XCircleIcon;
      default:
        return ClockIcon;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'pending_approval':
        return 'text-yellow-600 bg-yellow-100';
      case 'draft':
        return 'text-gray-600 bg-gray-100';
      case 'paused':
        return 'text-orange-600 bg-orange-100';
      case 'expired':
        return 'text-red-600 bg-red-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const canEditOffer = (status) => {
    return ['draft', 'pending_approval'].includes(status);
  };

  const canDeleteOffer = (status) => {
    return ['draft', 'pending_approval'].includes(status);
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['publisher']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading offer details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!offer) {
    return (
      <ProtectedRoute allowedRoles={['publisher']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <ExclamationTriangleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Offer not found</h3>
            <p className="text-gray-600 mb-6">The offer you're looking for doesn't exist or you don't have access to it.</p>
            <Link href="/publisher/offers" className="btn btn-primary">
              Back to Offers
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const StatusIcon = getStatusIcon(offer.status);

  return (
    <ProtectedRoute allowedRoles={['publisher']}>
      <Head>
        <title>{offer.title} - Offer Details | Casyoro</title>
        <meta name="description" content={offer.description} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div className="mb-8" variants={fadeInUp}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/publisher/offers"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeftIcon className="w-6 h-6" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{offer.title}</h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(offer.status)}`}>
                      {offer.status.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-600 capitalize">{offer.type}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {canEditOffer(offer.status) && (
                  <Link
                    href={`/publisher/offers/${offer._id}/edit`}
                    className="btn btn-secondary flex items-center space-x-2"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span>Edit</span>
                  </Link>
                )}
                
                <Link
                  href={`/publisher/offers/${offer._id}/analytics`}
                  className="btn btn-primary flex items-center space-x-2"
                >
                  <ChartBarIcon className="w-4 h-4" />
                  <span>Analytics</span>
                </Link>
                
                {canDeleteOffer(offer.status) && (
                  <button
                    onClick={handleDeleteOffer}
                    className="btn btn-danger flex items-center space-x-2"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <motion.div className="card" variants={fadeInUp}>
                <div className="card-header">
                  <h2 className="text-xl font-semibold text-gray-900">Description</h2>
                </div>
                <div className="card-body">
                  <p className="text-gray-700 leading-relaxed">{offer.description}</p>
                  {offer.shortDescription && (
                    <p className="mt-4 text-sm text-gray-600 italic">{offer.shortDescription}</p>
                  )}
                </div>
              </motion.div>

              {/* Offer Details */}
              <motion.div className="card" variants={fadeInUp}>
                <div className="card-header">
                  <h2 className="text-xl font-semibold text-gray-900">Offer Details</h2>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Merchant</label>
                      <p className="text-gray-900">{offer.merchant?.name}</p>
                      {offer.merchant?.platform && (
                        <p className="text-sm text-gray-600 capitalize">{offer.merchant.platform}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Offer Type</label>
                      <p className="text-gray-900 capitalize">{offer.type}</p>
                    </div>

                    {offer.couponCode && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
                        <p className="text-gray-900 font-mono bg-gray-100 px-3 py-2 rounded">{offer.couponCode}</p>
                      </div>
                    )}

                    {offer.discountType && offer.discountValue && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
                        <p className="text-gray-900">
                          {offer.discountType === 'percentage' 
                            ? `${offer.discountValue}%` 
                            : formatCurrency(offer.discountValue)
                          }
                        </p>
                      </div>
                    )}

                    {offer.cashbackPercentage && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cashback</label>
                        <p className="text-gray-900">{offer.cashbackPercentage}%</p>
                        {offer.maxCashback && (
                          <p className="text-sm text-gray-600">Max: {formatCurrency(offer.maxCashback)}</p>
                        )}
                      </div>
                    )}

                    {offer.minOrderValue && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Value</label>
                        <p className="text-gray-900">{formatCurrency(offer.minOrderValue)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Categories */}
              <motion.div className="card" variants={fadeInUp}>
                <div className="card-header">
                  <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
                </div>
                <div className="card-body">
                  <div className="flex flex-wrap gap-2">
                    {offer.categories?.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full capitalize"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Terms & Conditions */}
              {(offer.terms?.length > 0 || offer.exclusions?.length > 0) && (
                <motion.div className="card" variants={fadeInUp}>
                  <div className="card-header">
                    <h2 className="text-xl font-semibold text-gray-900">Terms & Conditions</h2>
                  </div>
                  <div className="card-body space-y-4">
                    {offer.terms?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Terms</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {offer.terms.map((term, index) => (
                            <li key={index}>{term}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {offer.exclusions?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Exclusions</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {offer.exclusions.map((exclusion, index) => (
                            <li key={index}>{exclusion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Status & Actions */}
              <motion.div className="card" variants={fadeInUp}>
                <div className="card-header">
                  <h2 className="text-xl font-semibold text-gray-900">Status</h2>
                </div>
                <div className="card-body">
                  <div className="flex items-center space-x-3 mb-4">
                    <StatusIcon className="w-6 h-6 text-gray-400" />
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(offer.status)}`}>
                      {offer.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  {offer.approvedBy && (
                    <div className="text-sm text-gray-600">
                      <p>Approved by: {offer.approvedBy.firstName} {offer.approvedBy.lastName}</p>
                      {offer.approvedAt && (
                        <p>On: {formatDate(offer.approvedAt)}</p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Validity Period */}
              <motion.div className="card" variants={fadeInUp}>
                <div className="card-header">
                  <h2 className="text-xl font-semibold text-gray-900">Validity Period</h2>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Start Date</p>
                        <p className="text-sm text-gray-600">{formatDate(offer.startDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">End Date</p>
                        <p className="text-sm text-gray-600">{formatDate(offer.endDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Usage Statistics */}
              <motion.div className="card" variants={fadeInUp}>
                <div className="card-header">
                  <h2 className="text-xl font-semibold text-gray-900">Usage Statistics</h2>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Usage</span>
                      <span className="text-sm font-medium text-gray-900">{offer.currentUsage || 0}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Unique Users</span>
                      <span className="text-sm font-medium text-gray-900">{offer.uniqueUsers || 0}</span>
                    </div>
                    
                    {offer.totalUsageLimit && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Usage Limit</span>
                        <span className="text-sm font-medium text-gray-900">{offer.totalUsageLimit}</span>
                      </div>
                    )}
                    
                    {offer.userUsageLimit && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Per User Limit</span>
                        <span className="text-sm font-medium text-gray-900">{offer.userUsageLimit}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Performance Metrics */}
              <motion.div className="card" variants={fadeInUp}>
                <div className="card-header">
                  <h2 className="text-xl font-semibold text-gray-900">Performance</h2>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Views</span>
                      <span className="text-sm font-medium text-gray-900">{offer.metrics?.views || 0}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Clicks</span>
                      <span className="text-sm font-medium text-gray-900">{offer.metrics?.clicks || 0}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Conversions</span>
                      <span className="text-sm font-medium text-gray-900">{offer.metrics?.conversions || 0}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">CTR</span>
                      <span className="text-sm font-medium text-gray-900">{(offer.metrics?.ctr || 0).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

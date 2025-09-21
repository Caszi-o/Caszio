import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
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

export default function OfferDetail() {
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
        metrics: {
          views: 1250,
          clicks: 89,
          conversions: 12
        },
        terms: 'Valid on all electronics. Cannot be combined with other offers.'
      };

      setOffer(mockOffer);
    } catch (error) {
      console.error('Failed to load offer:', error);
      toast.error('Failed to load offer');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (action) => {
    try {
      // Mock API call
      toast.success(`Offer ${action} successfully`);
      loadOffer();
    } catch (error) {
      console.error('Failed to update offer status:', error);
      toast.error('Failed to update offer status');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        // Mock API call
        toast.success('Offer deleted successfully');
        router.push('/publisher/offers');
      } catch (error) {
        console.error('Failed to delete offer:', error);
        toast.error('Failed to delete offer');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'paused': return 'text-gray-600 bg-gray-100';
      case 'expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return CheckCircleIcon;
      case 'pending': return ClockIcon;
      case 'paused': return ExclamationTriangleIcon;
      case 'expired': return XCircleIcon;
      default: return ClockIcon;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
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

  const StatusIcon = getStatusIcon(offer.status);

  return (
    <ProtectedRoute allowedRoles={['publisher']}>
      <Head>
        <title>{offer.title} - Publisher Dashboard</title>
        <meta name="description" content="View offer details and performance" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/publisher/offers" className="text-2xl font-bold text-primary-600">
                  Caszio
                </Link>
                <div className="h-6 border-l border-gray-300"></div>
                <h1 className="text-xl font-semibold text-gray-900">Offer Details</h1>
              </div>

              <div className="flex items-center space-x-3">
                <Link href={`/publisher/offers/${id}/edit`} className="btn btn-outline">
                  <PencilIcon className="w-5 h-5 mr-2" />
                  Edit Offer
                </Link>
                <Link href="/publisher/offers" className="btn btn-outline">
                  <ArrowLeftIcon className="w-5 h-5 mr-2" />
                  Back to Offers
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Offer Overview */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          {offer.merchant?.logo ? (
                            <img src={offer.merchant.logo} alt={offer.merchant.name} className="w-12 h-12 object-contain" />
                          ) : (
                            <span className="text-2xl font-bold text-gray-600">
                              {offer.merchant?.name?.charAt(0) || '?'}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <h1 className="text-2xl font-bold text-gray-900">{offer.title}</h1>
                          <p className="text-gray-600">{offer.merchant?.name}</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(offer.status)} mt-2`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {offer.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-6">{offer.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <TagIcon className="w-5 h-5 text-blue-600 mr-2" />
                          <div>
                            <p className="text-sm text-blue-600">Discount</p>
                            <p className="text-lg font-semibold text-blue-900">
                              {offer.discountType === 'percentage' 
                                ? `${offer.discountValue}% OFF` 
                                : `${formatCurrency(offer.discountValue)} OFF`
                              }
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <CurrencyRupeeIcon className="w-5 h-5 text-green-600 mr-2" />
                          <div>
                            <p className="text-sm text-green-600">Cashback</p>
                            <p className="text-lg font-semibold text-green-900">
                              {offer.cashbackPercentage}%
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <CalendarIcon className="w-5 h-5 text-purple-600 mr-2" />
                          <div>
                            <p className="text-sm text-purple-600">Valid Until</p>
                            <p className="text-lg font-semibold text-purple-900">
                              {new Date(offer.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <ChartBarIcon className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatNumber(offer.metrics.views)}</p>
                        <p className="text-sm text-gray-600">Total Views</p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <CheckCircleIcon className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatNumber(offer.metrics.clicks)}</p>
                        <p className="text-sm text-gray-600">Total Clicks</p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <CurrencyRupeeIcon className="w-8 h-8 text-purple-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatNumber(offer.metrics.conversions)}</p>
                        <p className="text-sm text-gray-600">Conversions</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600">Click Rate</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {((offer.metrics.clicks / offer.metrics.views) * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Conversion Rate</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {((offer.metrics.conversions / offer.metrics.clicks) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                {offer.terms && (
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions</h2>
                      <p className="text-gray-700">{offer.terms}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    
                    <div className="space-y-3">
                      <Link
                        href={`/publisher/offers/${id}/edit`}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <PencilIcon className="w-5 h-5 mr-2" />
                        Edit Offer
                      </Link>

                      {offer.status === 'active' ? (
                        <button
                          onClick={() => handleStatusChange('pause')}
                          className="w-full flex items-center justify-center px-4 py-2 border border-yellow-300 rounded-md text-yellow-700 hover:bg-yellow-50 transition-colors"
                        >
                          <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                          Pause Offer
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange('activate')}
                          className="w-full flex items-center justify-center px-4 py-2 border border-green-300 rounded-md text-green-700 hover:bg-green-50 transition-colors"
                        >
                          <CheckCircleIcon className="w-5 h-5 mr-2" />
                          Activate Offer
                        </button>
                      )}

                      <button
                        onClick={handleDelete}
                        className="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-md text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <TrashIcon className="w-5 h-5 mr-2" />
                        Delete Offer
                      </button>
                    </div>
                  </div>
                </div>

                {/* Offer Details */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Offer Details</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {offer.categories?.join(', ')}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Start Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(offer.startDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">End Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(offer.endDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Created</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  TagIcon,
  CalendarIcon,
  CurrencyRupeeIcon
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

export default function PublisherOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  useEffect(() => {
    loadOffers();
  }, [filters, pagination.currentPage]);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 20,
        ...filters
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await publisherAPI.getOffers(params);
      setOffers(response.data.data.offers);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Failed to load offers:', error);
      toast.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOffer = async (offerId) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    try {
      await publisherAPI.deleteOffer(offerId);
      toast.success('Offer deleted successfully');
      loadOffers();
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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'coupon':
        return TagIcon;
      case 'cashback':
        return CurrencyRupeeIcon;
      case 'deal':
        return ChartBarIcon;
      case 'bundle':
        return TagIcon;
      default:
        return TagIcon;
    }
  };

  const canEditOffer = (status) => {
    return ['draft', 'pending_approval'].includes(status);
  };

  const canDeleteOffer = (status) => {
    return ['draft', 'pending_approval'].includes(status);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <ProtectedRoute allowedRoles={['publisher']}>
      <Head>
        <title>My Offers - Publisher Dashboard | Casyoro</title>
        <meta name="description" content="Manage your offers and discounts" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div className="mb-8" variants={fadeInUp}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Offers</h1>
                <p className="mt-2 text-gray-600">
                  Create and manage your discount offers and cashback deals
                </p>
              </div>
              <Link
                href="/publisher/offers/create"
                className="btn btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Create Offer</span>
              </Link>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div className="card mb-8" variants={fadeInUp}>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search offers..."
                      className="input pl-10"
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    className="input"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="expired">Expired</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    className="input"
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  >
                    <option value="">All Types</option>
                    <option value="coupon">Coupon</option>
                    <option value="cashback">Cashback</option>
                    <option value="deal">Deal</option>
                    <option value="bundle">Bundle</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({ status: '', type: '', search: '' })}
                    className="btn btn-secondary w-full"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Offers List */}
          {loading ? (
            <motion.div className="text-center py-12" variants={fadeInUp}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading offers...</p>
            </motion.div>
          ) : offers.length === 0 ? (
            <motion.div className="text-center py-12" variants={fadeInUp}>
              <TagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No offers found</h3>
              <p className="text-gray-600 mb-6">
                {Object.values(filters).some(f => f) 
                  ? 'Try adjusting your filters to see more results.'
                  : 'Create your first offer to get started.'
                }
              </p>
              {!Object.values(filters).some(f => f) && (
                <Link href="/publisher/offers/create" className="btn btn-primary">
                  Create Your First Offer
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              variants={staggerChildren}
            >
              {offers.map((offer) => {
                const StatusIcon = getStatusIcon(offer.status);
                const TypeIcon = getTypeIcon(offer.type);
                
                return (
                  <motion.div key={offer._id} className="card" variants={fadeInUp}>
                    <div className="card-body">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {offer.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {offer.description}
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                          {offer.status.replace('_', ' ')}
                        </div>
                      </div>

                      {/* Offer Details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-2">
                          <TypeIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 capitalize">{offer.type}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">Merchant:</span>
                          <span className="text-sm text-gray-600">{offer.merchant?.name}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
                          </span>
                        </div>

                        {/* Discount/Cashback Info */}
                        {offer.discountValue && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">Discount:</span>
                            <span className="text-sm text-green-600 font-semibold">
                              {offer.discountType === 'percentage' 
                                ? `${offer.discountValue}%` 
                                : formatCurrency(offer.discountValue)
                              }
                            </span>
                          </div>
                        )}

                        {offer.cashbackPercentage && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">Cashback:</span>
                            <span className="text-sm text-blue-600 font-semibold">
                              {offer.cashbackPercentage}%
                            </span>
                          </div>
                        )}

                        {/* Usage Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Used: {offer.currentUsage || 0}</span>
                          {offer.totalUsageLimit && (
                            <span>Limit: {offer.totalUsageLimit}</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/publisher/offers/${offer._id}`}
                            className="text-primary-600 hover:text-primary-700"
                            title="View Details"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </Link>
                          
                          {canEditOffer(offer.status) && (
                            <Link 
                              href={`/publisher/offers/${offer._id}/edit`}
                              className="text-gray-600 hover:text-gray-700"
                              title="Edit Offer"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </Link>
                          )}
                          
                          <Link 
                            href={`/publisher/offers/${offer._id}/analytics`}
                            className="text-green-600 hover:text-green-700"
                            title="View Analytics"
                          >
                            <ChartBarIcon className="w-5 h-5" />
                          </Link>
                          
                          {canDeleteOffer(offer.status) && (
                            <button
                              onClick={() => handleDeleteOffer(offer._id)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete Offer"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>

                        <StatusIcon className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <motion.div className="mt-8 flex justify-center" variants={fadeInUp}>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                  disabled={pagination.currentPage === 1}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

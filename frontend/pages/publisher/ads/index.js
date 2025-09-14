import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  ChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
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

export default function PublisherAds() {
  const [ads, setAds] = useState([]);
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
    loadAds();
  }, [filters, pagination.currentPage]);

  const loadAds = async () => {
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

      const response = await publisherAPI.getAds(params);
      setAds(response.data.data.ads);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Failed to load ads:', error);
      toast.error('Failed to load ads');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (adId, action) => {
    try {
      await publisherAPI.updateAdStatus(adId, { action });
      toast.success(`Ad ${action}d successfully`);
      loadAds();
    } catch (error) {
      console.error('Failed to update ad status:', error);
      toast.error('Failed to update ad status');
    }
  };

  const handleDeleteAd = async (adId) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    try {
      await publisherAPI.deleteAd(adId);
      toast.success('Ad deleted successfully');
      loadAds();
    } catch (error) {
      console.error('Failed to delete ad:', error);
      toast.error('Failed to delete ad');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success-600 bg-success-100';
      case 'paused': return 'text-warning-600 bg-warning-100';
      case 'pending_review': return 'text-primary-600 bg-primary-100';
      case 'rejected': return 'text-danger-600 bg-danger-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return CheckCircleIcon;
      case 'paused': return ClockIcon;
      case 'pending_review': return ExclamationTriangleIcon;
      case 'rejected': return XCircleIcon;
      case 'completed': return CheckCircleIcon;
      case 'draft': return ClockIcon;
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

  const canEditAd = (status) => {
    return ['draft', 'paused', 'rejected'].includes(status);
  };

  const canDeleteAd = (status) => {
    return ['draft', 'rejected', 'completed'].includes(status);
  };

  const canPauseResume = (status) => {
    return ['active', 'paused'].includes(status);
  };

  return (
    <ProtectedRoute allowedRoles={['publisher']}>
      <Head>
        <title>My Ads - Publisher Dashboard - Casyoro</title>
        <meta name="description" content="Manage your advertising campaigns" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/publisher/dashboard" className="text-2xl font-bold text-primary-600">
                  Casyoro
                </Link>
                <div className="h-6 border-l border-gray-300"></div>
                <h1 className="text-xl font-semibold text-gray-900">My Ads</h1>
              </div>

              <Link href="/publisher/ads/create" className="btn btn-primary">
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Ad
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <motion.div className="mb-6 card" variants={fadeInUp}>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="form-label">Search</label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      className="form-input pl-10"
                      placeholder="Search ads..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  >
                    <option value="">All Types</option>
                    <option value="banner">Banner</option>
                    <option value="text">Text</option>
                    <option value="video">Video</option>
                    <option value="native">Native</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({ status: '', type: '', search: '' })}
                    className="btn btn-secondary w-full"
                  >
                    <FunnelIcon className="w-5 h-5 mr-2" />
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Ads Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="spinner spinner-lg"></div>
            </div>
          ) : ads.length === 0 ? (
            <motion.div className="text-center py-12" variants={fadeInUp}>
              <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No ads found</h3>
              <p className="text-gray-600 mb-6">
                {Object.values(filters).some(v => v) 
                  ? 'Try adjusting your filters or create your first ad campaign.'
                  : 'Create your first ad campaign to start reaching customers.'
                }
              </p>
              <Link href="/publisher/ads/create" className="btn btn-primary">
                Create Your First Ad
              </Link>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="initial"
              animate="animate"
              variants={{
                animate: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {ads.map((ad) => {
                const StatusIcon = getStatusIcon(ad.status);
                const ctr = ad.metrics.impressions > 0 ? ((ad.metrics.clicks / ad.metrics.impressions) * 100).toFixed(2) : '0';
                
                return (
                  <motion.div key={ad._id} className="card hover:shadow-medium transition-shadow" variants={fadeInUp}>
                    <div className="card-body">
                      {/* Ad Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 truncate">{ad.title}</h3>
                          <div className="flex items-center mt-1">
                            <span className="text-sm text-gray-500 capitalize">{ad.type} Ad</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ad.status)}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {ad.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Ad Preview */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        {ad.type === 'banner' && (
                          <div className="text-center">
                            <div className="w-full h-20 bg-gray-200 rounded mb-2 flex items-center justify-center">
                              <span className="text-xs text-gray-500">Banner Preview</span>
                            </div>
                            <p className="text-xs text-gray-600 truncate">{ad.description}</p>
                          </div>
                        )}
                        
                        {ad.type === 'text' && (
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-1">{ad.title}</p>
                            <p className="text-xs text-gray-600 line-clamp-2">{ad.description}</p>
                          </div>
                        )}
                        
                        {ad.type === 'video' && (
                          <div className="text-center">
                            <div className="w-full h-20 bg-gray-200 rounded mb-2 flex items-center justify-center">
                              <PlayIcon className="w-6 h-6 text-gray-500" />
                            </div>
                            <p className="text-xs text-gray-600 truncate">{ad.description}</p>
                          </div>
                        )}
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{formatNumber(ad.metrics.impressions)}</div>
                          <div className="text-xs text-gray-500">Impressions</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{formatNumber(ad.metrics.clicks)}</div>
                          <div className="text-xs text-gray-500">Clicks</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{ctr}%</div>
                          <div className="text-xs text-gray-500">CTR</div>
                        </div>
                      </div>

                      {/* Budget Info */}
                      <div className="mb-4 p-2 bg-blue-50 rounded">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Spent / Budget:</span>
                          <span className="font-medium">
                            {formatCurrency(ad.budget.spent)} / {formatCurrency(ad.budget.amount)}
                          </span>
                        </div>
                        <div className="mt-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min((ad.budget.spent / ad.budget.amount) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/publisher/ads/${ad._id}`}
                            className="text-primary-600 hover:text-primary-700"
                            title="View Details"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </Link>
                          
                          {canEditAd(ad.status) && (
                            <Link 
                              href={`/publisher/ads/${ad._id}/edit`}
                              className="text-gray-600 hover:text-gray-700"
                              title="Edit Ad"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </Link>
                          )}
                          
                          <Link 
                            href={`/publisher/ads/${ad._id}/analytics`}
                            className="text-green-600 hover:text-green-700"
                            title="View Analytics"
                          >
                            <ChartBarIcon className="w-5 h-5" />
                          </Link>
                          
                          {canDeleteAd(ad.status) && (
                            <button
                              onClick={() => handleDeleteAd(ad._id)}
                              className="text-danger-600 hover:text-danger-700"
                              title="Delete Ad"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>

                        {canPauseResume(ad.status) && (
                          <button
                            onClick={() => handleStatusChange(ad._id, ad.status === 'active' ? 'pause' : 'resume')}
                            className={`btn btn-sm ${
                              ad.status === 'active' 
                                ? 'btn-secondary' 
                                : 'btn-primary'
                            }`}
                          >
                            {ad.status === 'active' ? (
                              <>
                                <PauseIcon className="w-4 h-4 mr-1" />
                                Pause
                              </>
                            ) : (
                              <>
                                <PlayIcon className="w-4 h-4 mr-1" />
                                Resume
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Rejection Reason */}
                      {ad.status === 'rejected' && ad.rejectionReason && (
                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-xs text-red-700">
                            <strong>Rejection Reason:</strong> {ad.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <motion.div className="mt-8 flex justify-center" variants={fadeInUp}>
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                  disabled={pagination.currentPage === 1}
                  className="btn btn-secondary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPagination({ ...pagination, currentPage: i + 1 })}
                    className={`btn btn-sm ${
                      pagination.currentPage === i + 1 
                        ? 'btn-primary' 
                        : 'btn-secondary'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="btn btn-secondary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

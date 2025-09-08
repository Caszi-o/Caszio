import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { ProtectedRoute } from '../../lib/auth';
import { adminAPI } from '../../lib/api';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function AdminPromoters() {
  const [promoters, setPromoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [selectedPromoter, setSelectedPromoter] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    status: '',
    notes: ''
  });

  useEffect(() => {
    loadPromoters();
  }, [filters, pagination.currentPage]);

  const loadPromoters = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 20,
        ...filters
      };
      
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await adminAPI.getPromoters(params);
      setPromoters(response.data.data.promoters);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Failed to load promoters:', error);
      toast.error('Failed to load promoters');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewPromoter = (promoter) => {
    setSelectedPromoter(promoter);
    setReviewForm({
      status: '',
      notes: ''
    });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!reviewForm.status) {
      toast.error('Please select an application status');
      return;
    }

    try {
      await adminAPI.approvePromoter(selectedPromoter._id, reviewForm);
      toast.success(`Promoter application ${reviewForm.status} successfully`);
      setShowReviewModal(false);
      loadPromoters();
    } catch (error) {
      console.error('Failed to review promoter:', error);
      toast.error('Failed to review promoter application');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-success-600 bg-success-100';
      case 'pending': return 'text-warning-600 bg-warning-100';
      case 'rejected': return 'text-danger-600 bg-danger-100';
      case 'under_review': return 'text-primary-600 bg-primary-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return CheckCircleIcon;
      case 'pending': return ClockIcon;
      case 'rejected': return XCircleIcon;
      case 'under_review': return ExclamationTriangleIcon;
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <ProtectedRoute allowedRoles={['admin']} requireVerification>
      <Head>
        <title>Promoter Management - Admin Dashboard - Casyoro</title>
        <meta name="description" content="Review and manage promoter applications" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/admin/dashboard" className="text-2xl font-bold text-primary-600">
                  Casyoro
                </Link>
                <div className="h-6 border-l border-gray-300"></div>
                <h1 className="text-xl font-semibold text-gray-900">Promoter Management</h1>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Total Promoters: {pagination.totalItems}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <motion.div className="mb-6 card" variants={fadeInUp}>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Search</label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      className="form-input pl-10"
                      placeholder="Search promoters..."
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
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({ search: '', status: '' })}
                    className="btn btn-secondary w-full"
                  >
                    <FunnelIcon className="w-5 h-5 mr-2" />
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Promoters Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="spinner spinner-lg"></div>
            </div>
          ) : promoters.length === 0 ? (
            <motion.div className="text-center py-12" variants={fadeInUp}>
              <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No promoters found</h3>
              <p className="text-gray-600">Try adjusting your search filters.</p>
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
              {promoters.map((promoter) => {
                const StatusIcon = getStatusIcon(promoter.applicationStatus);
                
                return (
                  <motion.div key={promoter._id} className="card hover:shadow-medium transition-shadow" variants={fadeInUp}>
                    <div className="card-body">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                            <UserGroupIcon className="w-6 h-6 text-warning-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 truncate">
                              {promoter.displayName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {formatNumber(promoter.monthlyTraffic)} monthly traffic
                            </p>
                          </div>
                        </div>
                        
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(promoter.applicationStatus)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {promoter.applicationStatus.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Bio */}
                      {promoter.bio && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {promoter.bio}
                          </p>
                        </div>
                      )}

                      {/* Platforms */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Platforms</h4>
                        <div className="space-y-1">
                          {promoter.platforms.slice(0, 3).map((platform, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                              <GlobeAltIcon className="w-4 h-4 mr-2" />
                              <span className="capitalize font-medium">{platform.name}:</span>
                              <span className="ml-1 truncate">{platform.url}</span>
                            </div>
                          ))}
                          {promoter.platforms.length > 3 && (
                            <p className="text-xs text-gray-500">
                              +{promoter.platforms.length - 3} more platforms
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      {promoter.applicationStatus === 'approved' && (
                        <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {formatCurrency(promoter.earnings?.totalEarnings || 0)}
                            </div>
                            <div className="text-xs text-gray-500">Earnings</div>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {formatNumber(promoter.stats?.totalClicks || 0)}
                            </div>
                            <div className="text-xs text-gray-500">Clicks</div>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {promoter.qualityScore || 0}
                            </div>
                            <div className="text-xs text-gray-500">Quality</div>
                          </div>
                        </div>
                      )}

                      {/* Contact Info */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">
                            {promoter.userId?.firstName} {promoter.userId?.lastName}
                          </p>
                          <p className="text-gray-600">{promoter.userId?.email}</p>
                          <div className="flex items-center mt-1">
                            <CalendarIcon className="w-4 h-4 mr-1 text-gray-400" />
                            <span className="text-gray-500">Applied: {formatDate(promoter.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Audience Demographics */}
                      {promoter.audienceDemographics && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <h5 className="text-sm font-medium text-blue-900 mb-1">Audience</h5>
                          <div className="text-xs text-blue-800">
                            {promoter.audienceDemographics.topCountries && (
                              <p>Countries: {promoter.audienceDemographics.topCountries}</p>
                            )}
                            {promoter.audienceDemographics.interests && (
                              <p>Interests: {promoter.audienceDemographics.interests}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <Link 
                          href={`/admin/promoters/${promoter._id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          View Details
                        </Link>

                        {promoter.applicationStatus === 'pending' && (
                          <button
                            onClick={() => handleReviewPromoter(promoter)}
                            className="btn btn-sm btn-primary"
                          >
                            Review
                          </button>
                        )}

                        {promoter.applicationStatus === 'approved' && (
                          <Link 
                            href={`/admin/promoters/${promoter._id}/earnings`}
                            className="text-success-600 hover:text-success-700 text-sm font-medium flex items-center"
                          >
                            <ChartBarIcon className="w-4 h-4 mr-1" />
                            Earnings
                          </Link>
                        )}
                      </div>

                      {/* Referral Code */}
                      {promoter.referralCode && (
                        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-900">Referral Code:</span>
                            <span className="font-mono text-sm text-green-700">{promoter.referralCode}</span>
                          </div>
                        </div>
                      )}

                      {/* Rejection Reason */}
                      {promoter.applicationStatus === 'rejected' && promoter.applicationNotes && (
                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-xs text-red-700">
                            <strong>Rejection Reason:</strong> {promoter.applicationNotes}
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
                
                {[...Array(Math.min(pagination.totalPages, 10))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setPagination({ ...pagination, currentPage: page })}
                      className={`btn btn-sm ${
                        pagination.currentPage === page 
                          ? 'btn-primary' 
                          : 'btn-secondary'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
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

        {/* Review Modal */}
        {showReviewModal && selectedPromoter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-lg mx-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Review Promoter: {selectedPromoter.displayName}
              </h3>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Display Name:</strong> {selectedPromoter.displayName}
                  </div>
                  <div>
                    <strong>Monthly Traffic:</strong> {formatNumber(selectedPromoter.monthlyTraffic)}
                  </div>
                  <div>
                    <strong>Platforms:</strong> {selectedPromoter.platforms.length}
                  </div>
                  {selectedPromoter.bio && (
                    <div>
                      <strong>Bio:</strong> {selectedPromoter.bio}
                    </div>
                  )}
                  <div>
                    <strong>Contact:</strong> {selectedPromoter.userId?.email}
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmitReview}>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Application Decision *</label>
                    <select
                      className="form-select"
                      value={reviewForm.status}
                      onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                      required
                    >
                      <option value="">Select decision</option>
                      <option value="approved">Approve Application</option>
                      <option value="rejected">Reject Application</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Notes</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      placeholder="Add notes about your decision..."
                      value={reviewForm.notes}
                      onChange={(e) => setReviewForm({ ...reviewForm, notes: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={`flex-1 btn ${
                      reviewForm.status === 'approved' ? 'btn-success' : 
                      reviewForm.status === 'rejected' ? 'btn-danger' : 'btn-primary'
                    }`}
                  >
                    {reviewForm.status === 'approved' ? 'Approve' : 
                     reviewForm.status === 'rejected' ? 'Reject' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

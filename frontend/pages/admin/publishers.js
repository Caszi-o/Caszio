import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BuildingOfficeIcon,
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
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { ProtectedRoute } from '../../lib/auth';
import { adminAPI } from '../../lib/api';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function AdminPublishers() {
  const [publishers, setPublishers] = useState([]);
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
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    status: '',
    notes: ''
  });

  useEffect(() => {
    loadPublishers();
  }, [filters, pagination.currentPage]);

  const loadPublishers = async () => {
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

      const response = await adminAPI.getPublishers(params);
      setPublishers(response.data.data.publishers);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Failed to load publishers:', error);
      toast.error('Failed to load publishers');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewPublisher = (publisher) => {
    setSelectedPublisher(publisher);
    setReviewForm({
      status: '',
      notes: ''
    });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!reviewForm.status) {
      toast.error('Please select a verification status');
      return;
    }

    try {
      await adminAPI.verifyPublisher(selectedPublisher._id, reviewForm);
      toast.success(`Publisher ${reviewForm.status} successfully`);
      setShowReviewModal(false);
      loadPublishers();
    } catch (error) {
      console.error('Failed to review publisher:', error);
      toast.error('Failed to review publisher');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-success-600 bg-success-100';
      case 'pending': return 'text-warning-600 bg-warning-100';
      case 'rejected': return 'text-danger-600 bg-danger-100';
      case 'under_review': return 'text-primary-600 bg-primary-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return CheckCircleIcon;
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
        <title>Publisher Management - Admin Dashboard - Casyoro</title>
        <meta name="description" content="Review and manage publisher accounts" />
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
                <h1 className="text-xl font-semibold text-gray-900">Publisher Management</h1>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Total Publishers: {pagination.totalItems}
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
                      placeholder="Search publishers..."
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
                    <option value="verified">Verified</option>
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

          {/* Publishers Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="spinner spinner-lg"></div>
            </div>
          ) : publishers.length === 0 ? (
            <motion.div className="text-center py-12" variants={fadeInUp}>
              <BuildingOfficeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No publishers found</h3>
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
              {publishers.map((publisher) => {
                const StatusIcon = getStatusIcon(publisher.verificationStatus);
                
                return (
                  <motion.div key={publisher._id} className="card hover:shadow-medium transition-shadow" variants={fadeInUp}>
                    <div className="card-body">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <BuildingOfficeIcon className="w-6 h-6 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 truncate">
                              {publisher.businessName}
                            </h3>
                            <p className="text-sm text-gray-500 capitalize">
                              {publisher.businessType}
                            </p>
                          </div>
                        </div>
                        
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(publisher.verificationStatus)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {publisher.verificationStatus.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Business Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Industry:</span>
                          <span className="ml-2 capitalize">{publisher.industry}</span>
                        </div>
                        
                        {publisher.website && (
                          <div className="flex items-center text-sm text-gray-600">
                            <GlobeAltIcon className="w-4 h-4 mr-1" />
                            <a 
                              href={publisher.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-700 truncate"
                            >
                              {publisher.website}
                            </a>
                          </div>
                        )}

                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          <span>Applied: {formatDate(publisher.createdAt)}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {publisher.stats?.totalAds || 0}
                          </div>
                          <div className="text-xs text-gray-500">Ads</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {formatCurrency(publisher.totalSpent || 0)}
                          </div>
                          <div className="text-xs text-gray-500">Spent</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {publisher.qualityScore || 0}
                          </div>
                          <div className="text-xs text-gray-500">Quality</div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">
                            {publisher.userId?.firstName} {publisher.userId?.lastName}
                          </p>
                          <p className="text-gray-600">{publisher.businessEmail}</p>
                          <p className="text-gray-600">{publisher.businessPhone}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <Link 
                          href={`/admin/publishers/${publisher._id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          View Details
                        </Link>

                        {publisher.verificationStatus === 'pending' && (
                          <button
                            onClick={() => handleReviewPublisher(publisher)}
                            className="btn btn-sm btn-primary"
                          >
                            Review
                          </button>
                        )}

                        {publisher.verificationStatus === 'verified' && (
                          <Link 
                            href={`/admin/publishers/${publisher._id}/ads`}
                            className="text-success-600 hover:text-success-700 text-sm font-medium flex items-center"
                          >
                            <ChartBarIcon className="w-4 h-4 mr-1" />
                            View Ads
                          </Link>
                        )}
                      </div>

                      {/* Rejection Reason */}
                      {publisher.verificationStatus === 'rejected' && publisher.verificationNotes && (
                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-xs text-red-700">
                            <strong>Rejection Reason:</strong> {publisher.verificationNotes}
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
        {showReviewModal && selectedPublisher && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-lg mx-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Review Publisher: {selectedPublisher.businessName}
              </h3>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Business:</strong> {selectedPublisher.businessName}
                  </div>
                  <div>
                    <strong>Type:</strong> {selectedPublisher.businessType}
                  </div>
                  <div>
                    <strong>Industry:</strong> {selectedPublisher.industry}
                  </div>
                  {selectedPublisher.website && (
                    <div>
                      <strong>Website:</strong> 
                      <a 
                        href={selectedPublisher.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 ml-1"
                      >
                        {selectedPublisher.website}
                      </a>
                    </div>
                  )}
                  <div>
                    <strong>Contact:</strong> {selectedPublisher.businessEmail}
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmitReview}>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Verification Decision *</label>
                    <select
                      className="form-select"
                      value={reviewForm.status}
                      onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                      required
                    >
                      <option value="">Select decision</option>
                      <option value="verified">Approve Publisher</option>
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
                      reviewForm.status === 'verified' ? 'btn-success' : 
                      reviewForm.status === 'rejected' ? 'btn-danger' : 'btn-primary'
                    }`}
                  >
                    {reviewForm.status === 'verified' ? 'Approve' : 
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

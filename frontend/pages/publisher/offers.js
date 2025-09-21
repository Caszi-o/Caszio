import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { ProtectedRoute } from '../../lib/auth';
import { publisherAPI } from '../../lib/api';
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
    category: '',
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

      // Mock data for now since API might not be ready
      const mockOffers = [
        {
          _id: '1',
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
          }
        },
        {
          _id: '2',
          title: 'Fashion Week Special',
          description: 'Exclusive deals on fashion items',
          discountType: 'fixed',
          discountValue: 500,
          cashbackPercentage: 3,
          categories: ['fashion'],
          status: 'pending',
          startDate: '2024-02-01',
          endDate: '2024-02-28',
          merchant: {
            name: 'FashionHub',
            logo: null
          },
          metrics: {
            views: 890,
            clicks: 45,
            conversions: 8
          }
        }
      ];

      setOffers(mockOffers);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: mockOffers.length
      });
    } catch (error) {
      console.error('Failed to load offers:', error);
      toast.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (offerId, action) => {
    try {
      // Mock API call
      toast.success(`Offer ${action} successfully`);
      loadOffers();
    } catch (error) {
      console.error('Failed to update offer status:', error);
      toast.error('Failed to update offer status');
    }
  };

  const handleDelete = async (offerId) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        // Mock API call
        toast.success('Offer deleted successfully');
        loadOffers();
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

  return (
    <ProtectedRoute allowedRoles={['publisher']}>
      <Head>
        <title>Manage Offers - Publisher Dashboard</title>
        <meta name="description" content="Create and manage your discount offers" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/publisher/dashboard" className="text-2xl font-bold text-primary-600">
                  Caszio
                </Link>
                <div className="h-6 border-l border-gray-300"></div>
                <h1 className="text-xl font-semibold text-gray-900">Manage Offers</h1>
              </div>

              <Link href="/publisher/offers/create" className="btn btn-primary">
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Offer
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            {/* Stats Overview */}
            <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" variants={fadeInUp}>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TagIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Offers</p>
                    <p className="text-2xl font-bold text-gray-900">{offers.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Offers</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {offers.filter(offer => offer.status === 'active').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <ClockIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {offers.filter(offer => offer.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(offers.reduce((sum, offer) => sum + offer.metrics.views, 0))}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Filters */}
            <motion.div className="bg-white p-6 rounded-lg shadow-sm border mb-6" variants={fadeInUp}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search offers..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="paused">Paused</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="beauty">Beauty</option>
                    <option value="home">Home</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({ status: '', category: '', search: '' })}
                    className="w-full px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Offers List */}
            <motion.div className="bg-white rounded-lg shadow-sm border" variants={fadeInUp}>
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading offers...</p>
                </div>
              ) : offers.length === 0 ? (
                <div className="p-8 text-center">
                  <TagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No offers found</h3>
                  <p className="text-gray-600 mb-6">
                    {Object.values(filters).some(filter => filter) 
                      ? 'No offers match your current filters. Try adjusting your search criteria.'
                      : 'You haven\'t created any offers yet. Create your first offer to get started.'
                    }
                  </p>
                  <Link href="/publisher/offers/create" className="btn btn-primary">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Create Your First Offer
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Offer Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Discount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cashback
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Performance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {offers.map((offer) => {
                        const StatusIcon = getStatusIcon(offer.status);
                        return (
                          <tr key={offer._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                  {offer.merchant?.logo ? (
                                    <img src={offer.merchant.logo} alt={offer.merchant.name} className="w-8 h-8 object-contain" />
                                  ) : (
                                    <span className="text-lg font-bold text-gray-600">
                                      {offer.merchant?.name?.charAt(0) || '?'}
                                    </span>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                                  <div className="text-sm text-gray-500">{offer.description}</div>
                                  <div className="text-xs text-gray-400 capitalize">
                                    {offer.categories?.join(', ')}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {offer.discountType === 'percentage' 
                                  ? `${offer.discountValue}% OFF` 
                                  : `${formatCurrency(offer.discountValue)} OFF`
                                }
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {offer.cashbackPercentage}%
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {offer.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                <div>{formatNumber(offer.metrics.views)} views</div>
                                <div className="text-xs text-gray-500">
                                  {formatNumber(offer.metrics.clicks)} clicks
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <Link
                                  href={`/publisher/offers/${offer._id}`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <EyeIcon className="w-4 h-4" />
                                </Link>
                                <Link
                                  href={`/publisher/offers/${offer._id}/edit`}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                </Link>
                                {offer.status === 'active' ? (
                                  <button
                                    onClick={() => handleStatusChange(offer._id, 'pause')}
                                    className="text-yellow-600 hover:text-yellow-900"
                                  >
                                    <ExclamationTriangleIcon className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleStatusChange(offer._id, 'activate')}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    <CheckCircleIcon className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(offer._id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

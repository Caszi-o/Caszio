import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  BanknotesIcon,
  CalendarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { useAuth, ProtectedRoute } from '../../lib/auth';
import { publisherAPI } from '../../lib/api';
import DashboardContainer from '../../components/Dashboard/DashboardContainer';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

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

export default function PublisherDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await publisherAPI.getDashboard();
      console.log('Publisher dashboard data:', response.data.data);
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Set default data to prevent crashes
      setDashboardData({
        publisher: {
          verificationStatus: 'verified',
          currentPackage: 'Premium',
          packageStatus: 'active'
        },
        recentAds: [],
        activeAdsCount: 0,
        todayMetrics: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          cost: 0
        },
        packageInfo: {
          current: 'Premium',
          status: 'active'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success-600 bg-success-100';
      case 'paused': return 'text-warning-600 bg-warning-100';
      case 'pending_review': return 'text-primary-600 bg-primary-100';
      case 'rejected': return 'text-danger-600 bg-danger-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner spinner-lg"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Publisher Account Required</h2>
          <p className="text-gray-600 mb-6">You need to apply for a publisher account to access this dashboard.</p>
          <Link href="/publisher/apply" className="btn btn-primary">
            Apply for Publisher Account
          </Link>
        </div>
      </div>
    );
  }

  const { 
    publisher = {}, 
    recentAds = [], 
    activeAdsCount = 0, 
    todayMetrics = { impressions: 0, clicks: 0, conversions: 0, cost: 0 }, 
    packageInfo = { current: 'Premium', status: 'active' } 
  } = dashboardData || {};

  // Chart data
  const performanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Impressions',
        data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'Clicks',
        data: [65, 89, 120, 200, 90, 150, 180],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  };

  const adStatusData = {
    labels: ['Active', 'Paused', 'Pending Review', 'Rejected'],
    datasets: [
      {
        data: [12, 3, 2, 1],
        backgroundColor: [
          '#22c55e',
          '#f59e0b',
          '#3b82f6',
          '#ef4444'
        ],
        borderWidth: 0
      }
    ]
  };

  const spendingData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Ad Spend',
        data: [12000, 15000, 18000, 14000],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4
      }
    ]
  };

  const quickActions = [
    {
      title: 'Create Campaign',
      description: 'Launch a new ad campaign',
      icon: PlusIcon,
      href: '/publisher/ads/create',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Manage Offers',
      description: 'Create and manage discount offers',
      icon: TagIcon,
      href: '/publisher/offers',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Ad Manager',
      description: 'Manage all your campaigns',
      icon: EyeIcon,
      href: '/publisher/ads',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Billing',
      description: 'Manage payments & budget',
      icon: BanknotesIcon,
      href: '/publisher/wallet',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['publisher']}>
      <DashboardContainer
        title="Ad Campaign Manager"
        subtitle="Create, manage, and optimize your advertising campaigns"
        role="publisher"
        quickActions={quickActions}
      >
          {/* Verification Status */}
          {publisher.verificationStatus !== 'verified' && (
            <motion.div
              className="mb-6 p-4 bg-warning-50 border border-warning-200 rounded-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-warning-600 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-warning-800">
                      Account Verification {publisher.verificationStatus === 'pending' ? 'Pending' : 'Required'}
                    </h3>
                    <p className="text-sm text-warning-700 mt-1">
                      {publisher.verificationStatus === 'pending' 
                        ? 'Your account is under review. You can create draft ads but cannot publish them until verified.'
                        : 'Complete your account verification to start publishing ads.'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  {publisher.verificationStatus !== 'pending' && (
                    <Link 
                      href="/publisher/verify" 
                      className="btn btn-warning btn-sm"
                    >
                      Verify Account
                    </Link>
                  )}
                  <Link 
                    href="/publisher/profile" 
                    className="btn btn-outline-warning btn-sm"
                  >
                    Update Profile
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Overview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.div className="card" variants={fadeInUp}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Impressions</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatNumber(todayMetrics.impressions)}
                    </p>
                    <div className="flex items-center mt-1">
                      <TrendingUpIcon className="w-4 h-4 text-success-500 mr-1" />
                      <span className="text-sm text-success-600">+12%</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <EyeIcon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="card" variants={fadeInUp}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Clicks</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatNumber(todayMetrics.clicks)}
                    </p>
                    <div className="flex items-center mt-1">
                      <TrendingUpIcon className="w-4 h-4 text-success-500 mr-1" />
                      <span className="text-sm text-success-600">+8%</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                    <CursorArrowRaysIcon className="w-6 h-6 text-success-600" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="card" variants={fadeInUp}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Spend</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(todayMetrics.cost)}
                    </p>
                    <div className="flex items-center mt-1">
                      <TrendingDownIcon className="w-4 h-4 text-danger-500 mr-1" />
                      <span className="text-sm text-danger-600">-5%</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                    <BanknotesIcon className="w-6 h-6 text-warning-600" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="card" variants={fadeInUp}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Ads</p>
                    <p className="text-3xl font-bold text-gray-900">{activeAdsCount}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-600">
                        of {packageInfo.features?.adsPerMonth || 'unlimited'} allowed
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Performance Chart */}
            <motion.div className="lg:col-span-2 card" variants={fadeInUp}>
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="form-select text-sm"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                </div>
              </div>
              <div className="card-body">
                <div style={{ height: '300px' }}>
                  {/* Temporarily commented out Line chart for debugging */}
                  <div className="text-center text-gray-500 py-20">Chart temporarily disabled for debugging</div>
                </div>
              </div>
            </motion.div>

            {/* Ad Status Distribution */}
            <motion.div className="card" variants={fadeInUp}>
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">Ad Status</h2>
              </div>
              <div className="card-body">
                <div style={{ height: '200px' }}>
{/* Temporarily commented out Doughnut chart for debugging */}
                  <div className="text-center text-gray-500 py-16">Chart temporarily disabled for debugging</div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Recent Ads */}
            <motion.div className="card" variants={fadeInUp}>
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Ads</h2>
                  <Link href="/publisher/ads" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {recentAds.map((ad) => {
                    const StatusIcon = getStatusIcon(ad.status) || CheckCircleIcon;
                    return (
                      <div key={ad._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{ad.title}</h3>
                          <p className="text-sm text-gray-600 capitalize">{ad.type} Ad</p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-xs text-gray-500">
                              {formatNumber(ad.metrics?.impressions || 0)} impressions
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatNumber(ad.metrics?.clicks || 0)} clicks
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatCurrency(ad.metrics?.cost || 0)} spent
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ad.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {ad.status.replace('_', ' ')}
                          </span>
                          <Link href={`/publisher/ads/${ad._id}`} className="text-primary-600 hover:text-primary-700">
                            <EyeIcon className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {recentAds.length === 0 && (
                  <div className="text-center py-8">
                    <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No ads yet</h3>
                    <p className="text-gray-600 mb-4">Create your first ad campaign to start reaching customers.</p>
                    <Link href="/publisher/ads/create" className="btn btn-primary">
                      Create Your First Ad
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Monthly Spending */}
            <motion.div className="card" variants={fadeInUp}>
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">Monthly Spending</h2>
              </div>
              <div className="card-body">
                <div style={{ height: '250px' }}>
{/* Temporarily commented out Bar chart for debugging */}
                  <div className="text-center text-gray-500 py-20">Chart temporarily disabled for debugging</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4" variants={staggerChildren}>
            <motion.div variants={fadeInUp}>
              <Link href="/publisher/ads/create" className="block p-6 bg-gradient-primary rounded-lg text-white hover:shadow-lg transition-shadow">
                <PlusIcon className="w-8 h-8 mb-3" />
                <h3 className="font-semibold mb-2">Create New Ad</h3>
                <p className="text-sm opacity-90">Launch a new advertising campaign</p>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Link href="/publisher/wallet" className="block p-6 bg-gradient-success rounded-lg text-white hover:shadow-lg transition-shadow">
                <BanknotesIcon className="w-8 h-8 mb-3" />
                <h3 className="font-semibold mb-2">Manage Wallet</h3>
                <p className="text-sm opacity-90">Top up funds and view transactions</p>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Link href="/publisher/analytics" className="block p-6 bg-gradient-warning rounded-lg text-white hover:shadow-lg transition-shadow">
                <ChartBarIcon className="w-8 h-8 mb-3" />
                <h3 className="font-semibold mb-2">View Analytics</h3>
                <p className="text-sm opacity-90">Detailed performance insights</p>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Link href="/publisher/offers" className="block p-6 bg-gradient-info rounded-lg text-white hover:shadow-lg transition-shadow">
                <TagIcon className="w-8 h-8 mb-3" />
                <h3 className="font-semibold mb-2">Manage Offers</h3>
                <p className="text-sm opacity-90">Create and manage discount offers</p>
              </Link>
            </motion.div>
        </motion.div>
      </DashboardContainer>
    </ProtectedRoute>
  );
}

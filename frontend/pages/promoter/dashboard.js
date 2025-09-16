import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CurrencyRupeeIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon,
  ArrowArrowTrendingDownIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  BanknotesIcon,
  ChartBarIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useAuth, ProtectedRoute } from '../../lib/auth';
import { promoterAPI } from '../../lib/api';
import DashboardContainer from '../../components/Dashboard/DashboardContainer';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
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

export default function PromoterDashboard() {
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
      const response = await promoterAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-success-600 bg-success-100';
      case 'pending': return 'text-warning-600 bg-warning-100';
      case 'under_review': return 'text-primary-600 bg-primary-100';
      case 'rejected': return 'text-danger-600 bg-danger-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Promoter Account Required</h2>
          <p className="text-gray-600 mb-6">You need to apply for a promoter account to access this dashboard.</p>
          <Link href="/promoter/apply" className="btn btn-primary">
            Apply for Promoter Account
          </Link>
        </div>
      </div>
    );
  }

  const { promoter, todayEarnings, availableAds, recentEarnings } = dashboardData;

  // Chart data
  const earningsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Earnings',
        data: [45, 78, 120, 95, 134, 89, 156],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  };

  const trafficSourceData = {
    labels: ['Website', 'Social Media', 'Email', 'Direct'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444'
        ],
        borderWidth: 0
      }
    ]
  };

  const clickData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Clicks',
        data: [320, 450, 380, 420],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4
      },
      {
        label: 'Conversions',
        data: [25, 38, 31, 35],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderRadius: 4
      }
    ]
  };

  const quickActions = [
    {
      title: 'Active Promotions',
      description: 'View your current campaigns',
      icon: EyeIcon,
      href: '/promoter/campaigns',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'My Earnings',
      description: 'Track income and withdraw',
      icon: BanknotesIcon,
      href: '/promoter/earnings',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Content Tools',
      description: 'Generate scripts and content',
      icon: CodeBracketIcon,
      href: '/promoter/tools',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Analytics',
      description: 'Track performance metrics',
      icon: ChartBarIcon,
      href: '/promoter/analytics',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['promoter']}>
      <DashboardContainer
        title="Influencer Hub"
        subtitle="Promote brands and earn money from your content"
        role="promoter"
        quickActions={quickActions}
      >
          {/* Application Status */}
          {promoter.applicationStatus !== 'approved' && (
            <motion.div
              className="mb-6 p-4 bg-warning-50 border border-warning-200 rounded-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DocumentTextIcon className="w-5 h-5 text-warning-600 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-warning-800">
                      Application Status: {promoter.applicationStatus.replace('_', ' ')}
                    </h3>
                    <p className="text-sm text-warning-700 mt-1">
                      {promoter.applicationStatus === 'pending' 
                        ? 'Your application is under review. You will be notified once approved.'
                        : promoter.applicationStatus === 'under_review'
                        ? 'Our team is reviewing your application. This usually takes 24-48 hours.'
                        : 'Please contact support for more information about your application status.'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  {promoter.applicationStatus === 'pending' && (
                    <Link 
                      href="/promoter/apply" 
                      className="btn btn-warning btn-sm"
                    >
                      Complete Application
                    </Link>
                  )}
                  <Link 
                    href="/promoter/profile" 
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
                    <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(todayEarnings.totalEarnings)}
                    </p>
                    <div className="flex items-center mt-1">
                      <ArrowTrendingUpIcon className="w-4 h-4 text-success-500 mr-1" />
                      <span className="text-sm text-success-600">+15%</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                    <CurrencyRupeeIcon className="w-6 h-6 text-success-600" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="card" variants={fadeInUp}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(promoter.earnings.totalEarnings)}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-600">
                        Available: {formatCurrency(promoter.earnings.currentBalance)}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <BanknotesIcon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="card" variants={fadeInUp}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatNumber(promoter.stats.totalClicks)}
                    </p>
                    <div className="flex items-center mt-1">
                      <ArrowTrendingUpIcon className="w-4 h-4 text-success-500 mr-1" />
                      <span className="text-sm text-success-600">+8%</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                    <CursorArrowRaysIcon className="w-6 h-6 text-warning-600" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="card" variants={fadeInUp}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Quality Score</p>
                    <p className="text-3xl font-bold text-gray-900">{promoter.qualityScore}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-600">
                        {promoter.qualityScore >= 80 ? 'Excellent' : 
                         promoter.qualityScore >= 60 ? 'Good' : 'Needs Improvement'}
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
            {/* Earnings Chart */}
            <motion.div className="lg:col-span-2 card" variants={fadeInUp}>
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Earnings Overview</h2>
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
                  <Line
                    data={earningsData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return formatCurrency(value);
                            }
                          }
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Traffic Sources */}
            <motion.div className="card" variants={fadeInUp}>
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">Traffic Sources</h2>
              </div>
              <div className="card-body">
                <div style={{ height: '200px' }}>
                  <Doughnut
                    data={trafficSourceData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Available Ads */}
            <motion.div className="card" variants={fadeInUp}>
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Available Ads</h2>
                  <Link href="/promoter/scripts" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {availableAds.slice(0, 5).map((ad) => (
                    <div key={ad._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{ad.title}</h3>
                        <p className="text-sm text-gray-600 capitalize">{ad.type} Ad</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-xs text-gray-500">
                            CPC: {formatCurrency(ad.bidding.amount)}
                          </span>
                          <span className="text-xs text-gray-500">
                            Publisher: {ad.publisherId.businessName}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-success-600">
                          Earn: {formatCurrency(ad.bidding.amount * 0.7)}/click
                        </div>
                        <Link 
                          href={`/promoter/scripts?ad=${ad._id}`}
                          className="text-xs text-primary-600 hover:text-primary-700"
                        >
                          Get Script
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                
                {availableAds.length === 0 && (
                  <div className="text-center py-8">
                    <CodeBracketIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No ads available</h3>
                    <p className="text-gray-600 mb-4">Check back later for new advertising opportunities.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Earnings */}
            <motion.div className="card" variants={fadeInUp}>
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Earnings</h2>
                  <Link href="/promoter/earnings" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {recentEarnings.map((earning) => (
                    <div key={earning._id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                          <CurrencyRupeeIcon className="w-4 h-4 text-success-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{earning.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(earning.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-success-600">
                          +{formatCurrency(earning.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {recentEarnings.length === 0 && (
                  <div className="text-center py-8">
                    <BanknotesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No earnings yet</h3>
                    <p className="text-gray-600 mb-4">Start promoting ads to earn money.</p>
                    <Link href="/promoter/scripts" className="btn btn-primary btn-sm">
                      Get Ad Scripts
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Performance Chart */}
          <motion.div className="mt-8 card" variants={fadeInUp}>
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Performance Metrics</h2>
            </div>
            <div className="card-body">
              <div style={{ height: '300px' }}>
                <Bar
                  data={clickData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </motion.div>
      </DashboardContainer>
    </ProtectedRoute>
  );
}

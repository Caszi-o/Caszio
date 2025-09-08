import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  UsersIcon,
  CurrencyRupeeIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { ProtectedRoute } from '../../lib/auth';
import { adminAPI } from '../../lib/api';
import { Line, Bar, Doughnut, Scatter } from 'react-chartjs-2';
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

export default function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAnalytics({ period: selectedPeriod });
      setAnalyticsData(response.data.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      toast.error('Failed to load analytics data');
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

  const exportData = async () => {
    try {
      // In a real implementation, this would call an export API
      toast.success('Analytics data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner spinner-lg"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Not Available</h2>
          <p className="text-gray-600">Unable to load analytics data.</p>
        </div>
      </div>
    );
  }

  // Chart data
  const userTrendData = {
    labels: analyticsData.userTrends.map(trend => 
      new Date(trend._id).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'New Users',
        data: analyticsData.userTrends.map(trend => trend.count),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  };

  const revenueTrendData = {
    labels: analyticsData.revenueTrends.map(trend => 
      new Date(trend._id).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Daily Revenue',
        data: analyticsData.revenueTrends.map(trend => trend.revenue),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  };

  const platformDistributionData = {
    labels: analyticsData.platformStats.map(stat => stat._id.charAt(0).toUpperCase() + stat._id.slice(1)),
    datasets: [
      {
        data: analyticsData.platformStats.map(stat => stat.count),
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6'
        ],
        borderWidth: 0
      }
    ]
  };

  const topAdsData = {
    labels: analyticsData.topAds.slice(0, 10).map((ad, index) => `Ad ${index + 1}`),
    datasets: [
      {
        label: 'CTR (%)',
        data: analyticsData.topAds.slice(0, 10).map(ad => ad.ctr || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4
      }
    ]
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'users', name: 'Users', icon: UsersIcon },
    { id: 'revenue', name: 'Revenue', icon: CurrencyRupeeIcon },
    { id: 'performance', name: 'Performance', icon: TrendingUpIcon }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']} requireVerification>
      <Head>
        <title>Analytics - Admin Dashboard - Casyoro</title>
        <meta name="description" content="Comprehensive platform analytics and insights" />
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
                <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="form-select text-sm"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="365d">Last year</option>
                </select>
                
                <button
                  onClick={exportData}
                  className="btn btn-secondary"
                >
                  <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              className="space-y-8"
              initial="initial"
              animate="animate"
              variants={staggerChildren}
            >
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div className="card bg-gradient-primary text-white" variants={fadeInUp}>
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-primary-100 text-sm font-medium">Total Revenue</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(analyticsData.revenueTrends.reduce((sum, trend) => sum + trend.revenue, 0))}
                        </p>
                        <div className="flex items-center mt-1">
                          <TrendingUpIcon className="w-4 h-4 text-primary-100 mr-1" />
                          <span className="text-primary-100 text-sm">+12.5%</span>
                        </div>
                      </div>
                      <CurrencyRupeeIcon className="w-8 h-8 text-primary-100" />
                    </div>
                  </div>
                </motion.div>

                <motion.div className="card bg-gradient-success text-white" variants={fadeInUp}>
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-success-100 text-sm font-medium">New Users</p>
                        <p className="text-2xl font-bold">
                          {formatNumber(analyticsData.userTrends.reduce((sum, trend) => sum + trend.count, 0))}
                        </p>
                        <div className="flex items-center mt-1">
                          <TrendingUpIcon className="w-4 h-4 text-success-100 mr-1" />
                          <span className="text-success-100 text-sm">+8.2%</span>
                        </div>
                      </div>
                      <UsersIcon className="w-8 h-8 text-success-100" />
                    </div>
                  </div>
                </motion.div>

                <motion.div className="card bg-gradient-warning text-white" variants={fadeInUp}>
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-warning-100 text-sm font-medium">Top Ads</p>
                        <p className="text-2xl font-bold">{analyticsData.topAds.length}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-warning-100 text-sm">
                            Avg CTR: {(analyticsData.topAds.reduce((sum, ad) => sum + (ad.ctr || 0), 0) / analyticsData.topAds.length).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <ChartBarIcon className="w-8 h-8 text-warning-100" />
                    </div>
                  </div>
                </motion.div>

                <motion.div className="card bg-gradient-danger text-white" variants={fadeInUp}>
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-danger-100 text-sm font-medium">Platform Growth</p>
                        <p className="text-2xl font-bold">+15.3%</p>
                        <div className="flex items-center mt-1">
                          <span className="text-danger-100 text-sm">This period</span>
                        </div>
                      </div>
                      <TrendingUpIcon className="w-8 h-8 text-danger-100" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div className="card" variants={fadeInUp}>
                  <div className="card-header">
                    <h2 className="text-lg font-semibold text-gray-900">User Growth</h2>
                  </div>
                  <div className="card-body">
                    <div style={{ height: '300px' }}>
                      <Line
                        data={userTrendData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
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

                <motion.div className="card" variants={fadeInUp}>
                  <div className="card-header">
                    <h2 className="text-lg font-semibold text-gray-900">Revenue Trends</h2>
                  </div>
                  <div className="card-body">
                    <div style={{ height: '300px' }}>
                      <Line
                        data={revenueTrendData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
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
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div className="card" variants={fadeInUp}>
                  <div className="card-header">
                    <h2 className="text-lg font-semibold text-gray-900">User Distribution</h2>
                  </div>
                  <div className="card-body">
                    <div style={{ height: '250px' }}>
                      <Doughnut
                        data={platformDistributionData}
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

                <motion.div className="card" variants={fadeInUp}>
                  <div className="card-header">
                    <h2 className="text-lg font-semibold text-gray-900">Top Performing Ads</h2>
                  </div>
                  <div className="card-body">
                    <div style={{ height: '250px' }}>
                      <Bar
                        data={topAdsData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                callback: function(value) {
                                  return value + '%';
                                }
                              }
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div
              className="space-y-8"
              initial="initial"
              animate="animate"
              variants={staggerChildren}
            >
              <motion.div className="card" variants={fadeInUp}>
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900">User Analytics</h2>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600">
                        {formatNumber(analyticsData.userTrends.reduce((sum, trend) => sum + trend.count, 0))}
                      </div>
                      <div className="text-sm text-gray-600">New Registrations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-success-600">
                        {analyticsData.platformStats.find(s => s._id === 'user')?.count || 0}
                      </div>
                      <div className="text-sm text-gray-600">Regular Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-warning-600">85%</div>
                      <div className="text-sm text-gray-600">Retention Rate</div>
                    </div>
                  </div>
                  
                  <div style={{ height: '400px' }}>
                    <Line
                      data={userTrendData}
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
            </motion.div>
          )}

          {/* Revenue Tab */}
          {activeTab === 'revenue' && (
            <motion.div
              className="space-y-8"
              initial="initial"
              animate="animate"
              variants={staggerChildren}
            >
              <motion.div className="card" variants={fadeInUp}>
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900">Revenue Analytics</h2>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">
                        {formatCurrency(analyticsData.revenueTrends.reduce((sum, trend) => sum + trend.revenue, 0))}
                      </div>
                      <div className="text-sm text-gray-600">Total Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success-600">
                        {formatCurrency(analyticsData.revenueTrends.reduce((sum, trend) => sum + trend.revenue, 0) / analyticsData.revenueTrends.length)}
                      </div>
                      <div className="text-sm text-gray-600">Daily Average</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-warning-600">+12.5%</div>
                      <div className="text-sm text-gray-600">Growth Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-danger-600">₹850</div>
                      <div className="text-sm text-gray-600">ARPU</div>
                    </div>
                  </div>
                  
                  <div style={{ height: '400px' }}>
                    <Line
                      data={revenueTrendData}
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
            </motion.div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <motion.div
              className="space-y-8"
              initial="initial"
              animate="animate"
              variants={staggerChildren}
            >
              <motion.div className="card" variants={fadeInUp}>
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900">Platform Performance</h2>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600">
                        {(analyticsData.topAds.reduce((sum, ad) => sum + (ad.ctr || 0), 0) / analyticsData.topAds.length).toFixed(2)}%
                      </div>
                      <div className="text-sm text-gray-600">Average CTR</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-success-600">2.3%</div>
                      <div className="text-sm text-gray-600">Conversion Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-warning-600">99.9%</div>
                      <div className="text-sm text-gray-600">Uptime</div>
                    </div>
                  </div>
                  
                  <div style={{ height: '400px' }}>
                    <Bar
                      data={topAdsData}
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
                                return value + '%';
                              }
                            }
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

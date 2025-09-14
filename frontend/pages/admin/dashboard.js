import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  MegaphoneIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAuth, ProtectedRoute } from '../../lib/auth';
import { adminAPI } from '../../lib/api';
import DashboardContainer from '../../components/Dashboard/DashboardContainer';
import SafeChart from '../../components/SafeChart';
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

export default function AdminDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboard();
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h2>
          <p className="text-gray-600">You need admin privileges to access this dashboard.</p>
        </div>
      </div>
    );
  }

  const { overview, recentActivities, growth } = dashboardData;

  // Chart data
  const userGrowthData = {
    labels: growth.period,
    datasets: [
      {
        label: 'New Users',
        data: growth.period.map(date => {
          const found = growth.users.find(u => u._id === date);
          return found ? found.count : 0;
        }),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  };

  const revenueGrowthData = {
    labels: growth.period,
    datasets: [
      {
        label: 'Daily Revenue',
        data: growth.period.map(date => {
          const found = growth.revenue.find(r => r._id === date);
          return found ? found.revenue : 0;
        }),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  };

  const userDistributionData = {
    labels: ['Users', 'Publishers', 'Promoters', 'Admins'],
    datasets: [
      {
        data: [
          overview.users.total - overview.publishers.total - overview.promoters.total,
          overview.publishers.total,
          overview.promoters.total,
          5 // Assuming 5 admins
        ],
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

  const adStatusData = {
    labels: ['Active', 'Pending Review', 'Rejected'],
    datasets: [
      {
        label: 'Ads',
        data: [overview.ads.active, overview.ads.pending, overview.ads.total - overview.ads.active - overview.ads.pending],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderRadius: 4
      }
    ]
  };

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage all user accounts',
      icon: UsersIcon,
      href: '/admin/users',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Publisher Approvals',
      description: 'Review & approve publishers',
      icon: BuildingOfficeIcon,
      href: '/admin/publishers',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Promoter Approvals',
      description: 'Review & approve promoters',
      icon: UserGroupIcon,
      href: '/admin/promoters',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'System Analytics',
      description: 'Platform performance metrics',
      icon: ChartBarIcon,
      href: '/admin/analytics',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardContainer
        title="System Control Center"
        subtitle="Manage users, campaigns, and platform operations"
        role="admin"
        quickActions={quickActions}
      >
          {/* Overview Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.div className="card" variants={fadeInUp}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatNumber(overview.users.total)}
                    </p>
                    <div className="flex items-center mt-1">
                      <TrendingUpIcon className="w-4 h-4 text-success-500 mr-1" />
                      <span className="text-sm text-success-600">+{overview.users.newToday} today</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="card" variants={fadeInUp}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Publishers</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatNumber(overview.publishers.total)}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-warning-600">
                        {overview.publishers.pending} pending
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                    <BuildingOfficeIcon className="w-6 h-6 text-success-600" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="card" variants={fadeInUp}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Promoters</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatNumber(overview.promoters.total)}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-warning-600">
                        {overview.promoters.pending} pending
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                    <UserGroupIcon className="w-6 h-6 text-warning-600" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="card" variants={fadeInUp}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(overview.financials.monthlyRevenue)}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-600">
                        Total: {formatCurrency(overview.financials.totalRevenue)}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CurrencyRupeeIcon className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Secondary Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            variants={staggerChildren}
          >
            <motion.div className="card bg-gradient-primary text-white" variants={fadeInUp}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-100 text-sm font-medium">Active Ads</p>
                    <p className="text-3xl font-bold">{overview.ads.active}</p>
                    <p className="text-primary-100 text-sm mt-1">
                      {overview.ads.pending} awaiting review
                    </p>
                  </div>
                  <MegaphoneIcon className="w-8 h-8 text-primary-100" />
                </div>
              </div>
            </motion.div>

            <motion.div className="card bg-gradient-success text-white" variants={fadeInUp}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-success-100 text-sm font-medium">Verified Users</p>
                    <p className="text-3xl font-bold">{overview.users.verified}</p>
                    <p className="text-success-100 text-sm mt-1">
                      {((overview.users.verified / overview.users.total) * 100).toFixed(1)}% verification rate
                    </p>
                  </div>
                  <CheckCircleIcon className="w-8 h-8 text-success-100" />
                </div>
              </div>
            </motion.div>

            <motion.div className="card bg-gradient-warning text-white" variants={fadeInUp}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-warning-100 text-sm font-medium">Total Cashback</p>
                    <p className="text-3xl font-bold">
                      {formatCurrency(overview.financials.totalCashback)}
                    </p>
                    <p className="text-warning-100 text-sm mt-1">Paid to users</p>
                  </div>
                  <CurrencyRupeeIcon className="w-8 h-8 text-warning-100" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Growth Chart */}
            <motion.div className="lg:col-span-2 card" variants={fadeInUp}>
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">User Growth</h2>
              </div>
              <div className="card-body">
                <SafeChart
                  type="line"
                  data={userGrowthData}
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
                  height="300px"
                />
              </div>
            </motion.div>

            {/* User Distribution */}
            <motion.div className="card" variants={fadeInUp}>
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">User Distribution</h2>
              </div>
              <div className="card-body">
                <SafeChart
                  type="doughnut"
                  data={userDistributionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                  height="200px"
                />
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Revenue Growth */}
            <motion.div className="card" variants={fadeInUp}>
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">Revenue Growth</h2>
              </div>
              <div className="card-body">
                <SafeChart
                  type="line"
                  data={revenueGrowthData}
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
                  height="250px"
                />
              </div>
            </motion.div>

            {/* Ad Status */}
            <motion.div className="card" variants={fadeInUp}>
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">Ad Status Overview</h2>
              </div>
              <div className="card-body">
                <SafeChart
                  type="bar"
                  data={adStatusData}
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
                  height="250px"
                />
              </div>
            </motion.div>
          </div>

          {/* Recent Activities */}
          <motion.div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8" variants={staggerChildren}>
            {/* Recent Users */}
            <motion.div className="card" variants={fadeInUp}>
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
                  <Link href="/admin/users" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {recentActivities.users.map((user) => (
                    <div key={user._id} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <span className={`badge ${
                          user.role === 'admin' ? 'badge-danger' :
                          user.role === 'publisher' ? 'badge-success' :
                          user.role === 'promoter' ? 'badge-warning' : 'badge-primary'
                        }`}>
                          {user.role}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Recent Transactions */}
            <motion.div className="card" variants={fadeInUp}>
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                  <Link href="/admin/transactions" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {recentActivities.transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction._id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.amount > 0 ? 'bg-success-100' : 'bg-danger-100'
                        }`}>
                          <CurrencyRupeeIcon className={`w-4 h-4 ${
                            transaction.amount > 0 ? 'text-success-600' : 'text-danger-600'
                          }`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.userId.firstName} {transaction.userId.lastName}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {transaction.type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          transaction.amount > 0 ? 'text-success-600' : 'text-danger-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
      </DashboardContainer>
    </ProtectedRoute>
  );
}

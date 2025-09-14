import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CurrencyRupeeIcon,
  BanknotesIcon,
  ArrowDownIcon,
  CalendarIcon,
  FunnelIcon,
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { ProtectedRoute } from '../../lib/auth';
import { promoterAPI } from '../../lib/api';
import { Line, Bar } from 'react-chartjs-2';
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

export default function PromoterEarnings() {
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    period: '30d',
    type: ''
  });
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank_transfer');

  useEffect(() => {
    loadEarnings();
  }, [filters]);

  const loadEarnings = async () => {
    try {
      setLoading(true);
      const response = await promoterAPI.getEarnings(filters);
      setEarningsData(response.data.data);
    } catch (error) {
      console.error('Failed to load earnings:', error);
      toast.error('Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    
    if (!withdrawAmount || parseFloat(withdrawAmount) < 100) {
      toast.error('Minimum withdrawal amount is ₹100');
      return;
    }

    try {
      await promoterAPI.requestWithdrawal({
        amount: parseFloat(withdrawAmount),
        method: withdrawMethod
      });

      toast.success('Withdrawal request submitted successfully!');
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      loadEarnings();

    } catch (error) {
      console.error('Withdrawal failed:', error);
      toast.error('Failed to process withdrawal request');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'ad_revenue': return CurrencyRupeeIcon;
      case 'promoter_payment': return BanknotesIcon;
      default: return CurrencyRupeeIcon;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'ad_revenue': return 'text-success-600';
      case 'promoter_payment': return 'text-primary-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner spinner-lg"></div>
      </div>
    );
  }

  // Chart data
  const earningsChartData = {
    labels: earningsData?.dailyEarnings.map(day => 
      new Date(day._id).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    ) || [],
    datasets: [
      {
        label: 'Daily Earnings',
        data: earningsData?.dailyEarnings.map(day => day.earnings) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  };

  const transactionData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Transactions',
        data: [15, 23, 18, 28],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4
      }
    ]
  };

  return (
    <ProtectedRoute allowedRoles={['promoter']}>
      <Head>
        <title>Earnings - Promoter Dashboard - Casyoro</title>
        <meta name="description" content="Track your earnings and manage withdrawals" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/promoter/dashboard" className="text-2xl font-bold text-primary-600">
                  Casyoro
                </Link>
                <div className="h-6 border-l border-gray-300"></div>
                <h1 className="text-xl font-semibold text-gray-900">Earnings</h1>
              </div>

              <button
                onClick={() => setShowWithdrawModal(true)}
                className="btn btn-primary"
              >
                <ArrowDownIcon className="w-5 h-5 mr-2" />
                Withdraw
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Earnings Overview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.div className="card bg-gradient-success text-white" variants={fadeInUp}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-success-100 text-sm font-medium">Total Earnings</p>
                    <p className="text-3xl font-bold">
                      {formatCurrency(earningsData?.summary.totalEarnings || 0)}
                    </p>
                    <p className="text-success-100 text-sm mt-1">All-time earnings</p>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <CurrencyRupeeIcon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="card bg-gradient-primary text-white" variants={fadeInUp}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-100 text-sm font-medium">Available Balance</p>
                    <p className="text-3xl font-bold">
                      {formatCurrency(earningsData?.summary.totalEarnings - (earningsData?.summary.withdrawnAmount || 0))}
                    </p>
                    <p className="text-primary-100 text-sm mt-1">Ready to withdraw</p>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <BanknotesIcon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="card bg-gradient-warning text-white" variants={fadeInUp}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-warning-100 text-sm font-medium">Total Transactions</p>
                    <p className="text-3xl font-bold">
                      {earningsData?.summary.totalTransactions || 0}
                    </p>
                    <div className="flex items-center mt-1">
                      <TrendingUpIcon className="w-4 h-4 text-warning-100 mr-1" />
                      <span className="text-warning-100 text-sm">+12% this month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="card bg-gradient-danger text-white" variants={fadeInUp}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-danger-100 text-sm font-medium">Average Per Transaction</p>
                    <p className="text-3xl font-bold">
                      {formatCurrency(earningsData?.summary.averageEarning || 0)}
                    </p>
                    <p className="text-danger-100 text-sm mt-1">Per successful action</p>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <TrendingUpIcon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Filters */}
          <motion.div className="mb-6 card" variants={fadeInUp}>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Time Period</label>
                  <select
                    className="form-select"
                    value={filters.period}
                    onChange={(e) => setFilters({ ...filters, period: e.target.value })}
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="365d">Last year</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Transaction Type</label>
                  <select
                    className="form-select"
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  >
                    <option value="">All Types</option>
                    <option value="ad_revenue">Ad Revenue</option>
                    <option value="promoter_payment">Bonus Payments</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({ period: '30d', type: '' })}
                    className="btn btn-secondary w-full"
                  >
                    <FunnelIcon className="w-5 h-5 mr-2" />
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Earnings Chart */}
            <motion.div className="lg:col-span-2 card" variants={fadeInUp}>
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">Earnings Overview</h2>
              </div>
              <div className="card-body">
                <div style={{ height: '300px' }}>
                  <Line
                    data={earningsChartData}
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

            {/* Transaction Volume */}
            <motion.div className="card" variants={fadeInUp}>
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">Transaction Volume</h2>
              </div>
              <div className="card-body">
                <div style={{ height: '200px' }}>
                  <Bar
                    data={transactionData}
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
          </div>

          {/* Recent Earnings */}
          <motion.div className="mt-8 card" variants={fadeInUp}>
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Earnings</h2>
                <Link href="/promoter/withdrawals" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View Withdrawals
                </Link>
              </div>
            </div>
            <div className="card-body">
              {earningsData?.earnings.length === 0 ? (
                <div className="text-center py-8">
                  <CurrencyRupeeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No earnings yet</h3>
                  <p className="text-gray-600 mb-4">Start promoting ads to earn money.</p>
                  <Link href="/promoter/scripts" className="btn btn-primary">
                    Get Ad Scripts
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead className="table-header">
                      <tr>
                        <th className="table-header-cell">Date</th>
                        <th className="table-header-cell">Type</th>
                        <th className="table-header-cell">Description</th>
                        <th className="table-header-cell">Amount</th>
                        <th className="table-header-cell">Status</th>
                      </tr>
                    </thead>
                    <tbody className="table-body">
                      {earningsData?.earnings.map((earning) => {
                        const IconComponent = getTransactionIcon(earning.type);
                        return (
                          <tr key={earning._id}>
                            <td className="table-cell">
                              {new Date(earning.createdAt).toLocaleDateString()}
                            </td>
                            <td className="table-cell">
                              <div className="flex items-center space-x-2">
                                <IconComponent className={`w-4 h-4 ${getTransactionColor(earning.type)}`} />
                                <span className="capitalize">{earning.type.replace('_', ' ')}</span>
                              </div>
                            </td>
                            <td className="table-cell">
                              <span className="text-gray-900">{earning.description}</span>
                              {earning.relatedAdId && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Ad: {earning.relatedAdId.title}
                                </div>
                              )}
                            </td>
                            <td className="table-cell">
                              <span className="font-medium text-success-600">
                                +{formatCurrency(earning.amount)}
                              </span>
                            </td>
                            <td className="table-cell">
                              <span className="badge badge-success">
                                <CheckCircleIcon className="w-3 h-3 mr-1" />
                                Completed
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4" variants={staggerChildren}>
            <motion.div variants={fadeInUp}>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="w-full p-6 bg-gradient-primary rounded-lg text-white hover:shadow-lg transition-shadow text-left"
              >
                <ArrowDownIcon className="w-8 h-8 mb-3" />
                <h3 className="font-semibold mb-2">Request Withdrawal</h3>
                <p className="text-sm opacity-90">Withdraw your earnings to bank account</p>
              </button>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Link
                href="/promoter/scripts"
                className="block w-full p-6 bg-gradient-success rounded-lg text-white hover:shadow-lg transition-shadow"
              >
                <CurrencyRupeeIcon className="w-8 h-8 mb-3" />
                <h3 className="font-semibold mb-2">Earn More</h3>
                <p className="text-sm opacity-90">Get more ad scripts to increase earnings</p>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Link
                href="/promoter/analytics"
                className="block w-full p-6 bg-gradient-warning rounded-lg text-white hover:shadow-lg transition-shadow"
              >
                <ChartBarIcon className="w-8 h-8 mb-3" />
                <h3 className="font-semibold mb-2">View Analytics</h3>
                <p className="text-sm opacity-90">Detailed performance insights</p>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Withdrawal Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Withdrawal</h3>
              
              <form onSubmit={handleWithdraw}>
                <div className="mb-4">
                  <label className="form-label">Amount (₹)</label>
                  <input
                    type="number"
                    min="100"
                    step="1"
                    className="form-input"
                    placeholder="1000"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                  />
                  <p className="form-help">
                    Minimum amount: ₹100 | Available: {formatCurrency(earningsData?.summary.totalEarnings - (earningsData?.summary.withdrawnAmount || 0))}
                  </p>
                </div>

                <div className="mb-6">
                  <label className="form-label">Withdrawal Method</label>
                  <select
                    className="form-select"
                    value={withdrawMethod}
                    onChange={(e) => setWithdrawMethod(e.target.value)}
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1 btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn btn-primary">
                    Request Withdrawal
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

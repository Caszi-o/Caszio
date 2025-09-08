import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CreditCardIcon,
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  CalendarIcon,
  DocumentTextIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { ProtectedRoute } from '../../lib/auth';
import { publisherAPI } from '../../lib/api';
import { Line, Doughnut } from 'react-chartjs-2';
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

export default function PublisherWallet() {
  const [walletData, setWalletData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    loadWalletData();
    loadPayments();
  }, [selectedPeriod]);

  const loadWalletData = async () => {
    try {
      const response = await publisherAPI.getWallet();
      setWalletData(response.data.data);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
      toast.error('Failed to load wallet data');
    }
  };

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await publisherAPI.getPayments({ period: selectedPeriod });
      setPayments(response.data.data.payments);
    } catch (error) {
      console.error('Failed to load payments:', error);
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async (e) => {
    e.preventDefault();
    
    if (!topUpAmount || parseFloat(topUpAmount) < 500) {
      toast.error('Minimum top-up amount is ₹500');
      return;
    }

    try {
      const response = await publisherAPI.topUpWallet({
        amount: parseFloat(topUpAmount),
        paymentMethod
      });

      // In a real implementation, this would redirect to payment gateway
      toast.success('Top-up request created. Redirecting to payment...');
      setShowTopUpModal(false);
      setTopUpAmount('');
      
      // Simulate payment completion for demo
      setTimeout(() => {
        loadWalletData();
        loadPayments();
        toast.success('Payment completed successfully!');
      }, 2000);

    } catch (error) {
      console.error('Top-up failed:', error);
      toast.error('Failed to process top-up request');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success-600 bg-success-100';
      case 'pending': return 'text-warning-600 bg-warning-100';
      case 'failed': return 'text-danger-600 bg-danger-100';
      case 'processing': return 'text-primary-600 bg-primary-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Chart data
  const spendingData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Ad Spend',
        data: [12000, 15000, 18000, 14000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'Top-ups',
        data: [20000, 0, 25000, 0],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  };

  const expenseBreakdown = {
    labels: ['Ad Campaigns', 'Featured Listings', 'Package Fees', 'Other'],
    datasets: [
      {
        data: [65, 20, 10, 5],
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

  if (loading && !walletData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner spinner-lg"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['publisher']} requireVerification>
      <Head>
        <title>Wallet - Publisher Dashboard - Casyoro</title>
        <meta name="description" content="Manage your advertising budget and payments" />
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
                <h1 className="text-xl font-semibold text-gray-900">Wallet</h1>
              </div>

              <button
                onClick={() => setShowTopUpModal(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Funds
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Wallet Overview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.div className="card bg-gradient-primary text-white" variants={fadeInUp}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-100 text-sm font-medium">Current Balance</p>
                    <p className="text-3xl font-bold">
                      {formatCurrency(walletData?.walletBalance || 0)}
                    </p>
                    <p className="text-primary-100 text-sm mt-1">Available for advertising</p>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <BanknotesIcon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="card bg-gradient-success text-white" variants={fadeInUp}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-success-100 text-sm font-medium">Total Spent</p>
                    <p className="text-3xl font-bold">
                      {formatCurrency(walletData?.totalSpent || 0)}
                    </p>
                    <p className="text-success-100 text-sm mt-1">All-time advertising spend</p>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <ArrowUpIcon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="card bg-gradient-warning text-white" variants={fadeInUp}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-warning-100 text-sm font-medium">Next Billing</p>
                    <p className="text-xl font-bold">
                      {walletData?.nextBillingDate 
                        ? new Date(walletData.nextBillingDate).toLocaleDateString()
                        : 'No billing'
                      }
                    </p>
                    <p className="text-warning-100 text-sm mt-1">Package renewal date</p>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Spending Chart */}
            <motion.div className="lg:col-span-2 card" variants={fadeInUp}>
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Spending Overview</h2>
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
                    data={spendingData}
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

            {/* Expense Breakdown */}
            <motion.div className="card" variants={fadeInUp}>
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">Expense Breakdown</h2>
              </div>
              <div className="card-body">
                <div style={{ height: '200px' }}>
                  <Doughnut
                    data={expenseBreakdown}
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

          {/* Recent Transactions */}
          <motion.div className="mt-8 card" variants={fadeInUp}>
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                <Link href="/publisher/payments" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </Link>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="spinner spinner-md"></div>
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-8">
                  <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                  <p className="text-gray-600">Your payment history will appear here once you start using the platform.</p>
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
                      {payments.slice(0, 10).map((payment) => (
                        <tr key={payment._id}>
                          <td className="table-cell">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </td>
                          <td className="table-cell">
                            <span className="capitalize">{payment.type.replace('_', ' ')}</span>
                          </td>
                          <td className="table-cell">
                            <span className="text-gray-900">{payment.description}</span>
                          </td>
                          <td className="table-cell">
                            <span className={`font-medium ${
                              payment.amount > 0 ? 'text-success-600' : 'text-danger-600'
                            }`}>
                              {payment.amount > 0 ? '+' : ''}{formatCurrency(payment.amount)}
                            </span>
                          </td>
                          <td className="table-cell">
                            <span className={`badge ${getPaymentStatusColor(payment.status)}`}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
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
                onClick={() => setShowTopUpModal(true)}
                className="w-full p-6 bg-gradient-primary rounded-lg text-white hover:shadow-lg transition-shadow text-left"
              >
                <PlusIcon className="w-8 h-8 mb-3" />
                <h3 className="font-semibold mb-2">Add Funds</h3>
                <p className="text-sm opacity-90">Top up your wallet to continue advertising</p>
              </button>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Link
                href="/publisher/ads"
                className="block w-full p-6 bg-gradient-success rounded-lg text-white hover:shadow-lg transition-shadow"
              >
                <ChartBarIcon className="w-8 h-8 mb-3" />
                <h3 className="font-semibold mb-2">Manage Campaigns</h3>
                <p className="text-sm opacity-90">View and optimize your ad campaigns</p>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Link
                href="/publisher/payments"
                className="block w-full p-6 bg-gradient-warning rounded-lg text-white hover:shadow-lg transition-shadow"
              >
                <DocumentTextIcon className="w-8 h-8 mb-3" />
                <h3 className="font-semibold mb-2">Payment History</h3>
                <p className="text-sm opacity-90">View detailed transaction history</p>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Top-up Modal */}
        {showTopUpModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Funds to Wallet</h3>
              
              <form onSubmit={handleTopUp}>
                <div className="mb-4">
                  <label className="form-label">Amount (₹)</label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    className="form-input"
                    placeholder="5000"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    required
                  />
                  <p className="form-help">Minimum amount: ₹500</p>
                </div>

                <div className="mb-6">
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="razorpay">Razorpay (Cards, UPI, Net Banking)</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowTopUpModal(false)}
                    className="flex-1 btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn btn-primary">
                    Add Funds
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

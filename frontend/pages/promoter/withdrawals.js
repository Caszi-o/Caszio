import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  BanknotesIcon,
  CalendarIcon,
  FunnelIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { ProtectedRoute } from '../../lib/auth';
import { promoterAPI } from '../../lib/api';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function PromoterWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank_transfer');

  useEffect(() => {
    loadWithdrawals();
  }, [filters, pagination.currentPage]);

  const loadWithdrawals = async () => {
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

      const response = await promoterAPI.getWithdrawals(params);
      setWithdrawals(response.data.data.withdrawals);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Failed to load withdrawals:', error);
      toast.error('Failed to load withdrawals');
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
      loadWithdrawals();

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success-600 bg-success-100';
      case 'pending': return 'text-warning-600 bg-warning-100';
      case 'processing': return 'text-primary-600 bg-primary-100';
      case 'rejected': return 'text-danger-600 bg-danger-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircleIcon;
      case 'pending': return ClockIcon;
      case 'processing': return ClockIcon;
      case 'rejected': return XCircleIcon;
      case 'cancelled': return XCircleIcon;
      default: return ClockIcon;
    }
  };

  const getMethodName = (method) => {
    switch (method) {
      case 'bank_transfer': return 'Bank Transfer';
      case 'upi': return 'UPI';
      case 'crypto': return 'Cryptocurrency';
      default: return method;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['promoter']} requireVerification>
      <Head>
        <title>Withdrawals - Promoter Dashboard - Casyoro</title>
        <meta name="description" content="Track your withdrawal requests and payment history" />
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
                <h1 className="text-xl font-semibold text-gray-900">Withdrawals</h1>
              </div>

              <button
                onClick={() => setShowWithdrawModal(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                New Withdrawal
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <motion.div className="mb-6 card" variants={fadeInUp}>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex items-end">
                  <button
                    onClick={() => setFilters({ status: '' })}
                    className="btn btn-secondary w-full"
                  >
                    <FunnelIcon className="w-5 h-5 mr-2" />
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Withdrawals Table */}
          <motion.div className="card" variants={fadeInUp}>
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Withdrawal History</h2>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="spinner spinner-lg"></div>
                </div>
              ) : withdrawals.length === 0 ? (
                <div className="text-center py-8">
                  <ArrowDownIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No withdrawals yet</h3>
                  <p className="text-gray-600 mb-4">
                    {filters.status ? 'No withdrawals found with the selected filters.' : 'You haven\'t made any withdrawal requests yet.'}
                  </p>
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="btn btn-primary"
                  >
                    Request First Withdrawal
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead className="table-header">
                      <tr>
                        <th className="table-header-cell">Date</th>
                        <th className="table-header-cell">Amount</th>
                        <th className="table-header-cell">Method</th>
                        <th className="table-header-cell">Status</th>
                        <th className="table-header-cell">Processed Date</th>
                        <th className="table-header-cell">Reference</th>
                      </tr>
                    </thead>
                    <tbody className="table-body">
                      {withdrawals.map((withdrawal) => {
                        const StatusIcon = getStatusIcon(withdrawal.status);
                        return (
                          <tr key={withdrawal._id}>
                            <td className="table-cell">
                              <div className="flex items-center space-x-2">
                                <CalendarIcon className="w-4 h-4 text-gray-400" />
                                <span>{new Date(withdrawal.requestedAt).toLocaleDateString()}</span>
                              </div>
                            </td>
                            <td className="table-cell">
                              <span className="font-medium text-gray-900">
                                {formatCurrency(withdrawal.amount)}
                              </span>
                            </td>
                            <td className="table-cell">
                              <span className="text-gray-700">
                                {getMethodName(withdrawal.method)}
                              </span>
                            </td>
                            <td className="table-cell">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(withdrawal.status)}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                              </span>
                            </td>
                            <td className="table-cell">
                              {withdrawal.processedAt ? (
                                <span className="text-gray-700">
                                  {new Date(withdrawal.processedAt).toLocaleDateString()}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="table-cell">
                              {withdrawal.transactionId ? (
                                <span className="font-mono text-xs text-gray-600">
                                  {withdrawal.transactionId}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
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

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <motion.div className="mt-6 flex justify-center" variants={fadeInUp}>
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

          {/* Info Cards */}
          <motion.div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6" variants={fadeInUp}>
            <div className="card bg-gradient-primary text-white">
              <div className="card-body">
                <div className="flex items-center">
                  <BanknotesIcon className="w-8 h-8 mr-3" />
                  <div>
                    <h3 className="font-semibold">Withdrawal Limits</h3>
                    <p className="text-sm opacity-90">Min: ₹100 • Max: ₹50,000</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-success text-white">
              <div className="card-body">
                <div className="flex items-center">
                  <ClockIcon className="w-8 h-8 mr-3" />
                  <div>
                    <h3 className="font-semibold">Processing Time</h3>
                    <p className="text-sm opacity-90">1-3 business days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-warning text-white">
              <div className="card-body">
                <div className="flex items-center">
                  <CalendarIcon className="w-8 h-8 mr-3" />
                  <div>
                    <h3 className="font-semibold">Payment Schedule</h3>
                    <p className="text-sm opacity-90">Weekly on Mondays</p>
                  </div>
                </div>
              </div>
            </div>
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
                    max="50000"
                    step="1"
                    className="form-input"
                    placeholder="1000"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                  />
                  <p className="form-help">Minimum: ₹100 • Maximum: ₹50,000</p>
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

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Withdrawals are processed weekly on Mondays. 
                    It may take 1-3 business days for the amount to reflect in your account.
                  </p>
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

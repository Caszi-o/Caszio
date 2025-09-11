import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  BanknotesIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../lib/auth';
import { walletAPI } from '../lib/api';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Withdraw() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      amount: '',
      method: 'bank',
      bankAccount: '',
      upiId: ''
    }
  });

  const amount = watch('amount');
  const method = watch('method');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    loadWalletData();
  }, [user, router]);

  const loadWalletData = async () => {
    try {
      const [walletResponse, withdrawalsResponse] = await Promise.all([
        walletAPI.getWallet(),
        walletAPI.getWithdrawals()
      ]);
      setWallet(walletResponse.data.data);
      setWithdrawals(withdrawalsResponse.data.data);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await walletAPI.requestWithdrawal(data);
      toast.success('Withdrawal request submitted successfully!');
      reset();
      loadWalletData(); // Refresh data
    } catch (error) {
      console.error('Withdrawal request error:', error);
      toast.error('Failed to submit withdrawal request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const withdrawalMethods = [
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: CreditCardIcon,
      description: 'Transfer to your bank account',
      processingTime: '2-3 business days',
      minAmount: 100
    },
    {
      id: 'upi',
      name: 'UPI Transfer',
      icon: BanknotesIcon,
      description: 'Instant transfer via UPI',
      processingTime: 'Instant',
      minAmount: 50
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner spinner-lg"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Withdraw Funds - Casyoro</title>
        <meta name="description" content="Withdraw your cashback earnings to your bank account or UPI" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/user/dashboard" className="text-gray-400 hover:text-gray-600">
                  <ArrowLeftIcon className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">Withdraw Funds</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Wallet Balance */}
          <motion.div
            className="mb-8"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium mb-1">Available Balance</h2>
                  <p className="text-3xl font-bold">₹{wallet?.balance || 0}</p>
                </div>
                <BanknotesIcon className="w-12 h-12 text-primary-200" />
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Withdrawal Form */}
            <motion.div
              className="lg:col-span-2"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Request Withdrawal</h3>
                  <p className="text-gray-600">Choose your preferred withdrawal method</p>
                </div>
                
                <div className="card-body">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Withdrawal Method */}
                    <div>
                      <label className="form-label">Withdrawal Method *</label>
                      <div className="grid md:grid-cols-2 gap-4">
                        {withdrawalMethods.map((methodOption) => (
                          <label
                            key={methodOption.id}
                            className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                              method === methodOption.id
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              value={methodOption.id}
                              className="sr-only"
                              {...register('method', { required: 'Please select a withdrawal method' })}
                            />
                            <div className="flex items-center space-x-3">
                              <methodOption.icon className="w-8 h-8 text-primary-600" />
                              <div>
                                <h4 className="font-medium text-gray-900">{methodOption.name}</h4>
                                <p className="text-sm text-gray-600">{methodOption.description}</p>
                                <p className="text-xs text-gray-500">Processing: {methodOption.processingTime}</p>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                      {errors.method && (
                        <p className="form-error">{errors.method.message}</p>
                      )}
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="form-label">Withdrawal Amount *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="number"
                          className="form-input pl-8"
                          placeholder="Enter amount"
                          min={method === 'upi' ? 50 : 100}
                          max={wallet?.balance || 0}
                          {...register('amount', {
                            required: 'Amount is required',
                            min: {
                              value: method === 'upi' ? 50 : 100,
                              message: `Minimum amount is ₹${method === 'upi' ? 50 : 100}`
                            },
                            max: {
                              value: wallet?.balance || 0,
                              message: 'Amount cannot exceed available balance'
                            }
                          })}
                        />
                      </div>
                      {errors.amount && (
                        <p className="form-error">{errors.amount.message}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        Available: ₹{wallet?.balance || 0} | Min: ₹{method === 'upi' ? 50 : 100}
                      </p>
                    </div>

                    {/* Bank Account Details */}
                    {method === 'bank' && (
                      <div>
                        <label className="form-label">Bank Account Number *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter your bank account number"
                          {...register('bankAccount', {
                            required: method === 'bank' ? 'Bank account is required' : false,
                            pattern: {
                              value: /^[0-9]{9,18}$/,
                              message: 'Please enter a valid bank account number'
                            }
                          })}
                        />
                        {errors.bankAccount && (
                          <p className="form-error">{errors.bankAccount.message}</p>
                        )}
                      </div>
                    )}

                    {/* UPI ID */}
                    {method === 'upi' && (
                      <div>
                        <label className="form-label">UPI ID *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter your UPI ID (e.g., user@paytm)"
                          {...register('upiId', {
                            required: method === 'upi' ? 'UPI ID is required' : false,
                            pattern: {
                              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/,
                              message: 'Please enter a valid UPI ID'
                            }
                          })}
                        />
                        {errors.upiId && (
                          <p className="form-error">{errors.upiId.message}</p>
                        )}
                      </div>
                    )}

                    {/* Terms and Conditions */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex">
                        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                        <div className="text-sm text-yellow-800">
                          <p className="font-medium mb-1">Important Notes:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Withdrawal requests are processed within 24-48 hours</li>
                            <li>Bank transfers may take 2-3 business days to reflect</li>
                            <li>UPI transfers are usually instant</li>
                            <li>All withdrawals are subject to verification</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full btn btn-primary"
                      disabled={loading || !amount || (wallet?.balance || 0) < (method === 'upi' ? 50 : 100)}
                    >
                      {loading ? (
                        <>
                          <div className="spinner spinner-sm mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        'Request Withdrawal'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>

            {/* Withdrawal History */}
            <motion.div
              className="lg:col-span-1"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Withdrawals</h3>
                </div>
                <div className="card-body">
                  {withdrawals.length > 0 ? (
                    <div className="space-y-4">
                      {withdrawals.slice(0, 5).map((withdrawal) => (
                        <div key={withdrawal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">₹{withdrawal.amount}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(withdrawal.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              withdrawal.status === 'completed' 
                                ? 'bg-success-100 text-success-800'
                                : withdrawal.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {withdrawal.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BanknotesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No withdrawal history</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

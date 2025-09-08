import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CreditCardIcon,
  BanknotesIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  GiftIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useAuth, ProtectedRoute } from '../../lib/auth';
import { userAPI, offersAPI } from '../../lib/api';

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

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    monthlyEarnings: 0,
    pendingCashback: 0,
    totalTransactions: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [featuredOffers, setFeaturedOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, transactionsRes, offersRes] = await Promise.all([
        userAPI.getEarningsStats(),
        userAPI.getRecentTransactions(),
        offersAPI.getFeaturedOffers()
      ]);

      setStats(statsRes.data.data);
      setRecentTransactions(transactionsRes.data.data);
      setFeaturedOffers(offersRes.data.data.slice(0, 4));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Browse Offers',
      description: 'Discover new cashback opportunities',
      icon: GiftIcon,
      href: '/offers',
      color: 'bg-primary-500'
    },
    {
      title: 'View Earnings',
      description: 'Track your cashback history',
      icon: BanknotesIcon,
      href: '/user/earnings',
      color: 'bg-success-500'
    },
    {
      title: 'Link Accounts',
      description: 'Add more payment methods',
      icon: CreditCardIcon,
      href: '/user/accounts',
      color: 'bg-warning-500'
    },
    {
      title: 'Profile Settings',
      description: 'Manage your account',
      icon: ChartBarIcon,
      href: '/user/profile',
      color: 'bg-danger-500'
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['user']}>
      <Head>
        <title>Dashboard - Casyoro</title>
        <meta name="description" content="Your personal cashback dashboard. Track earnings, discover offers, and manage your account." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">Casyoro</span>
                </Link>
                
                <div className="hidden md:flex items-center space-x-6">
                  <Link href="/user/dashboard" className="text-primary-600 font-medium">
                    Dashboard
                  </Link>
                  <Link href="/offers" className="text-gray-600 hover:text-primary-600">
                    Offers
                  </Link>
                  <Link href="/user/earnings" className="text-gray-600 hover:text-primary-600">
                    Earnings
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.firstName}!
                </span>
                <Link href="/user/profile" className="btn btn-primary btn-sm">
                  Profile
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <motion.div
            className="mb-8"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-600">
              Here's your cashback overview and latest opportunities
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="spinner spinner-lg"></div>
            </div>
          ) : (
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerChildren}
            >
              {/* Stats Grid */}
              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" variants={fadeInUp}>
                <div className="card">
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Earnings</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{stats.totalEarnings?.toLocaleString() || '0'}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <BanknotesIcon className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+12% this month</span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">This Month</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{stats.monthlyEarnings?.toLocaleString() || '0'}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                        <ChartBarIcon className="w-6 h-6 text-success-600" />
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-500">
                        Goal: ₹2,000
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Pending</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{stats.pendingCashback?.toLocaleString() || '0'}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                        <ClockIcon className="w-6 h-6 text-warning-600" />
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-500">
                        Processing...
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Transactions</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.totalTransactions || '0'}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <ShoppingBagIcon className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-500">
                        All time
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Transactions */}
                <motion.div className="lg:col-span-2" variants={fadeInUp}>
                  <div className="card">
                    <div className="card-header">
                      <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                      <Link href="/user/earnings" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        View all
                      </Link>
                    </div>
                    <div className="card-body">
                      {recentTransactions.length > 0 ? (
                        <div className="space-y-4">
                          {recentTransactions.map((transaction, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                  <ShoppingBagIcon className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{transaction.merchant}</p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(transaction.date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900">
                                  ₹{transaction.amount.toLocaleString()}
                                </p>
                                <p className="text-sm text-green-600">
                                  +₹{transaction.cashback} cashback
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <ShoppingBagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                          <p className="text-gray-600 mb-4">
                            Start shopping to see your cashback transactions here
                          </p>
                          <Link href="/offers" className="btn btn-primary">
                            Browse Offers
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Quick Actions & Featured Offers */}
                <motion.div className="space-y-6" variants={fadeInUp}>
                  {/* Quick Actions */}
                  <div className="card">
                    <div className="card-header">
                      <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                    </div>
                    <div className="card-body">
                      <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action) => (
                          <Link
                            key={action.title}
                            href={action.href}
                            className="p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all group"
                          >
                            <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                              <action.icon className="w-4 h-4 text-white" />
                            </div>
                            <p className="font-medium text-gray-900 text-sm group-hover:text-primary-600">
                              {action.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {action.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Featured Offers */}
                  <div className="card">
                    <div className="card-header">
                      <h2 className="text-lg font-semibold text-gray-900">Featured Offers</h2>
                      <Link href="/offers" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        View all
                      </Link>
                    </div>
                    <div className="card-body">
                      <div className="space-y-3">
                        {featuredOffers.map((offer) => (
                          <div key={offer._id} className="p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                                  {offer.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                  {offer.merchant?.name}
                                </p>
                              </div>
                              <span className="badge badge-success text-xs ml-2">
                                {offer.cashbackPercentage}%
                              </span>
                            </div>
                            <Link href={`/offers/${offer._id}`} className="btn btn-primary btn-sm w-full mt-2">
                              Get Deal
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Tips Section */}
              <motion.div className="mt-8" variants={fadeInUp}>
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <StarIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">💡 Pro Tip</h3>
                      <p className="text-primary-100 mb-4">
                        Link your credit cards and bank accounts to earn automatic cashback on every purchase. 
                        No need to remember to activate offers!
                      </p>
                      <Link href="/user/accounts" className="btn bg-white text-primary-600 hover:bg-gray-50 btn-sm">
                        Link Accounts
                      </Link>
                    </div>
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

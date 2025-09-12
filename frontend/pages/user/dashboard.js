import { useState, useEffect } from 'react';
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
  StarIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useAuth, ProtectedRoute } from '../../lib/auth';
import { userAPI, offersAPI } from '../../lib/api';
import DashboardContainer from '../../components/Dashboard/DashboardContainer';

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
  const { user, loading: authLoading } = useAuth();
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
    console.log('User dashboard - User:', user);
    console.log('User dashboard - Auth loading:', authLoading);
    
    if (user && !authLoading) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Try to load dashboard data
      let dashboardData = null;
      let offersData = [];
      
      try {
        const dashboardRes = await userAPI.getDashboard();
        dashboardData = dashboardRes.data.data;
      } catch (dashboardError) {
        console.warn('Dashboard API failed, using mock data:', dashboardError.message);
        // Use mock data for development
        dashboardData = {
          orderStats: {
            totalOrders: 0,
            totalAmount: 0,
            totalCashback: 0,
            pendingCashback: 0,
            creditedCashback: 0
          },
          monthlyEarnings: {
            earnings: 0,
            withdrawals: 0,
            transactions: 0
          },
          recentOrders: []
        };
      }

      try {
        const offersRes = await offersAPI.getFeaturedOffers();
        offersData = offersRes.data.data?.offers || offersRes.data.data || [];
      } catch (offersError) {
        console.warn('Offers API failed, using mock data:', offersError.message);
        // Use mock offers for development
        offersData = [
          {
            _id: '1',
            title: 'Amazon Cashback',
            merchant: { name: 'Amazon' },
            cashbackPercentage: 5
          },
          {
            _id: '2', 
            title: 'Flipkart Deal',
            merchant: { name: 'Flipkart' },
            cashbackPercentage: 3
          }
        ];
      }

      // Set the data
      setStats({
        totalEarnings: dashboardData.orderStats?.totalAmount || 0,
        monthlyEarnings: dashboardData.monthlyEarnings?.earnings || 0,
        pendingCashback: dashboardData.orderStats?.pendingCashback || 0,
        totalTransactions: dashboardData.orderStats?.totalOrders || 0
      });
      setRecentTransactions(dashboardData.recentOrders || []);
      setFeaturedOffers(offersData.slice(0, 4));
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Set default values on error
      setStats({
        totalEarnings: 0,
        monthlyEarnings: 0,
        pendingCashback: 0,
        totalTransactions: 0
      });
      setRecentTransactions([]);
      setFeaturedOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Shop & Earn',
      description: 'Browse stores with cashback',
      icon: ShoppingBagIcon,
      href: '/offers',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'My Earnings',
      description: 'View cashback and withdraw',
      icon: BanknotesIcon,
      href: '/user/earnings',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Refer & Earn',
      description: 'Invite friends, earn ₹100 each',
      icon: StarIcon,
      href: '/user/referrals',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'My Orders',
      description: 'Track your purchases',
      icon: ChartBarIcon,
      href: '/user/transactions',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  // Show loading if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner spinner-lg mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show message if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to access your dashboard.</p>
          <div className="space-x-4">
            <Link href="/auth/login" className="btn btn-primary">
              Go to Login
            </Link>
            <Link href="/auth/register" className="btn btn-secondary">
              Create Account
            </Link>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              <strong>For testing, use these credentials:</strong>
            </p>
            <div className="text-xs space-y-1">
              <div>• <strong>User:</strong> test@example.com / password123</div>
              <div>• <strong>Publisher:</strong> publisher@example.com / password123</div>
              <div>• <strong>Promoter:</strong> promoter@example.com / password123</div>
              <div>• <strong>Admin:</strong> admin@example.com / password123</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['user']}>
      <DashboardContainer
        title="My Cashback Dashboard"
        subtitle="Earn money back on every purchase you make"
        role="user"
        quickActions={quickActions}
      >

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
      </DashboardContainer>
    </ProtectedRoute>
  );
}

import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import ProtectedRoute from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';
import VerificationBanner from '../../components/VerificationBanner';
import Link from 'next/link';
import Image from 'next/image';

const UserDashboard = () => {
  const { user } = useAuth();
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [cashbackData, setCashbackData] = useState({
    total: 0,
    pending: 0,
    withdrawn: 0,
    credited: 0
  });

  useEffect(() => {
    // Load user data
    loadUserData();
  }, []);

  const loadUserData = async () => {
    // Mock data for now - replace with actual API calls
    setLinkedAccounts([
      { id: 1, name: 'Amazon', status: 'linked', logo: '/images/merchants/Amazon-logo.jpeg' },
      { id: 2, name: 'Flipkart', status: 'linked', logo: '/images/merchants/Flipkart-Logo.jpg' },
      { id: 3, name: 'Myntra', status: 'not_linked', logo: '/images/merchants/Myntra-Logo.jpg' },
      { id: 4, name: 'Nykaa', status: 'not_linked', logo: '/images/merchants/Nykaa-Logo.png' },
      { id: 5, name: 'Tata CLiQ', status: 'not_linked', logo: '/images/merchants/Tata-Cliq-Logo.jpg' },
      { id: 6, name: 'AJIO', status: 'not_linked', logo: '/images/merchants/Ajio-Logo.jpg' }
    ]);

    setCashbackData({
      total: 1250.50,
      pending: 150.25,
      withdrawn: 800.00,
      credited: 300.25
    });
  };

  const handleLinkAccount = (accountId) => {
    // Implement account linking logic
    console.log('Linking account:', accountId);
  };

  const handleUnlinkAccount = (accountId) => {
    // Implement account unlinking logic
    console.log('Unlinking account:', accountId);
  };

  return (
    <ProtectedRoute allowedRoles={['user']}>
      <Layout>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.firstName}!
                </h1>
                <p className="mt-2 text-gray-600">
                  Manage your cashback earnings and linked accounts
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Email Verification Banner */}
            <VerificationBanner />
            
            {/* Cashback Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Cashback</p>
                    <p className="text-2xl font-semibold text-gray-900">₹{cashbackData.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Pending</p>
                    <p className="text-2xl font-semibold text-gray-900">₹{cashbackData.pending}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Credited</p>
                    <p className="text-2xl font-semibold text-gray-900">₹{cashbackData.credited}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Withdrawn</p>
                    <p className="text-2xl font-semibold text-gray-900">₹{cashbackData.withdrawn}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Linked Accounts */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Linked Accounts</h3>
                  <p className="mt-1 text-sm text-gray-500">Connect your ecommerce accounts to earn cashback</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {linkedAccounts.map((account) => (
                      <div key={account.id} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {account.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{account.name}</p>
                            <p className={`text-xs ${
                              account.status === 'linked' ? 'text-green-600' : 'text-gray-500'
                            }`}>
                              {account.status === 'linked' ? 'Connected' : 'Not connected'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3">
                          {account.status === 'linked' ? (
                            <button
                              onClick={() => handleUnlinkAccount(account.id)}
                              className="w-full text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                              Unlink
                            </button>
                          ) : (
                            <button
                              onClick={() => handleLinkAccount(account.id)}
                              className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Link Account
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6 space-y-4">
                  <Link href="/offers" className="block">
                    <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Browse Offers</p>
                        <p className="text-xs text-gray-500">Find the best cashback deals</p>
                      </div>
                    </div>
                  </Link>

                  <Link href="/withdraw" className="block">
                    <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Withdraw Funds</p>
                        <p className="text-xs text-gray-500">Transfer to bank/UPI/wallet</p>
                      </div>
                    </div>
                  </Link>

                  <Link href="/security" className="block">
                    <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Security Settings</p>
                        <p className="text-xs text-gray-500">2FA, password, and more</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Cashback earned from Amazon</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-green-600">+₹25.50</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Withdrawal to UPI</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-red-600">-₹500.00</span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Cashback pending from Flipkart</p>
                        <p className="text-xs text-gray-500">3 days ago</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-yellow-600">+₹75.25</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default UserDashboard;

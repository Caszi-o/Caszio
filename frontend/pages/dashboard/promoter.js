import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import ProtectedRoute from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';
import VerificationBanner from '../../components/VerificationBanner';
import Link from 'next/link';

const PromoterDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingEarnings: 0,
    totalClicks: 0,
    totalImpressions: 0,
    conversionRate: 0,
    approvalStatus: 'pending'
  });
  const [earnings, setEarnings] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    loadPromoterData();
  }, []);

  const loadPromoterData = async () => {
    // Mock data - replace with actual API calls
    setStats({
      totalEarnings: 1850.75,
      pendingEarnings: 125.50,
      totalClicks: 2450,
      totalImpressions: 125000,
      conversionRate: 3.2,
      approvalStatus: 'approved'
    });

    setEarnings([
      { id: 1, campaign: 'Electronics Campaign', type: 'CPC', amount: 45.50, date: '2024-01-15', status: 'paid' },
      { id: 2, campaign: 'Fashion Campaign', type: 'CPA', amount: 32.25, date: '2024-01-14', status: 'paid' },
      { id: 3, campaign: 'Home & Garden', type: 'CPC', amount: 28.75, date: '2024-01-13', status: 'pending' },
      { id: 4, campaign: 'Tech Gadgets', type: 'CPA', amount: 58.90, date: '2024-01-12', status: 'paid' }
    ]);

    setCampaigns([
      { id: 1, name: 'Electronics Campaign', type: 'CPC', rate: 0.50, clicks: 91, earnings: 45.50, status: 'active' },
      { id: 2, name: 'Fashion Campaign', type: 'CPA', rate: 15.00, conversions: 2, earnings: 30.00, status: 'active' },
      { id: 3, name: 'Home & Garden', type: 'CPC', rate: 0.75, clicks: 38, earnings: 28.50, status: 'paused' },
      { id: 4, name: 'Tech Gadgets', type: 'CPA', rate: 25.00, conversions: 2, earnings: 50.00, status: 'active' }
    ]);
  };

  const handleWithdrawRequest = () => {
    // Navigate to withdrawal page
    console.log('Request withdrawal');
  };

  const handleApplyForApproval = () => {
    // Apply for promoter approval
    console.log('Apply for approval');
  };

  return (
    <ProtectedRoute allowedRoles={['promoter']}>
      <Layout>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  Promoter Dashboard
                </h1>
                <p className="mt-2 text-gray-600">
                  Track your earnings and manage your promotional campaigns
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Email Verification Banner */}
            <VerificationBanner />
            
            {/* Approval Status Banner */}
            {stats.approvalStatus === 'pending' && (
              <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Approval Pending
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Your promoter application is under review. You'll be notified once approved.</p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={handleApplyForApproval}
                        className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-200"
                      >
                        Check Application Status
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
                    <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                    <p className="text-2xl font-semibold text-gray-900">₹{stats.totalEarnings}</p>
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
                    <p className="text-2xl font-semibold text-gray-900">₹{stats.pendingEarnings}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Clicks</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalClicks.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Impressions</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalImpressions.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-100 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.conversionRate}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Active Campaigns */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Active Campaigns</h3>
                  <p className="mt-1 text-sm text-gray-500">Your current promotional campaigns and performance</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{campaign.name}</h4>
                            <p className="text-xs text-gray-500">
                              {campaign.type} • Rate: ₹{campaign.rate}
                              {campaign.type === 'CPC' ? ' per click' : ' per conversion'}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="text-center">
                              <p className="text-gray-500">
                                {campaign.type === 'CPC' ? 'Clicks' : 'Conversions'}
                              </p>
                              <p className="font-medium">
                                {campaign.type === 'CPC' ? campaign.clicks : campaign.conversions}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-500">Earnings</p>
                              <p className="font-medium">₹{campaign.earnings}</p>
                            </div>
                            <div className="text-center">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                campaign.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {campaign.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Earnings */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Earnings</h3>
                  <p className="mt-1 text-sm text-gray-500">Your latest earnings and payment history</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {earnings.map((earning) => (
                      <div key={earning.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            earning.status === 'paid' ? 'bg-green-100' : 'bg-yellow-100'
                          }`}>
                            <svg className={`w-4 h-4 ${
                              earning.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{earning.campaign}</p>
                            <p className="text-xs text-gray-500">{earning.type} • {earning.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">₹{earning.amount}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            earning.status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {earning.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <button
                    onClick={handleWithdrawRequest}
                    className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Withdraw Earnings</p>
                      <p className="text-xs text-gray-500">Request payment to bank/UPI</p>
                    </div>
                  </button>

                  <Link href="/promoter/scripts" className="block">
                    <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Ad Scripts</p>
                        <p className="text-xs text-gray-500">Get promotional scripts</p>
                      </div>
                    </div>
                  </Link>

                  <Link href="/promoter/analytics" className="block">
                    <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Analytics</p>
                        <p className="text-xs text-gray-500">View detailed reports</p>
                      </div>
                    </div>
                  </Link>

                  <Link href="/promoter/profile" className="block">
                    <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Profile</p>
                        <p className="text-xs text-gray-500">Manage your account</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default PromoterDashboard;

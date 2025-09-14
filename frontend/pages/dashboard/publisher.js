import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import ProtectedRoute from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';
import VerificationBanner from '../../components/VerificationBanner';
import Link from 'next/link';

const PublisherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalClicks: 0,
    totalEarnings: 0,
    adSpend: 0,
    walletBalance: 0
  });
  const [listings, setListings] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    loadPublisherData();
  }, []);

  const loadPublisherData = async () => {
    // Load publisher data from API
    try {
      // TODO: Replace with actual API calls
      setStats({
        totalListings: 0,
        activeListings: 0,
        totalClicks: 0,
        totalEarnings: 0,
        adSpend: 0,
        walletBalance: 0
      });

      setListings([]);
      setCampaigns([]);
    } catch (error) {
      console.error('Failed to load publisher data:', error);
    }
  };

  const handleCreateListing = () => {
    // Navigate to create listing page
    console.log('Create new listing');
  };

  const handleCreateCampaign = () => {
    // Navigate to create campaign page
    console.log('Create new campaign');
  };

  return (
    <ProtectedRoute allowedRoles={['publisher']}>
      <Layout>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  Publisher Dashboard
                </h1>
                <p className="mt-2 text-gray-600">
                  Manage your listings, campaigns, and track performance
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Email Verification Banner */}
            <VerificationBanner />
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Listings</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalListings}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.activeListings}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Earnings</p>
                    <p className="text-2xl font-semibold text-gray-900">₹{stats.totalEarnings}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Ad Spend</p>
                    <p className="text-2xl font-semibold text-gray-900">₹{stats.adSpend}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-100 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Wallet</p>
                    <p className="text-2xl font-semibold text-gray-900">₹{stats.walletBalance}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Listings */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Product Listings</h3>
                    <p className="mt-1 text-sm text-gray-500">Manage your product listings and performance</p>
                  </div>
                  <button
                    onClick={handleCreateListing}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    + New Listing
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {listings.map((listing) => (
                      <div key={listing.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{listing.title}</h4>
                            <p className="text-xs text-gray-500">{listing.category}</p>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="text-center">
                              <p className="text-gray-500">Clicks</p>
                              <p className="font-medium">{listing.clicks}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-500">Earnings</p>
                              <p className="font-medium">₹{listing.earnings}</p>
                            </div>
                            <div className="text-center">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                listing.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {listing.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ad Campaigns */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Ad Campaigns</h3>
                    <p className="mt-1 text-sm text-gray-500">Create and manage your advertising campaigns</p>
                  </div>
                  <button
                    onClick={handleCreateCampaign}
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    + New Campaign
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{campaign.name}</h4>
                            <p className="text-xs text-gray-500">{campaign.type} • Budget: ₹{campaign.budget}</p>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="text-center">
                              <p className="text-gray-500">Spent</p>
                              <p className="font-medium">₹{campaign.spent}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-500">
                                {campaign.type === 'CPC' ? 'Clicks' : 'Impressions'}
                              </p>
                              <p className="font-medium">
                                {campaign.type === 'CPC' ? campaign.clicks : campaign.impressions?.toLocaleString()}
                              </p>
                            </div>
                            <div className="text-center">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                campaign.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
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
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Link href="/publisher/listings" className="block">
                    <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Manage Listings</p>
                        <p className="text-xs text-gray-500">Edit, pause, or delete listings</p>
                      </div>
                    </div>
                  </Link>

                  <Link href="/publisher/campaigns" className="block">
                    <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592c-1.137-.227-2.116-.52-2.116-1.4 0-.72.636-1.272 1.727-1.272 1.003 0 1.952.492 2.786 1.336l.893.893c.293.293.766.293 1.059 0l.893-.893c.834-.844 1.783-1.336 2.786-1.336.09 0 .18.006.27.018V5.882a1.76 1.76 0 00-3.417-.592c-1.137.227-2.116.52-2.116 1.4 0 .72.636 1.272 1.727 1.272 1.003 0 1.952-.492 2.786-1.336l.893-.893c.293-.293.766-.293 1.059 0l.893.893c.834.844 1.783 1.336 2.786 1.336.09 0 .18-.006.27-.018z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Campaigns</p>
                        <p className="text-xs text-gray-500">Create and manage ads</p>
                      </div>
                    </div>
                  </Link>

                  <Link href="/publisher/analytics" className="block">
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

                  <Link href="/publisher/wallet" className="block">
                    <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Wallet</p>
                        <p className="text-xs text-gray-500">Manage funds and payments</p>
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

export default PublisherDashboard;

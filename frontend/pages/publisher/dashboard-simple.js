import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, ProtectedRoute } from '../../lib/auth';
import { publisherAPI } from '../../lib/api';
import toast from 'react-hot-toast';

export default function PublisherDashboardSimple() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await publisherAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Set default mock data
      setDashboardData({
        publisher: {
          companyName: 'Test Publisher Co.',
          verificationStatus: 'pending'
        },
        recentAds: [],
        activeAdsCount: 0,
        todayMetrics: { impressions: 0, clicks: 0, conversions: 0, cost: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const { publisher = {}, recentAds = [] } = dashboardData || {};

  return (
    <ProtectedRoute allowedRoles={['publisher']} requireVerification>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Publisher Dashboard</h1>
                <p className="text-gray-600">Manage your ad campaigns and track performance</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.firstName || 'Publisher'}
                </span>
                <Link href="/publisher/profile" className="btn btn-outline-primary btn-sm">
                  Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Verification Status */}
          {publisher.verificationStatus !== 'verified' && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-yellow-400 rounded-full mr-3"></div>
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">
                      Account Verification {publisher.verificationStatus === 'pending' ? 'Pending' : 'Required'}
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      {publisher.verificationStatus === 'pending' 
                        ? 'Your account is under review. You can create draft ads but cannot publish them until verified.'
                        : 'Complete your account verification to start publishing ads.'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  {publisher.verificationStatus !== 'pending' && (
                    <Link href="/publisher/verify" className="btn btn-warning btn-sm">
                      Verify Account
                    </Link>
                  )}
                  <Link href="/publisher/profile" className="btn btn-outline-warning btn-sm">
                    Update Profile
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-medium">I</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today's Impressions</p>
                  <p className="text-2xl font-semibold text-gray-900">{publisher.todayMetrics?.impressions || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-medium">C</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today's Clicks</p>
                  <p className="text-2xl font-semibold text-gray-900">{publisher.todayMetrics?.clicks || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-medium">CV</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Conversions</p>
                  <p className="text-2xl font-semibold text-gray-900">{publisher.todayMetrics?.conversions || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-medium">$</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today's Spend</p>
                  <p className="text-2xl font-semibold text-gray-900">${publisher.todayMetrics?.cost || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link href="/publisher/ads/create" className="block p-6 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-medium">+</span>
                </div>
                <div>
                  <h3 className="font-semibold">Create New Ad</h3>
                  <p className="text-sm opacity-90">Launch a new campaign</p>
                </div>
              </div>
            </Link>

            <Link href="/publisher/wallet" className="block p-6 bg-green-600 rounded-lg text-white hover:bg-green-700 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-medium">$</span>
                </div>
                <div>
                  <h3 className="font-semibold">Manage Wallet</h3>
                  <p className="text-sm opacity-90">Top up funds</p>
                </div>
              </div>
            </Link>

            <Link href="/publisher/analytics" className="block p-6 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-medium">📊</span>
                </div>
                <div>
                  <h3 className="font-semibold">View Analytics</h3>
                  <p className="text-sm opacity-90">Performance insights</p>
                </div>
              </div>
            </Link>

            <Link href="/publisher/profile" className="block p-6 bg-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-medium">👤</span>
                </div>
                <div>
                  <h3 className="font-semibold">Account Settings</h3>
                  <p className="text-sm opacity-90">Manage profile</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Ads */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Ads</h2>
            </div>
            <div className="p-6">
              {recentAds.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-medium">📊</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No ads yet</h3>
                  <p className="text-gray-600 mb-4">Create your first ad campaign to start reaching customers.</p>
                  <Link href="/publisher/ads/create" className="btn btn-primary">
                    Create Your First Ad
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentAds.map((ad) => (
                    <div key={ad._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{ad.title}</h3>
                        <p className="text-sm text-gray-600 capitalize">{ad.type} Ad</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-xs text-gray-500">
                            {ad.metrics?.impressions || 0} impressions
                          </span>
                          <span className="text-xs text-gray-500">
                            {ad.metrics?.clicks || 0} clicks
                          </span>
                          <span className="text-xs text-gray-500">
                            ${ad.metrics?.cost || 0} spent
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ad.status === 'active' ? 'bg-green-100 text-green-800' :
                          ad.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {ad.status.replace('_', ' ')}
                        </span>
                        <Link href={`/publisher/ads/${ad._id}`} className="text-primary-600 hover:text-primary-700">
                          <span className="text-sm">View</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

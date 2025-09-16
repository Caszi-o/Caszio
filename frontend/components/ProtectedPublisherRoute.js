import { useAuth } from '../lib/auth';
import LoginRequired from './LoginRequired';
import Link from 'next/link';

const ProtectedPublisherRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner spinner-lg mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginRequired />;
  }

  // More flexible role checking
  const userRole = user.role || user.userRole || user.accountType;

  if (userRole !== 'publisher') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-lg w-full mx-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-2 text-lg">
              You need a <span className="font-semibold text-green-600">Publisher Account</span> to access this dashboard.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Publisher accounts allow you to create and manage advertising campaigns, track performance metrics, and reach your target audience effectively.
            </p>
            
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">What you can do as a Publisher:</h3>
                <ul className="text-sm text-blue-800 space-y-1 text-left">
                  <li>• Create and manage advertising campaigns</li>
                  <li>• Track performance metrics and analytics</li>
                  <li>• Manage your advertising budget</li>
                  <li>• Access detailed reporting tools</li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  href="/publisher/apply" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Apply for Publisher Account
                </Link>
                <Link 
                  href="/contact" 
                  className="flex-1 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  Contact Support
                </Link>
              </div>
              
              <Link 
                href="/" 
                className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedPublisherRoute;

import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShieldExclamationIcon,
  HomeIcon,
  ArrowLeftIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../lib/auth';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Unauthorized() {
  const { user, logout } = useAuth();

  const roleRedirects = {
    user: '/user/dashboard',
    publisher: '/publisher/dashboard', 
  };

  return (
    <>
      <Head>
        <title>Unauthorized Access - Caszio</title>
        <meta name="description" content="You don't have permission to access this page. Contact support if you believe this is an error." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-md w-full text-center"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          {/* Logo */}
          <Link href="/" className="inline-block mb-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-3xl font-bold text-gray-900">Caszio</span>
            </div>
          </Link>

          {/* Warning Icon */}
          <div className="mb-8">
            <motion.div
              className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto"
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <ShieldExclamationIcon className="w-12 h-12 text-red-600" />
            </motion.div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            You don't have permission to access this page.
          </p>
          {user && (
            <p className="text-sm text-gray-500 mb-8">
              Logged in as: <span className="font-medium">{user.email}</span> ({user.role})
            </p>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {user ? (
              <>
                {/* Redirect to appropriate dashboard */}
                <Link 
                  href={roleRedirects[user.role] || '/user/dashboard'} 
                  className="btn btn-primary btn-lg w-full flex items-center justify-center"
                >
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  Go to My Dashboard
                </Link>
                
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/" className="btn btn-secondary">
                    <HomeIcon className="w-4 h-4 mr-2" />
                    Homepage
                  </Link>
                  <button 
                    onClick={logout}
                    className="btn btn-outline-primary"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Not logged in */}
                <Link href="/auth/login" className="btn btn-primary btn-lg w-full">
                  Login to Continue
                </Link>
                
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/" className="btn btn-secondary">
                    <HomeIcon className="w-4 h-4 mr-2" />
                    Homepage
                  </Link>
                  <Link href="/auth/register" className="btn btn-outline-primary">
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Help Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                If you believe this is an error, please contact our support team.
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/contact" className="text-primary-600 hover:text-primary-700">
                  Contact Support
                </Link>
                <Link href="/help" className="text-primary-600 hover:text-primary-700">
                  Help Center
                </Link>
              </div>
            </div>
          </div>

          {/* Role Information */}
          <motion.div 
            className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Account Types</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>User:</strong> Earn cashback on purchases</p>
              <p><strong>Publisher:</strong> Create and manage ads</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

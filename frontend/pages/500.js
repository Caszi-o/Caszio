import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ExclamationTriangleIcon,
  HomeIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Custom500() {
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <>
      <Head>
        <title>Server Error - Casyoro</title>
        <meta name="description" content="Something went wrong on our end. We're working to fix it. Please try again later." />
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
              <span className="text-3xl font-bold text-gray-900">Casyoro</span>
            </div>
          </Link>

          {/* Error Animation */}
          <div className="mb-8">
            <div className="text-8xl md:text-9xl font-bold text-red-200 select-none">
              500
            </div>
            <div className="relative -mt-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Oops! Something Went Wrong
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            We're experiencing some technical difficulties on our end.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Our team has been notified and is working to fix this issue. Please try again in a few minutes.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button 
              onClick={refreshPage}
              className="btn btn-primary btn-lg w-full flex items-center justify-center"
            >
              <ArrowPathIcon className="w-5 h-5 mr-2" />
              Try Again
            </button>
            
            <div className="grid grid-cols-2 gap-4">
              <Link href="/" className="btn btn-secondary flex items-center justify-center">
                <HomeIcon className="w-4 h-4 mr-2" />
                Homepage
              </Link>
              <Link href="/contact" className="btn btn-outline-primary flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                Support
              </Link>
            </div>
          </div>

          {/* Status Information */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">In the meantime, you can:</p>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <Link href="/offers" className="text-primary-600 hover:text-primary-700 p-2 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
                Browse Available Offers
              </Link>
              <Link href="/how-it-works" className="text-primary-600 hover:text-primary-700 p-2 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
                Learn How Casyoro Works
              </Link>
              <Link href="/auth/register" className="text-primary-600 hover:text-primary-700 p-2 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
                Create Your Account
              </Link>
            </div>
          </div>

          {/* Error Code */}
          <motion.div 
            className="mt-8 p-4 bg-gray-50 rounded-lg border"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-xs text-gray-500 mb-1">Error Code: 500</p>
            <p className="text-xs text-gray-400">
              If this problem persists, please include this error code when contacting support.
            </p>
          </motion.div>

          {/* Reassurance */}
          <div className="mt-6">
            <p className="text-xs text-gray-500">
              Don't worry - your account data and earnings are safe! 💰
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}

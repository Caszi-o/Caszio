import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  HomeIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found - Casyoro</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to Casyoro to continue earning cashback." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
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

          {/* 404 Animation */}
          <div className="mb-8">
            <div className="text-8xl md:text-9xl font-bold text-primary-200 select-none">
              404
            </div>
            <div className="relative -mt-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <MagnifyingGlassIcon className="w-8 h-8 text-primary-600" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track to earning cashback!
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link href="/" className="btn btn-primary btn-lg w-full flex items-center justify-center">
              <HomeIcon className="w-5 h-5 mr-2" />
              Go to Homepage
            </Link>
            
            <div className="grid grid-cols-2 gap-4">
              <Link href="/offers" className="btn btn-secondary">
                Browse Offers
              </Link>
              <button 
                onClick={() => window.history.back()}
                className="btn btn-outline-primary flex items-center justify-center"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Go Back
              </button>
            </div>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Looking for something specific?</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Link href="/how-it-works" className="text-primary-600 hover:text-primary-700">
                How it Works
              </Link>
              <Link href="/contact" className="text-primary-600 hover:text-primary-700">
                Contact Support
              </Link>
              <Link href="/auth/login" className="text-primary-600 hover:text-primary-700">
                Login
              </Link>
              <Link href="/auth/register" className="text-primary-600 hover:text-primary-700">
                Sign Up
              </Link>
            </div>
          </div>

          {/* Fun Stats */}
          <motion.div 
            className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-xs text-gray-500 mb-2">While you're here...</p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-primary-600">50,000+</span> users are earning 
              <span className="font-semibold text-success-600"> ₹2.5Cr+</span> in cashback with Casyoro!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { authAPI } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function VerifyEmail() {
  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, success, error
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, loadUser } = useAuth();
  const { token } = router.query;

  useEffect(() => {
    if (token) {
      verifyEmailToken(token);
    }
  }, [token]);

  const verifyEmailToken = async (verificationToken) => {
    try {
      setLoading(true);
      await authAPI.verifyEmail(verificationToken);
      setVerificationStatus('success');
      await loadUser(); // Refresh user data
      toast.success('Email verified successfully!');
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/user/dashboard');
      }, 3000);
    } catch (error) {
      setVerificationStatus('error');
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!user?.email) {
      toast.error('No email address found');
      return;
    }

    try {
      setLoading(true);
      await authAPI.resendVerification(user.email);
      toast.success('Verification email sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Verify Email - Casyoro</title>
        <meta name="description" content="Verify your email address to complete your Casyoro account setup." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-md w-full space-y-8"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="text-center">
            <Link href="/" className="inline-block">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <span className="text-3xl font-bold text-gray-900">Casyoro</span>
              </div>
            </Link>
          </div>

          {verificationStatus === 'pending' && !token && (
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Check your email
              </h2>
              <p className="text-gray-600 mb-6">
                We sent a verification link to{' '}
                <span className="font-medium text-gray-900">{user?.email}</span>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Click the link in the email to verify your account. If you don't see the email, check your spam folder.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={resendVerification}
                  disabled={loading}
                  className="w-full btn btn-primary"
                >
                  {loading ? 'Sending...' : 'Resend verification email'}
                </button>
                
                <Link href="/auth/login" className="block w-full btn btn-secondary">
                  Back to login
                </Link>
              </div>
            </div>
          )}

          {loading && token && (
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="animate-spin w-8 h-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verifying your email...
              </h2>
              <p className="text-gray-600">
                Please wait while we verify your email address.
              </p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="text-center">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Email verified!
              </h2>
              <p className="text-gray-600 mb-6">
                Your email has been successfully verified. You can now access all features of your Casyoro account.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Redirecting to your dashboard in a few seconds...
              </p>
              
              <Link href="/user/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="text-center">
              <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verification failed
              </h2>
              <p className="text-gray-600 mb-6">
                The verification link is invalid or has expired. Please request a new verification email.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={resendVerification}
                  disabled={loading}
                  className="w-full btn btn-primary"
                >
                  {loading ? 'Sending...' : 'Send new verification email'}
                </button>
                
                <Link href="/auth/login" className="block w-full btn btn-secondary">
                  Back to login
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}

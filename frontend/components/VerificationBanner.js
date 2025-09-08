import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { authAPI } from '../lib/api';
import toast from 'react-hot-toast';

const VerificationBanner = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

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

  // Don't show banner if user is verified
  if (user?.isVerified) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Email Verification Required
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Please verify your email address ({user?.email}) to access all features. 
              Check your inbox for the verification link.
            </p>
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex">
              <button
                onClick={resendVerification}
                disabled={loading}
                className="bg-yellow-100 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Resend verification email'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationBanner;

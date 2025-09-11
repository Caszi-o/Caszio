import { useAuth } from '../lib/auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, allowedRoles = [], requireVerification = true }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        router.push('/unauthorized');
        return;
      }

      // Email verification is no longer required
      // if (requireVerification && !user.isVerified) {
      //   router.push('/auth/verify-email');
      //   return;
      // }
    }
  }, [user, loading, router, allowedRoles, requireVerification]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null;
  }

  // Email verification is no longer required
  // if (requireVerification && !user.isVerified) {
  //   return null;
  // }

  return children;
};

export default ProtectedRoute;

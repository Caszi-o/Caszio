import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { authAPI, setTokens, clearTokens, isAuthenticated } from './api';
import toast from 'react-hot-toast';

// Auth Context
const AuthContext = createContext({});

// Helper function for role-based redirects
export const getRedirectPath = (role) => {
  switch (role) {
    case 'publisher':
      return '/publisher/dashboard';
    case 'promoter':
      return '/promoter/dashboard';
    case 'user':
    default:
      return '/user/dashboard';
  }
};

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      if (isAuthenticated()) {
        const response = await authAPI.getCurrentUser();
        setUser(response.data.data.user);
      }
    } catch (error) {
      console.error('Load user error:', error);
      clearTokens();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { user, accessToken, refreshToken, requiresTwoFactor } = response.data.data;

      if (requiresTwoFactor) {
        return { requiresTwoFactor: true };
      }

      setTokens(accessToken, refreshToken);
      setUser(user);
      toast.success('Login successful!');
      
      // Redirect based on user role (immediate access)
      const redirectPath = getRedirectPath(user.role);
      router.push(redirectPath);
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { user, accessToken, refreshToken } = response.data.data;

      setTokens(accessToken, refreshToken);
      setUser(user);
      
      // Redirect based on user role (no verification required)
      toast.success('Registration successful! Welcome to Casyoro!');
      const redirectPath = getRedirectPath(user.role);
      router.push(redirectPath);
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      setUser(null);
      router.push('/');
      toast.success('Logged out successfully');
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };


  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const isVerified = () => {
    return user?.isVerified === true;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    loadUser,
    hasRole,
    hasAnyRole,
    isVerified,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Auth Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for protected routes
export const withAuth = (WrappedComponent, allowedRoles = []) => {
  return function AuthenticatedComponent(props) {
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
      }
    }, [user, loading, router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="spinner spinner-lg"></div>
        </div>
      );
    }

    if (!user) {
      return null;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

// Route guard component
export const ProtectedRoute = ({ children, allowedRoles = [], requireVerification = false }) => {
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
        <div className="spinner spinner-lg"></div>
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

// Public route (redirect if authenticated)
export const PublicRoute = ({ children, redirectTo = null }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      const redirect = redirectTo || getRedirectPath(user.role);
      router.push(redirect);
    }
  }, [user, loading, router, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner spinner-lg"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return children;
};

export default AuthContext;

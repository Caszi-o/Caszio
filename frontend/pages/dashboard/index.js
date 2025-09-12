import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth, ProtectedRoute } from '../../lib/auth';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

// Import role-specific dashboard components
import UserDashboard from './user';
import PublisherDashboard from './publisher';
import PromoterDashboard from './promoter';
import AdminDashboard from './admin';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to role-specific dashboard if user has a specific role
  useEffect(() => {
    if (!loading && user) {
      const role = user.role;
      switch (role) {
        case 'admin':
          router.replace('/admin/dashboard');
          break;
        case 'publisher':
          router.replace('/publisher/dashboard');
          break;
        case 'promoter':
          router.replace('/promoter/dashboard');
          break;
        case 'user':
        default:
          router.replace('/user/dashboard');
          break;
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner spinner-lg mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // This component will redirect, so we show a loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="spinner spinner-lg mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}

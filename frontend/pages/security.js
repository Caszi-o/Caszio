import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  ShieldCheckIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../lib/auth';
import { authAPI } from '../lib/api';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Security() {
  const { user, loadUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('password');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const newPassword = watch('newPassword');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
  }, [user, router]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await authAPI.resetPassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      toast.success('Password updated successfully!');
      reset();
    } catch (error) {
      console.error('Password update error:', error);
      toast.error('Failed to update password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    try {
      setLoading(true);
      const response = await authAPI.setup2FA();
      toast.success('2FA setup initiated. Please check your authenticator app.');
      // In a real app, you'd show the QR code and setup instructions
    } catch (error) {
      console.error('2FA setup error:', error);
      toast.error('Failed to setup 2FA. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      setLoading(true);
      await authAPI.disable2FA({ password: 'current-password' });
      toast.success('2FA disabled successfully!');
      await loadUser();
    } catch (error) {
      console.error('2FA disable error:', error);
      toast.error('Failed to disable 2FA. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'password', name: 'Password', icon: KeyIcon },
    { id: 'twofa', name: 'Two-Factor Auth', icon: DevicePhoneMobileIcon },
    { id: 'sessions', name: 'Active Sessions', icon: ShieldCheckIcon }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner spinner-lg"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Security Settings - Casyoro</title>
        <meta name="description" content="Manage your account security settings and password" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/user/dashboard" className="text-gray-400 hover:text-gray-600">
                  <ArrowLeftIcon className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">Security Settings</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            className="mb-8"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Security</h1>
            <p className="text-gray-600">Protect your account with strong security settings</p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              className="lg:col-span-1"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <div className="bg-white rounded-lg shadow-sm border">
                <nav className="p-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              className="lg:col-span-3"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              {/* Password Tab */}
              {activeTab === 'password' && (
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                    <p className="text-gray-600">Update your password to keep your account secure</p>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div>
                        <label className="form-label">Current Password *</label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            className="form-input pr-10"
                            placeholder="Enter your current password"
                            {...register('currentPassword', { required: 'Current password is required' })}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPassword ? (
                              <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                              <EyeIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        {errors.currentPassword && (
                          <p className="form-error">{errors.currentPassword.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label">New Password *</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            className="form-input pr-10"
                            placeholder="Enter your new password"
                            {...register('newPassword', {
                              required: 'New password is required',
                              minLength: {
                                value: 8,
                                message: 'Password must be at least 8 characters'
                              },
                              pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                                message: 'Password must contain uppercase, lowercase, number and special character'
                              }
                            })}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? (
                              <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                              <EyeIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        {errors.newPassword && (
                          <p className="form-error">{errors.newPassword.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label">Confirm New Password *</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="form-input pr-10"
                            placeholder="Confirm your new password"
                            {...register('confirmPassword', {
                              required: 'Please confirm your password',
                              validate: value => value === newPassword || 'Passwords do not match'
                            })}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? (
                              <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                              <EyeIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="form-error">{errors.confirmPassword.message}</p>
                        )}
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex">
                          <ShieldCheckIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                          <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Password Requirements:</p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>At least 8 characters long</li>
                              <li>Contains uppercase and lowercase letters</li>
                              <li>Contains at least one number</li>
                              <li>Contains at least one special character</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="spinner spinner-sm mr-2"></div>
                            Updating...
                          </>
                        ) : (
                          'Update Password'
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Two-Factor Authentication Tab */}
              {activeTab === 'twofa' && (
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <div className="card-body">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <DevicePhoneMobileIcon className="w-8 h-8 text-primary-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">Authenticator App</h4>
                            <p className="text-sm text-gray-600">Use an authenticator app for 2FA</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {user.twoFactorEnabled ? (
                            <>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                                <CheckCircleIcon className="w-3 h-3 mr-1" />
                                Enabled
                              </span>
                              <button
                                onClick={handleDisable2FA}
                                className="btn btn-secondary btn-sm"
                                disabled={loading}
                              >
                                Disable
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={handleEnable2FA}
                              className="btn btn-primary btn-sm"
                              disabled={loading}
                            >
                              Enable
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex">
                          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                          <div className="text-sm text-yellow-800">
                            <p className="font-medium mb-1">Important:</p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Keep your authenticator app secure</li>
                              <li>Save backup codes in a safe place</li>
                              <li>You'll need your phone to log in if 2FA is enabled</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Sessions Tab */}
              {activeTab === 'sessions' && (
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
                    <p className="text-gray-600">Manage devices that are currently logged into your account</p>
                  </div>
                  <div className="card-body">
                    <div className="space-y-4">
                      {/* Current Session */}
                      <div className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">C</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Current Session</h4>
                            <p className="text-sm text-gray-600">Chrome on Windows • Mumbai, India</p>
                            <p className="text-xs text-gray-500">Last active: Now</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          Current
                        </span>
                      </div>

                      {/* Other Sessions */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">M</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Mobile App</h4>
                            <p className="text-sm text-gray-600">iOS App • Mumbai, India</p>
                            <p className="text-xs text-gray-500">Last active: 2 hours ago</p>
                          </div>
                        </div>
                        <button className="btn btn-secondary btn-sm">
                          Revoke
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">F</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Firefox Browser</h4>
                            <p className="text-sm text-gray-600">Firefox on macOS • Mumbai, India</p>
                            <p className="text-xs text-gray-500">Last active: 1 day ago</p>
                          </div>
                        </div>
                        <button className="btn btn-secondary btn-sm">
                          Revoke
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <button className="btn btn-danger">
                        Revoke All Other Sessions
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

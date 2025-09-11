import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CameraIcon,
  CheckCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../lib/auth';
import { userAPI } from '../lib/api';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Profile() {
  const { user, loadUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        pincode: user?.address?.pincode || '',
        country: user?.address?.country || 'India'
      }
    }
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    reset({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: {
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || '',
        country: user.address?.country || 'India'
      }
    });
  }, [user, reset, router]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await userAPI.updateProfile(data);
      await loadUser(); // Refresh user data
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: {
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || '',
        country: user.address?.country || 'India'
      }
    });
    setEditing(false);
  };

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
        <title>Profile - Casyoro</title>
        <meta name="description" content="Manage your Casyoro profile and personal information" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">Casyoro</span>
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                <Link href="/user/dashboard" className="btn btn-secondary">
                  Back to Dashboard
                </Link>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600">Manage your personal information and account details</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Picture & Basic Info */}
            <motion.div
              className="lg:col-span-1"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <div className="card">
                <div className="card-body text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-12 h-12 text-primary-600" />
                      )}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors">
                      <CameraIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-gray-600 mb-2">{user.email}</p>
                  
                  <div className="flex items-center justify-center space-x-2 text-sm text-success-600">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Verified Account</span>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Member Since</p>
                        <p className="font-medium">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total Cashback</p>
                        <p className="font-medium text-success-600">₹{user.totalCashback || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Profile Form */}
            <motion.div
              className="lg:col-span-2"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <div className="card">
                <div className="card-header">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Personal Information
                    </h3>
                    {!editing && (
                      <button
                        onClick={() => setEditing(true)}
                        className="btn btn-secondary btn-sm"
                      >
                        <PencilIcon className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="card-body">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">First Name *</label>
                        <input
                          type="text"
                          className="form-input"
                          disabled={!editing}
                          {...register('firstName', { required: 'First name is required' })}
                        />
                        {errors.firstName && (
                          <p className="form-error">{errors.firstName.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="form-label">Last Name *</label>
                        <input
                          type="text"
                          className="form-input"
                          disabled={!editing}
                          {...register('lastName', { required: 'Last name is required' })}
                        />
                        {errors.lastName && (
                          <p className="form-error">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Email Address *</label>
                      <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          className="form-input pl-10"
                          disabled={true}
                          {...register('email')}
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Email cannot be changed. Contact support if needed.
                      </p>
                    </div>

                    <div>
                      <label className="form-label">Phone Number</label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          className="form-input pl-10"
                          disabled={!editing}
                          placeholder="+91 98765 43210"
                          {...register('phone', {
                            pattern: {
                              value: /^[\+]?[1-9][\d]{0,15}$/,
                              message: 'Please enter a valid phone number'
                            }
                          })}
                        />
                      </div>
                      {errors.phone && (
                        <p className="form-error">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Address Information */}
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Address Information</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="form-label">Street Address</label>
                          <div className="relative">
                            <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              className="form-input pl-10"
                              disabled={!editing}
                              placeholder="Street address"
                              {...register('address.street')}
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="form-label">City</label>
                            <input
                              type="text"
                              className="form-input"
                              disabled={!editing}
                              placeholder="City"
                              {...register('address.city')}
                            />
                          </div>
                          
                          <div>
                            <label className="form-label">State</label>
                            <input
                              type="text"
                              className="form-input"
                              disabled={!editing}
                              placeholder="State"
                              {...register('address.state')}
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="form-label">PIN Code</label>
                            <input
                              type="text"
                              className="form-input"
                              disabled={!editing}
                              placeholder="PIN Code"
                              {...register('address.pincode', {
                                pattern: {
                                  value: /^[1-9][0-9]{5}$/,
                                  message: 'Please enter a valid PIN code'
                                }
                              })}
                            />
                            {errors.address?.pincode && (
                              <p className="form-error">{errors.address.pincode.message}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="form-label">Country</label>
                            <input
                              type="text"
                              className="form-input"
                              disabled={true}
                              {...register('address.country')}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Form Actions */}
                    {editing && (
                      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="btn btn-secondary"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <div className="spinner spinner-sm mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

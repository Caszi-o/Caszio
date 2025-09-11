import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, ShareIcon, CurrencyDollarIcon, UsersIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../lib/auth';
import { PublicRoute } from '../../lib/auth';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function RegisterPromoter() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    socialMediaHandles: {
      instagram: '',
      youtube: '',
      twitter: '',
      facebook: '',
      tiktok: ''
    },
    followerCount: '',
    niche: '',
    experience: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('socialMediaHandles.')) {
      const socialPlatform = name.split('.')[1];
      setFormData({
        ...formData,
        socialMediaHandles: {
          ...formData.socialMediaHandles,
          [socialPlatform]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (formData.firstName.length < 2) {
      toast.error('First name must be at least 2 characters');
      return;
    }
    
    if (formData.lastName.length < 2) {
      toast.error('Last name must be at least 2 characters');
      return;
    }
    
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'promoter',
        socialMediaHandles: formData.socialMediaHandles,
        followerCount: formData.followerCount,
        niche: formData.niche,
        experience: formData.experience
      };
      
      await register(registrationData);
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        toast.error('Backend server is not running. Please start the backend server on port 5000.');
      } else if (error.response?.status === 400) {
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
          toast.error(`Validation errors: ${errorMessages}`);
        } else {
          toast.error(error.response.data.message || 'Invalid registration data');
        }
      } else if (error.response?.status === 409) {
        toast.error('User already exists with this email');
      } else {
        toast.error(error.response?.data?.message || 'Registration failed. Please check backend server.');
      }
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: ShareIcon,
      title: 'Promote & Earn',
      description: 'Share ads and earn money for every click and conversion'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'High Commissions',
      description: 'Earn up to ₹50 per click with our competitive rates'
    },
    {
      icon: ChartBarIcon,
      title: 'Track Performance',
      description: 'Monitor your earnings with detailed analytics'
    }
  ];

  const niches = [
    'Fashion & Beauty',
    'Technology',
    'Food & Cooking',
    'Travel',
    'Fitness & Health',
    'Gaming',
    'Education',
    'Business',
    'Lifestyle',
    'Entertainment',
    'Other'
  ];

  const experienceLevels = [
    'Beginner (0-6 months)',
    'Intermediate (6 months - 2 years)',
    'Advanced (2-5 years)',
    'Expert (5+ years)'
  ];

  const followerRanges = [
    'Under 1K',
    '1K - 10K',
    '10K - 50K',
    '50K - 100K',
    '100K - 500K',
    '500K - 1M',
    'Above 1M'
  ];

  return (
    <PublicRoute>
      <Head>
        <title>Join as Promoter - Casyoro</title>
        <meta name="description" content="Create your Casyoro promoter account to start earning money by promoting ads and content." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">Casyoro</span>
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn btn-primary">
                  Choose Role
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Benefits */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerChildren}
            >
              <motion.div variants={fadeInUp}>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Start <span className="bg-gradient-primary bg-clip-text text-transparent">Earning</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Join Casyoro as a promoter and monetize your social media presence by promoting relevant ads.
                </p>
              </motion.div>

              <motion.div className="space-y-6" variants={staggerChildren}>
                {benefits.map((benefit, index) => (
                  <motion.div key={index} className="flex items-start space-x-4" variants={fadeInUp}>
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <benefit.icon className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div className="mt-8 p-6 bg-success-50 border border-success-200 rounded-lg" variants={fadeInUp}>
                <h3 className="text-lg font-semibold text-success-800 mb-2">💰 Earn More!</h3>
                <p className="text-success-700">
                  Top promoters earn ₹10,000+ per month. Start your journey today!
                </p>
              </motion.div>
            </motion.div>

            {/* Right Side - Registration Form */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Promoter Account</h2>
                <p className="text-gray-600">Join as a promoter to start earning money</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Phone number (e.g., +919876543210)"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* Social Media Handles */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Presence</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                        Instagram Handle
                      </label>
                      <input
                        id="instagram"
                        name="socialMediaHandles.instagram"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="@yourusername"
                        value={formData.socialMediaHandles.instagram}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="youtube" className="block text-sm font-medium text-gray-700 mb-1">
                        YouTube Channel
                      </label>
                      <input
                        id="youtube"
                        name="socialMediaHandles.youtube"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Channel name or URL"
                        value={formData.socialMediaHandles.youtube}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                          Twitter Handle
                        </label>
                        <input
                          id="twitter"
                          name="socialMediaHandles.twitter"
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="@username"
                          value={formData.socialMediaHandles.twitter}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="tiktok" className="block text-sm font-medium text-gray-700 mb-1">
                          TikTok Handle
                        </label>
                        <input
                          id="tiktok"
                          name="socialMediaHandles.tiktok"
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="@username"
                          value={formData.socialMediaHandles.tiktok}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="followerCount" className="block text-sm font-medium text-gray-700 mb-1">
                    Total Followers (across all platforms)
                  </label>
                  <select
                    id="followerCount"
                    name="followerCount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={formData.followerCount}
                    onChange={handleChange}
                  >
                    <option value="">Select follower range</option>
                    {followerRanges.map((range) => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="niche" className="block text-sm font-medium text-gray-700 mb-1">
                    Content Niche
                  </label>
                  <select
                    id="niche"
                    name="niche"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={formData.niche}
                    onChange={handleChange}
                  >
                    <option value="">Select your niche</option>
                    {niches.map((niche) => (
                      <option key={niche} value={niche}>{niche}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                    Content Creation Experience
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={formData.experience}
                    onChange={handleChange}
                  >
                    <option value="">Select experience level</option>
                    {experienceLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                  />
                  <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn btn-primary btn-lg"
                >
                  {loading ? (
                    <>
                      <div className="spinner spinner-sm mr-2"></div>
                      Creating account...
                    </>
                  ) : (
                    'Create Promoter Account'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
                    Sign in here
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}


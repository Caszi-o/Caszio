import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  DocumentTextIcon,
  PhotoIcon,
  UserGroupIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  UserIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { useAuth, ProtectedRoute } from '../../lib/auth';
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

export default function PromoterVerification() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [verificationData, setVerificationData] = useState({
    fullName: '',
    dateOfBirth: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    socialMediaHandles: {
      instagram: '',
      facebook: '',
      twitter: '',
      youtube: '',
      tiktok: ''
    },
    followerCount: '',
    niche: '',
    experience: '',
    previousBrands: '',
    contentTypes: [],
    availability: '',
    paymentMethod: '',
    taxId: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('socialMediaHandles.')) {
      const socialPlatform = name.split('.')[1];
      setVerificationData(prev => ({
        ...prev,
        socialMediaHandles: {
          ...prev.socialMediaHandles,
          [socialPlatform]: value
        }
      }));
    } else if (type === 'checkbox') {
      setVerificationData(prev => ({
        ...prev,
        contentTypes: checked 
          ? [...prev.contentTypes, value]
          : prev.contentTypes.filter(type => type !== value)
      }));
    } else {
      setVerificationData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would call the verification API
      // await promoterAPI.submitVerification(verificationData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Verification submitted successfully! We will review your application within 24-48 hours.');
      
      // Redirect to dashboard
      window.location.href = '/promoter/dashboard';
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Failed to submit verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verificationSteps = [
    {
      id: 1,
      title: 'Personal Information',
      description: 'Provide your personal details',
      icon: UserIcon,
      completed: verificationData.fullName && verificationData.dateOfBirth
    },
    {
      id: 2,
      title: 'Social Media',
      description: 'Add your social media profiles',
      icon: ShareIcon,
      completed: Object.values(verificationData.socialMediaHandles).some(handle => handle.trim() !== '')
    },
    {
      id: 3,
      title: 'Content & Experience',
      description: 'Share your content experience',
      icon: DocumentTextIcon,
      completed: verificationData.niche && verificationData.experience
    },
    {
      id: 4,
      title: 'Payment & Tax',
      description: 'Set up payment information',
      icon: CurrencyDollarIcon,
      completed: verificationData.paymentMethod && verificationData.taxId
    }
  ];

  const contentTypes = [
    'Product Reviews',
    'Unboxing Videos',
    'Tutorials',
    'Lifestyle Content',
    'Fashion & Beauty',
    'Food & Cooking',
    'Travel',
    'Tech Reviews',
    'Fitness & Health',
    'Entertainment'
  ];

  return (
    <ProtectedRoute allowedRoles={['promoter']}>
      <Head>
        <title>Promoter Verification - Casyoro</title>
        <meta name="description" content="Complete your promoter account verification" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            {/* Header */}
            <motion.div className="text-center mb-8" variants={fadeInUp}>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Promoter Account Verification</h1>
              <p className="text-lg text-gray-600">
                Complete your verification to start promoting brands and earning money
              </p>
            </motion.div>

            {/* Progress Steps */}
            <motion.div className="mb-8" variants={fadeInUp}>
              <div className="flex items-center justify-between">
                {verificationSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      step.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'bg-white border-gray-300 text-gray-500'
                    }`}>
                      {step.completed ? (
                        <CheckCircleIcon className="w-6 h-6" />
                      ) : (
                        <span className="text-sm font-medium">{step.id}</span>
                      )}
                    </div>
                    <div className="ml-3 hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">{step.title}</p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                    {index < verificationSteps.length - 1 && (
                      <div className={`hidden sm:block w-16 h-0.5 mx-4 ${
                        step.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Verification Form */}
            <motion.div className="bg-white rounded-lg shadow-sm border border-gray-200" variants={fadeInUp}>
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                <p className="text-sm text-gray-600">Please provide accurate information about yourself</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={verificationData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={verificationData.dateOfBirth}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={verificationData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax ID / SSN
                    </label>
                    <input
                      type="text"
                      name="taxId"
                      value={verificationData.taxId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your tax ID or SSN"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="address"
                      value={verificationData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Street address"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        name="city"
                        value={verificationData.city}
                        onChange={handleChange}
                        required
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="City"
                      />
                      <input
                        type="text"
                        name="state"
                        value={verificationData.state}
                        onChange={handleChange}
                        required
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="State"
                      />
                      <input
                        type="text"
                        name="pincode"
                        value={verificationData.pincode}
                        onChange={handleChange}
                        required
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="ZIP Code"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media Profiles */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Profiles</h3>
                  <p className="text-sm text-gray-600 mb-4">Add your social media handles to showcase your reach</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instagram Handle
                      </label>
                      <input
                        type="text"
                        name="socialMediaHandles.instagram"
                        value={verificationData.socialMediaHandles.instagram}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="@yourusername"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facebook Page
                      </label>
                      <input
                        type="text"
                        name="socialMediaHandles.facebook"
                        value={verificationData.socialMediaHandles.facebook}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Your Facebook page name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter Handle
                      </label>
                      <input
                        type="text"
                        name="socialMediaHandles.twitter"
                        value={verificationData.socialMediaHandles.twitter}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="@yourusername"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        YouTube Channel
                      </label>
                      <input
                        type="text"
                        name="socialMediaHandles.youtube"
                        value={verificationData.socialMediaHandles.youtube}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Your YouTube channel name"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Follower Count (across all platforms)
                    </label>
                    <select
                      name="followerCount"
                      value={verificationData.followerCount}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select follower range</option>
                      <option value="0-1000">0 - 1,000</option>
                      <option value="1000-5000">1,000 - 5,000</option>
                      <option value="5000-10000">5,000 - 10,000</option>
                      <option value="10000-50000">10,000 - 50,000</option>
                      <option value="50000-100000">50,000 - 100,000</option>
                      <option value="100000+">100,000+</option>
                    </select>
                  </div>
                </div>

                {/* Content & Experience */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Content & Experience</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content Niche *
                      </label>
                      <select
                        name="niche"
                        value={verificationData.niche}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select your niche</option>
                        <option value="fashion">Fashion & Beauty</option>
                        <option value="lifestyle">Lifestyle</option>
                        <option value="tech">Technology</option>
                        <option value="food">Food & Cooking</option>
                        <option value="travel">Travel</option>
                        <option value="fitness">Fitness & Health</option>
                        <option value="gaming">Gaming</option>
                        <option value="education">Education</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience
                      </label>
                      <select
                        name="experience"
                        value={verificationData.experience}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select experience level</option>
                        <option value="0-1">0 - 1 year</option>
                        <option value="1-2">1 - 2 years</option>
                        <option value="2-5">2 - 5 years</option>
                        <option value="5+">5+ years</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Types You Create
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {contentTypes.map((type) => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            name="contentTypes"
                            value={type}
                            checked={verificationData.contentTypes.includes(type)}
                            onChange={handleChange}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Previous Brand Collaborations
                    </label>
                    <textarea
                      name="previousBrands"
                      value={verificationData.previousBrands}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="List any brands you've worked with before (optional)"
                    />
                  </div>
                </div>

                {/* Payment & Availability */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment & Availability</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Payment Method *
                      </label>
                      <select
                        name="paymentMethod"
                        value={verificationData.paymentMethod}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select payment method</option>
                        <option value="paypal">PayPal</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="stripe">Stripe</option>
                        <option value="crypto">Cryptocurrency</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Availability
                      </label>
                      <select
                        name="availability"
                        value={verificationData.availability}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select availability</option>
                        <option value="part_time">Part-time (1-2 campaigns/month)</option>
                        <option value="moderate">Moderate (3-5 campaigns/month)</option>
                        <option value="full_time">Full-time (5+ campaigns/month)</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <Link 
                    href="/promoter/dashboard" 
                    className="btn btn-outline-secondary"
                  >
                    Cancel
                  </Link>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? 'Submitting...' : 'Submit Verification'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

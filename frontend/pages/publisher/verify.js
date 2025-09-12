import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  DocumentTextIcon,
  PhotoIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  UserIcon
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

export default function PublisherVerification() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [verificationData, setVerificationData] = useState({
    businessName: '',
    businessType: '',
    website: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    phone: '',
    taxId: '',
    businessDescription: '',
    monthlyBudget: '',
    targetAudience: '',
    marketingGoals: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVerificationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would call the verification API
      // await publisherAPI.submitVerification(verificationData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Verification submitted successfully! We will review your information within 24-48 hours.');
      
      // Redirect to dashboard
      window.location.href = '/publisher/dashboard';
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
      title: 'Business Information',
      description: 'Provide your business details',
      icon: BuildingOfficeIcon,
      completed: verificationData.businessName && verificationData.businessType
    },
    {
      id: 2,
      title: 'Contact Details',
      description: 'Add your contact information',
      icon: UserIcon,
      completed: verificationData.phone && verificationData.address
    },
    {
      id: 3,
      title: 'Business Documents',
      description: 'Upload required documents',
      icon: DocumentTextIcon,
      completed: false // This would be handled by file upload
    },
    {
      id: 4,
      title: 'Marketing Preferences',
      description: 'Set your advertising goals',
      icon: CurrencyDollarIcon,
      completed: verificationData.monthlyBudget && verificationData.targetAudience
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['publisher']}>
      <Head>
        <title>Publisher Verification - Casyoro</title>
        <meta name="description" content="Complete your publisher account verification" />
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Publisher Account Verification</h1>
              <p className="text-lg text-gray-600">
                Complete your verification to start publishing ads and reach thousands of customers
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
                <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>
                <p className="text-sm text-gray-600">Please provide accurate information about your business</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Business Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={verificationData.businessName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your business name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type *
                    </label>
                    <select
                      name="businessType"
                      value={verificationData.businessType}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select business type</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="retail">Retail Store</option>
                      <option value="service">Service Provider</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={verificationData.website}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Description *
                  </label>
                  <textarea
                    name="businessDescription"
                    value={verificationData.businessDescription}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Describe your business, products, or services"
                  />
                </div>

                {/* Contact Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                  
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
                        Tax ID / Business Registration Number
                      </label>
                      <input
                        type="text"
                        name="taxId"
                        value={verificationData.taxId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter your tax ID or registration number"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address *
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
                </div>

                {/* Marketing Preferences */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Marketing Preferences</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Advertising Budget *
                      </label>
                      <select
                        name="monthlyBudget"
                        value={verificationData.monthlyBudget}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select budget range</option>
                        <option value="0-500">$0 - $500</option>
                        <option value="500-1000">$500 - $1,000</option>
                        <option value="1000-5000">$1,000 - $5,000</option>
                        <option value="5000-10000">$5,000 - $10,000</option>
                        <option value="10000+">$10,000+</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Audience *
                      </label>
                      <input
                        type="text"
                        name="targetAudience"
                        value={verificationData.targetAudience}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., Young adults, families, professionals"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marketing Goals
                    </label>
                    <textarea
                      name="marketingGoals"
                      value={verificationData.marketingGoals}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="What do you hope to achieve with your advertising campaigns?"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <Link 
                    href="/publisher/dashboard" 
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

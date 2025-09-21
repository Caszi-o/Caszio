import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  MegaphoneIcon, 
  ShareIcon, 
  ArrowRightIcon,
  GiftIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { PublicRoute } from '../../lib/auth';

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

export default function Register() {

  const roles = [
    {
      id: 'user',
      title: 'User',
      subtitle: 'Earn Cashback',
      description: 'Shop and earn money back on every purchase',
      icon: UserIcon,
      features: ['Earn cashback on purchases', 'Exclusive deals & offers', 'Referral bonuses'],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      link: '/auth/register-user'
    },
    {
      id: 'publisher',
      title: 'Publisher',
      subtitle: 'Advertise Your Business',
      description: 'Promote your business to thousands of users',
      icon: MegaphoneIcon,
      features: ['Reach more customers', 'Detailed analytics', 'Flexible budgeting'],
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      link: '/auth/register-publisher'
    },
    {
      id: 'promoter',
      title: 'Promoter',
      subtitle: 'Earn by Promoting',
      description: 'Monetize your social media presence',
      icon: ShareIcon,
      features: ['High commission rates', 'Track performance', 'Flexible schedule'],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      link: '/auth/register-promoter'
    }
  ];

  return (
    <PublicRoute>
      <Head>
        <title>Choose Your Role - Caszio</title>
        <meta name="description" content="Join Caszio as a user, publisher, or promoter. Choose your role and start your journey today." />
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
                  <span className="text-2xl font-bold text-gray-900">Caszio</span>
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your <span className="bg-gradient-primary bg-clip-text text-transparent">Role</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join Caszio and be part of India's leading cashback and affiliate platform. 
              Choose how you want to participate in our ecosystem.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            {roles.map((role) => (
              <motion.div
                key={role.id}
                className={`${role.bgColor} ${role.borderColor} border-2 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105`}
                variants={fadeInUp}
              >
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${role.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <role.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{role.title}</h3>
                  <p className="text-lg font-semibold text-gray-700 mb-2">{role.subtitle}</p>
                  <p className="text-gray-600">{role.description}</p>
                </div>

                <div className="space-y-3 mb-8">
                  {role.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={role.link}
                  className={`w-full btn bg-gradient-to-r ${role.color} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300`}
                >
                  <span>Join as {role.title}</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-16 text-center"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <p className="text-gray-600 mb-4">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in here
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </PublicRoute>
  );
}

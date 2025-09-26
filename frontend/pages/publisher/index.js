import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  BuildingOfficeIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  UsersIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlayIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../lib/auth';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
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

export default function PublisherLanding() {
  const { user } = useAuth();

  const features = [
    {
      icon: BuildingOfficeIcon,
      title: 'Advanced Ad Management',
      description: 'Create, manage, and optimize your ad campaigns with our powerful dashboard. Track performance in real-time.',
      color: 'bg-primary-500'
    },
    {
      icon: ChartBarIcon,
      title: 'Detailed Analytics',
      description: 'Get comprehensive insights into your ad performance with detailed analytics and reporting tools.',
      color: 'bg-success-500'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Flexible Budgeting',
      description: 'Set your own budget and control your spending with our flexible payment and billing system.',
      color: 'bg-warning-500'
    },
    {
      icon: UsersIcon,
      title: 'Targeted Reach',
      description: 'Reach your target audience through our network of verified affiliate partners.',
      color: 'bg-danger-500'
    }
  ];

  const benefits = [
    'No setup fees or hidden charges',
    'Real-time campaign performance tracking',
    'Dedicated account manager support',
    'Advanced targeting options',
    'Secure payment processing',
    '24/7 customer support'
  ];

  const testimonials = [];

  const stats = [
    { label: 'Active Publishers', value: '500+' },
    { label: 'Campaigns Running', value: '2,500+' },
    { label: 'Total Reach', value: '10M+' },
    { label: 'Average ROI', value: '350%' }
  ];

  return (
    <>
      <Head>
        <title>Publishers - Caszio</title>
        <meta name="description" content="Join Caszio as a publisher and advertise your business to millions of users. Advanced ad management, detailed analytics, and flexible budgeting." />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
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

              <div className="hidden md:flex items-center space-x-8">
                <Link href="/offers" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Offers
                </Link>
                <Link href="/how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors">
                  How it Works
                </Link>
                
                {user ? (
                  <Link href="/user/dashboard" className="btn btn-primary">
                    Dashboard
                  </Link>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link href="/auth/login" className="text-gray-600 hover:text-primary-600 transition-colors">
                      Login
                    </Link>
                    <Link href="/auth/register-publisher" className="btn btn-primary">
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-50 via-white to-success-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div 
              className="text-center"
              initial="initial"
              animate="animate"
              variants={staggerChildren}
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
                variants={fadeInUp}
              >
                Advertise Your Business
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Like Never Before</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
                variants={fadeInUp}
              >
                Join Caszio as a publisher and reach millions of users through our network. 
                Advanced ad management, detailed analytics, and flexible budgeting - all in one platform.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                variants={fadeInUp}
              >
                <Link href="/publisher/apply" className="btn btn-primary btn-lg">
                  Become a Publisher
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
                <Link href="#how-it-works" className="btn btn-secondary btn-lg">
                  <PlayIcon className="w-5 h-5 mr-2" />
                  How it Works
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
                variants={staggerChildren}
              >
                {stats.map((stat, index) => (
                  <motion.div key={index} className="text-center" variants={fadeInUp}>
                    <div className="text-3xl font-bold text-primary-600">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Background decorations */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary-100 rounded-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-success-100 rounded-full opacity-20"></div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our comprehensive platform provides all the tools you need to create, manage, and optimize your advertising campaigns.
              </p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="text-center p-6 rounded-xl hover:shadow-medium transition-shadow"
                  variants={fadeInUp}
                >
                  <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Caszio?
              </h2>
              <p className="text-xl text-gray-600">
                Join hundreds of successful businesses already using our platform
              </p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm"
                  variants={fadeInUp}
                >
                  <CheckCircleIcon className="w-6 h-6 text-success-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Success Stories
              </h2>
              <p className="text-xl text-gray-600">
                See how other publishers are growing their business with Caszio
              </p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-3 gap-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="card"
                  variants={fadeInUp}
                >
                  <div className="card-body">
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-gray-600 mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="bg-success-50 border border-success-200 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium text-success-800">
                        Result: {testimonial.results}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Grow Your Business?
              </h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Join Caszio today and start reaching your target audience with our powerful advertising platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/publisher/apply" className="btn bg-white text-primary-600 hover:bg-gray-50 btn-lg">
                  Apply Now
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/contact" className="btn btn-outline-primary border-white text-white hover:bg-white hover:text-primary-600 btn-lg">
                  Contact Sales
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                  <span className="text-2xl font-bold">Caszio</span>
                </div>
                <p className="text-gray-400 mb-4">
                  India's leading cashback and affiliate platform helping businesses grow and users save.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Platform</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/offers" className="hover:text-white transition-colors">Offers</Link></li>
                  <li><Link href="/cashback" className="hover:text-white transition-colors">Cashback</Link></li>
                  <li><Link href="/publisher" className="hover:text-white transition-colors">Publishers</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                  <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Caszio. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

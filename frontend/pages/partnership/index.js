import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HandshakeIcon,
  GlobeAltIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import Layout from '../../components/Layout';

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

export default function Partnership() {
  const benefits = [
    {
      icon: GlobeAltIcon,
      title: 'Global Reach',
      description: 'Access millions of potential customers across India through our platform'
    },
    {
      icon: ChartBarIcon,
      title: 'Advanced Analytics',
      description: 'Get detailed insights into your campaign performance and ROI'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Flexible Pricing',
      description: 'Choose from CPC, CPA, or revenue-sharing models that work for you'
    },
    {
      icon: UsersIcon,
      title: 'Targeted Audience',
      description: 'Reach specific demographics and interests with precision targeting'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Quality Assurance',
      description: 'Our fraud detection ensures high-quality traffic and genuine conversions'
    },
    {
      icon: HandshakeIcon,
      title: 'Dedicated Support',
      description: 'Get personal account management and marketing strategy consultation'
    }
  ];

  const features = [
    'Real-time campaign management',
    'Advanced targeting options',
    'Detailed performance analytics',
    'Multiple ad formats support',
    'Fraud protection & quality control',
    'Flexible payment terms',
    '24/7 customer support',
    'API integration available'
  ];

  const process = [
    {
      step: '01',
      title: 'Submit Application',
      description: 'Fill out our partnership application with your company details and marketing goals.'
    },
    {
      step: '02',
      title: 'Review Process',
      description: 'Our team reviews your application within 2-3 business days.'
    },
    {
      step: '03',
      title: 'Account Setup',
      description: 'Once approved, we help you set up your account and create your first campaign.'
    },
    {
      step: '04',
      title: 'Start Advertising',
      description: 'Launch your campaigns and start reaching your target audience immediately.'
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Partnership Program - Caszio</title>
        <meta name="description" content="Partner with Caszio to reach millions of customers. Advanced advertising platform with targeting, analytics, and dedicated support." />
        <meta name="keywords" content="partnership, advertising, digital marketing, customer acquisition, Caszio" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <motion.section
          initial="initial"
          animate="animate"
          variants={staggerChildren}
          className="bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16"
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <motion.div variants={fadeInUp}>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  Grow Your Business with
                  <span className="text-blue-600 block">Caszio Partnership</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Join India's leading cashback and advertising platform. Reach millions of potential customers 
                  with our advanced targeting, real-time analytics, and dedicated account management.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/partnership/apply"
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl inline-flex items-center justify-center"
                  >
                    Apply for Partnership
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="#benefits"
                    className="border border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="py-16 bg-gray-50"
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: '10M+', label: 'Active Users' },
                { number: '50K+', label: 'Partner Brands' },
                { number: '₹100Cr+', label: 'Revenue Generated' },
                { number: '98%', label: 'Customer Satisfaction' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section
          id="benefits"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-4">
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Partner with Caszio?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands of successful brands who trust Caszio to drive their customer acquisition and growth.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <benefit.icon className="h-12 w-12 text-blue-600 mb-6" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="py-20 bg-gray-50"
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div variants={fadeInUp}>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Powerful Features for Your Success
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Our platform provides everything you need to run successful advertising campaigns 
                  and maximize your return on investment.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="relative">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl text-white">
                  <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                  <p className="text-blue-100 mb-6">
                    Join our partnership program today and start reaching millions of potential customers.
                  </p>
                  <Link
                    href="/partnership/apply"
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center"
                  >
                    Apply Now
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Process Section */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-4">
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Getting started with Caszio partnership is simple and straightforward.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((step, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold mx-auto mb-6">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="py-20 bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of successful brands and start growing your customer base today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/partnership/apply"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl inline-flex items-center justify-center"
                >
                  Start Your Partnership
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/contact"
                  className="border border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Contact Sales Team
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </Layout>
  );
}

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

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

export default function Cashback() {
  const [stats, setStats] = useState({
    totalUsers: '50,000+',
    totalCashback: '₹2.5 Cr+',
    avgMonthlyEarning: '₹1,250',
    topCashback: '₹25,000'
  });

  const features = [
    {
      icon: CreditCardIcon,
      title: 'Automatic Tracking',
      description: 'Link your cards and bank accounts for seamless cashback tracking across all purchases.',
      benefits: [
        'Real-time transaction monitoring',
        'Works with all major banks',
        'No manual order entry needed',
        'Secure bank-level encryption'
      ]
    },
    {
      icon: BanknotesIcon,
      title: 'Instant Cashback',
      description: 'Earn cashback immediately on qualifying purchases from our 500+ partner merchants.',
      benefits: [
        'Cashback credited within 24-48 hours',
        'Up to 20% cashback on purchases',
        'No minimum purchase requirements',
        'Works online and in-store'
      ]
    },
    {
      icon: ChartBarIcon,
      title: 'Smart Analytics',
      description: 'Track your earnings, spending patterns, and discover new opportunities to earn more.',
      benefits: [
        'Detailed earning breakdowns',
        'Monthly spending insights',
        'Personalized recommendations',
        'Goal setting and tracking'
      ]
    }
  ];

  const topMerchants = [
    { name: 'Amazon', logo: '/images/merchants/amazon.png', cashback: '2-5%', category: 'Shopping' },
    { name: 'Flipkart', logo: '/images/merchants/flipkart.png', cashback: '3-7%', category: 'Electronics' },
    { name: 'Myntra', logo: '/images/merchants/myntra.png', cashback: '4-8%', category: 'Fashion' },
    { name: 'Swiggy', logo: '/images/merchants/swiggy.png', cashback: '2-6%', category: 'Food' },
    { name: 'Ola', logo: '/images/merchants/ola.png', cashback: '1-3%', category: 'Travel' },
    { name: 'BookMyShow', logo: '/images/merchants/bookmyshow.png', cashback: '2-4%', category: 'Entertainment' }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Sign Up & Verify',
      description: 'Create your free account and verify your email to get started.'
    },
    {
      step: 2,
      title: 'Link Your Accounts',
      description: 'Securely connect your bank accounts and credit cards for automatic tracking.'
    },
    {
      step: 3,
      title: 'Shop Normally',
      description: 'Continue shopping at your favorite stores online and offline.'
    },
    {
      step: 4,
      title: 'Earn Automatically',
      description: 'Watch your cashback accumulate automatically with every purchase.'
    }
  ];

  return (
    <>
      <Head>
        <title>Cashback Program - Casyoro</title>
        <meta name="description" content="Earn automatic cashback on every purchase with Casyoro. Get up to 20% cashback from 500+ merchants without any manual effort." />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">Casyoro</span>
              </Link>
              
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Home
                </Link>
                <Link href="/offers" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Offers
                </Link>
                <Link href="/cashback" className="text-primary-600 font-medium">
                  Cashback
                </Link>
                <Link href="/how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors">
                  How it Works
                </Link>
                <Link href="/auth/login" className="btn btn-primary">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 via-white to-success-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Automatic Cashback on
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Every Purchase</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                India's first fully automated cashback system. Link your accounts once and earn cashback automatically on every purchase without any manual effort.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/auth/register" className="btn btn-primary btn-lg">
                  Start Earning Cashback
                </Link>
                <Link href="#how-it-works" className="btn btn-secondary btn-lg">
                  Learn How It Works
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {Object.entries(stats).map(([key, value]) => (
                  <motion.div 
                    key={key} 
                    className="text-center"
                    variants={fadeInUp}
                  >
                    <div className="text-3xl font-bold text-primary-600">{value}</div>
                    <div className="text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Casyoro Cashback?
              </h2>
              <p className="text-xl text-gray-600">
                The most advanced and user-friendly cashback system in India
              </p>
            </motion.div>

            <motion.div
              className="grid lg:grid-cols-3 gap-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  className="card hover:shadow-lg transition-shadow"
                  variants={fadeInUp}
                >
                  <div className="card-body">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Top Merchants Section */}
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
                Top Cashback Merchants
              </h2>
              <p className="text-xl text-gray-600">
                Earn cashback from India's most popular brands
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {topMerchants.map((merchant) => (
                <motion.div
                  key={merchant.name}
                  className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                  variants={fadeInUp}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={merchant.logo}
                        alt={merchant.name}
                        width={40}
                        height={40}
                        className="rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{merchant.name}</h3>
                        <p className="text-sm text-gray-500">{merchant.category}</p>
                      </div>
                    </div>
                    <span className="badge badge-success">
                      {merchant.cashback}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Earn up to {merchant.cashback} cashback on all purchases
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <div className="text-center mt-12">
              <Link href="/offers" className="btn btn-primary btn-lg">
                View All Merchants
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How Automatic Cashback Works
              </h2>
              <p className="text-xl text-gray-600">
                Start earning in just 4 simple steps
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {howItWorks.map((step) => (
                <motion.div
                  key={step.step}
                  className="text-center"
                  variants={fadeInUp}
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl font-bold text-primary-600">{step.step}</span>
                    </div>
                    {step.step < 4 && (
                      <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-primary-200"></div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-20 bg-gradient-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Calculate Your Potential Earnings
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                See how much you could earn with automatic cashback
              </p>
              
              <div className="bg-white rounded-xl p-8 max-w-md mx-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Spending (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="10,000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div className="bg-primary-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Estimated Monthly Earnings:</span>
                      <span className="text-2xl font-bold text-primary-600">₹400</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-700">Yearly Earnings:</span>
                      <span className="text-xl font-semibold text-primary-600">₹4,800</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    *Based on average 4% cashback across all merchants
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/auth/register" className="btn bg-white text-primary-600 hover:bg-gray-50 btn-lg">
                  Start Earning Now
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
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
                What Our Users Say
              </h2>
              <p className="text-xl text-gray-600">
                Real stories from real cashback earners
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {[
                {
                  name: 'Priya Sharma',
                  role: 'Software Engineer',
                  earning: '₹8,500/month',
                  quote: 'I earn ₹8,500 monthly just by shopping normally. The automatic tracking is amazing!'
                },
                {
                  name: 'Rajesh Kumar',
                  role: 'Business Owner',
                  earning: '₹15,000/month',
                  quote: 'Casyoro has helped me save thousands on business expenses while earning cashback.'
                },
                {
                  name: 'Sneha Patel',
                  role: 'Student',
                  earning: '₹3,200/month',
                  quote: 'As a student, every rupee counts. Casyoro helps me save money on daily purchases.'
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="card"
                  variants={fadeInUp}
                >
                  <div className="card-body">
                    <div className="flex items-center mb-4">
                      <ArrowTrendingUpIcon className="w-8 h-8 text-green-500" />
                      <span className="ml-2 text-green-600 font-semibold">
                        {testimonial.earning}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 italic">
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ready to Start Earning Automatic Cashback?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join 50,000+ users who are already earning ₹2.5Cr+ in automatic cashback with Casyoro
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register" className="btn btn-primary btn-lg">
                  Get Started Free
                </Link>
                <Link href="/how-it-works" className="btn btn-secondary btn-lg">
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}

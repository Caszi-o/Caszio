import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  UsersIcon, 
  GlobeAltIcon,
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

export default function PromoterLanding() {
  const { user } = useAuth();

  const features = [
    {
      icon: CurrencyDollarIcon,
      title: 'Earn Per Click',
      description: 'Get paid for every click on your promoted ads. The more traffic you drive, the more you earn.',
      color: 'bg-success-500'
    },
    {
      icon: ChartBarIcon,
      title: 'Real-time Analytics',
      description: 'Track your performance with detailed analytics and see your earnings grow in real-time.',
      color: 'bg-primary-500'
    },
    {
      icon: UsersIcon,
      title: 'Build Your Audience',
      description: 'Grow your following by promoting valuable offers and building trust with your audience.',
      color: 'bg-warning-500'
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Reach',
      description: 'Promote ads to audiences worldwide and maximize your earning potential.',
      color: 'bg-danger-500'
    }
  ];

  const benefits = [
    'No upfront investment required',
    'Flexible working hours',
    'Multiple payment methods',
    'Dedicated support team',
    'High commission rates',
    'Easy-to-use dashboard'
  ];

  const testimonials = [
    {
      name: 'Sneha Patel',
      platform: 'Instagram Influencer',
      image: '/images/testimonials/promoter1.jpg',
      rating: 5,
      content: 'I earn ₹25,000+ monthly by promoting ads through Casyoro. It\'s been life-changing!',
      earnings: '₹25,000+ monthly'
    },
    {
      name: 'Rahul Singh',
      platform: 'YouTube Creator',
      image: '/images/testimonials/promoter2.jpg',
      rating: 5,
      content: 'The platform is so easy to use. I can track my earnings and manage campaigns effortlessly.',
      earnings: '₹40,000+ monthly'
    },
    {
      name: 'Priya Sharma',
      platform: 'Blogger',
      image: '/images/testimonials/promoter3.jpg',
      rating: 5,
      content: 'Casyoro has helped me monetize my blog effectively. The commission rates are excellent.',
      earnings: '₹18,000+ monthly'
    }
  ];

  const stats = [
    { label: 'Active Promoters', value: '2,500+' },
    { label: 'Total Earnings Paid', value: '₹50L+' },
    { label: 'Average Monthly Income', value: '₹15K+' },
    { label: 'Success Rate', value: '95%' }
  ];

  return (
    <>
      <Head>
        <title>Promoters - Casyoro</title>
        <meta name="description" content="Join Casyoro as a promoter and earn money by promoting ads. Flexible hours, high commissions, and real-time analytics." />
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
                  <span className="text-2xl font-bold text-gray-900">Casyoro</span>
                </Link>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <Link href="/offers" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Offers
                </Link>
                <Link href="/how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors">
                  How it Works
                </Link>
                <Link href="/publisher" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Publishers
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
                    <Link href="/auth/register-promoter" className="btn btn-primary">
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-success-50 via-white to-primary-50 overflow-hidden">
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
                Earn Money by
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Promoting Ads</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
                variants={fadeInUp}
              >
                Join Casyoro as a promoter and start earning money by promoting ads to your audience. 
                Flexible hours, high commission rates, and real-time analytics - perfect for influencers, bloggers, and content creators.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                variants={fadeInUp}
              >
                <Link href="/promoter/apply" className="btn btn-primary btn-lg">
                  Become a Promoter
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
                    <div className="text-3xl font-bold text-success-600">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Background decorations */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-success-100 rounded-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-primary-100 rounded-full opacity-20"></div>
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
                Why Choose Casyoro?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our platform is designed to help you maximize your earning potential with minimal effort.
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
                Perfect for Everyone
              </h2>
              <p className="text-xl text-gray-600">
                Whether you're a beginner or an experienced promoter, Casyoro has something for you
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
                See how other promoters are earning with Casyoro
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
                        Monthly Earnings: {testimonial.earnings}
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
                        <div className="text-sm text-gray-500">{testimonial.platform}</div>
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
                Ready to Start Earning?
              </h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Join thousands of promoters already earning with Casyoro. Start your journey today!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/promoter/apply" className="btn bg-white text-primary-600 hover:bg-gray-50 btn-lg">
                  Apply Now
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/contact" className="btn btn-outline-primary border-white text-white hover:bg-white hover:text-primary-600 btn-lg">
                  Learn More
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
                  <span className="text-2xl font-bold">Casyoro</span>
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
                  <li><Link href="/promoter" className="hover:text-white transition-colors">Promoters</Link></li>
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
              <p>&copy; 2024 Casyoro. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

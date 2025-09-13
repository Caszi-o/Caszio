import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  CreditCardIcon, 
  GiftIcon, 
  ChartBarIcon, 
  ShoppingBagIcon,
  StarIcon,
  CheckIcon,
  ArrowRightIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../lib/auth';
import { offersAPI } from '../lib/api';

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

export default function Home() {
  const { user } = useAuth();
  const [featuredOffers, setFeaturedOffers] = useState([]);
  const [stats, setStats] = useState({
    users: '0',
    cashback: '₹0',
    merchants: '0',
    savings: '₹0'
  });

  // Load featured offers
  useEffect(() => {
    loadFeaturedOffers();
  }, []);

  const loadFeaturedOffers = async () => {
    try {
      const response = await offersAPI.getFeaturedOffers();
      setFeaturedOffers(response.data.data.slice(0, 6));
    } catch (error) {
      console.error('Failed to load featured offers:', error);
    }
  };

  const features = [
    {
      icon: CreditCardIcon,
      title: 'Automatic Cashback',
      description: 'Earn cashback automatically on every purchase without manual order entry. Link your accounts and start earning.',
      color: 'bg-primary-500'
    },
    {
      icon: GiftIcon,
      title: 'Exclusive Coupons',
      description: 'Access thousands of exclusive coupons and deals from top brands. Save more on every purchase.',
      color: 'bg-success-500'
    },
    {
      icon: ChartBarIcon,
      title: 'Publisher Tools',
      description: 'Grow your business with our advanced ad management system. Target your audience effectively.',
      color: 'bg-warning-500'
    },
    {
      icon: ShoppingBagIcon,
      title: 'Promoter Network',
      description: 'Monetize your traffic by promoting ads. Earn per click and build sustainable income streams.',
      color: 'bg-danger-500'
    }
  ];

  const testimonials = [];

  const merchants = [
    { name: 'Amazon', logo: '/images/merchants/Amazon-logo.jpeg' },
    { name: 'Flipkart', logo: '/images/merchants/Flipkart-Logo.jpg' },
    { name: 'Myntra', logo: '/images/merchants/Myntra-Logo.jpg' },
    { name: 'Ajio', logo: '/images/merchants/Ajio-Logo.jpg' },
    { name: 'Nykaa', logo: '/images/merchants/Nykaa-Logo.png' },
    { name: 'Tata CLiQ', logo: '/images/merchants/Tata-Cliq-Logo.jpg' }
  ];

  return (
    <>
      <Head>
        <title>Casyoro - India's Leading Cashback & Affiliate Platform</title>
        <meta name="description" content="Earn automatic cashback, find exclusive coupons, and grow your business with our comprehensive affiliate platform." />
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
                <Link href="/promoter" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Promoters
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
                    <Link href="/auth/register" className="btn btn-primary">
                      Get Started
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button className="text-gray-600 hover:text-gray-900">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
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
                Earn Cashback on
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Every Purchase</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
                variants={fadeInUp}
              >
                India's first fully automated cashback platform. Link your accounts, shop normally, 
                and earn cashback without manual order entry. Join 50K+ users earning ₹2.5Cr+ in cashback.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                variants={fadeInUp}
              >
                <Link href="/auth/register" className="btn btn-primary btn-lg">
                  Start Earning Cashback
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/how-it-works" className="btn btn-secondary btn-lg">
                  <PlayIcon className="w-5 h-5 mr-2" />
                  How it Works
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
                variants={staggerChildren}
              >
                {Object.entries(stats).map(([key, value]) => (
                  <motion.div key={key} className="text-center" variants={fadeInUp}>
                    <div className="text-3xl font-bold text-primary-600">{value}</div>
                    <div className="text-gray-600 capitalize">{key}</div>
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
                Everything You Need in One Platform
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                From automatic cashback to advanced ad management, we've built the complete ecosystem for modern commerce.
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

        {/* Featured Offers */}
        {featuredOffers.length > 0 && (
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
                  Featured Offers
                </h2>
                <p className="text-xl text-gray-600">
                  Discover the best deals and highest cashback rates
                </p>
              </motion.div>

              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerChildren}
              >
                {featuredOffers.map((offer) => (
                  <motion.div
                    key={offer._id}
                    className="card hover:shadow-medium transition-shadow"
                    variants={fadeInUp}
                  >
                    <div className="card-body">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {offer.merchant.logo && (
                            <Image
                              src={offer.merchant.logo}
                              alt={offer.merchant.name}
                              width={40}
                              height={40}
                              className="rounded-lg"
                            />
                          )}
                          <span className="font-semibold text-gray-900">{offer.merchant.name}</span>
                        </div>
                        <span className="badge badge-success">
                          {offer.cashbackPercentage}% Cashback
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{offer.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{offer.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Valid until {new Date(offer.endDate).toLocaleDateString()}
                        </span>
                        <Link href={`/offers/${offer._id}`} className="btn btn-primary btn-sm">
                          View Offer
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <div className="text-center mt-12">
                <Link href="/offers" className="btn btn-primary btn-lg">
                  View All Offers
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Merchants */}
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
                Partner Merchants
              </h2>
              <p className="text-xl text-gray-600">
                Earn cashback from 500+ top brands and retailers
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {merchants.map((merchant) => (
                <motion.div
                  key={merchant.name}
                  className="flex items-center justify-center p-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-gray-50"
                  variants={fadeInUp}
                >
                  <Image
                    src={merchant.logo}
                    alt={merchant.name}
                    width={120}
                    height={60}
                    className="max-w-full h-auto"
                  />
                </motion.div>
              ))}
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
                Join thousands of satisfied users earning more every day
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
                        <div className="text-sm text-gray-500">{testimonial.role}</div>
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
                Join Casyoro today and start earning cashback on every purchase. It's free, automatic, and rewarding.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register" className="btn bg-white text-primary-600 hover:bg-gray-50 btn-lg">
                  Get Started Free
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/how-it-works" className="btn btn-outline-primary border-white text-white hover:bg-white hover:text-primary-600 btn-lg">
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
                  India's leading cashback and affiliate platform helping users earn more on every purchase.
                </p>
                <div className="flex space-x-4">
                  {/* Social media links */}
                </div>
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
                  <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
                  <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Casyoro. All rights reserved. | Made with ❤️ for Peter Thiel Fellowship</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  LinkIcon,
  ShareIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../lib/auth';
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

export default function AffiliateProgram() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const affiliateLink = user ? `https://casyoro.com/ref/${user.referralCode}` : 'https://casyoro.com/ref/your-code';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(affiliateLink);
      setCopied(true);
      toast.success('Affiliate link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const features = [
    {
      icon: CurrencyDollarIcon,
      title: 'Earn ₹100 Per Referral',
      description: 'Get ₹100 for every friend who signs up using your referral link',
      color: 'bg-success-500'
    },
    {
      icon: UsersIcon,
      title: 'Unlimited Referrals',
      description: 'No limit on how many people you can refer. The more, the merrier!',
      color: 'bg-primary-500'
    },
    {
      icon: ChartBarIcon,
      title: 'Track Your Earnings',
      description: 'Monitor your referral earnings with detailed analytics and reports',
      color: 'bg-warning-500'
    },
    {
      icon: ShareIcon,
      title: 'Easy Sharing',
      description: 'Share your referral link on social media, email, or any platform',
      color: 'bg-danger-500'
    }
  ];

  const benefits = [
    '₹100 bonus for each successful referral',
    'Your friend gets ₹50 welcome bonus',
    'Real-time tracking of referrals',
    'Instant payouts to your wallet',
    'No minimum withdrawal limit',
    '24/7 support for affiliates'
  ];

  const steps = [
    {
      step: 1,
      title: 'Get Your Link',
      description: 'Copy your unique referral link from your dashboard',
      icon: LinkIcon
    },
    {
      step: 2,
      title: 'Share with Friends',
      description: 'Share your link on social media, WhatsApp, or email',
      icon: ShareIcon
    },
    {
      step: 3,
      title: 'They Sign Up',
      description: 'Your friends sign up and verify their account',
      icon: UsersIcon
    },
    {
      step: 4,
      title: 'Earn Money',
      description: 'You get ₹100 when they complete their first transaction',
      icon: CurrencyDollarIcon
    }
  ];

  const stats = [
    { label: 'Total Referrals', value: user?.referralCount || 0 },
    { label: 'Earnings This Month', value: `₹${user?.referralEarnings || 0}` },
    { label: 'Pending Referrals', value: user?.pendingReferrals || 0 },
    { label: 'Total Earned', value: `₹${user?.totalReferralEarnings || 0}` }
  ];

  return (
    <>
      <Head>
        <title>Affiliate Program - Casyoro</title>
        <meta name="description" content="Join Casyoro's affiliate program and earn ₹100 for every friend you refer. Start earning today!" />
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
                Earn ₹100 for
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Every Friend</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
                variants={fadeInUp}
              >
                Join Casyoro's affiliate program and earn money by referring friends. 
                Your friends get ₹50 welcome bonus, and you earn ₹100 for each successful referral!
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                variants={fadeInUp}
              >
                {user ? (
                  <Link href="/user/dashboard" className="btn btn-primary btn-lg">
                    Go to Dashboard
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </Link>
                ) : (
                  <Link href="/auth/register" className="btn btn-primary btn-lg">
                    Join Now
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </Link>
                )}
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

        {/* How It Works */}
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
                How It Works
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
              {steps.map((step, index) => (
                <motion.div
                  key={step.step}
                  className="text-center"
                  variants={fadeInUp}
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-success-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{step.step}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
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
                Why Choose Our Affiliate Program?
              </h2>
              <p className="text-xl text-gray-600">
                The best affiliate program with the highest payouts
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
                Program Benefits
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to succeed as an affiliate
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
                  className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg"
                  variants={fadeInUp}
                >
                  <CheckCircleIcon className="w-6 h-6 text-success-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Affiliate Link Section */}
        {user && (
          <section className="py-20 bg-primary-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Your Affiliate Link
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Share this link with your friends to start earning
                </p>
                
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={affiliateLink}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                      />
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className={`btn ${copied ? 'btn-success' : 'btn-primary'}`}
                    >
                      {copied ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

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
                Join thousands of affiliates already earning with Casyoro. Start your journey today!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Link href="/user/dashboard" className="btn bg-white text-primary-600 hover:bg-gray-50 btn-lg">
                    Go to Dashboard
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </Link>
                ) : (
                  <Link href="/auth/register" className="btn bg-white text-primary-600 hover:bg-gray-50 btn-lg">
                    Join Now
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </Link>
                )}
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

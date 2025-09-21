import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  UserPlusIcon,
  LinkIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  CheckCircleIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function HowItWorks() {
  const steps = [
    {
      icon: UserPlusIcon,
      title: 'Sign Up Free',
      description: 'Create your Caszio account in under 2 minutes. Choose your role: User, Publisher, or Promoter.',
      details: [
        'No credit card required',
        'Email verification for security',
        'Choose from multiple user types',
        'Access to basic features immediately'
      ]
    },
    {
      icon: LinkIcon,
      title: 'Link Your Accounts',
      description: 'Connect your bank accounts, cards, and shopping accounts for automatic cashback tracking.',
      details: [
        'Bank-level security encryption',
        'Read-only access to transactions',
        'Support for major banks and cards',
        'Instant sync across platforms'
      ]
    },
    {
      icon: ShoppingBagIcon,
      title: 'Shop Normally',
      description: 'Continue shopping at your favorite stores online and offline. No need to remember to activate offers.',
      details: [
        'Works with 500+ partner merchants',
        'Online and in-store purchases',
        'No manual order entry required',
        'Automatic deal detection'
      ]
    },
    {
      icon: CreditCardIcon,
      title: 'Earn Automatically',
      description: 'Watch your cashback accumulate automatically. Get real-time notifications for every earning.',
      details: [
        'Instant cashback notifications',
        'Detailed earning breakdowns',
        'Track across all merchants',
        'Monthly earning summaries'
      ]
    }
  ];

  const userTypes = [
    {
      title: 'For Users',
      subtitle: 'Earn Cashback Automatically',
      icon: '🛍️',
      features: [
        'Automatic cashback on purchases',
        'Access to exclusive coupons',
        'Real-time earning notifications',
        'Seamless withdrawal process',
        'No manual order entry needed'
      ],
      cta: 'Start Earning',
      href: '/auth/register?role=user'
    },
    {
      title: 'For Publishers',
      subtitle: 'Advertise Your Business',
      icon: '📢',
      features: [
        'Advanced ad targeting system',
        'Real-time campaign analytics',
        'Multiple ad format support',
        'ROI tracking and optimization',
        'Dedicated account management'
      ],
      cta: 'Start Advertising',
      href: '/auth/register?role=publisher'
    },
    {
      title: 'For Promoters',
      subtitle: 'Monetize Your Traffic',
      icon: '💰',
      features: [
        'Earn per click and conversion',
        'Easy-to-use promotion tools',
        'Performance-based payouts',
        'Detailed earning analytics',
        'Multiple payout methods'
      ],
      cta: 'Start Promoting',
      href: '/auth/register?role=promoter'
    }
  ];

  const faqs = [
    {
      question: 'How does automatic cashback work?',
      answer: 'Once you link your accounts, our secure system monitors your transactions and automatically credits cashback when you shop at partner merchants. No manual intervention required.'
    },
    {
      question: 'Is my financial data secure?',
      answer: 'Yes, we use bank-level encryption and only access read-only transaction data. We never store your login credentials or have access to move money from your accounts.'
    },
    {
      question: 'How quickly do I receive cashback?',
      answer: 'Cashback is usually credited within 24-48 hours of purchase confirmation. Some merchants may take up to 7 days for cashback to appear in your account.'
    },
    {
      question: 'What\'s the minimum withdrawal amount?',
      answer: 'The minimum withdrawal amount is ₹100. You can withdraw your earnings directly to your bank account or digital wallet.'
    },
    {
      question: 'Are there any fees?',
      answer: 'Caszio is completely free for users. Publishers and promoters pay only when they see results - no upfront costs or hidden fees.'
    }
  ];

  return (
    <>
      <Head>
        <title>How It Works - Caszio</title>
        <meta name="description" content="Learn how Caszio's automatic cashback system works. Earn money on every purchase without manual order entry." />
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
                <span className="text-2xl font-bold text-gray-900">Caszio</span>
              </Link>
              
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Home
                </Link>
                <Link href="/offers" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Offers
                </Link>
                <Link href="/how-it-works" className="text-primary-600 font-medium">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                How Caszio Works
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Discover how our automatic cashback system revolutionizes the way you earn money on every purchase
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register" className="btn btn-primary btn-lg">
                  Get Started Free
                </Link>
                <button className="btn btn-secondary btn-lg">
                  <PlayIcon className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Steps */}
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
                Start Earning in 4 Simple Steps
              </h2>
              <p className="text-xl text-gray-600">
                Our automated system makes earning cashback effortless
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
                  key={step.title}
                  className="text-center"
                  variants={fadeInUp}
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {step.description}
                  </p>
                  
                  <ul className="text-sm text-gray-500 text-left space-y-1">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* User Types */}
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
                Choose Your Journey
              </h2>
              <p className="text-xl text-gray-600">
                Different paths to success on our platform
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {userTypes.map((type) => (
                <motion.div
                  key={type.title}
                  className="card hover:shadow-lg transition-shadow"
                  variants={fadeInUp}
                >
                  <div className="card-body text-center">
                    <div className="text-4xl mb-4">{type.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {type.title}
                    </h3>
                    <p className="text-primary-600 font-medium mb-6">
                      {type.subtitle}
                    </p>
                    
                    <ul className="text-left space-y-3 mb-8">
                      {type.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link href={type.href} className="btn btn-primary w-full">
                      {type.cta}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to know about Caszio
              </p>
            </motion.div>

            <motion.div
              className="space-y-6"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                  variants={fadeInUp}
                >
                  <details className="group">
                    <summary className="flex items-center justify-between p-6 cursor-pointer">
                      <h3 className="text-lg font-medium text-gray-900">
                        {faq.question}
                      </h3>
                      <svg
                        className="w-5 h-5 text-gray-500 transform group-open:rotate-180 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-6 pb-6">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </details>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-primary py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Join thousands of users who are already earning with Caszio. It's free, automated, and rewarding.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register" className="btn bg-white text-primary-600 hover:bg-gray-50 btn-lg">
                  Get Started Free
                </Link>
                <Link href="/contact" className="btn btn-outline-primary border-white text-white hover:bg-white hover:text-primary-600 btn-lg">
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}

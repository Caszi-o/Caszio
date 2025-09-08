import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function RefundPolicy() {
  const lastUpdated = "January 1, 2024";

  return (
    <>
      <Head>
        <title>Refund Policy - Casyoro</title>
        <meta name="description" content="Learn about Casyoro's refund policy for cashback, subscriptions, and other services." />
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
                <Link href="/help" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Help
                </Link>
                <Link href="/contact" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Contact
                </Link>
                <Link href="/auth/login" className="btn btn-primary">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Header */}
        <section className="bg-gradient-to-br from-primary-50 via-white to-success-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <CurrencyDollarIcon className="w-16 h-16 text-primary-600 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Refund Policy
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                Our commitment to fair and transparent refund practices
              </p>
              <p className="text-sm text-gray-500">
                Last updated: {lastUpdated}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Overview */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Key Points</h2>
                <ul className="text-blue-800 space-y-2">
                  <li>• Cashback services are free - no refunds needed for basic services</li>
                  <li>• Subscription services have a 30-day money-back guarantee</li>
                  <li>• Processing fees are non-refundable</li>
                  <li>• Refund requests must be made within specified timeframes</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Service Categories */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Refund Policies by Service</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Free Services */}
                <div className="card">
                  <div className="card-body">
                    <div className="flex items-center mb-4">
                      <CheckCircleIcon className="w-8 h-8 text-green-500 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900">Free Services</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Our core cashback service is completely free for users.
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Account creation and basic features</li>
                      <li>• Automatic cashback tracking</li>
                      <li>• Standard customer support</li>
                      <li>• Mobile app access</li>
                    </ul>
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-green-800 text-sm font-medium">
                        No payment required = No refunds applicable
                      </p>
                    </div>
                  </div>
                </div>

                {/* Premium Services */}
                <div className="card">
                  <div className="card-body">
                    <div className="flex items-center mb-4">
                      <CurrencyDollarIcon className="w-8 h-8 text-primary-500 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900">Premium Services</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Advanced features and services with subscription fees.
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Advanced analytics dashboard</li>
                      <li>• Priority customer support</li>
                      <li>• Enhanced cashback rates</li>
                      <li>• Custom reporting tools</li>
                    </ul>
                    <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                      <p className="text-primary-800 text-sm font-medium">
                        30-day money-back guarantee
                      </p>
                    </div>
                  </div>
                </div>

                {/* Publisher Services */}
                <div className="card">
                  <div className="card-body">
                    <div className="flex items-center mb-4">
                      <ExclamationCircleIcon className="w-8 h-8 text-orange-500 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900">Publisher Services</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Advertising services with performance-based pricing.
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Ad campaign management</li>
                      <li>• Targeting and optimization</li>
                      <li>• Performance analytics</li>
                      <li>• Account management</li>
                    </ul>
                    <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                      <p className="text-orange-800 text-sm font-medium">
                        Refunds based on unused ad spend only
                      </p>
                    </div>
                  </div>
                </div>

                {/* Processing Fees */}
                <div className="card">
                  <div className="card-body">
                    <div className="flex items-center mb-4">
                      <ClockIcon className="w-8 h-8 text-gray-500 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900">Processing Fees</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Transaction and payment processing charges.
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Payment gateway fees</li>
                      <li>• International transfer charges</li>
                      <li>• Express withdrawal fees</li>
                      <li>• Currency conversion fees</li>
                    </ul>
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-800 text-sm font-medium">
                        Processing fees are non-refundable
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Refund Process */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How to Request a Refund</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    step: 1,
                    title: 'Contact Support',
                    description: 'Send a refund request to our support team with your account details and reason for refund.'
                  },
                  {
                    step: 2,
                    title: 'Review Process',
                    description: 'Our team will review your request within 3-5 business days and verify eligibility.'
                  },
                  {
                    step: 3,
                    title: 'Refund Processing',
                    description: 'Approved refunds are processed within 7-10 business days to your original payment method.'
                  }
                ].map((step) => (
                  <div key={step.step} className="text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary-600 font-bold">{step.step}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Requirements for Refund Requests</h3>
                <ul className="text-yellow-800 space-y-1">
                  <li>• Request must be made within the specified timeframe</li>
                  <li>• Provide detailed reason for the refund request</li>
                  <li>• Include relevant transaction or subscription details</li>
                  <li>• Account must be in good standing</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Special Circumstances */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Special Circumstances</h2>
              
              <div className="space-y-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Technical Issues</h3>
                    <p className="text-gray-600 mb-3">
                      If you experience technical issues that prevent you from using our services, we may offer:
                    </p>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Service credit for the affected period</li>
                      <li>• Extension of subscription period</li>
                      <li>• Full or partial refund in severe cases</li>
                    </ul>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Duplicate Charges</h3>
                    <p className="text-gray-600 mb-3">
                      If you are accidentally charged multiple times for the same service:
                    </p>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Duplicate charges will be refunded within 3-5 business days</li>
                      <li>• No questions asked for obvious billing errors</li>
                      <li>• Contact support immediately when you notice duplicate charges</li>
                    </ul>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Suspension</h3>
                    <p className="text-gray-600 mb-3">
                      If your account is suspended due to our error:
                    </p>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Full refund for any unused subscription period</li>
                      <li>• Restoration of account access when possible</li>
                      <li>• Compensation for any lost earnings due to our error</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="bg-primary-50 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help with a Refund?</h2>
                <p className="text-gray-600 mb-6">
                  Our support team is here to help you with any refund requests or billing questions.
                </p>
                
                <div className="space-y-2 text-gray-600 mb-6">
                  <p><strong>Email:</strong> billing@casyoro.com</p>
                  <p><strong>Support:</strong> support@casyoro.com</p>
                  <p><strong>Phone:</strong> +91 98765 43210</p>
                </div>
                
                <Link href="/contact" className="btn btn-primary mr-4">
                  Contact Support
                </Link>
                <Link href="/help" className="btn btn-secondary">
                  Help Center
                </Link>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                    Terms of Service
                  </Link>
                  <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                    Privacy Policy
                  </Link>
                  <Link href="/disclaimer" className="text-primary-600 hover:text-primary-700">
                    Disclaimer
                  </Link>
                  <Link href="/contact" className="text-primary-600 hover:text-primary-700">
                    Contact Us
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}

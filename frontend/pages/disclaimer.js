import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ShieldExclamationIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Disclaimer() {
  const lastUpdated = "January 1, 2024";

  return (
    <>
      <Head>
        <title>Disclaimer - Casyoro</title>
        <meta name="description" content="Important disclaimers and limitations regarding Casyoro's cashback and affiliate services." />
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
        <section className="bg-gradient-to-br from-red-50 via-white to-orange-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <ExclamationTriangleIcon className="w-16 h-16 text-orange-600 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Disclaimer
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                Important information about the limitations and responsibilities regarding our services
              </p>
              <p className="text-sm text-gray-500">
                Last updated: {lastUpdated}
              </p>
            </motion.div>
          </div>
        </section>

        {/* General Disclaimer */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-red-900 mb-4">Important Notice</h2>
                <p className="text-red-800 leading-relaxed">
                  The information provided by Casyoro is for general informational purposes only. 
                  While we strive to keep the information up to date and correct, we make no representations 
                  or warranties of any kind, express or implied, about the completeness, accuracy, reliability, 
                  suitability, or availability of our services.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Service Disclaimers */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Service-Specific Disclaimers</h2>
              
              <div className="space-y-8">
                {/* Cashback Disclaimer */}
                <div className="card">
                  <div className="card-body">
                    <div className="flex items-start space-x-4">
                      <InformationCircleIcon className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Cashback Services</h3>
                        <ul className="text-gray-600 space-y-2">
                          <li>• Cashback rates are subject to change without notice</li>
                          <li>• Cashback eligibility depends on merchant terms and conditions</li>
                          <li>• Processing times may vary based on merchant confirmation</li>
                          <li>• Some transactions may not be eligible for cashback</li>
                          <li>• We do not guarantee cashback for all purchases</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Investment Disclaimer */}
                <div className="card">
                  <div className="card-body">
                    <div className="flex items-start space-x-4">
                      <ShieldExclamationIcon className="w-8 h-8 text-orange-500 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Not Investment Advice</h3>
                        <ul className="text-gray-600 space-y-2">
                          <li>• Casyoro is not a financial advisor or investment platform</li>
                          <li>• Our services do not constitute investment advice</li>
                          <li>• Earnings through our platform are not guaranteed</li>
                          <li>• Past performance does not predict future results</li>
                          <li>• Users should conduct their own financial research</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Third-Party Services */}
                <div className="card">
                  <div className="card-body">
                    <div className="flex items-start space-x-4">
                      <DocumentTextIcon className="w-8 h-8 text-purple-500 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Services</h3>
                        <ul className="text-gray-600 space-y-2">
                          <li>• We partner with various merchants and service providers</li>
                          <li>• We are not responsible for third-party terms or policies</li>
                          <li>• Merchant offers and terms may change without notice</li>
                          <li>• Issues with purchases should be resolved with the merchant</li>
                          <li>• We do not endorse all partner merchant practices</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Limitation of Liability</h2>
              
              <div className="prose prose-lg max-w-none">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">Maximum Liability</h3>
                  <p className="text-yellow-800">
                    To the maximum extent permitted by applicable law, Casyoro shall not be liable for any 
                    indirect, incidental, special, consequential, or punitive damages, including but not limited 
                    to loss of profits, data, use, goodwill, or other intangible losses.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">We Are Not Liable For:</h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Service interruptions or downtime</li>
                      <li>• Loss of cashback due to merchant issues</li>
                      <li>• Technical errors or system failures</li>
                      <li>• Third-party merchant policies or actions</li>
                      <li>• Changes in cashback rates or terms</li>
                      <li>• User error or misuse of services</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Maximum Damages:</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 mb-2">
                        Our total liability to you for any claims shall not exceed:
                      </p>
                      <ul className="text-gray-600 space-y-1">
                        <li>• The amount you paid us in the last 12 months, or</li>
                        <li>• ₹10,000, whichever is less</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* User Responsibilities */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">User Responsibilities</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="card">
                  <div className="card-body">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Security</h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Keep your login credentials secure</li>
                      <li>• Monitor your account for unauthorized activity</li>
                      <li>• Report security issues immediately</li>
                      <li>• Use strong, unique passwords</li>
                      <li>• Enable two-factor authentication when available</li>
                    </ul>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Compliance</h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Follow all applicable laws and regulations</li>
                      <li>• Provide accurate information</li>
                      <li>• Comply with merchant terms and conditions</li>
                      <li>• Use services for legitimate purposes only</li>
                      <li>• Report any issues or discrepancies promptly</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Changes and Updates */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Changes to This Disclaimer</h2>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-blue-800 mb-4">
                  We reserve the right to update this disclaimer at any time. Changes will be effective 
                  immediately upon posting the updated disclaimer on our website.
                </p>
                <p className="text-blue-800 mb-4">
                  We encourage you to review this disclaimer periodically to stay informed about our 
                  current limitations and responsibilities.
                </p>
                <p className="text-blue-800 font-medium">
                  Your continued use of our services after any changes constitutes acceptance of the new disclaimer.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About This Disclaimer?</h2>
                <p className="text-gray-600 mb-6">
                  If you have any questions about this disclaimer, please contact our legal team.
                </p>
                
                <div className="space-y-2 text-gray-600 mb-6">
                  <p><strong>Email:</strong> legal@casyoro.com</p>
                  <p><strong>Support:</strong> support@casyoro.com</p>
                  <p><strong>Address:</strong> Bangalore, Karnataka, India</p>
                </div>
                
                <Link href="/contact" className="btn btn-primary mr-4">
                  Contact Us
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
                  <Link href="/refund" className="text-primary-600 hover:text-primary-700">
                    Refund Policy
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

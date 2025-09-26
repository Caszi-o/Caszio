import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon,
  ScaleIcon,
  UserIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Terms() {
  const lastUpdated = "January 1, 2024";
  const effectiveDate = "January 1, 2024";

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: DocumentTextIcon,
      content: [
        {
          subtitle: 'Agreement to Terms',
          details: 'By accessing or using Casyoro\'s services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our services.'
        },
        {
          subtitle: 'Eligibility',
          details: 'You must be at least 18 years old and have the legal capacity to enter into contracts to use our services. By using our platform, you represent and warrant that you meet these requirements.'
        },
        {
          subtitle: 'Modifications',
          details: 'We reserve the right to modify these terms at any time. We will notify users of material changes via email or platform notifications. Continued use after modifications constitutes acceptance of the new terms.'
        }
      ]
    },
    {
      id: 'services',
      title: 'Description of Services',
      icon: CreditCardIcon,
      content: [
        {
          subtitle: 'Cashback Platform',
          details: 'Casyoro provides an automated cashback platform that rewards users for purchases made at participating merchants. We track eligible transactions and credit cashback to user accounts according to our cashback policies.'
        },
        {
          subtitle: 'Publisher Services',
          details: 'We offer advertising services for businesses (Publishers) to create and manage ad campaigns. Publishers can target audiences and track campaign performance through our platform.'
        },
        {
          subtitle: 'Affiliate Network',
          details: 'Our affiliate program allows users to earn commissions by promoting offers and driving traffic to merchant partners. Affiliates are compensated based on performance metrics.'
        },
        {
          subtitle: 'Service Availability',
          details: 'While we strive for continuous availability, we do not guarantee uninterrupted access to our services. We may temporarily suspend services for maintenance, updates, or other operational needs.'
        }
      ]
    },
    {
      id: 'user-obligations',
      title: 'User Obligations',
      icon: UserIcon,
      content: [
        {
          subtitle: 'Account Responsibility',
          details: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.'
        },
        {
          subtitle: 'Accurate Information',
          details: 'You agree to provide accurate, current, and complete information when creating your account and to update this information as necessary to maintain its accuracy.'
        },
        {
          subtitle: 'Prohibited Activities',
          details: 'You may not use our services for any illegal, fraudulent, or unauthorized purposes. This includes but is not limited to: manipulating cashback systems, creating fake accounts, or violating merchant terms.'
        },
        {
          subtitle: 'Compliance',
          details: 'You agree to comply with all applicable laws, regulations, and these terms when using our services. You are responsible for ensuring your use complies with local laws in your jurisdiction.'
        }
      ]
    },
    {
      id: 'financial-terms',
      title: 'Financial Terms',
      icon: ScaleIcon,
      content: [
        {
          subtitle: 'Cashback Eligibility',
          details: 'Cashback is earned only on qualifying purchases made through our platform or at participating merchants. Cashback rates and eligibility criteria may vary by merchant and are subject to change.'
        },
        {
          subtitle: 'Payment Processing',
          details: 'Cashback payments are typically processed within 7-14 business days of reaching the minimum withdrawal threshold. Payment methods and processing times may vary based on your location and chosen withdrawal method.'
        },
        {
          subtitle: 'Fees and Charges',
          details: 'Basic cashback services are provided free of charge to users. Publishers may be subject to service fees as outlined in their respective agreements. We reserve the right to introduce reasonable fees with advance notice.'
        },
        {
          subtitle: 'Disputes and Refunds',
          details: 'Cashback disputes must be reported within 90 days of the original transaction. We will investigate all legitimate disputes and may adjust cashback amounts if errors are found. Refund policies vary by service type.'
        }
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Terms of Service - Casyoro</title>
        <meta name="description" content="Read Casyoro's Terms of Service to understand your rights and obligations when using our cashback and affiliate platform." />
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
              <DocumentTextIcon className="w-16 h-16 text-primary-600 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Terms of Service
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                Please read these terms carefully before using our services. They govern your use of the Casyoro platform.
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Last updated: {lastUpdated}</p>
                <p>Effective date: {effectiveDate}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
              <div className="grid md:grid-cols-2 gap-2">
                {sections.map((section, index) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all"
                  >
                    <section.icon className="w-5 h-5 text-primary-600 mr-3" />
                    <span className="text-gray-900 font-medium">{index + 1}. {section.title}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Casyoro</h2>
                <p className="text-gray-600 mb-6">
                  These Terms of Service ("Terms") govern your use of Casyoro's cashback and affiliate marketing platform ("Service") operated by Casyoro ("us," "we," or "our"). Our Service provides automated cashback rewards, advertising solutions for businesses, and monetization opportunities for affiliates.
                </p>
                <p className="text-gray-600 mb-6">
                  By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Notes</h3>
                  <ul className="text-yellow-800 space-y-1">
                    <li>• These terms constitute a legally binding agreement</li>
                    <li>• You must be 18 or older to use our services</li>
                    <li>• We may update these terms with notice to users</li>
                    <li>• Violation of terms may result in account suspension</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Sections */}
        {sections.map((section, index) => (
          <section key={section.id} id={section.id} className={`py-12 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <div className="flex items-center mb-6">
                  <section.icon className="w-8 h-8 text-primary-600 mr-4" />
                  <h2 className="text-3xl font-bold text-gray-900">
                    {index + 1}. {section.title}
                  </h2>
                </div>
                
                <div className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="border-l-4 border-primary-200 pl-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {item.subtitle}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.details}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        ))}

        {/* Additional Terms */}
        <section className="py-12 bg-primary-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Additional Important Terms</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Intellectual Property</h3>
                  <p className="text-gray-600 mb-4">
                    All content, features, and functionality of our Service are owned by Casyoro and are protected by copyright, trademark, and other intellectual property laws.
                  </p>
                  <p className="text-gray-600">
                    You may not reproduce, distribute, modify, or create derivative works of our content without express written permission.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Limitation of Liability</h3>
                  <p className="text-gray-600 mb-4">
                    To the maximum extent permitted by law, Casyoro shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.
                  </p>
                  <p className="text-gray-600">
                    Our total liability shall not exceed the amount you have paid to us in the twelve months preceding the claim.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Indemnification</h3>
                  <p className="text-gray-600">
                    You agree to indemnify and hold harmless Casyoro from any claims, damages, or expenses arising from your use of our services or violation of these terms.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Governing Law</h3>
                  <p className="text-gray-600">
                    These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact & Related */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Questions or Concerns?</h2>
              
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-6">
                  If you have any questions about these Terms of Service, please don't hesitate to contact us. 
                  We're here to help clarify any aspects of our agreement.
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Documents</h3>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                    Privacy Policy
                  </Link>
                  <Link href="/refund" className="text-primary-600 hover:text-primary-700">
                    Refund Policy
                  </Link>
                  <Link href="/disclaimer" className="text-primary-600 hover:text-primary-700">
                    Disclaimer
                  </Link>
                  <Link href="/help" className="text-primary-600 hover:text-primary-700">
                    Help Center
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

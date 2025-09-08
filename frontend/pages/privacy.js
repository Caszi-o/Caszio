import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon,
  LockClosedIcon,
  EyeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Privacy() {
  const lastUpdated = "January 1, 2024";

  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: EyeIcon,
      content: [
        {
          subtitle: 'Personal Information',
          details: 'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This includes your name, email address, phone number, and payment information.'
        },
        {
          subtitle: 'Transaction Data',
          details: 'To provide cashback services, we securely access read-only transaction data from your linked bank accounts and credit cards. We only see transaction amounts, merchant names, and dates.'
        },
        {
          subtitle: 'Usage Information',
          details: 'We collect information about how you use our services, including your interactions with offers, cashback earnings, and website navigation patterns.'
        },
        {
          subtitle: 'Device Information',
          details: 'We automatically collect certain information about your device, including IP address, browser type, operating system, and device identifiers.'
        }
      ]
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      icon: UserGroupIcon,
      content: [
        {
          subtitle: 'Service Provision',
          details: 'We use your information to provide, maintain, and improve our cashback services, including processing transactions and calculating earnings.'
        },
        {
          subtitle: 'Communication',
          details: 'We may send you service-related emails, promotional offers, and account updates. You can opt out of promotional communications at any time.'
        },
        {
          subtitle: 'Personalization',
          details: 'We use your information to personalize your experience, recommend relevant offers, and improve our services based on your preferences.'
        },
        {
          subtitle: 'Security and Fraud Prevention',
          details: 'We use your information to verify your identity, prevent fraud, and ensure the security of our platform and your account.'
        }
      ]
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing',
      icon: LockClosedIcon,
      content: [
        {
          subtitle: 'Merchant Partners',
          details: 'We may share necessary information with merchant partners to facilitate cashback transactions and verify purchases.'
        },
        {
          subtitle: 'Service Providers',
          details: 'We work with trusted third-party service providers who help us operate our platform. These providers are bound by strict confidentiality agreements.'
        },
        {
          subtitle: 'Legal Requirements',
          details: 'We may disclose your information if required by law, regulation, or legal process, or to protect the rights, property, or safety of Casyoro or others.'
        },
        {
          subtitle: 'Business Transfers',
          details: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction.'
        }
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: ShieldCheckIcon,
      content: [
        {
          subtitle: 'Encryption',
          details: 'All sensitive data is encrypted both in transit and at rest using industry-standard encryption protocols.'
        },
        {
          subtitle: 'Access Controls',
          details: 'We implement strict access controls and regularly review who has access to personal information within our organization.'
        },
        {
          subtitle: 'Security Monitoring',
          details: 'Our systems are continuously monitored for security threats and vulnerabilities. We conduct regular security audits and assessments.'
        },
        {
          subtitle: 'Incident Response',
          details: 'We have established procedures to respond to security incidents and will notify you promptly of any breach that may affect your personal information.'
        }
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Privacy Policy - Casyoro</title>
        <meta name="description" content="Learn how Casyoro protects your privacy and handles your personal information. Read our comprehensive privacy policy." />
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
              <ShieldCheckIcon className="w-16 h-16 text-primary-600 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Privacy Policy
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                Your privacy is important to us. This policy explains how we collect, use, and protect your information.
              </p>
              <p className="text-sm text-gray-500">
                Last updated: {lastUpdated}
              </p>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                <p className="text-gray-600 mb-6">
                  Casyoro ("we," "our," or "us") is committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our cashback and affiliate marketing services.
                </p>
                <p className="text-gray-600 mb-6">
                  By using our services, you agree to the collection and use of information in accordance with this policy. We will not use or share your information with anyone except as described in this Privacy Policy.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Key Principles</h3>
                  <ul className="text-blue-800 space-y-1">
                    <li>• We only collect information necessary to provide our services</li>
                    <li>• We use bank-level security to protect your data</li>
                    <li>• We never sell your personal information to third parties</li>
                    <li>• You have control over your privacy settings and data</li>
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

        {/* Your Rights */}
        <section className="py-12 bg-primary-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Privacy Rights</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Access Your Data',
                    description: 'You can request a copy of all personal information we have about you.'
                  },
                  {
                    title: 'Update Information',
                    description: 'You can update or correct your personal information at any time through your account settings.'
                  },
                  {
                    title: 'Delete Your Account',
                    description: 'You can request deletion of your account and associated personal information.'
                  },
                  {
                    title: 'Data Portability',
                    description: 'You can request your data in a portable format to transfer to another service.'
                  },
                  {
                    title: 'Opt-Out',
                    description: 'You can opt out of marketing communications while still receiving service-related messages.'
                  },
                  {
                    title: 'Restrict Processing',
                    description: 'You can request that we limit how we process your personal information in certain situations.'
                  }
                ].map((right, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">{right.title}</h3>
                    <p className="text-gray-600 text-sm">{right.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">
                  To exercise any of these rights, please contact us at{' '}
                  <a href="mailto:privacy@casyoro.com" className="text-primary-600 hover:text-primary-700">
                    privacy@casyoro.com
                  </a>
                </p>
                <Link href="/contact" className="btn btn-primary">
                  Contact Privacy Team
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact & Updates */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us & Policy Updates</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Questions About This Policy?</h3>
                  <p className="text-gray-600 mb-4">
                    If you have any questions about this Privacy Policy or our data practices, please don't hesitate to contact us.
                  </p>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Email:</strong> privacy@casyoro.com</p>
                    <p><strong>Address:</strong> Bangalore, Karnataka, India</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Policy Updates</h3>
                  <p className="text-gray-600 mb-4">
                    We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
                  </p>
                  <p className="text-gray-600">
                    We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                    Terms of Service
                  </Link>
                  <Link href="/refund" className="text-primary-600 hover:text-primary-700">
                    Refund Policy
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

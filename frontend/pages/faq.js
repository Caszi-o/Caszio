import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ChevronDownIcon,
  ChevronUpIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function FAQ() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqCategories = [
    {
      title: 'Getting Started',
      questions: [
        {
          question: 'How do I create an account on Caszio?',
          answer: 'Creating an account is simple! Click on "Get Started" or "Register" button, fill in your details including name, email, and password. You\'ll receive a confirmation email to verify your account.'
        },
        {
          question: 'Is Caszio free to use?',
          answer: 'Yes, Caszio is completely free for users! You can browse offers, earn cashback, and use all basic features without any charges. Some premium features may have additional costs.'
        },
        {
          question: 'How does cashback work?',
          answer: 'When you make a purchase through our platform, you earn a percentage of your purchase amount back as cashback. This cashback is credited to your Caszio wallet and can be withdrawn to your bank account.'
        }
      ]
    },
    {
      title: 'Cashback & Rewards',
      questions: [
        {
          question: 'How much cashback can I earn?',
          answer: 'Cashback rates vary by merchant and offer, typically ranging from 1% to 15% of your purchase amount. Some special promotions may offer even higher rates.'
        },
        {
          question: 'When will my cashback be credited?',
          answer: 'Cashback is usually credited within 24-48 hours after your purchase is confirmed by the merchant. For some merchants, it may take up to 7 days.'
        },
        {
          question: 'What is the minimum withdrawal amount?',
          answer: 'The minimum withdrawal amount is ₹100. You can withdraw your cashback to your bank account or use it for future purchases on our platform.'
        }
      ]
    },
    {
      title: 'Account & Security',
      questions: [
        {
          question: 'How do I reset my password?',
          answer: 'Click on "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your email to reset your password.'
        },
        {
          question: 'Is my personal information safe?',
          answer: 'Yes, we take your privacy and security seriously. All your personal information is encrypted and stored securely. We never share your data with third parties without your consent.'
        },
        {
          question: 'Can I link multiple bank accounts?',
          answer: 'Currently, you can link one primary bank account for withdrawals. You can update your bank account details anytime from your account settings.'
        }
      ]
    },
    {
      title: 'Publishers & Promoters',
      questions: [
        {
          question: 'How do I become a publisher?',
          answer: 'Click on "Become a Publisher" and fill out the application form. Our team will review your application and contact you within 24-48 hours to guide you through the verification process.'
        },
        {
          question: 'How do I become a promoter?',
          answer: 'Click on "Become a Promoter" and complete the application. Once approved, you can start promoting ads and earning commissions for every click or conversion.'
        },
        {
          question: 'What are the commission rates for promoters?',
          answer: 'Commission rates vary by campaign and advertiser, typically ranging from ₹5 to ₹50 per click. High-performing promoters may qualify for higher rates.'
        }
      ]
    },
    {
      title: 'Technical Support',
      questions: [
        {
          question: 'The app is not working properly. What should I do?',
          answer: 'Try refreshing the page or clearing your browser cache. If the issue persists, contact our support team with details about the problem you\'re experiencing.'
        },
        {
          question: 'How do I contact customer support?',
          answer: 'You can reach our support team through the "Contact Us" page, email us at support@casyoro.com, or use the live chat feature on our website.'
        },
        {
          question: 'What browsers are supported?',
          answer: 'Caszio works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your browser.'
        }
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>FAQ - Frequently Asked Questions | Caszio</title>
        <meta name="description" content="Find answers to common questions about Caszio cashback, rewards, account management, and more." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">Caszio</span>
                </Link>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <Link href="/offers" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Offers
                </Link>
                <Link href="/help" className="text-primary-600 font-medium">
                  Help
                </Link>
                <Link href="/contact" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            className="text-center mb-12"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <QuestionMarkCircleIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600">
              Find answers to common questions about Caszio
            </p>
          </motion.div>

          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                className="bg-white rounded-lg shadow-sm border"
                initial="initial"
                animate="animate"
                variants={fadeInUp}
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {category.title}
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {category.questions.map((item, itemIndex) => {
                    const globalIndex = `${categoryIndex}-${itemIndex}`;
                    const isOpen = openItems[globalIndex];
                    
                    return (
                      <div key={itemIndex} className="p-6">
                        <button
                          onClick={() => toggleItem(globalIndex)}
                          className="flex justify-between items-center w-full text-left"
                        >
                          <h3 className="text-lg font-medium text-gray-900 pr-4">
                            {item.question}
                          </h3>
                          {isOpen ? (
                            <ChevronUpIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDownIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4"
                          >
                            <p className="text-gray-600 leading-relaxed">
                              {item.answer}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Support */}
          <motion.div
            className="mt-12 bg-primary-50 border border-primary-200 rounded-lg p-8 text-center"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <Link href="/contact" className="btn btn-primary">
              Contact Support
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}

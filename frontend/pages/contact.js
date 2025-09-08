import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon
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

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      title: 'Email Us',
      details: 'support@casyoro.com',
      description: 'Send us an email anytime'
    },
    {
      icon: PhoneIcon,
      title: 'Call Us',
      details: '+91 98765 43210',
      description: 'Mon-Fri, 9:00 AM - 6:00 PM IST'
    },
    {
      icon: MapPinIcon,
      title: 'Visit Us',
      details: 'Bangalore, Karnataka, India',
      description: 'Our headquarters'
    },
    {
      icon: ClockIcon,
      title: 'Response Time',
      details: 'Within 24 hours',
      description: 'We respond quickly'
    }
  ];

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'partnership', label: 'Business Partnership' },
    { value: 'feedback', label: 'Feedback & Suggestions' },
    { value: 'bug', label: 'Report a Bug' }
  ];

  const faqs = [
    {
      question: 'How does automatic cashback work?',
      answer: 'Once you link your accounts, our system automatically tracks your purchases at partner merchants and credits cashback to your account within 24-48 hours.'
    },
    {
      question: 'When will I receive my cashback?',
      answer: 'Cashback is typically credited within 24-48 hours of purchase confirmation. Some merchants may take up to 7 days.'
    },
    {
      question: 'What is the minimum withdrawal amount?',
      answer: 'The minimum withdrawal amount is ₹100. You can withdraw to your bank account or digital wallet.'
    },
    {
      question: 'How do I become a publisher or promoter?',
      answer: 'You can apply to become a publisher or promoter during registration or through your dashboard. Applications are reviewed within 2-3 business days.'
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  return (
    <>
      <Head>
        <title>Contact Us - Casyoro</title>
        <meta name="description" content="Get in touch with Casyoro. We're here to help with any questions about cashback, technical support, or partnerships." />
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
                <Link href="/help" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Help
                </Link>
                <Link href="/contact" className="text-primary-600 font-medium">
                  Contact
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
                Get in Touch
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Have questions about Casyoro? We're here to help! Reach out to our friendly support team.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {contactInfo.map((info) => (
                <motion.div
                  key={info.title}
                  className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  variants={fadeInUp}
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-primary-600 font-medium mb-1">
                    {info.details}
                  </p>
                  <p className="text-sm text-gray-500">
                    {info.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Form & FAQ */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>

                {submitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-green-700 mb-4">
                      Thank you for contacting us. We'll respond within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn btn-primary"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        {categories.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn btn-primary btn-lg"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                )}
              </motion.div>

              {/* FAQ Section */}
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-600 mb-8">
                  Quick answers to common questions. Can't find what you're looking for?
                </p>

                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <details className="group">
                        <summary className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                          <h3 className="font-medium text-gray-900">
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
                        <div className="p-4 bg-white">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-primary-50 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <ChatBubbleLeftRightIcon className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-primary-900 mb-2">
                        Need More Help?
                      </h3>
                      <p className="text-primary-700 mb-4">
                        Visit our comprehensive help center for detailed guides and tutorials.
                      </p>
                      <Link href="/help" className="btn btn-primary btn-sm">
                        Visit Help Center
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

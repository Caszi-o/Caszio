import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  BookOpenIcon,
  CreditCardIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon
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

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpenIcon },
    { id: 'getting-started', name: 'Getting Started', icon: UserGroupIcon },
    { id: 'cashback', name: 'Cashback & Earnings', icon: CreditCardIcon },
    { id: 'accounts', name: 'Account Management', icon: ShieldCheckIcon },
    { id: 'publisher', name: 'For Publishers', icon: ChartBarIcon },
    { id: 'promoter', name: 'For Promoters', icon: ChatBubbleLeftRightIcon },
  ];

  const articles = [
    {
      id: 1,
      title: 'How to Get Started with Caszio',
      category: 'getting-started',
      description: 'Complete guide to setting up your account and earning your first cashback',
      readTime: '5 min read',
      tags: ['beginner', 'setup', 'account']
    },
    {
      id: 2,
      title: 'Understanding Automatic Cashback',
      category: 'cashback',
      description: 'Learn how our automatic cashback system works and maximizes your earnings',
      readTime: '7 min read',
      tags: ['cashback', 'automatic', 'earnings']
    },
    {
      id: 3,
      title: 'Linking Your Bank Accounts and Cards',
      category: 'accounts',
      description: 'Step-by-step guide to securely connecting your financial accounts',
      readTime: '4 min read',
      tags: ['security', 'linking', 'accounts']
    },
    {
      id: 4,
      title: 'Withdrawing Your Earnings',
      category: 'cashback',
      description: 'How to withdraw your cashback to your bank account or digital wallet',
      readTime: '3 min read',
      tags: ['withdrawal', 'payout', 'bank']
    },
    {
      id: 5,
      title: 'Creating Effective Ad Campaigns',
      category: 'publisher',
      description: 'Best practices for publishers to create high-converting ad campaigns',
      readTime: '10 min read',
      tags: ['advertising', 'campaigns', 'conversion']
    },
    {
      id: 6,
      title: 'Maximizing Your Promoter Earnings',
      category: 'promoter',
      description: 'Tips and strategies to increase your earnings as a promoter',
      readTime: '8 min read',
      tags: ['promotion', 'earnings', 'strategy']
    },
    {
      id: 7,
      title: 'Account Security and Privacy',
      category: 'accounts',
      description: 'How we protect your data and what you can do to keep your account secure',
      readTime: '6 min read',
      tags: ['security', 'privacy', 'protection']
    },
    {
      id: 8,
      title: 'Troubleshooting Common Issues',
      category: 'getting-started',
      description: 'Solutions to frequently encountered problems and error messages',
      readTime: '5 min read',
      tags: ['troubleshooting', 'errors', 'solutions']
    }
  ];

  const popularQuestions = [
    {
      question: 'How does automatic cashback work?',
      answer: 'Our system securely monitors your linked accounts and automatically credits cashback when you shop at partner merchants.'
    },
    {
      question: 'When will I receive my cashback?',
      answer: 'Cashback is typically credited within 24-48 hours of purchase confirmation from the merchant.'
    },
    {
      question: 'What is the minimum withdrawal amount?',
      answer: 'The minimum withdrawal amount is ₹100. You can withdraw to your bank account or digital wallet.'
    },
    {
      question: 'Is my financial data safe?',
      answer: 'Yes, we use bank-level encryption and only access read-only transaction data. We never store login credentials.'
    },
    {
      question: 'How do I become a publisher?',
      answer: 'You can apply to become a publisher during registration or upgrade your account in the dashboard.'
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Head>
        <title>Help Center - Caszio</title>
        <meta name="description" content="Find answers to your questions about Caszio. Get help with cashback, account setup, and more." />
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
                <Link href="/help" className="text-primary-600 font-medium">
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

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 via-white to-success-50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                How can we help you?
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Find answers to your questions and get the most out of Caszio
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg border transition-colors text-center ${
                    selectedCategory === category.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                  variants={fadeInUp}
                >
                  <category.icon className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{category.name}</span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Popular Questions */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Popular Questions
              </h2>
              <p className="text-gray-600">
                Quick answers to the most common questions
              </p>
            </motion.div>

            <motion.div
              className="space-y-4"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {popularQuestions.map((item, index) => (
                <motion.div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                  variants={fadeInUp}
                >
                  <details className="group">
                    <summary className="flex items-center justify-between p-6 cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                      <h3 className="font-medium text-gray-900 flex items-center">
                        <QuestionMarkCircleIcon className="w-5 h-5 text-primary-600 mr-3" />
                        {item.question}
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
                    <div className="px-6 pb-6 bg-gray-50">
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  </details>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Help Articles */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Help Articles
              </h2>
              <p className="text-gray-600">
                Detailed guides and tutorials to help you succeed
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {filteredArticles.map((article) => (
                <motion.div
                  key={article.id}
                  className="card hover:shadow-lg transition-shadow"
                  variants={fadeInUp}
                >
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-primary-600 font-medium uppercase tracking-wider">
                        {categories.find(c => c.id === article.category)?.name}
                      </span>
                      <span className="text-xs text-gray-500">{article.readTime}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <Link href={`/help/${article.id}`} className="btn btn-primary btn-sm w-full">
                      Read Article
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or browse different categories
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="btn btn-primary"
                >
                  Reset Search
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Still Need Help?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Can't find what you're looking for? Our support team is here to help
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <Link href="/contact" className="card hover:shadow-lg transition-shadow text-center">
                  <div className="card-body">
                    <ChatBubbleLeftRightIcon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
                    <p className="text-gray-600 text-sm">Send us a message and get help from our team</p>
                  </div>
                </Link>
                
                <div className="card text-center">
                  <div className="card-body">
                    <BookOpenIcon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                    <p className="text-gray-600 text-sm mb-3">Chat with our support team in real-time</p>
                    <button className="btn btn-primary btn-sm">
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}

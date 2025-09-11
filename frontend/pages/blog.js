import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  CalendarIcon,
  UserIcon,
  ArrowRightIcon,
  TagIcon
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

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'cashback', name: 'Cashback Tips' },
    { id: 'savings', name: 'Money Saving' },
    { id: 'shopping', name: 'Shopping Guide' },
    { id: 'technology', name: 'Technology' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: '10 Ways to Maximize Your Cashback Earnings',
      excerpt: 'Learn proven strategies to earn more cashback on every purchase and build your savings faster.',
      content: 'Discover the best practices for maximizing your cashback earnings...',
      author: 'Casyoro Team',
      date: '2024-01-15',
      category: 'cashback',
      image: '/images/blog/cashback-tips.jpg',
      readTime: '5 min read',
      featured: true
    },
    {
      id: 2,
      title: 'The Ultimate Guide to Online Shopping Savings',
      excerpt: 'Everything you need to know about finding the best deals and saving money while shopping online.',
      content: 'Online shopping has revolutionized the way we buy products...',
      author: 'Sarah Johnson',
      date: '2024-01-12',
      category: 'shopping',
      image: '/images/blog/shopping-guide.jpg',
      readTime: '8 min read',
      featured: false
    },
    {
      id: 3,
      title: 'How to Build a Sustainable Savings Habit',
      excerpt: 'Practical tips and strategies to develop a consistent savings routine that actually works.',
      content: 'Building a sustainable savings habit is crucial for financial security...',
      author: 'Michael Chen',
      date: '2024-01-10',
      category: 'savings',
      image: '/images/blog/savings-habit.jpg',
      readTime: '6 min read',
      featured: false
    },
    {
      id: 4,
      title: 'The Future of Cashback Technology',
      excerpt: 'Exploring how AI and machine learning are revolutionizing the cashback industry.',
      content: 'The cashback industry is undergoing a technological transformation...',
      author: 'Tech Team',
      date: '2024-01-08',
      category: 'technology',
      image: '/images/blog/tech-future.jpg',
      readTime: '7 min read',
      featured: true
    },
    {
      id: 5,
      title: 'Seasonal Shopping: When to Buy for Maximum Savings',
      excerpt: 'Timing your purchases can save you hundreds of rupees. Here\'s when to buy what.',
      content: 'Understanding seasonal shopping patterns can significantly impact your savings...',
      author: 'Emma Wilson',
      date: '2024-01-05',
      category: 'shopping',
      image: '/images/blog/seasonal-shopping.jpg',
      readTime: '4 min read',
      featured: false
    },
    {
      id: 6,
      title: 'Mobile Apps vs Websites: Which Saves You More?',
      excerpt: 'A comprehensive comparison of mobile apps and websites for cashback and deals.',
      content: 'The debate between mobile apps and websites for shopping continues...',
      author: 'David Kumar',
      date: '2024-01-03',
      category: 'technology',
      image: '/images/blog/mobile-vs-web.jpg',
      readTime: '5 min read',
      featured: false
    }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <>
      <Head>
        <title>Blog - Casyoro</title>
        <meta name="description" content="Read the latest tips, guides, and insights about cashback, savings, and smart shopping on Casyoro blog." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
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
                <Link href="/blog" className="text-primary-600 font-medium">
                  Blog
                </Link>
                <Link href="/help" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Help
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 via-white to-success-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Casyoro Blog
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover tips, guides, and insights to help you save more and earn more with cashback
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Featured Posts */}
          {selectedCategory === 'all' && (
            <motion.div
              className="mb-12"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Posts</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <motion.article
                    key={post.id}
                    className="card hover:shadow-lg transition-shadow"
                    variants={fadeInUp}
                  >
                    <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <UserIcon className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {post.excerpt}
                      </p>
                      <Link 
                        href={`/blog/${post.id}`}
                        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Read More
                        <ArrowRightIcon className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          )}

          {/* Category Filter */}
          <motion.div
            className="mb-8"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Blog Posts Grid */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            {filteredPosts.map((post) => (
              <motion.article
                key={post.id}
                className="card hover:shadow-lg transition-shadow"
                variants={fadeInUp}
              >
                <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="card-body">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <TagIcon className="w-4 h-4" />
                      <span className="capitalize">{post.category}</span>
                    </div>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <UserIcon className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/blog/${post.id}`}
                    className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Read More
                    <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            className="mt-16 bg-primary-50 border border-primary-200 rounded-lg p-8 text-center"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Stay Updated
            </h3>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter for the latest cashback tips and exclusive offers
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="btn btn-primary">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

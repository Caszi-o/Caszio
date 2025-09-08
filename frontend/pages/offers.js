import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  TagIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { offersAPI } from '../lib/api';

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

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);

  const categories = [
    { id: 'all', name: 'All Offers' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'food', name: 'Food & Dining' },
    { id: 'travel', name: 'Travel' },
    { id: 'health', name: 'Health & Beauty' },
    { id: 'home', name: 'Home & Garden' }
  ];

  useEffect(() => {
    loadOffers();
  }, [searchTerm, selectedCategory, sortBy, page]);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        search: searchTerm,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        sortBy
      };
      
      const response = await offersAPI.getOffers(params);
      if (page === 1) {
        setOffers(response.data.data);
      } else {
        setOffers(prev => [...prev, ...response.data.data]);
      }
    } catch (error) {
      console.error('Failed to load offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadOffers();
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <>
      <Head>
        <title>Offers & Deals - Casyoro</title>
        <meta name="description" content="Discover thousands of exclusive offers and deals from top brands. Earn cashback on every purchase with Casyoro." />
      </Head>

      <div className="min-h-screen bg-gray-50">
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
                <Link href="/offers" className="text-primary-600 font-medium">
                  Offers
                </Link>
                <Link href="/how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors">
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
        <section className="bg-gradient-primary py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Exclusive Offers & Deals
              </h1>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Discover thousands of offers from top brands and earn automatic cashback on every purchase
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 w-full lg:max-w-md">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search offers, brands, categories..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>

              {/* Category Filter */}
              <div className="flex items-center space-x-4">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="cashback">Highest Cashback</option>
                <option value="popular">Most Popular</option>
                <option value="ending">Ending Soon</option>
              </select>
            </div>
          </div>
        </section>

        {/* Offers Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading && page === 1 ? (
              <div className="flex justify-center items-center py-12">
                <div className="spinner spinner-lg"></div>
              </div>
            ) : (
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial="initial"
                animate="animate"
                variants={staggerChildren}
              >
                {offers.map((offer) => (
                  <motion.div
                    key={offer._id}
                    className="card hover:shadow-lg transition-shadow"
                    variants={fadeInUp}
                  >
                    <div className="card-body">
                      {/* Merchant Info */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {offer.merchant?.logo && (
                            <Image
                              src={offer.merchant.logo}
                              alt={offer.merchant.name}
                              width={40}
                              height={40}
                              className="rounded-lg"
                            />
                          )}
                          <span className="font-medium text-gray-900">{offer.merchant?.name}</span>
                        </div>
                        {offer.featured && (
                          <StarIcon className="w-5 h-5 text-yellow-500 fill-current" />
                        )}
                      </div>

                      {/* Offer Title */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {offer.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {offer.description}
                      </p>

                      {/* Cashback Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="badge badge-success flex items-center">
                          <TagIcon className="w-4 h-4 mr-1" />
                          {offer.cashbackPercentage}% Cashback
                        </span>
                        {offer.couponCode && (
                          <span className="text-xs text-primary-600 font-mono bg-primary-50 px-2 py-1 rounded">
                            {offer.couponCode}
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          <span>Until {new Date(offer.endDate).toLocaleDateString()}</span>
                        </div>
                        <Link 
                          href={`/offers/${offer._id}`}
                          className="btn btn-primary btn-sm"
                        >
                          Get Deal
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Load More */}
            {offers.length > 0 && !loading && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMore}
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More Offers'}
                </button>
              </div>
            )}

            {/* No Results */}
            {!loading && offers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TagIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No offers found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or browse different categories
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setPage(1);
                  }}
                  className="btn btn-primary"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="bg-primary-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Never Miss a Deal
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Get notified about new offers and exclusive deals
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary-300"
              />
              <button className="btn bg-white text-primary-600 hover:bg-gray-50">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

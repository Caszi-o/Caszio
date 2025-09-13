import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import { offersAPI } from '../lib/api';
import toast from 'react-hot-toast';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Electronics', 'Fashion', 'Beauty', 'Home', 'Sports'];

  useEffect(() => {
    loadOffers();
  }, [selectedCategory]);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') {
        params.category = selectedCategory.toLowerCase();
      }
      
      const response = await offersAPI.getOffers(params);
      setOffers(response.data.data.offers);
    } catch (error) {
      console.error('Failed to load offers:', error);
      toast.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-8">
              <h1 className="text-3xl font-bold text-gray-900">Exclusive Offers</h1>
              <p className="mt-2 text-gray-600">
                Discover amazing deals and earn cashback on every purchase
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === selectedCategory
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading offers...</p>
            </div>
          ) : offers.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No offers available</h3>
              <p className="text-gray-600 mb-6">
                {selectedCategory === 'All' 
                  ? 'There are currently no offers available. Check back later for new deals!'
                  : `No offers found in the ${selectedCategory} category. Try selecting a different category.`
                }
              </p>
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  View All Categories
                </button>
              )}
            </div>
          ) : (
            /* Offers Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <div key={offer._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {offer.merchant?.logo ? (
                            <img src={offer.merchant.logo} alt={offer.merchant.name} className="w-8 h-8 object-contain" />
                          ) : (
                            <span className="text-lg font-bold text-gray-600">
                              {offer.merchant?.name?.charAt(0) || '?'}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{offer.merchant?.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">{offer.categories?.[0]}</p>
                        </div>
                      </div>
                      {offer.discountValue && (
                        <div className="text-right">
                          <div className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                            {offer.discountType === 'percentage' 
                              ? `${offer.discountValue}% OFF` 
                              : `₹${offer.discountValue} OFF`
                            }
                          </div>
                        </div>
                      )}
                    </div>

                    <h4 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h4>
                    <p className="text-gray-600 mb-4">{offer.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        {offer.cashbackPercentage && (
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Cashback</p>
                            <p className="text-lg font-bold text-green-600">{offer.cashbackPercentage}%</p>
                          </div>
                        )}
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Valid Until</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(offer.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors">
                        Shop Now
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Offers;
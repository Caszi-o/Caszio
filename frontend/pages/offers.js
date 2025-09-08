import Layout from '../components/Layout';
import Link from 'next/link';

const Offers = () => {
  const offers = [
    {
      id: 1,
      merchant: 'Amazon',
      title: 'Electronics Sale',
      description: 'Get up to 50% off on electronics with 5% cashback',
      discount: '50% OFF',
      cashback: '5%',
      image: '/images/merchants/amazon.png',
      category: 'Electronics',
      validUntil: '2024-02-15'
    },
    {
      id: 2,
      merchant: 'Flipkart',
      title: 'Fashion Week',
      description: 'Latest fashion trends with 3% cashback',
      discount: '30% OFF',
      cashback: '3%',
      image: '/images/merchants/flipkart.png',
      category: 'Fashion',
      validUntil: '2024-02-20'
    },
    {
      id: 3,
      merchant: 'Myntra',
      title: 'Summer Collection',
      description: 'Fresh summer styles with 4% cashback',
      discount: '40% OFF',
      cashback: '4%',
      image: '/images/merchants/myntra.png',
      category: 'Fashion',
      validUntil: '2024-02-25'
    },
    {
      id: 4,
      merchant: 'Nykaa',
      title: 'Beauty Bonanza',
      description: 'Premium beauty products with 6% cashback',
      discount: '25% OFF',
      cashback: '6%',
      image: '/images/merchants/nykaa.png',
      category: 'Beauty',
      validUntil: '2024-02-18'
    },
    {
      id: 5,
      merchant: 'Tata CLiQ',
      title: 'Home & Living',
      description: 'Transform your home with 4% cashback',
      discount: '35% OFF',
      cashback: '4%',
      image: '/images/merchants/tatacliq.png',
      category: 'Home',
      validUntil: '2024-02-22'
    },
    {
      id: 6,
      merchant: 'AJIO',
      title: 'Trending Styles',
      description: 'Latest fashion with 3% cashback',
      discount: '45% OFF',
      cashback: '3%',
      image: '/images/merchants/ajio.png',
      category: 'Fashion',
      validUntil: '2024-02-28'
    }
  ];

  const categories = ['All', 'Electronics', 'Fashion', 'Beauty', 'Home', 'Sports'];

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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === 'All'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-600">
                          {offer.merchant.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{offer.merchant}</h3>
                        <p className="text-sm text-gray-500">{offer.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                        {offer.discount}
                      </div>
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h4>
                  <p className="text-gray-600 mb-4">{offer.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Cashback</p>
                        <p className="text-lg font-bold text-green-600">{offer.cashback}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Valid Until</p>
                        <p className="text-sm font-medium text-gray-900">{offer.validUntil}</p>
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

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-gray-200 text-gray-700 px-8 py-3 rounded-md font-medium hover:bg-gray-300 transition-colors">
              Load More Offers
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Offers;
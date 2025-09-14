import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CodeBracketIcon,
  ClipboardIcon,
  EyeIcon,
  CurrencyRupeeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  PlayIcon,
  PhotoIcon,
  DocumentTextIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { ProtectedRoute } from '../../lib/auth';
import { promoterAPI } from '../../lib/api';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function PromoterScripts() {
  const [scriptsData, setScriptsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  });
  const [selectedAd, setSelectedAd] = useState(null);
  const [scriptFormat, setScriptFormat] = useState('html');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadScripts();
  }, [filters]);

  const loadScripts = async () => {
    try {
      setLoading(true);
      const params = { ...filters };
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await promoterAPI.getAdScripts(params);
      setScriptsData(response.data.data);
      
      if (response.data.data.adScripts.length > 0 && !selectedAd) {
        setSelectedAd(response.data.data.adScripts[0]);
      }
    } catch (error) {
      console.error('Failed to load scripts:', error);
      toast.error('Failed to load ad scripts');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Script copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const getAdTypeIcon = (type) => {
    switch (type) {
      case 'banner': return PhotoIcon;
      case 'text': return DocumentTextIcon;
      case 'video': return PlayIcon;
      case 'native': return GlobeAltIcon;
      default: return DocumentTextIcon;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getScriptContent = () => {
    if (!selectedAd) return '';
    return selectedAd.scripts[scriptFormat] || '';
  };

  const getImplementationInstructions = () => {
    switch (scriptFormat) {
      case 'html':
        return [
          'Copy the HTML code above',
          'Paste it into your website where you want the ad to appear',
          'The ad will automatically track impressions and clicks',
          'No additional setup required'
        ];
      case 'javascript':
        return [
          'Add the JavaScript code to your website',
          `Create a div with id="casyoro-ad-${selectedAd?.adId}" where you want the ad`,
          'The script will automatically render the ad in that container',
          'Alternative: Call CasyoroPromoterAd_{AD_ID}.render("your-container-id") manually'
        ];
      case 'iframe':
        return [
          'Copy the iframe code above',
          'Paste it into your website HTML',
          'The iframe will load the ad content securely',
          'Responsive design will adjust to container size'
        ];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner spinner-lg"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['promoter']}>
      <Head>
        <title>Ad Scripts - Promoter Dashboard - Casyoro</title>
        <meta name="description" content="Get ad scripts to promote on your platforms" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/promoter/dashboard" className="text-2xl font-bold text-primary-600">
                  Casyoro
                </Link>
                <div className="h-6 border-l border-gray-300"></div>
                <h1 className="text-xl font-semibold text-gray-900">Ad Scripts</h1>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Promoter Code: <span className="font-mono font-medium">{scriptsData?.promoterCode}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Available Ads */}
            <div className="lg:col-span-1">
              <motion.div className="card" variants={fadeInUp}>
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900">Available Ads</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Choose an ad to get promotion scripts
                  </p>
                </div>
                <div className="card-body">
                  {/* Filters */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="form-label">Search</label>
                      <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          className="form-input pl-10"
                          placeholder="Search ads..."
                          value={filters.search}
                          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      >
                        <option value="">All Categories</option>
                        <option value="technology">Technology</option>
                        <option value="fashion">Fashion</option>
                        <option value="beauty">Beauty</option>
                        <option value="food">Food</option>
                        <option value="travel">Travel</option>
                        <option value="finance">Finance</option>
                      </select>
                    </div>
                  </div>

                  {/* Ad List */}
                  <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
                    {scriptsData?.adScripts.map((ad) => {
                      const IconComponent = getAdTypeIcon(ad.type);
                      return (
                        <div
                          key={ad.adId}
                          onClick={() => setSelectedAd(ad)}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedAd?.adId === ad.adId
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {ad.title}
                              </h3>
                              <p className="text-xs text-gray-500 capitalize">
                                {ad.type} • {ad.publisher}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-success-600 font-medium">
                                  {formatCurrency(ad.earnings.perClick)}/click
                                </span>
                                <span className="text-xs text-gray-500">
                                  {ad.biddingModel.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {scriptsData?.adScripts.length === 0 && (
                    <div className="text-center py-8">
                      <CodeBracketIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No ads available</h3>
                      <p className="text-gray-600">Check back later for new opportunities.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Script Generator */}
            <div className="lg:col-span-2">
              {selectedAd ? (
                <motion.div className="space-y-6" variants={fadeInUp}>
                  {/* Ad Details */}
                  <div className="card">
                    <div className="card-body">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{selectedAd.title}</h3>
                          <p className="text-sm text-gray-600 capitalize">
                            {selectedAd.type} Ad • By {selectedAd.publisher}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-success-600">
                            {formatCurrency(selectedAd.earnings.perClick)}/click
                          </div>
                          <div className="text-sm text-gray-500">
                            {selectedAd.biddingModel.toUpperCase()} • {formatCurrency(selectedAd.bidAmount)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(selectedAd.earnings.perClick)}
                          </div>
                          <div className="text-xs text-gray-500">Per Click</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(selectedAd.earnings.perImpression)}
                          </div>
                          <div className="text-xs text-gray-500">Per Impression</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(selectedAd.earnings.perConversion)}
                          </div>
                          <div className="text-xs text-gray-500">Per Conversion</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Script Options */}
                  <div className="card">
                    <div className="card-header">
                      <h3 className="text-lg font-semibold text-gray-900">Choose Script Format</h3>
                    </div>
                    <div className="card-body">
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {[
                          { value: 'html', label: 'HTML', description: 'Direct HTML embed' },
                          { value: 'javascript', label: 'JavaScript', description: 'Dynamic JS widget' },
                          { value: 'iframe', label: 'iFrame', description: 'Secure iframe embed' }
                        ].map((format) => (
                          <label key={format.value} className="cursor-pointer">
                            <input
                              type="radio"
                              value={format.value}
                              checked={scriptFormat === format.value}
                              onChange={(e) => setScriptFormat(e.target.value)}
                              className="sr-only"
                            />
                            <div className={`p-4 border rounded-lg text-center transition-colors ${
                              scriptFormat === format.value
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}>
                              <h4 className="font-medium text-gray-900">{format.label}</h4>
                              <p className="text-xs text-gray-500 mt-1">{format.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>

                      {/* Script Code */}
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <label className="form-label">Generated Script</label>
                          <button
                            onClick={() => copyToClipboard(getScriptContent())}
                            className="btn btn-sm btn-secondary"
                          >
                            {copied ? (
                              <>
                                <CheckIcon className="w-4 h-4 mr-2" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <ClipboardIcon className="w-4 h-4 mr-2" />
                                Copy Script
                              </>
                            )}
                          </button>
                        </div>
                        
                        <div className="relative">
                          <SyntaxHighlighter
                            language={scriptFormat === 'javascript' ? 'javascript' : 'html'}
                            style={tomorrow}
                            customStyle={{
                              background: '#1f2937',
                              padding: '1rem',
                              borderRadius: '0.5rem',
                              fontSize: '0.875rem',
                              maxHeight: '400px'
                            }}
                          >
                            {getScriptContent()}
                          </SyntaxHighlighter>
                        </div>
                      </div>

                      {/* Implementation Instructions */}
                      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-3">Implementation Instructions</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                          {getImplementationInstructions().map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                          ))}
                        </ol>
                      </div>

                      {/* Revenue Information */}
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-3">Revenue Information</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-green-800">
                              <strong>Commission Rate:</strong> 70% of bid amount
                            </p>
                            <p className="text-green-800">
                              <strong>Payment Frequency:</strong> Weekly
                            </p>
                          </div>
                          <div>
                            <p className="text-green-800">
                              <strong>Minimum Payout:</strong> ₹100
                            </p>
                            <p className="text-green-800">
                              <strong>Payment Methods:</strong> Bank, UPI
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Preview */}
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-900 mb-3">Ad Preview</h4>
                        <div className="border rounded-lg p-4 bg-white">
                          <div className="max-w-sm">
                            {selectedAd.type === 'banner' && (
                              <div className="text-center">
                                <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center">
                                  <PhotoIcon className="w-8 h-8 text-gray-400" />
                                </div>
                                <h4 className="font-medium text-gray-900">{selectedAd.title}</h4>
                                <button className="btn btn-primary btn-sm mt-3">
                                  Learn More
                                </button>
                              </div>
                            )}
                            
                            {selectedAd.type === 'text' && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">{selectedAd.title}</h4>
                                <p className="text-sm text-gray-600 mb-3">
                                  Your promotional text content will appear here...
                                </p>
                                <button className="btn btn-primary btn-sm">
                                  Click Here
                                </button>
                              </div>
                            )}
                            
                            <div className="mt-2 text-xs text-gray-500">Promoted Content</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <CodeBracketIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Ad</h3>
                    <p className="text-gray-600">Choose an ad from the list to generate promotion scripts.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

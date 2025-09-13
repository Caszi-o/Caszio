import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const getTokens = () => {
  return {
    accessToken: Cookies.get('accessToken'),
    refreshToken: Cookies.get('refreshToken'),
  };
};

const setTokens = (accessToken, refreshToken) => {
  if (accessToken) {
    Cookies.set('accessToken', accessToken, { expires: 7 }); // 7 days
  }
  if (refreshToken) {
    Cookies.set('refreshToken', refreshToken, { expires: 30 }); // 30 days
  }
};

const clearTokens = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const { accessToken } = getTokens();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = getTokens();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        setTokens(accessToken, newRefreshToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.message) {
      toast.error(error.message);
    }

    return Promise.reject(error);
  }
);

// Import mock API for development
import { mockAuthAPI, mockUserAPI, mockOffersAPI, mockPublisherAPI, mockPromoterAPI, mockAdminAPI, checkBackendAvailability } from './mockAPI';

// Check if we should use mock API
const USE_MOCK_API = process.env.NODE_ENV === 'development' && (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || true);

// API functions with fallback to mock
export const authAPI = {
  register: async (data) => {
    if (USE_MOCK_API) {
      console.log('Using mock API for registration');
      return mockAuthAPI.register(data);
    }
    
    try {
      return await api.post('/auth/register', data);
    } catch (error) {
      // If backend is not available, suggest using mock API
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        console.error('Backend not available. To use mock API, set NEXT_PUBLIC_USE_MOCK_API=true in your environment');
      }
      throw error;
    }
  },
  
  login: async (data) => {
    if (USE_MOCK_API) {
      console.log('Using mock API for login');
      return mockAuthAPI.login(data);
    }
    
    try {
      return await api.post('/auth/login', data);
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        console.error('Backend not available. To use mock API, set NEXT_PUBLIC_USE_MOCK_API=true in your environment');
      }
      throw error;
    }
  },
  logout: async (refreshToken) => {
    if (USE_MOCK_API) {
      console.log('Using mock API for logout');
      return mockAuthAPI.logout(refreshToken);
    }
    
    try {
      return await api.post('/auth/logout', { refreshToken });
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        console.error('Backend not available. To use mock API, set NEXT_PUBLIC_USE_MOCK_API=true in your environment');
      }
      throw error;
    }
  },
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getCurrentUser: async () => {
    if (USE_MOCK_API) {
      console.log('Using mock API for getCurrentUser');
      return mockAuthAPI.getCurrentUser();
    }
    
    try {
      return await api.get('/auth/me');
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        console.error('Backend not available. To use mock API, set NEXT_PUBLIC_USE_MOCK_API=true in your environment');
      }
      throw error;
    }
  },
  setup2FA: () => api.post('/auth/setup-2fa'),
  verify2FA: (code) => api.post('/auth/verify-2fa', { code }),
  disable2FA: (data) => api.post('/auth/disable-2fa', data),
  oauthGoogle: (data) => api.post('/auth/oauth/google', data),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  updateAddress: (data) => api.put('/users/address', data),
  uploadAvatar: (formData) => api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getDashboard: async () => {
    if (USE_MOCK_API) {
      console.log('Using mock API for user dashboard');
      return mockUserAPI.getDashboard();
    }
    return api.get('/users/dashboard');
  },
  getOrders: (params) => api.get('/users/orders', { params }),
  linkAccount: (data) => api.post('/users/link-account', data),
  unlinkAccount: (platform, accountId) => api.delete(`/users/unlink-account/${platform}/${accountId}`),
  updatePreferences: (data) => api.put('/users/preferences', data),
  updateBankDetails: (data) => api.put('/users/bank-details', data),
  deleteAccount: (data) => api.delete('/users/account', { data }),
};

export const walletAPI = {
  getWallet: () => api.get('/wallet'),
  getTransactions: (params) => api.get('/wallet/transactions', { params }),
  requestWithdrawal: (data) => api.post('/wallet/withdraw', data),
  getWithdrawals: (params) => api.get('/wallet/withdrawals', { params }),
  addFunds: (data) => api.post('/wallet/add-funds', data),
};

export const offersAPI = {
  getOffers: (params) => api.get('/offers', { params }),
  getOffer: (id) => api.get(`/offers/${id}`),
  getFeaturedOffers: async () => {
    if (USE_MOCK_API) {
      console.log('Using mock API for featured offers');
      return mockOffersAPI.getFeaturedOffers();
    }
    return api.get('/offers/featured');
  },
  getOffersByCategory: (category) => api.get(`/offers/category/${category}`),
  trackOfferView: (id) => api.post(`/offers/${id}/view`),
  trackOfferClick: (id) => api.post(`/offers/${id}/click`),
  useOffer: (id, data) => api.post(`/offers/${id}/use`, data),
};

export const publisherAPI = {
  apply: (data) => api.post('/publishers/apply', data),
  getProfile: () => api.get('/publishers/profile'),
  updateProfile: (data) => api.put('/publishers/profile', data),
  getDashboard: async () => {
    if (USE_MOCK_API) {
      console.log('Using mock API for publisher dashboard');
      return mockPublisherAPI.getDashboard();
    }
    return api.get('/publishers/dashboard');
  },
  getAds: (params) => api.get('/publishers/ads', { params }),
  createAd: (data) => api.post('/publishers/ads', data),
  updateAd: (id, data) => api.put(`/publishers/ads/${id}`, data),
  updateAdStatus: (id, data) => api.patch(`/publishers/ads/${id}/status`, data),
  deleteAd: (id) => api.delete(`/publishers/ads/${id}`),
  getAdMetrics: (id, params) => api.get(`/publishers/ads/${id}/metrics`, { params }),
  getWallet: () => api.get('/publishers/wallet'),
  topUpWallet: (data) => api.post('/publishers/wallet/topup', data),
  getPayments: (params) => api.get('/publishers/payments', { params }),
  
  // Offer Management
  getOffers: (params) => api.get('/publishers/offers', { params }),
  createOffer: (data) => api.post('/publishers/offers', data),
  getOffer: (id) => api.get(`/publishers/offers/${id}`),
  updateOffer: (id, data) => api.put(`/publishers/offers/${id}`, data),
  deleteOffer: (id) => api.delete(`/publishers/offers/${id}`),
  getOfferAnalytics: (id) => api.get(`/publishers/offers/${id}/analytics`),
};

export const promoterAPI = {
  apply: (data) => api.post('/promoters/apply', data),
  getProfile: () => api.get('/promoters/profile'),
  updateProfile: (data) => api.put('/promoters/profile', data),
  getDashboard: async () => {
    if (USE_MOCK_API) {
      console.log('Using mock API for promoter dashboard');
      return mockPromoterAPI.getDashboard();
    }
    return api.get('/promoters/dashboard');
  },
  getAdScripts: (params) => api.get('/promoters/scripts', { params }),
  getEarnings: (params) => api.get('/promoters/earnings', { params }),
  requestWithdrawal: (data) => api.post('/promoters/withdraw', data),
  getWithdrawals: (params) => api.get('/promoters/withdrawals', { params }),
  getMetrics: (params) => api.get('/promoters/metrics', { params }),
};

export const adminAPI = {
  getDashboard: async () => {
    if (USE_MOCK_API) {
      console.log('Using mock API for admin dashboard');
      return mockAdminAPI.getDashboard();
    }
    return api.get('/admin/dashboard');
  },
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  getPublishers: (params) => api.get('/admin/publishers', { params }),
  verifyPublisher: (id, data) => api.patch(`/admin/publishers/${id}/verification`, data),
  getPromoters: (params) => api.get('/admin/promoters', { params }),
  approvePromoter: (id, data) => api.patch(`/admin/promoters/${id}/application`, data),
  getOffers: (params) => api.get('/admin/offers', { params }),
  createOffer: (data) => api.post('/admin/offers', data),
  updateOffer: (id, data) => api.put(`/admin/offers/${id}`, data),
  getAds: (params) => api.get('/admin/ads', { params }),
  reviewAd: (id, data) => api.patch(`/admin/ads/${id}/review`, data),
  getTransactions: (params) => api.get('/admin/transactions', { params }),
  getWithdrawals: (params) => api.get('/admin/withdrawals', { params }),
  processWithdrawal: (promoterId, withdrawalId, data) => api.patch(`/admin/withdrawals/${promoterId}/${withdrawalId}`, data),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
  getSettings: () => api.get('/admin/settings'),
};

export const paymentAPI = {
  createRazorpayOrder: (data) => api.post('/payments/razorpay/create-order', data),
  verifyRazorpayPayment: (data) => api.post('/payments/razorpay/verify', data),
  getPaymentMethods: () => api.get('/payments/methods'),
  addPaymentMethod: (data) => api.post('/payments/methods', data),
  deletePaymentMethod: (id) => api.delete(`/payments/methods/${id}`),
};

// Utility functions
export const isAuthenticated = () => {
  const { accessToken } = getTokens();
  return !!accessToken;
};

export const getAuthHeader = () => {
  const { accessToken } = getTokens();
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

export { setTokens, clearTokens, getTokens };
export default api;

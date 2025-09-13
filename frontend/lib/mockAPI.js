// Mock API for development when backend is not available
export const mockAuthAPI = {
  register: async (data) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate validation
    if (!data.email || !data.password) {
      throw new Error('Email and password are required');
    }
    
    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    
    // Simulate successful registration
    const mockUser = {
      id: Date.now(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role || 'user',
      isVerified: true,
      createdAt: new Date().toISOString()
    };
    
    const mockTokens = {
      accessToken: 'mock_access_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now()
    };
    
    return {
      data: {
        success: true,
        data: {
          user: mockUser,
          ...mockTokens
        }
      }
    };
  },
  
  login: async (credentials) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Support different test users for different roles
    const testUsers = {
      'test@example.com': {
        id: 1,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: 'user',
        isVerified: true
      },
      'publisher@example.com': {
        id: 2,
        firstName: 'Test',
        lastName: 'Publisher',
        email: 'publisher@example.com',
        role: 'publisher',
        isVerified: true
      },
      'promoter@example.com': {
        id: 3,
        firstName: 'Test',
        lastName: 'Promoter',
        email: 'promoter@example.com',
        role: 'promoter',
        isVerified: true
      },
      'admin@example.com': {
        id: 4,
        firstName: 'Test',
        lastName: 'Admin',
        email: 'admin@example.com',
        role: 'admin',
        isVerified: true
      }
    };
    
    if (testUsers[credentials.email] && credentials.password === 'password123') {
      const user = testUsers[credentials.email];
      
      // Store the current user in global scope for getCurrentUser
      if (typeof window !== 'undefined') {
        window.mockCurrentUser = user;
      }
      
      return {
        data: {
          success: true,
          data: {
            user,
            accessToken: 'mock_access_token_' + user.role,
            refreshToken: 'mock_refresh_token_' + user.role
          }
        }
      };
    } else {
      throw {
        response: {
          status: 401,
          data: { message: 'Invalid credentials' }
        }
      };
    }
  },
  
  logout: async (refreshToken) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Clear the current user from global scope
    if (typeof window !== 'undefined') {
      window.mockCurrentUser = null;
    }
    
    return {
      data: {
        success: true,
        message: 'Logged out successfully'
      }
    };
  },
  
  getCurrentUser: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get the current user from a global variable or return a default
    // This is a simple approach for mock API
    let user = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'user',
      isVerified: true
    };
    
    // Check if we have a stored user in the global scope
    if (typeof window !== 'undefined' && window.mockCurrentUser) {
      user = window.mockCurrentUser;
    }
    
    return {
      data: {
        success: true,
        data: {
          user
        }
      }
    };
  }
};

// Check if backend is available
export const checkBackendAvailability = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/health', {
      method: 'GET',
      timeout: 3000
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Mock API for user dashboard
export const mockUserAPI = {
  getDashboard: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      data: {
        success: true,
        data: {
          wallet: {
            balance: 1250.50,
            totalEarnings: 2500.75
          },
          recentOrders: [
            {
              _id: '1',
              merchant: 'Amazon',
              amount: 1500,
              cashback: 75,
              date: new Date().toISOString()
            },
            {
              _id: '2', 
              merchant: 'Flipkart',
              amount: 800,
              cashback: 40,
              date: new Date(Date.now() - 86400000).toISOString()
            }
          ],
          orderStats: {
            totalOrders: 15,
            totalAmount: 8500,
            totalCashback: 425,
            pendingCashback: 150,
            creditedCashback: 275
          },
          monthlyEarnings: {
            earnings: 425,
            withdrawals: 200,
            transactions: 8
          }
        }
      }
    };
  }
};

// Mock API for offers
export const mockOffersAPI = {
  getFeaturedOffers: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      data: {
        success: true,
        data: []
      }
    };
  }
};

// Mock API for publisher dashboard
export const mockPublisherAPI = {
  getDashboard: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      data: {
        success: true,
        data: {
                  publisher: {
                    _id: '1',
                    companyName: 'Test Publisher Co.',
                    verificationStatus: 'pending',
                    currentPackage: 'Premium',
                    packageStatus: 'active'
                  },
          recentAds: [],
          activeAdsCount: 0,
          todayMetrics: {
            impressions: 0,
            clicks: 0,
            conversions: 0,
            cost: 0
          },
          packageInfo: {
            current: 'Premium',
            status: 'active',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        }
      }
    };
  }
};

// Mock API for promoter dashboard
export const mockPromoterAPI = {
  getDashboard: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      data: {
        success: true,
        data: {
          promoter: {
            _id: '1',
            applicationStatus: 'pending',
            totalEarnings: 0,
            monthlyEarnings: 0,
            totalClicks: 0,
            totalConversions: 0
          },
          recentActivities: [],
          performance: {
            clicks: 0,
            conversions: 0,
            conversionRate: 0,
            totalEarnings: 0
          }
        }
      }
    };
  }
};

// Mock API for admin dashboard
export const mockAdminAPI = {
  getDashboard: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      data: {
        success: true,
        data: {
          overview: {
            users: {
              total: 0,
              newToday: 0,
              verified: 0,
              active: 0
            },
            publishers: {
              total: 0,
              approved: 0,
              pending: 0
            },
            promoters: {
              total: 0,
              approved: 0,
              pending: 0
            },
            ads: {
              total: 0,
              active: 0,
              pending: 0
            },
            financials: {
              totalRevenue: 0,
              monthlyRevenue: 0,
              totalCashback: 0
            }
          },
          recentActivities: {
            users: [],
            transactions: []
          },
          growth: {
            users: [0, 0, 0, 0, 0, 0, 0],
            revenue: [0, 0, 0, 0, 0, 0, 0],
            period: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7']
          }
        }
      }
    };
  }
};
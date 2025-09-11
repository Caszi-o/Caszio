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
    
    if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
      return {
        data: {
          success: true,
          data: {
            user: {
              id: 1,
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              role: 'user',
              isVerified: true
            },
            accessToken: 'mock_access_token',
            refreshToken: 'mock_refresh_token'
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
  
  getCurrentUser: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: {
        success: true,
        data: {
          user: {
            id: 1,
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            role: 'user',
            isVerified: true
          }
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

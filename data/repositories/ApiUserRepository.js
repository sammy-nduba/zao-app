export class ApiUserRepository {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async register(user) {
    try {
      console.log('ApiUserRepository.register called with:', user);
      const response = await this.apiClient.post('/api/farmer/signup', {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: user.password,
      });
      return {
        userId: response.data.id,
        token: response.data.token, 
        message: 'Registration successful. Please verify your email.',
      };
    } catch (error) {
      console.error('Registration error:', {
        message: error.message,
        response: error.response?.data,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to register. Please try again.',
      );
    }
  }

  async verifyEmail(token) {
    try {
      const response = await this.apiClient.post('/api/farmer/verify-email', { token });
      return {
        userId: response.data.id,
        email: response.data.email,
        isVerified: true,
        message: 'Email verified successfully.',
      };
    } catch (error) {
      console.error('Email verification error:', {
        message: error.message,
        response: error.response?.data,
      });
      throw new Error(
        error.response?.data?.message || 'Email verification failed. Invalid or expired token.',
      );
    }
  }

  async login(loginData) {
    try {
      console.log('ApiUserRepository.login called with:', loginData);
      const response = await this.apiClient.post('/login', {
        email: loginData.email,
        password: loginData.password,
      });
      console.log('ApiUserRepository.login response:', response.data);
      return {
        userId: response.data.id,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        phoneNumber: response.data.phoneNumber,
        isVerified: response.data.isVerified,
        farmerType: response.data.farmerType, // Include farmerType if available
      };
    } catch (error) {
      console.error('ApiUserRepository.login error:', {
        message: error.message,
        response: error.response?.data,
      });
      throw new Error(
        error.response?.data?.message || 'Login failed. Please check your credentials.',
      );
    }
  }
  

  async socialRegister(provider) {
    try {
      const response = await this.apiClient.post(`/api/farmer/social-register`, { provider });
      return {
        success: true,
        user: {
          id: response.data.id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
        },
        provider,
      };
    } catch (error) {
      throw new Error(`Social registration with ${provider} failed: ${error.message}`);
    }
  }
}
export class ApiUserRepository {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async register(user) {
    try {
      console.log('ApiUserRepository.register called with:', user);
  
      const signupResponse = await this.apiClient.post('/api/farmer/verify-email', {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phoneNumber,
        password: user.password,
      });
  
      console.log('Signup response:', signupResponse.data);
  
      const { message, token } = signupResponse.data;
  
      if (!message || !token) {
        throw new Error('Invalid server response. Please try again.');
      }
  
      return { message, token };
    } catch (error) {
      console.error('Registration error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        request: error.config,
      });
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to initiate registration. Please check your network or server status.'
      );
    }
  }
  
  async verifyEmail(token) {
    try {
      console.log('ApiUserRepository.verifyEmail called with:', token);
  
      const response = await this.apiClient.post('/api/farmer/register', { token });
      const data = response.data;
  
      console.log('Verify email response:', data);
  
      return {
        userId: data._id,
        email: data.email,
        token: data.token,
        message: data.message || 'Registration successful.',
      };
    } catch (error) {
      console.error('Email verification error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Registration failed. Invalid or expired token.'
      );
    }
  }
  
  async resendVerification(email) {
    try {
      console.log('ApiUserRepository.resendVerification called with:', email);
  
      const response = await this.apiClient.post('/api/farmer/resend-verification', { email });
      const data = response.data;
  
      console.log('Resend verification response:', data);
  
      return {
        success: true,
        message: data.message,
        token: data.token,
      };
    } catch (error) {
      console.error('Resend verification error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to resend verification email.'
      );
    }
  }
  


  async login(loginData) {
    try {
      console.log('ApiUserRepository.login called with:', loginData);
      const response = await this.apiClient.post('/api/farmer/signin', {
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
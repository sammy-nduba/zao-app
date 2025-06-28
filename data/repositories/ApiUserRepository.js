
export class ApiUserRepository {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async initiateSignup(email) {
    try {
      console.log('ApiUserRepository.initiateSignup called with:', email);
      const response = await this.apiClient.post('/api/farmer/register', { email });
      console.log('ApiUserRepository.initiateSignup response:', response.data);
      return response.data; // Expect { message: "Verification email sent", farmerId }
    } catch (error) {
      console.error('ApiUserRepository.initiateSignup error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || `Initiate signup failed: ${error.message}`);
    }
  }

  async register(token, user) {
    try {
      console.log('ApiUserRepository.register called with:', { token, user });
      const response = await this.apiClient.post(`/api/farmer/register/${token}`, {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: user.password,
      });
      console.log('ApiUserRepository.register response:', response.data);
      return response.data; // Expect { message, user, token }
    } catch (error) {
      console.error('ApiUserRepository.register error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || `Registration failed: ${error.message}`);
    }
  }

  async login(loginData) {
    try {
      console.log('ApiUserRepository.login called with:', loginData);
      const response = await this.apiClient.post('/api/farmer/login', {
        email: loginData.email,
        password: loginData.password,
      });
      console.log('ApiUserRepository.login response:', response.data);
      return response.data; // Expect { user, token }
    } catch (error) {
      console.error('ApiUserRepository.login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || `Login failed: ${error.message}`);
    }
  }
}
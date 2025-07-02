
export class ApiUserRepository {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async register(user) { 
    try {
      console.log('ApiUserRepository.register called with:', user);
      const response = await this.apiClient.post(`/api/farmer/signup`, {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: user.password,
      });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error; 
    }
  }

  async verifyEmail(token) {  
    try {
      const response = await this.apiClient.post(`/api/farmer/verify-email`, { 
        token 
      });
      return response.data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }


  async login(loginData) {
    try {
      console.log('ApiUserRepository.login called with:', loginData); // Debug
      const response = await this.apiClient.post('/login', {
        email: loginData.email,
        password: loginData.password,
      });
      console.log('ApiUserRepository.login response:', response.data); // Debug
      return response.data; // Expect { id, email, firstName, lastName, phoneNumber, ... }
    } catch (error) {
      console.error('ApiUserRepository.login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }); // Debug
      throw new Error(error.response?.data?.message || `Login failed: ${error.message}`);
    }
  }
}
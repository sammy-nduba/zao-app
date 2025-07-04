
export class RegisterUserUseCase {
  constructor(userRepository, storageService) {
    this.userRepository = userRepository;
    this.storageService = storageService;
  }

  async initiateSignup(formData) {
    try {
      console.log('RegisterUserUseCase.initiateSignup called with:', formData);
      const response = await this.userRepository.register(formData);
      console.log('Initiate signup response:', response);
      return {
        success: true,
        message: response.message,
        token: response.token,
      };
    } catch (error) {
      console.error('RegisterUserUseCase.initiateSignup error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async resendVerification(email) {
    try {
      console.log('RegisterUserUseCase.resendVerification called with:', email);
      const response = await this.userRepository.resendVerification(email);
      console.log('Resend verification response:', response);
      return {
        success: response.success,
        message: response.message,
        token: response.token,
      };
    } catch (error) {
      console.error('RegisterUserUseCase.resendVerification error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}


export default class VerifyEmailUseCase {
  constructor(userRepository) {
    if (!userRepository) throw new Error('userRepository is undefined');
    this.userRepository = userRepository;
  }

  async execute(token) {
    try {
      console.log('VerifyEmailUseCase.execute called with:', token);
      const response = await this.userRepository.verifyEmail(token);
      console.log('VerifyEmailUseCase.execute response:', response);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('VerifyEmailUseCase error:', error);
      throw new Error(`Email verification failed: ${error.message}`);
    }
  }
}
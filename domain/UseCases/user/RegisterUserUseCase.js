export class RegisterUserUseCase {
  constructor(userRepository, validationService, storageService) {
    this.userRepository = userRepository;
    this.validationService = validationService;
    this.storageService = storageService;
  }

  async execute(userData) {
    try {
      console.log('RegisterUserUseCase.execute called with:', userData);
      const validationResult = this.validationService.validateRegistrationData(userData);
      if (!validationResult.isValid) {
        throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
      }
      const userResponse = await this.userRepository.register(userData);
      const user = {
        id: userResponse.userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        token: userResponse.token,
      };
      await this.storageService.storeItem('Registration', true);
      await this.storageService.storeSecureItem('RegistrationToken', userResponse.token); // Store token securely
      console.log('Stored Registration status and token');
      return user;
    } catch (error) {
      console.error('RegisterUserUseCase error:', error);
      throw new Error(error.message);
    }
  }
  
}

export class SocialRegisterUseCase {
  constructor(socialAuthService, storageService) {
    this.socialAuthService = socialAuthService;
    this.storageService = storageService;
  }

  async execute(provider) {
    try {
      console.log('SocialRegisterUseCase.execute called with:', provider); // Debug
      const user = await this.socialAuthService.register(provider);
      await this.storageService.storeItem('Registration', true);
      console.log('Stored Social Registration status'); // Debug
      return user;
    } catch (error) {
      console.error('SocialRegisterUseCase error:', error); // Debug
      throw new Error(error.message);
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
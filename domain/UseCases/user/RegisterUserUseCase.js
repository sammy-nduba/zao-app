// src/domain/UseCases/user/RegisterUserUseCase.js
import { User } from '../../../domain/entities/User';

export class RegisterUserUseCase {
  constructor(userRepository, validationService, storageService) {
    this.userRepository = userRepository;
    this.validationService = validationService;
    this.storageService = storageService;
  }

  async execute(userData) {
    try {
      console.log('RegisterUserUseCase.execute called with:', userData); // Debug
      const validationResult = this.validationService.validateRegistrationData(userData);
      if (!validationResult.isValid) {
        throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
      }

      const user = new User(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.phoneNumber,
        userData.password
      );

      await this.userRepository.register(user);
      console.log('User registered successfully'); // Debug
      await this.storageService.storeItem('Registration', true);
      console.log('Stored Registration status'); // Debug

      return user;
    } catch (error) {
      console.error('RegisterUserUseCase error:', error); // Debug
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
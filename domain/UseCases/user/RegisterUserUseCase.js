import { User } from '../../../domain/entities/User';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class RegisterUserUseCase {
  constructor(userRepository, validationService, storageService) {
    this.userRepository = userRepository;
    this.validationService = validationService;
    this.storageService = storageService;
  }

  async initiateSignup(email) {
    try {
      console.log('RegisterUserUseCase.initiateSignup called with:', email);
      const result = await this.userRepository.initiateSignup(email);
      console.log('RegisterUserUseCase.initiateSignup result:', result);
      return result; // { message, farmerId }
    } catch (error) {
      console.error('RegisterUserUseCase.initiateSignup error:', error);
      throw new Error(error.message);
    }
  }

  async execute(token, userData) {
    try {
      console.log('RegisterUserUseCase.execute called with:', { token, userData });
      const user = new User(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.phoneNumber,
        userData.password
      );
      const response = await this.userRepository.register(token, user);
      console.log('User registered successfully:', response);
      await this.storageService.storeItem('Registration', true);
      await AsyncStorage.setItem('jwtToken', response.token);
      console.log('Stored Registration status and JWT');
      return response.user;
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
export class VerifyEmailUseCase {
    constructor(userRepository) {
      this.userRepository = userRepository;
    }
  
    async execute(token) {
      try {
        console.log('VerifyEmailUseCase.execute called with:', token);
        const result = await this.userRepository.verifyEmail(token);
        console.log('VerifyEmailUseCase result:', result);
        return result;
      } catch (error) {
        console.error('VerifyEmailUseCase.verifyEmail error:', error);
        throw new Error(error.message);
      }
    }
  }
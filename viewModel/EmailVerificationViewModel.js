export class EmailVerificationViewModel {
    constructor(verifyEmailUseCase) {
      this.verifyEmailUseCase = verifyEmailUseCase;
    }
  
    async verifyEmail(token) {
      try {
        console.log('EmailVerificationViewModel.verifyEmail called with:', token);
        const user = await this.verifyEmailUseCase.execute(token);
        console.log('Verification result:', user);
        return {
          success: true,
          user: {
            id: user.userId,
            email: user.email,
            token: user.token,
          },
          message: user.message,
        };
      } catch (error) {
        console.error('EmailVerificationViewModel.verifyEmail error:', error);
        return {
          success: false,
          error: error.message,
        };
      }
    }
  }
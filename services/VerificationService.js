

export class VerificationService {
    constructor(apiRepository, navigation) {
      this.api = apiRepository;
      this.navigation = navigation;
    }
  
    async handleVerificationToken(token) {
      try {
        const result = await this.api.verifyEmail(token);
        this.navigation.navigate('SuccessScreen');
        return result;
      } catch (error) {
        this.navigation.navigate('ErrorScreen', { 
          error: 'Verification failed' 
        });
        throw error;
      }
    }
  }
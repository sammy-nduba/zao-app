export class AuthViewModel {
  constructor(storageService) {
    this.storageService = storageService;
    this.state = {
      isZaoAppOnboarded: null,
      isRegistered: false,
      isLoggedIn: false,
      user: null,
      isLoading: false,
      authError: null,
    };
  }

  async initialize() {
    this.state.isLoading = true;
    try {
      const [onboardingStatus, registrationStatus, loginStatus] = await Promise.all([
        this.storageService.getItem('Onboarding'),
        this.storageService.getItem('Registration'),
        this.storageService.getItem('Login'),
      ]);
      this.state.isZaoAppOnboarded = onboardingStatus === 'true' || onboardingStatus === true;
      this.state.isRegistered = registrationStatus === 'true' || registrationStatus === true;
      this.state.isLoggedIn = loginStatus === 'true' || loginStatus === true;
    } catch (error) {
      console.error('AuthViewModel initialize error:', error);
      this.state.authError = error.message;
    } finally {
      this.state.isLoading = false;
    }
  }

  setIsZaoAppOnboarded(value) {
    this.state.isZaoAppOnboarded = value;
    this.storageService.storeItem('Onboarding', value).catch((error) => {
      console.error('Failed to store Onboarding:', error);
    });
  }

  setIsRegistered(value) {
    this.state.isRegistered = value;
    this.storageService.storeItem('Registration', value).catch((error) => {
      console.error('Failed to store Registration:', error);
    });
  }

  setIsLoggedIn(value) {
    this.state.isLoggedIn = value;
    this.storageService.storeItem('Login', value).catch((error) => {
      console.error('Failed to store Login:', error);
    });
  }

  setUser(user) {
    this.state.user = user;
    this.storageService.storeItem('User', user).catch((error) => {
      console.error('Failed to store User:', error);
    });
  }

  setAuthError(error) {
    this.state.authError = error;
  }

  getState() {
    return { ...this.state };
  }
}
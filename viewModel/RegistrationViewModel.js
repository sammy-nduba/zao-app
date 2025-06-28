export class RegistrationViewModel {
  constructor(registerUseCase, socialRegisterUseCase, validationService) {
    this.registerUseCase = registerUseCase;
    this.socialRegisterUseCase = socialRegisterUseCase;
    this.validationService = validationService;
    this.state = {
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
      },
      fieldErrors: {},
      isLoading: false,
      isRegistered: false,
      verificationToken: null,
    };
  }

  updateFormData(fieldName, value) {
    this.state.formData[fieldName] = value;
    if (fieldName === 'phoneNumber') {
      const { isValid, error } = this.validatePhoneNumber(value);
      this.state.fieldErrors.phoneNumber = error;
    } else if (this.state.fieldErrors[fieldName]) {
      this.state.fieldErrors[fieldName] = '';
    }
  }

  async initiateSignup() {
    this.state.isLoading = true;
    this.state.fieldErrors = {};
    try {
      console.log('RegistrationViewModel.initiateSignup called with:', this.state.formData.email);
      const result = await this.registerUseCase.initiateSignup(this.state.formData.email);
      console.log('RegistrationViewModel.initiateSignup result:', result);
      this.state.verificationToken = result.farmerId;
      return { success: true, message: result.message };
    } catch (error) {
      console.error('RegistrationViewModel.initiateSignup error:', error.message);
      this.state.fieldErrors.email = error.message;
      return { success: false, error: error.message };
    } finally {
      this.state.isLoading = false;
    }
  }

  async register() {
    this.state.isLoading = true;
    this.state.fieldErrors = {};
    try {
      console.log('RegistrationViewModel.register called with:', this.state.formData);
      if (!this.state.verificationToken) {
        throw new Error('Verification token not found. Please initiate signup first.');
      }
      const user = await this.registerUseCase.execute(this.state.verificationToken, this.state.formData);
      console.log('Registration successful, user:', user);
      this.state.isRegistered = true;
      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error.message);
      const errors = error.message.split(': ')[1]?.split(', ') || [error.message];
      const newFieldErrors = {};
      errors.forEach(error => {
        if (error.includes('First name')) newFieldErrors.firstName = error;
        else if (error.includes('Last name')) newFieldErrors.lastName = error;
        else if (error.includes('Email') || error.includes('email')) newFieldErrors.email = error;
        else if (error.includes('phone')) newFieldErrors.phoneNumber = error;
        else if (error.includes('Password') || error.includes('password')) newFieldErrors.password = error;
      });
      this.state.fieldErrors = newFieldErrors;
      return { success: false, error: error.message };
    } finally {
      this.state.isLoading = false;
    }
  }

  async socialRegister(provider) {
    this.state.isLoading = true;
    try {
      console.log('Social register called for:', provider);
      const user = await this.socialRegisterUseCase.execute(provider.toLowerCase());
      this.state.isRegistered = true;
      return { success: true, user, provider };
    } catch (error) {
      console.error('Social registration error:', error.message);
      return { success: false, error: error.message };
    } finally {
      this.state.isLoading = false;
    }
  }

  validatePhoneNumber(value) {
    return this.validationService.validatePhoneNumberOnEntry(value);
  }

  getPasswordRequirements(password) {
    return this.validationService.getPasswordRequirements(password);
  }

  getState() {
    return { ...this.state };
  }

  setVerificationToken(token) {
    this.state.verificationToken = token;
  }
}
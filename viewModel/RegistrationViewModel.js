class RegistrationViewModel {
  constructor(registerUserUseCase, socialRegisterUseCase, validationService) {
    this.registerUserUseCase = registerUserUseCase;
    this.socialRegisterUseCase = socialRegisterUseCase;
    this.validationService = validationService;
    this.state = { formData: {}, fieldErrors: {} };
  }

  updateFormData(fieldName, value) {
    this.state.formData[fieldName] = value;
    this.state.fieldErrors[fieldName] = this.validationService.validateField(fieldName, value);
  }

  getPasswordRequirements(password) {
    return this.validationService.getPasswordRequirements(password);
  }

  validatePhoneNumber(phoneNumber) {
    return this.validationService.validatePhoneNumberOnEntry(phoneNumber);
  }

  getState() {
    return this.state;
  }

  async initiateSignup(formData) {
    try {
      console.log('Initiating signup with:', formData);
      const validationResult = this.validationService.validateRegistrationData(formData);
      if (!validationResult.isValid) {
        this.state.fieldErrors = validationResult.errors.reduce((acc, error) => {
          const field = error.toLowerCase().includes('first name') ? 'firstName' :
                        error.toLowerCase().includes('last name') ? 'lastName' :
                        error.toLowerCase().includes('email') ? 'email' :
                        error.toLowerCase().includes('phone') ? 'phoneNumber' :
                        error.toLowerCase().includes('password') ? 'password' : '';
          return { ...acc, [field]: error };
        }, {});
        return { success: false, error: validationResult.errors[0] };
      }
      const result = await this.registerUserUseCase.initiateSignup(formData);
      console.log('Initiate signup result:', result);
      return result;
    } catch (error) {
      console.error('Initiate signup error:', error);
      return { success: false, error: error.message };
    }
  }

  async register(token) {
    try {
      console.log('Completing registration with token:', token);
      const result = await this.registerUserUseCase.execute(token);
      console.log('Register result:', result);
      return result;
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message, fieldErrors: error.fieldErrors };
    }
  }

  async socialRegister(provider) {
    try {
      console.log('Social register with provider:', provider);
      const result = await this.socialRegisterUseCase.execute(provider);
      console.log('Social register result:', result);
      return result;
    } catch (error) {
      console.error('Social register error:', error);
      return { success: false, error: error.message };
    }
  }

  async resendVerification(email) {
    try {
      console.log('Resending verification for:', email);
      const result = await this.registerUserUseCase.resendVerification(email);
      console.log('Resend verification result:', result);
      return result;
    } catch (error) {
      console.error('Resend verification error:', error);
      return { success: false, error: error.message };
    }
  }
}

export { RegistrationViewModel };
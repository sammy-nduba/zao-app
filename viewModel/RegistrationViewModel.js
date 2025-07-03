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

  async register(formData) {
    this.state.isLoading = true;
    this.state.fieldErrors = {};
    try {
      console.log('RegistrationViewModel.register called with:', formData);
      const user = await this.registerUseCase.execute(formData);
      console.log('Registration successful, user:', user);
      this.state.isRegistered = true;
      return { success: true, user: { ...user, token: user.token } }; 
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
      return { success: false, error: error.message, fieldErrors: newFieldErrors };
    } finally {
      this.state.isLoading = false;
    }
  }

  async socialRegister(provider) {
    this.state.isLoading = true;
    try {
      console.log('Social register called for:', provider);
      const user = await this.socialRegisterUseCase.execute(provider);
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
}
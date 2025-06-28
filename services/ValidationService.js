export class ValidationService {
  validateField(fieldName, value) {
    switch (fieldName) {
      case 'firstName':
      case 'lastName':
        return {
          isValid: value && value.length >= 2,
          error: value && value.length >= 2 ? '' : `${fieldName} must be at least 2 characters`,
        };
      case 'email':
        return {
          isValid: this.validateEmail(value),
          error: this.validateEmail(value) ? '' : 'Invalid email format',
        };
      case 'phoneNumber':
        return this.validatePhoneNumberOnEntry(value);
      case 'password':
        return {
          isValid: this.validatePassword(value),
          error: this.validatePassword(value) ? '' : 'Password does not meet requirements',
        };
      default:
        return { isValid: true, error: '' };
    }
  }

  validateRegistrationData(data) {
    const errors = [];
    if (!data.firstName || data.firstName.length < 2) {
      errors.push('First name must be at least 2 characters');
    }
    if (!data.lastName || data.lastName.length < 2) {
      errors.push('Last name must be at least 2 characters');
    }
    if (!this.validateEmail(data.email)) {
      errors.push('Invalid email format');
    }
    if (!data.phoneNumber || !this.validatePhoneNumber(data.phoneNumber)) {
      errors.push('Invalid phone number format');
    }
    if (!data.password || !this.validatePassword(data.password)) {
      errors.push('Password does not meet requirements');
    }
    return { isValid: errors.length === 0, errors };
  }

  validateLoginData(data) {
    const errors = [];
    if (!data.email || !this.validateEmail(data.email)) {
      errors.push('Invalid email format');
    }
    if (!data.password) {
      errors.push('Password is required');
    }
    return { isValid: errors.length === 0, errors };
  }

  validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return email && emailRegex.test(email);
  }

  validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneNumber && phoneRegex.test(phoneNumber);
  }

  validatePhoneNumberOnEntry(value) {
    if (!value) return { isValid: false, error: '' };
    const isValid = this.validatePhoneNumber(value);
    return { isValid, error: isValid ? '' : 'Invalid phone number format (e.g., +254700000000)' };
  }

  validatePassword(password) {
    return password &&
           password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password) &&
           /[^A-Za-z0-9]/.test(password);
  }

  getPasswordRequirements(password) {
    return [
      { label: 'At least 8 characters', met: password ? password.length >= 8 : false },
      { label: 'Contains uppercase letter', met: password ? /[A-Z]/.test(password) : false },
      { label: 'Contains lowercase letter', met: password ? /[a-z]/.test(password) : false },
      { label: 'Contains number', met: password ? /[0-9]/.test(password) : false },
      { label: 'Contains special character', met: password ? /[^A-Za-z0-9]/.test(password) : false },
    ];
  }
}
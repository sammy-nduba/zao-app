// src/services/ValidationService.js
export class ValidationService {
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
    return emailRegex.test(email);
  }

  validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }

  validatePhoneNumberOnEntry(value) {
    if (!value) return { isValid: false, error: '' };
    const isValid = this.validatePhoneNumber(value);
    return { isValid, error: isValid ? '' : 'Invalid phone number format' };
  }

  validatePassword(password) {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password) &&
           /[^A-Za-z0-9]/.test(password);
  }

  getPasswordRequirements(password) {
    return [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
      { label: 'Contains number', met: /[0-9]/.test(password) },
      { label: 'Contains special character', met: /[^A-Za-z0-9]/.test(password) },
    ];
  }
}
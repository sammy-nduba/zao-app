import React, { useState, useContext, useMemo } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollableMainContainer } from '../../components';
import StyledTextInput from '../../components/inputs/StyledTextInput';
import StyledText from '../../components/Texts/StyledText';
import StyledButton from '../../components/Buttons/StyledButton';
import { colors } from '../../config/theme';
import { AuthContext } from '../../utils/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import container from '../../infrastructure/di/Container';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState('form'); // 'form', 'verify', 'success'
  const { setIsRegistered, setUser } = useContext(AuthContext); // Added setUser
  const navigation = useNavigation();
  const viewModel = useMemo(() => container.get('registrationViewModel'), []);

  const passwordRequirements = viewModel.getPasswordRequirements(formData.password);
  const metRequirementsCount = passwordRequirements.filter(req => req.met).length;
  const isFormValid = Object.values(formData).every(value => value.trim() !== '') &&
    metRequirementsCount === passwordRequirements.length &&
    !Object.values(fieldErrors).some(error => error);

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    viewModel.updateFormData(fieldName, value);

    let error = '';
    if (fieldName === 'phoneNumber') {
      const { isValid, error: phoneError } = viewModel.validatePhoneNumber(value);
      error = phoneError;
    } else if (fieldName === 'email') {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      error = isValidEmail || value === '' ? '' : 'Invalid email format';
    } else if (fieldName === 'firstName' || fieldName === 'lastName') {
      error = value.trim().length >= 2 || value === '' ? '' : 'Must be at least 2 characters';
    } else if (fieldName === 'password' && value) {
      error = metRequirementsCount === passwordRequirements.length ? '' : 'Password does not meet requirements';
    }
    setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleInitiateSignup = async () => {
    setIsLoading(true);
    setFieldErrors({});
    try {
      console.log('Initiating signup:', formData.email);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Client timeout')), 15000)
      );
      const result = await Promise.race([viewModel.initiateSignup(), timeoutPromise]);
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Verification Email Sent',
          text2: result.message,
        });
        setStep('verify');
      } else {
        setFieldErrors({ email: result.error });
        Toast.show({
          type: 'error',
          text1: 'Signup Failed',
          text2: result.error,
        });
      }
    } catch (error) {
      console.error('Initiate signup error:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message.includes('502')
          ? 'Server is currently unavailable. Please try again later.'
          : error.message.includes('timed out')
          ? 'Request timed out. Please check your connection.'
          : error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setFieldErrors({});
    try {
      console.log('Completing registration:', formData);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Client timeout')), 15000)
      );
      const result = await Promise.race([viewModel.register(), timeoutPromise]);
      console.log('Register result:', result);
      if (result.success) {
        setIsRegistered(true);
        setUser({ id: result.user.id, ...result.user }); // Store user with id
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Registration successful! Please set up your farm details.',
        });
        navigation.navigate('FarmDetails'); // Navigate to FarmDetails
      } else {
        setFieldErrors(result.fieldErrors || {});
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: result.error || 'Please check your information and try again',
        });
      }
    } catch (error) {
      console.error('Registration error:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message.includes('502')
          ? 'Server is currently unavailable. Please try again later.'
          : error.message.includes('timed out')
          ? 'Request timed out. Please check your connection.'
          : error.message.includes('AsyncStorage')
          ? 'Storage error. Please try again.'
          : error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = async (provider) => {
    setIsLoading(true);
    try {
      console.log('Social register:', provider);
      const result = await viewModel.socialRegister(provider);
      if (result.success) {
        setIsRegistered(true);
        setUser({ id: result.user.id, ...result.user }); // Store user with id
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Registered with ${result.provider}! Please set up your farm details.`,
        });
        navigation.navigate('FarmDetails'); // Navigate to FarmDetails
      } else {
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: result.error,
        });
      }
    } catch (error) {
      console.error('Social registration error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message.includes('502')
          ? 'Server is currently unavailable. Please try again later.'
          : 'Social registration failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goToLogin = () => navigation.navigate('Login');
  const goToUserAgreement = () => navigation.navigate('UserAgreement');
  const goToPrivacyPolicy = () => navigation.navigate('PrivacyPolicy');

  return (
    <ScrollableMainContainer contentContainerStyle={styles.container}>
      <View style={styles.vectorContainer}>
        <Image source={require('../../assets/Vector1.png')} style={styles.vector1} />
        <Image source={require('../../assets/Vector.png')} style={styles.vector2} />
      </View>

      <View style={styles.header}>
        <StyledText style={styles.title}>Create Account</StyledText>
        <StyledText style={styles.subtitle}>
          Welcome to Zao App setup to your account to continue
        </StyledText>
      </View>

      <View style={styles.formContainer}>
        {step === 'form' && (
          <>
            <View style={styles.inputWrapper}>
              <StyledText style={styles.inputLabel}>First name</StyledText>
              <StyledTextInput
                placeholder="Enter first name"
                value={formData.firstName}
                onChangeText={(value) => handleFieldChange('firstName', value)}
                style={[styles.input, fieldErrors.firstName ? styles.inputError : null]}
              />
              {fieldErrors.firstName && (
                <StyledText style={styles.errorText}>{fieldErrors.firstName}</StyledText>
              )}
            </View>

            <View style={styles.inputWrapper}>
              <StyledText style={styles.inputLabel}>Last name</StyledText>
              <StyledTextInput
                placeholder="Enter last name"
                value={formData.lastName}
                onChangeText={(value) => handleFieldChange('lastName', value)}
                style={[styles.input, fieldErrors.lastName ? styles.inputError : null]}
              />
              {fieldErrors.lastName && (
                <StyledText style={styles.errorText}>{fieldErrors.lastName}</StyledText>
              )}
            </View>

            <View style={styles.inputWrapper}>
              <StyledText style={styles.inputLabel}>Email address</StyledText>
              <StyledTextInput
                placeholder="Enter email address"
                value={formData.email}
                onChangeText={(value) => handleFieldChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.input, fieldErrors.email ? styles.inputError : null]}
              />
              {fieldErrors.email && (
                <StyledText style={styles.errorText}>{fieldErrors.email}</StyledText>
              )}
            </View>

            <View style={styles.inputWrapper}>
              <StyledText style={styles.inputLabel}>Phone number</StyledText>
              <StyledTextInput
                placeholder="Enter phone number (e.g., +254700000000)"
                value={formData.phoneNumber}
                onChangeText={(value) => handleFieldChange('phoneNumber', value)}
                keyboardType="phone-pad"
                maxLength={12}
                style={[styles.input, fieldErrors.phoneNumber ? styles.inputError : null]}
              />
              {fieldErrors.phoneNumber && (
                <StyledText style={styles.errorText}>{fieldErrors.phoneNumber}</StyledText>
              )}
            </View>

            <View style={styles.inputWrapper}>
              <StyledText style={styles.inputLabel}>Password</StyledText>
              <View style={styles.passwordInputContainer}>
                <StyledTextInput
                  placeholder="***********"
                  value={formData.password}
                  onChangeText={(value) => handleFieldChange('password', value)}
                  secureTextEntry={!showPassword}
                  style={[styles.input, fieldErrors.password ? styles.inputError : null]}
                />
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.placeholder}
                  />
                </TouchableOpacity>
              </View>
              {fieldErrors.password && (
                <StyledText style={styles.errorText}>{fieldErrors.password}</StyledText>
              )}
            </View>

            <View style={styles.passwordRequirements}>
              <StyledText style={styles.requirementText}>Password strength</StyledText>
              <StyledText style={styles.requirementCount}>{`${metRequirementsCount}/5`}</StyledText>
              {passwordRequirements.map(({ label, met }, index) => (
                <StyledText
                  key={index}
                  style={[styles.requirementItem, met && styles.requirementMet]}
                >
                  {label}
                </StyledText>
              ))}
            </View>

            <View style={styles.termsContainer}>
              <StyledText style={styles.termsText}>
                By clicking "Send Verification Email", you agree to our{' '}
                <StyledText style={styles.linkText} onPress={goToUserAgreement}>
                  User agreement
                </StyledText>{' '}
                and{' '}
                <StyledText style={styles.linkText} onPress={goToPrivacyPolicy}>
                  Privacy policy
                </StyledText>{' '}
                of Zao APP.
              </StyledText>
            </View>

            <StyledButton
              title="Send Verification Email"
              onPress={handleInitiateSignup}
              disabled={isLoading || !isFormValid || !!fieldErrors.phoneNumber}
              style={styles.registerButton}
            />
          </>
        )}

        {step === 'verify' && (
          <View style={styles.verifyContainer}>
            <StyledText style={styles.verifyText}>
              Please check your email for a verification link. Once verified, complete your registration.
            </StyledText>
            <StyledButton
              title="Complete Registration"
              onPress={handleRegister}
              disabled={isLoading}
              style={styles.registerButton}
            />
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <StyledText style={styles.dividerText}>Or</StyledText>
          <View style={styles.dividerLine} />
        </View>
      </View>

      <View style={styles.socialButtonsContainer}>
        <StyledButton
          title="Continue with Google"
          icon="google"
          onPress={() => handleSocialRegister('google')}
          isSocial
          style={styles.socialButton}
          disabled={isLoading}
        />
        <StyledButton
          title="Continue with Facebook"
          icon="facebook"
          onPress={() => handleSocialRegister('facebook')}
          isSocial
          style={styles.socialButton}
          disabled={isLoading}
        />
        <StyledButton
          title="Continue with Apple"
          icon="apple"
          onPress={() => handleSocialRegister('apple')}
          isSocial
          style={styles.socialButton}
          disabled={isLoading}
        />
      </View>

      <View style={styles.loginContainer}>
        <StyledText style={styles.loginText}>Already have an account? </StyledText>
        <TouchableOpacity onPress={goToLogin}>
          <StyledText style={styles.loginLink}>Log In</StyledText>
        </TouchableOpacity>
      </View>
      <Toast />
    </ScrollableMainContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: colors.background,
  },
  verifyContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  verifyText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.grey[600],
    textAlign: 'center',
    marginBottom: 20,
  },
  vectorContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  vector2: {
    position: 'absolute',
    width: 200,
    height: 200,
    left: 217,
  },
  header: {
    marginTop: 75,
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.grey[600],
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.grey[500],
    fontWeight: '400',
  },
  formContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 20,
    width: '100%',
  },
  inputLabel: {
    fontFamily: 'Roboto',
    fontSize: 16,
    marginBottom: 8,
    color: colors.grey[600],
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.grey[300],
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: '#FF0000',
  },
  errorText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#FF0000',
    marginTop: 4,
  },
  passwordInputContainer: {
    position: 'relative',
  },
  toggleButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 2,
  },
  passwordRequirements: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grey[300],
    backgroundColor: colors.background,
    width: '100%',
    marginBottom: 20,
    gap: 8,
    position: 'relative',
  },
  requirementText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.grey[600],
    fontWeight: '600',
    marginBottom: 8,
  },
  requirementItem: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: colors.grey[600],
    fontWeight: '400',
    letterSpacing: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderColor: colors.grey[300],
    borderWidth: 1,
    borderRadius: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  requirementMet: {
    color: colors.primary[600],
    borderColor: colors.primary[600],
  },
  requirementCount: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary[600],
    position: 'absolute',
    top: 16,
    right: 16,
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: colors.grey[300],
    lineHeight: 18,
    textAlign: 'center',
  },
  linkText: {
    color: colors.primary[600],
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    marginBottom: 24,
  },
  registerButton: {
    width: '100%',
    height: 56,
    borderRadius: 32,
    backgroundColor: colors.primary[600],
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.grey[300],
  },
  dividerText: {
    marginHorizontal: 10,
    color: colors.grey[600],
    fontSize: 16,
  },
  socialButtonsContainer: {
    marginBottom: 24,
  },
  socialButton: {
    width: '100%',
    height: 50,
    marginBottom: 12,
    backgroundColor: colors.grey[100],
    borderWidth: 1,
    borderColor: colors.grey[300],
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 24,
  },
  loginText: {
    fontFamily: 'Roboto',
    color: colors.grey[600],
    fontSize: 14,
  },
  loginLink: {
    fontFamily: 'Roboto',
    color: colors.primary[600],
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Register;
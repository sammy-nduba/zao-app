import React, { useState, useContext, useMemo, useEffect } from 'react';
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
import { RegistrationViewModel } from '../../viewModel/RegistrationViewModel';
import container from '../../infrastructure/di/Container';

console.log("Register", AuthContext)

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
  const [isContainerReady, setIsContainerReady] = useState(false);
  const { setIsRegistered, setUser } = useContext(AuthContext);
  const navigation = useNavigation();

  const viewModel = useMemo(() => {
    try {
      return new RegistrationViewModel(
        container.get('registerUserUseCase'),
        container.get('socialRegisterUseCase'),
        container.get('validationService')
      );
    } catch (error) {
      console.error('Failed to initialize RegistrationViewModel:', error);
      Toast.show({
        type: 'error',
        text1: 'Initialization Error',
        text2: 'Failed to load registration. Please try again.',
      });
      return null;
    }
  }, []);

  useEffect(() => {
    const checkContainer = async () => {
      try {
        await container.initialize();
        setIsContainerReady(true);
      } catch (error) {
        console.error('Container initialization failed:', error);
        Toast.show({
          type: 'error',
          text1: 'Initialization Error',
          text2: 'Application failed to load. Please restart the app.',
        });
      }
    };
    checkContainer();
  }, []);

  if (!isContainerReady || !viewModel) {
    return (
      <View style={styles.container}>
        <StyledText>Loading...</StyledText>
      </View>
    );
  }

  // Password requirements from ValidationService via ViewModel
  const passwordRequirements = viewModel.getPasswordRequirements(formData.password);
  const metRequirementsCount = passwordRequirements.filter(req => req.met).length;

  // Form validation
  const isFormValid = () =>
    Object.values(formData).every(value => value.trim() !== '') &&
    metRequirementsCount === passwordRequirements.length &&
    !Object.values(fieldErrors).some(error => error);

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    viewModel.updateFormData(fieldName, value);
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: viewModel.getState().fieldErrors[fieldName] || '',
    }));
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setFieldErrors({});
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 15000)
      );
      const result = await Promise.race([viewModel.register(formData), timeoutPromise]);
      if (result.success) {
        setIsRegistered(true);
        setUser({
          id: result.user.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
        });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Registration successful! Please verify your email.',
        });
        navigation.navigate('EmailVerification', { token: result.user.token });
      } else {
        setFieldErrors(result.fieldErrors || {});
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: result.error || 'Please check your information and try again.',
        });
      }
    } catch (error) {
      const errorMessage = error.message.includes('502')
        ? 'Server is currently unavailable. Please try again later.'
        : error.message.includes('timed out')
        ? 'Request timed out. Please check your connection.'
        : error.message.includes('AsyncStorage')
        ? 'Storage error. Please try again.'
        : error.message;
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = async (provider) => {
    setIsLoading(true);
    try {
      const result = await viewModel.socialRegister(provider);
      if (result.success) {
        setIsRegistered(true);
        setUser({
          id: result.user.id,
          firstName: result.user.firstName || 'User',
          lastName: result.user.lastName || '',
          email: result.user.email,
          phoneNumber: result.user.phoneNumber || '',
        });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Registered with ${provider}! Please set up your farm details.`,
        });
        navigation.navigate('FarmDetails');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: result.error || 'Social registration failed.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Social registration failed. Please try again.',
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
        {/* <Image source={require('../../assets/Vector1.png')} style={styles.vector1} /> */}
        <Image source={require('../../assets/Vector.png')} style={styles.vector2} />
      </View>

      <View style={styles.header}>
        <StyledText style={styles.title}>Create Account</StyledText>
        <StyledText style={styles.subtitle}>
          Welcome to Zao App. Set up your account to continue.
        </StyledText>
      </View>

      <View style={styles.formContainer}>
        {/* First Name */}
        <View style={styles.inputWrapper}>
          <StyledText style={styles.inputLabel}>First Name</StyledText>
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

        {/* Last Name */}
        <View style={styles.inputWrapper}>
          <StyledText style={styles.inputLabel}>Last Name</StyledText>
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

        {/* Email */}
        <View style={styles.inputWrapper}>
          <StyledText style={styles.inputLabel}>Email Address</StyledText>
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

        {/* Phone Number */}
        <View style={styles.inputWrapper}>
          <StyledText style={styles.inputLabel}>Phone Number</StyledText>
          <StyledTextInput
            placeholder="Enter phone number (e.g., +254700000000)"
            value={formData.phoneNumber}
            onChangeText={(value) => handleFieldChange('phoneNumber', value)}
            keyboardType="phone-pad"
            maxLength={15}
            style={[styles.input, fieldErrors.phoneNumber ? styles.inputError : null]}
          />
          {fieldErrors.phoneNumber && (
            <StyledText style={styles.errorText}>{fieldErrors.phoneNumber}</StyledText>
          )}
        </View>

        {/* Password */}
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

        {/* Password Requirements */}
        <View style={styles.passwordRequirements}>
          <View style={styles.requirementsHeader}>
            <StyledText style={styles.requirementText}>Password Strength</StyledText>
            <StyledText style={styles.requirementCount}>{`${metRequirementsCount}/5`}</StyledText>
          </View>
          <View style={styles.requirementsGrid}>
            {passwordRequirements.map(({ label, met }, index) => (
              <StyledText
                key={index}
                style={[styles.requirementItem, met && styles.requirementMet]}
              >
                {label}
              </StyledText>
            ))}
          </View>
        </View>

        {/* Terms */}
        <View style={styles.termsContainer}>
          <StyledText style={styles.termsText}>
            By clicking "Create Account", you agree to our{' '}
            <StyledText style={styles.linkText} onPress={goToUserAgreement}>
              User Agreement
            </StyledText>{' '}
            and{' '}
            <StyledText style={styles.linkText} onPress={goToPrivacyPolicy}>
              Privacy Policy
            </StyledText>{' '}
            of Zao App.
          </StyledText>
        </View>
      </View>

      {/* Register Button */}
      <View style={styles.buttonContainer}>
        <StyledButton
          title="Create Account"
          onPress={handleRegister}
          disabled={isLoading || !isFormValid()}
          style={styles.registerButton}
        />

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <StyledText style={styles.dividerText}>Or</StyledText>
          <View style={styles.dividerLine} />
        </View>
      </View>

      {/* Social Buttons */}
      <View style={styles.socialButtonsContainer}>
        <StyledButton
          title="Continue with Google"
          icon="google"
          iconColor="#DB4437"
          onPress={() => handleSocialRegister('Google')}
          isSocial
          style={styles.socialButton}
          disabled={isLoading}
        />
        <StyledButton
          title="Continue with Facebook"
          icon="facebook-box"
          iconColor="#1877F2"
          onPress={() => handleSocialRegister('Facebook')}
          isSocial
          style={styles.socialButton}
          disabled={isLoading}
        />
        <StyledButton
          title="Continue with Apple"
          icon="apple"
          iconColor="#000000"
          onPress={() => handleSocialRegister('Apple')}
          isSocial
          style={styles.socialButton}
          disabled={isLoading}
        />
      </View>

      {/* Login Link */}
      <View style={styles.loginContainer}>
        <StyledText style={styles.loginText}>Already have an account? </StyledText>
        <TouchableOpacity onPress={goToLogin}>
          <StyledText style={styles.loginLink}>Log In</StyledText>
        </TouchableOpacity>
      </View>
    </ScrollableMainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: colors.background,
  },
  vectorContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  vector1: {
    position: 'absolute',
    width: 200,
    height: 200,
    top: 0,
    left: 0,
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
  },
  requirementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.grey[600],
    fontWeight: '600',
  },
  requirementCount: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary[600],
  },
  requirementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  requirementItem: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: colors.grey[600],
    fontWeight: '400',
    letterSpacing: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderColor: colors.grey[300],
    borderWidth: 1,
    borderRadius: 16,
    textAlign: 'center',
    width: '48%',
    marginBottom: 8,
  },
  requirementMet: {
    color: colors.primary[600],
    borderColor: colors.primary[600],
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
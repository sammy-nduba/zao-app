import React, { useState, useContext } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollableMainContainer } from '../../components';
import StyledTextInput from '../../components/inputs/StyledTextInput'
import StyledText from '../../components/Texts/StyledText';
import StyledButton from '../../components/Buttons/StyledButton';
import { colors } from '../../config/theme';
import { onBoardingContext } from '../../utils/context';
import { useNavigation } from '@react-navigation/native';
import { storeData } from '../../utils/storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
// import { FarmDetails } from './farmDetails/FarmDetails'


const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const { setIsRegistered } = useContext(onBoardingContext);
  const navigation = useNavigation();

  // Password requirements validation
  const requirements = [
    { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
    { label: 'An uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
    { label: 'A lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
    { label: 'A special character', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
    { label: 'A number', test: (pwd) => /[0-9]/.test(pwd) },
  ];

  const metRequirementsCount = requirements.filter(({ test }) => test(password)).length;

  // Email format validation
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setEmailError('');
    try {
      if (!firstName || !lastName || !email || !password) {
        Toast.show({
          type: 'error',
          text1: 'Missing Fields',
          text2: 'Please fill in all required fields',
        });
        throw new Error('Missing required fields');
      }
      if (!isValidEmail(email)) {
        setEmailError('Please enter a valid email address');
        Toast.show({
          type: 'error',
          text1: 'Invalid Email',
          text2: 'Please enter a valid email address',
        });
        throw new Error('Invalid email format');
      }
      if (metRequirementsCount < 5) {
        Toast.show({
          type: 'error',
          text1: 'Weak Password',
          text2: 'Password does not meet all requirements',
        });
        throw new Error('Password does not meet all requirements');
      }
      // Placeholder: Implement registration
      await storeData('@ZaoAPP:Registration', true);
      setIsRegistered(true);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Registration successful! Please log in.',
      });
      navigation.navigate('FarmDetails');
    } catch (error) {
      // Error shown via Toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      storeData('@ZaoAPP:Registration', true);
      setIsRegistered(true);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Registered with ${provider}! Please log in.`,
      });
      navigation.navigate('Login');
    }, 500);
  };

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  const goToUserAgreement = () => {
    navigation.navigate('UserAgreement');
  };

  const goToPrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  return (
    <ScrollableMainContainer contentContainerStyle={styles.container}>
      <View style={styles.vectorContainer}>
        <Image source={require('../../assets/Vector 1.png')} style={styles.vector1} />
        <Image source={require('../../assets/Vector.png')} style={styles.vector2} />
      </View>

      <View style={styles.header}>
        <StyledText style={styles.title}>Create Account</StyledText>
        <StyledText style={styles.subtitle}>
          Welcome to Zao App setup to your account to continue
        </StyledText>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
          <StyledText style={styles.inputLabel}>First name</StyledText>
          <StyledTextInput
            placeholder="Enter first name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />
        </View>

        <View style={styles.inputWrapper}>
          <StyledText style={styles.inputLabel}>Last name</StyledText>
          <StyledTextInput
            placeholder="Enter last name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />
        </View>

        <View style={styles.inputWrapper}>
          <StyledText style={styles.inputLabel}>Email address</StyledText>
          <StyledTextInput
            placeholder="Enter email address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, emailError ? styles.inputError : null]}
          />
          {emailError ? (
            <StyledText style={styles.errorText}>{emailError}</StyledText>
          ) : null}
        </View>

        <View style={styles.inputWrapper}>
          <StyledText style={styles.inputLabel}>Password</StyledText>
          <View style={styles.passwordInputContainer}>
            <StyledTextInput
              placeholder="***********"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
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
        </View>

        <View style={styles.passwordRequirements}>
          <StyledText style={styles.requirementText}>Password strength</StyledText>
          <StyledText style={styles.requirementCount}>{`${metRequirementsCount}/5`}</StyledText>
          {requirements.map(({ label }, index) => (
            <StyledText
              key={index}
              style={[
                styles.requirementItem,
                requirements[index].test(password) && styles.requirementMet,
              ]}
            >
              {label}
            </StyledText>
          ))}
        </View>

        <View style={styles.termsContainer}>
          <StyledText style={styles.termsText}>
            By clicking "Create account", you agree to our{' '}
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
      </View>

      <View style={styles.buttonContainer}>
        <StyledButton
          title="Create account"
          onPress={handleRegister}
          disabled={isLoading || !firstName || !lastName || !email || !password}
          style={styles.registerButton}
        />

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
          onPress={() => handleSocialRegister('Google')}
          isSocial
          style={styles.socialButton}
        />
        <StyledButton
          title="Continue with Facebook"
          icon="facebook"
          onPress={() => handleSocialRegister('Facebook')}
          isSocial
          style={styles.socialButton}
        />
        <StyledButton
          title="Continue with Apple"
          icon="apple1"
          onPress={() => handleSocialRegister('Apple')}
          isSocial
          style={styles.socialButton}
        />
      </View>

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
  // vectorContainer: {
  //   position: 'absolute',
  //   width: '100%',
  //   height: '100%',
  //   zIndex: -1,
  // },
  // vector1: {
  //   position: 'absolute',
  //   width: 130,
  //   height: 128,
  //   top: 100,
  //   left: 250,
  //   opacity: 0.1,
  //   transform: [{ rotate: '-161.18deg' }],
  // },
  // vector2: {
  //   position: 'absolute',
  //   width: 200,
  //   height: 200,
  //   top: 300,
  //   left: 200,
  //   opacity: 0.05,
  // },
  vectorContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1, 
  },
  // vector1: {
  //   position: 'absolute',
  //   width: 130.41,
  //   height: 128.5,
  //   top: 2065.92,
  //   left: 272.59,
  //   transform: [{ rotate: '-161.18deg' }],
  //   backgroundColor: '#FFCD381A', // 10% opacity
  // },
  vector2: {
    position: 'absolute',
    width: 200,
    height: 200,
    left: 217,
    // backgroundColor: '#4CAF500D', // 5% opacity
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
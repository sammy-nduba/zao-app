import React, { useState, useContext } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { StyledButton, ScrollableMainContainer } from '../../components';
import StyledText from '../../components/Texts/StyledText'
import StyledTextInput from '../../components/inputs/StyledTextInput'
import { colors } from '../../config/theme';
import { onBoardingContext } from '../../utils/context';
import { useNavigation } from '@react-navigation/native';
import { storeData } from '../../utils/storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';


const Login = () => {
  const { setIsLoggedIn, setUser, authError, setAuthError, isLoading, setIsLoading } =
    useContext(onBoardingContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigation = useNavigation();

  // Email validation (same as Register.js)
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setAuthError(null);
    setEmailError('');
    setPasswordError('');

    // Validate form
    let isValid = true;
    if (!email) {
      setEmailError('Email is required');
      Toast.show({
        type: 'error',
        text1: 'Missing Email',
        text2: 'Please enter your email address',
      });
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address',
      });
      isValid = false;
    }
    if (!password) {
      setPasswordError('Password is required');
      Toast.show({
        type: 'error',
        text1: 'Missing Password',
        text2: 'Please enter your password',
      });
      isValid = false;
    }
    if (!isValid) {
      return;
    }

    setIsLoading(true);
    try {
      // Placeholder: Replace with actual authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await storeData('@ZaoAPP:Login', true);
      setUser({ email });
      setIsLoggedIn(true);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Login successful!',
      });
      navigation.navigate('Home');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.message || 'Login failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      storeData('@ZaoAPP:Login', true);
      setIsLoggedIn(true);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Logged in with ${provider}!`,
      });
      navigation.navigate('Home');
    }, 500);
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  const goToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <ScrollableMainContainer contentContainerStyle={styles.container}>
      <View style={styles.vectorContainer}>
        <Image source={require('../../assets/Vector 1.png')} style={styles.vector1} />
        <Image source={require('../../assets/Vector.png')} style={styles.vector2} />
      </View>

      <View style={styles.header}>
        <StyledText style={styles.title}>Login</StyledText>
        <StyledText style={styles.subtitle}>
          Welcome to Zao App login to your account to continue
        </StyledText>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
          <StyledText style={styles.inputLabel}>Email</StyledText>
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
            <StyledText style={styles.fieldErrorText}>{emailError}</StyledText>
          ) : null}
        </View>

        <View style={styles.inputWrapper}>
          <StyledText style={styles.inputLabel}>Password</StyledText>
          <View style={styles.passwordInputContainer}>
            <StyledTextInput
              placeholder="***********"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
              secureTextEntry={!showPassword}
              style={[styles.input, passwordError ? styles.inputError : null]}
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
          <View style={styles.passwordFooter}>
            {passwordError ? (
              <StyledText style={styles.fieldErrorText}>{passwordError}</StyledText>
            ) : (
              <StyledText style={styles.fieldErrorText} />
            )}
            <TouchableOpacity onPress={goToForgotPassword} style={styles.forgotPasswordButton}>
              <StyledText style={styles.forgotPassword}>Forgot Password?</StyledText>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <StyledButton
          title="Log In"
          onPress={handleLogin}
          disabled={isLoading || !email || !password}
          style={styles.loginButton}
        />
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <StyledText style={styles.dividerText}>or</StyledText>
          <View style={styles.dividerLine} />
        </View>
      </View>

      <View style={styles.socialButtonsContainer}>
        <StyledButton
          title="Continue with Google"
          icon="google"
          onPress={() => handleSocialLogin('Google')}
          isSocial
          style={styles.socialButton}
        />
        <StyledButton
          title="Continue with Facebook"
          icon="facebook"
          onPress={() => handleSocialLogin('Facebook')}
          isSocial
          style={styles.socialButton}
        />
        <StyledButton
          title="Continue with Apple"
          icon="apple1"
          onPress={() => handleSocialLogin('Apple')}
          isSocial
          style={styles.socialButton}
        />
      </View>

      <View style={styles.footer}>
        <StyledText style={styles.registerText}>Don't have an account? </StyledText>
        <TouchableOpacity onPress={goToRegister}>
          <StyledText style={styles.registerLink}>Sign Up</StyledText>
        </TouchableOpacity>
      </View>
    </ScrollableMainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
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
  },
  inputLabel: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.grey[600],
    marginBottom: 8,
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
  fieldErrorText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#FF0000',
    marginTop: 4,
    marginLeft: 5,
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
  passwordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
  },
  forgotPassword: {
    fontFamily: 'Roboto',
    color: colors.grey[600],
    fontSize: 12,
    fontWeight: '600',
  },
  buttonContainer: {
    marginBottom: 24,
  },
  loginButton: {
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
    fontFamily: 'Roboto',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 24,
  },
  registerText: {
    fontFamily: 'Roboto',
    color: colors.grey[600],
    fontSize: 14,
  },
  registerLink: {
    fontFamily: 'Roboto',
    color: colors.primary[600],
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Login;

import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { ScrollableMainContainer, StyledTextInput, StyledButton, StyledText } from '../../components';
import { colors } from '../../config/theme';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // Email validation (same as Register.js and Login.js)
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setEmailError('');
    try {
      if (!email) {
        setEmailError('Email is required');
        Toast.show({
          type: 'error',
          text1: 'Missing Email',
          text2: 'Please enter your email address',
        });
        throw new Error('Email is required');
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
      // Mock OTP generation (replace with actual API call)
      const mockOTP = Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit OTP
      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: 'A 5-digit code has been sent to your email',
      });
      navigation.navigate('OTPScreen', { email, otp: mockOTP });
    } catch (error) {
      // Error shown via Toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollableMainContainer contentContainerStyle={styles.container}>
      <View style={styles.vectorContainer}>
        <Image source={require('../../assets/Vector 1.png')} style={styles.vector1} />
        <Image source={require('../../assets/Vector.png')} style={styles.vector2} />
      </View>

      <View style={styles.header}>
        <StyledText style={styles.title}>Forgot Password</StyledText>
        <StyledText style={styles.subtitle}>
          Enter your email address to receive a 5-digit OTP
        </StyledText>
      </View>

      <View style={styles.formContainer}>
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
      </View>

      <View style={styles.buttonContainer}>
        <StyledButton
          title="Send OTP"
          onPress={handleSubmit}
          disabled={isLoading || !email}
          style={styles.submitButton}
        />
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
    width: 130,
    height: 128,
    top: 100,
    left: 250,
    opacity: 0.1,
    transform: [{ rotate: '-161.18deg' }],
  },
  vector2: {
    position: 'absolute',
    width: 200,
    height: 200,
    top: 300,
    left: 200,
    opacity: 0.05,
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
  buttonContainer: {
    marginBottom: 24,
  },
  submitButton: {
    width: '100%',
    height: 56,
    borderRadius: 32,
    backgroundColor: colors.primary[600],
  },
});

export default ForgotPassword;
import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollableMainContainer, StyledButton,} from '../../components';
import StyledTextInput from '../../components/inputs/StyledTextInput';
import StyledText from '../../components/Texts/StyledText';
import { colors } from '../../config/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';


console.log("OTP screen", StyledTextInput)

const OTPScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [otpError, setOtpError] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { email, otp: sentOTP } = route.params; // Mock OTP from ForgotPassword
  const inputRefs = useRef([]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (value, index) => {
    if (isNaN(value) && value !== '') return; // Allow only numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    // Auto-focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1].focus();
    }
    // Auto-focus previous on backspace
    if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setOtpError('');
    try {
      const enteredOTP = otp.join('');
      if (enteredOTP.length !== 5) {
        setOtpError('Please enter a 5-digit OTP');
        Toast.show({
          type: 'error',
          text1: 'Invalid OTP',
          text2: 'Please enter a 5-digit OTP',
        });
        throw new Error('Invalid OTP length');
      }
      // Mock OTP verification
      if (enteredOTP !== sentOTP) {
        setOtpError('Incorrect OTP');
        Toast.show({
          type: 'error',
          text1: 'Incorrect OTP',
          text2: 'The OTP entered is incorrect',
        });
        throw new Error('Incorrect OTP');
      }
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'OTP verified! Please log in with your new password.',
      });
      navigation.navigate('Login');
    } catch (error) {
      // Error shown via Toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(30);
    // Mock resend OTP (replace with actual API call)
    const mockOTP = Math.floor(10000 + Math.random() * 90000).toString();
    Toast.show({
      type: 'success',
      text1: 'OTP Resent',
      text2: 'A new 5-digit code has been sent to your email',
    });
    navigation.setParams({ otp: mockOTP });
  };

  return (
    <ScrollableMainContainer contentContainerStyle={styles.container}>
      <View style={styles.vectorContainer}>
        <Image source={require('../../assets/Vector1.png')} style={styles.vector1} />
        <Image source={require('../../assets/Vector.png')} style={styles.vector2} />
      </View>

      <View style={styles.header}>
        <StyledText style={styles.title}>Enter OTP</StyledText>
        <StyledText style={styles.subtitle}>
          Enter the 5-digit code sent to {email}
        </StyledText>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <StyledTextInput
              key={index}
              placeholder="0"
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              keyboardType="numeric"
              maxLength={1}
              style={[styles.otpInput, otpError ? styles.inputError : null]}
              ref={(ref) => (inputRefs.current[index] = ref)}
              autoFocus={index === 0}
            />
          ))}
        </View>
        {otpError ? (
          <StyledText style={styles.errorText}>{otpError}</StyledText>
        ) : null}
        <View style={styles.resendContainer}>
          <StyledText style={styles.resendText}>Didn't receive the code? </StyledText>
          <TouchableOpacity onPress={handleResend} disabled={resendCooldown > 0}>
            <StyledText
              style={[
                styles.resendLink,
                resendCooldown > 0 ? styles.resendLinkDisabled : null,
              ]}
            >
              Resend {resendCooldown > 0 ? `(${resendCooldown}s)` : ''}
            </StyledText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <StyledButton
          title="Verify OTP"
          onPress={handleSubmit}
          disabled={isLoading || otp.some((digit) => !digit)}
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
  // vector1: {
  //   position: 'absolute',
  //   width: 130,
  //   height: 128,
  //   top: 100,
  //   left: 250,
  //   opacity: 0.1,
  //   transform: [{ rotate: '-161.18deg' }],
  // },
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grey[300],
    backgroundColor: colors.background,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Roboto',
  },
  inputError: {
    borderColor: '#FF0000',
  },
  errorText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#FF0000',
    marginTop: 4,
    textAlign: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  resendText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.grey[600],
  },
  resendLink: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.primary[600],
    fontWeight: 'bold',
  },
  resendLinkDisabled: {
    color: colors.grey[300],
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

export default OTPScreen;
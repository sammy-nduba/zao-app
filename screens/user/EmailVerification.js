// src/screens/EmailVerification.js
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { ScrollableMainContainer } from '../../components';
import StyledText from '../../components/Texts/StyledText';
import StyledButton from '../../components/Buttons/StyledButton';
import { colors } from '../../config/theme';
import { AuthContext } from '../../utils/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import container from '../../infrastructure/di/Container';
import { EmailVerificationViewModel } from '../../viewModel/EmailVerificationViewModel';

const EmailVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const { setIsVerified, setIsRegistered, setUser } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();

  const viewModel = useMemo(() => {
    try {
      return new EmailVerificationViewModel(container.get('verifyEmailUseCase'));
    } catch (error) {
      console.error('EmailVerification: Failed to initialize ViewModel:', error);
      Toast.show({
        type: 'error',
        text1: 'Initialization Error',
        text2: error.message.includes('Container not initialized')
          ? 'App not fully initialized. Please restart.'
          : `Failed to load verification: ${error.message}`,
      });
      return null;
    }
  }, []);

  useEffect(() => {
    const handleDeepLink = async (event) => {
      const url = event.url;
      console.log('Deep link received:', url);
      if (url) {
        const tokenFromUrl = new URL(url).searchParams.get('token');
        if (tokenFromUrl) {
          setToken(tokenFromUrl);
          await handleVerify(tokenFromUrl);
        }
      }
    };

    Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    // Set token and email from route params if available
    if (route.params?.token && route.params?.email) {
      setToken(route.params.token);
      setEmail(route.params.email);
    }

    return () => Linking.removeAllListeners('url');
  }, [route.params, viewModel]);

  const handleVerify = async (verifyToken = token) => {
    if (!viewModel || !verifyToken) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Verification token missing or app not ready.',
      });
      return;
    }
    setIsLoading(true);
    try {
      console.log('Verifying email with token:', verifyToken);
      const result = await viewModel.verifyEmail(verifyToken);
      console.log('Verification result:', result);
      if (result.success) {
        setIsVerified(true);
        setIsRegistered(true);
        setUser({
          id: result.user.id,
          email: result.user.email,
          token: result.user.token,
        });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Email verified! Please set up your farm details.',
        });
        navigation.navigate('FarmDetails');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: result.error.includes('expired')
            ? 'Verification link expired. Please resend.'
            : result.error.includes('401')
            ? 'Invalid or expired token.'
            : result.error,
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message.includes('timed out')
          ? 'Request timed out. Please check your connection.'
          : error.message.includes('401')
          ? 'Invalid or expired token.'
          : `Verification error: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!viewModel || !email) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Email address missing or app not ready.',
      });
      return;
    }
    setIsLoading(true);
    try {
      console.log('Resending verification for:', email);
      const result = await container.get('registerUserUseCase').resendVerification(email);
      console.log('Resend verification result:', result);
      if (result.success) {
        setToken(result.token);
        Toast.show({
          type: 'success',
          text1: 'Verification Email Resent',
          text2: result.message,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Resend Failed',
          text2: result.error.includes('404') ? 'No pending registration found.' : result.error,
        });
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message.includes('network') || error.message.includes('timeout')
          ? 'Network error. Please check your connection.'
          : error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!viewModel) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        <StyledText style={{ marginTop: 10, color: 'red', textAlign: 'center' }}>
          Failed to initialize verification. Please restart the app.
        </StyledText>
      </View>
    );
  }

  return (
    <ScrollableMainContainer contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <StyledText style={styles.title}>Verify Your Email</StyledText>
        <StyledText style={styles.subtitle}>
          Please verify your email to continue setting up your account.
        </StyledText>
      </View>
      <View style={styles.buttonContainer}>
        <StyledButton
          title="Verify Email"
          onPress={handleVerify}
          disabled={isLoading || !token}
          style={styles.verifyButton}
        />
        <StyledButton
          title="Resend Verification Email"
          onPress={handleResendVerification}
          disabled={isLoading || !email}
          style={styles.verifyButton}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
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
  buttonContainer: {
    marginBottom: 24,
  },
  verifyButton: {
    width: '100%',
    height: 56,
    borderRadius: 32,
    backgroundColor: colors.primary[600],
    marginBottom: 12,
  },
});

export default EmailVerification;
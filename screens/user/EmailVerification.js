import React, { useState, useEffect, useContext, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { ScrollableMainContainer } from '../../components/container/ScrollableMainContainer';
import StyledText from '../../components/Texts/StyledText';
import StyledButton from '../../components/Buttons/StyledButton';
import { colors } from '../../config/theme';
import { AuthContext } from '../../utils/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import container from '../../infrastructure/di/Container';

const EmailVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setIsVerified, setIsRegistrationComplete } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { token } = route.params || {};

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

  const handleVerify = async () => {
    if (!viewModel || !token) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Verification token missing or app not ready.',
      });
      return;
    }
    setIsLoading(true);
    try {
      const result = await viewModel.verifyEmail(token);
      if (result.success) {
        setIsVerified(true);
        setIsRegistrationComplete(true);
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
          text2: result.error || 'Invalid or expired token.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message.includes('timed out')
          ? 'Request timed out. Please check your connection.'
          : `Verification error: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!viewModel) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        <Text style={{ marginTop: 10, color: 'red', textAlign: 'center' }}>
          Failed to initialize verification. Please restart the app.
        </Text>
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
  },
});

export default EmailVerification;
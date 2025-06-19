import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { StyledButton } from '../../components';
import StyledText from '../../components/Texts/StyledText';
import { AuthContext } from '../../utils/AuthContext';
import { useTranslation } from 'react-i18next';
import { colors } from '../../config/theme';

const ErrorScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { authState, setIsLoading, setAuthError, initialize } = useContext(AuthContext);
  const error = route?.params?.error || t('error.default');

  const handleReload = async () => {
    console.log('ErrorScreen: handleReload called', { authState, error });
    setIsLoading(true);
    try {
      // Re-initialize AuthViewModel
      await initialize(); // Assumes initialize is exposed in AuthContext
      console.log('ErrorScreen: Auth initialized, new state:', authState);

      // Clear authError
      setAuthError(null);

      // Determine initial route
      let initialRoute = 'Onboarding';
      if (authState.isZaoAppOnboarded === false) {
        initialRoute = 'Onboarding';
      } else if (authState.isLoggedIn) {
        initialRoute = 'MainTabs';
      } else {
        initialRoute = 'Auth';
      }
      console.log('ErrorScreen: Resetting to route:', initialRoute);

      // Reset navigation
      navigation.reset({
        index: 0,
        routes: [{ name: initialRoute }],
      });
    } catch (err) {
      console.error('ErrorScreen: Reload failed:', err);
      navigation.setParams({ error: t('error.reloadFailed', { message: err.message }) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>

<View style={styles.vectorContainer}>
        <Image 
          source={require('../../assets/Vector1.png')} 
          style={styles.vector1}
        />
        <Image 
          source={require('../../assets/Vector.png')} 
          style={styles.vector2}
        />
      </View>
      <StyledText style={styles.title}>{t('error.title')}</StyledText>
      <StyledText style={styles.message}>{error}</StyledText>
      <StyledButton
        title={t('error.tryAgain')}
        onPress={handleReload}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.grey[600],
    marginBottom: 16,
  },
  message: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.grey[500],
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 32,
    backgroundColor: colors.primary[600],
  },
});

export default ErrorScreen;
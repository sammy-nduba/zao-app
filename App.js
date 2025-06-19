import global from './global';
import React, { useState, useEffect, useCallback } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import OnboardingStack from './components/navigators/OnboardingStacks';
import AuthStack from './components/navigators/AuthStack';
import { BottomNavStack } from './components';
import { ErrorScreen } from './screens';
import { AuthContext } from './utils/AuthContext';
import Toast from 'react-native-toast-message';
import ToastConfig from './utils/ToastConfig';
import container from './infrastructure/di/Container';
import { AuthViewModel } from './viewModel/AuthViewModel';
import { I18nextProvider } from 'react-i18next';
import i18n from './infrastructure/i18n/i18n';
import UpdateService from './infrastructure/services/UpdateService';
import { useTranslation } from 'react-i18next';
import { Home } from './screens';

const Stack = createStackNavigator();

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <ErrorScreen error="An unexpected error occurred" />;
  }

  try {
    return children;
  } catch (error) {
    setHasError(true);
    return null;
  }
};

const showUpdateAlert = (updateInfo, t) => {
  const message = updateInfo.isUpdateMandatory
    ? t('update.mandatory_message', { version: updateInfo.latestVersion })
    : t('update.message', { version: updateInfo.latestVersion });

  Alert.alert(
    t('update.title'),
    `${message}\n\n${t('update.release_notes')}: ${updateInfo.releaseNotes}`,
    [
      !updateInfo.isUpdateMandatory && {
        text: t('update.later'),
        style: 'cancel',
      },
      {
        text: t('update.now'),
        onPress: () => {
          Linking.openURL(
            Platform.OS === 'ios' ? updateInfo.updateUrl.ios : updateUrl.android
          );
          if (updateInfo.isUpdateMandatory) {
            Alert.alert(t('update.required'), t('update.required_message'));
          }
        },
      },
    ].filter(Boolean),
    { cancelable: !updateInfo.isUpdateMandatory }
  );
};

export default function App() {
  const { t } = useTranslation();
  const navigationRef = useNavigationContainerRef();
  const [appReady, setAppReady] = useState(false);
  const [i18nReady, setI18nReady] = useState(false);
  const [viewModel] = useState(() => new AuthViewModel(container.get('storageService')));
  const [authState, setAuthState] = useState(viewModel.getState());

  const prepareApp = useCallback(async () => {
    if (appReady) return; // Prevent re-running if already initialized
    console.log('App: prepareApp started');
    try {
      await Promise.all([viewModel.initialize(), i18n.init()]);
      setAuthState({ ...viewModel.getState() }); // Deep copy to avoid reference issues
      setI18nReady(true);

      const updateInfo = await UpdateService.checkForUpdate();
      if (updateInfo.isUpdateAvailable) {
        showUpdateAlert(updateInfo, t);
      }

      if (viewModel.getState().authError) {
        Toast.show({
          type: 'error',
          text1: t('error.initialization'),
          text2: viewModel.getState().authError,
        });
      }
    } catch (error) {
      console.error('App: Initialization failed:', error);
      viewModel.setAuthError(error.message);
      setAuthState({ ...viewModel.getState() });
    } finally {
      setAppReady(true);
      await SplashScreen.hideAsync();
      console.log('App: prepareApp completed');
    }
  }, [viewModel, t]); // Removed appReady from dependencies

  useEffect(() => {
    prepareApp();
  }, []); // Empty dependency array to run once

  const contextValue = {
    ...authState,
    setIsZaoAppOnboarded: (value) => {
      viewModel.setIsZaoAppOnboarded(value);
      setAuthState({ ...viewModel.getState() });
    },
    setIsRegistered: (value) => {
      viewModel.setIsRegistered(value);
      setAuthState({ ...viewModel.getState() });
    },
    setIsLoggedIn: (value) => {
      viewModel.setIsLoggedIn(value);
      setAuthState({ ...viewModel.getState() });
    },
    setUser: (userData) => {
      viewModel.setUser(userData);
      setAuthState({ ...viewModel.getState() });
    },
    setIsLoading: (value) => {
      viewModel.setIsLoading(value);
      setAuthState({ ...viewModel.getState() });
    },
    setAuthError: (error) => {
      viewModel.setAuthError(error);
      setAuthState({ ...viewModel.getState() });
    },
    initialize: async () => {
      await viewModel.initialize();
      setAuthState({ ...viewModel.getState() });
    },
  };

  if (!appReady || !i18nReady || authState.isZaoAppOnboarded === null) {
    console.log('App: Waiting for initialization', { appReady, i18nReady, authState });
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthContext.Provider value={contextValue}>
          <ErrorBoundary>
            <NavigationContainer
              ref={navigationRef}
              onStateChange={() => {
                console.log('Navigation state:', navigationRef.current?.getCurrentRoute());
              }}
            >
              <Stack.Navigator
                initialRouteName={
                  authState.authError && !authState.isLoading
                    ? 'Error'
                    : authState.isZaoAppOnboarded === false
                    ? 'Onboarding'
                    : authState.isLoggedIn
                    ? 'MainTabs'
                    : 'Auth'
                    
                }
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen name="Error" component={ErrorScreen} />
                <Stack.Screen name="Onboarding" component={OnboardingStack} />
                <Stack.Screen name="Auth" component={AuthStack} />
                <Stack.Screen name="MainTabs" component={BottomNavStack} />
                <Stack.Screen name ="Home" component={Home} />
              </Stack.Navigator>
              <StatusBar style="auto" />
            </NavigationContainer>
            <Toast config={ToastConfig} />
          </ErrorBoundary>
        </AuthContext.Provider>
      </GestureHandlerRootView>
    </I18nextProvider>
  );
}
import React, { useState, useEffect, useCallback } from 'react';
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

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const [appReady, setAppReady] = useState(false);
  const [i18nReady, setI18nReady] = useState(false);
  const [viewModel] = useState(() => new AuthViewModel(container.get('storageService')));
  const [authState, setAuthState] = useState(viewModel.getState());

  const prepareApp = useCallback(async () => {
    try {
      await Promise.all([
        viewModel.initialize(),
        i18n.init(),
      ]);
      setAuthState(viewModel.getState());
      setI18nReady(true);
      if (viewModel.getState().authError) {
        Toast.show({
          type: 'error',
          text1: 'Initialization Error',
          text2: viewModel.getState().authError,
        });
      }
    } catch (error) {
      viewModel.setAuthError(error.message);
      setAuthState(viewModel.getState());
    } finally {
      setAppReady(true);
      await SplashScreen.hideAsync();
    }
  }, [viewModel]);

  useEffect(() => {
    prepareApp();
  }, [prepareApp]);

  const contextValue = {
    ...authState,
    setIsZaoAppOnboarded: (value) => {
      viewModel.setIsZaoAppOnboarded(value);
      setAuthState(viewModel.getState());
    },
    setIsRegistered: (value) => {
      viewModel.setIsRegistered(value);
      setAuthState(viewModel.getState());
    },
    setIsLoggedIn: (value) => {
      viewModel.setIsLoggedIn(value);
      setAuthState(viewModel.getState());
    },
    setUser: (userData) => {
      viewModel.setUser(userData);
      setAuthState(viewModel.getState());
    },
    setIsLoading: (value) => {
      viewModel.setIsLoading(value);
      setAuthState(viewModel.getState());
    },
    setAuthError: (error) => {
      viewModel.setAuthError(error);
      setAuthState(viewModel.getState());
    },
  };

  if (!appReady || !i18nReady || authState.isZaoAppOnboarded === null) {
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
                  authState.authError
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
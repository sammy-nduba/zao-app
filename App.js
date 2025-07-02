import React, { useState, useEffect, useCallback, } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
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
import { SyncService } from './utils/SyncService';
import   ErrorBoundary  from './utils/ErrorBoundary';
import { Linking } from 'react-native';


console.log('OnboardingStack:', OnboardingStack);
console.log('AuthStack:', AuthStack);
console.log('BottomNavStack:', BottomNavStack);
console.log('ErrorScreen:', ErrorScreen);
console.log("ErrorBoundary", ErrorBoundary)




const Stack = createStackNavigator();


function App() {
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
    // Start background sync for offline data when user is available
    const unsubscribe = authState.user?.id ? SyncService.startSync(authState.user.id) : () => {};
    return () => unsubscribe();
  }, [prepareApp, authState.user?.id]);

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



  const linking = {
    prefixes: ['zao://', 'https://zao-app.com'],
    config: {
      screens: {
        Auth: {
          path: 'auth',
          screens: {
            EmailVerification: {
              path: 'verify-email/:token',
              parse: {
                token: (token) => `${token}`,
              },
            },
          },
        },
      },
    },
  };

  if (!appReady || !i18nReady || authState.isZaoAppOnboarded === null) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }} />
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthContext.Provider value={contextValue}>
          <ErrorBoundary>
            <NavigationContainer
              ref={navigationRef}
              linking={linking}
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
            </NavigationContainer>
          </ErrorBoundary>
          <Toast config={ToastConfig} />
        </AuthContext.Provider>
      </GestureHandlerRootView>
    </I18nextProvider>
  );
}

// const codePushOptions = {
//   checkFrequency: 0, // ON_APP_START
//   installMode: 1, // ON_NEXT_RESTART
// };

// // Log CodePush for debugging
// console.log('codePush:', codePush);
export default App;
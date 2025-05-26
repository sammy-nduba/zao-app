import React, { useState, useEffect }  from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import OnboardingStack from './components/navigators/OnboardingStacks';
import AuthStack from './components/navigators/AuthStack';
import Home from './screens/Home';
import { onBoardingContext } from './utils/context';
import { getData } from './utils/storage';
import Toast from 'react-native-toast-message';
import ToastConfig from './utils/ToastConfig';
import { ErrorScreen, FarmDetails } from './screens'
import AsyncStorage from '@react-native-async-storage/async-storage';


console.log( "APP:", ToastConfig)


export default function App() {
  const [appReady, setAppReady] = useState(false);

  // Consolidated auth state
  const [authState, setAuthState] = useState({
    isZaoAppOnboarded: null,
    isRegistered: false,
    isLoggedIn: false,
    user: null,
    isLoading: false,
    authError: null,
  });

  // Prepare app as splash screen shows
  // In App.js, inside prepareApp
const prepareApp = async () => {
  try {
    const [onboardingStatus, registrationStatus, loginStatus, newFarmerData, experiencedFarmerData] = await Promise.all([
      getData('@ZaoAPP:Onboarding'),
      getData('@ZaoAPP:Registration'),
      getData('@ZaoAPP:Login'),
      AsyncStorage.getItem('@ZaoAPP:NewFarmerForm'),
      AsyncStorage.getItem('@ZaoAPP:ExperiencedFarmerForm'),
    ]);

    console.log(
      'App initialization - Onboarding:', onboardingStatus,
      'Registration:', registrationStatus,
      'Login:', loginStatus,
      'NewFarmer:', newFarmerData,
      'ExperiencedFarmer:', experiencedFarmerData
    );

    setAuthState((prev) => ({
      ...prev,
      isZaoAppOnboarded: onboardingStatus === true,
      isRegistered: registrationStatus === true,
      isLoggedIn: loginStatus === true,
      user: {
        ...prev.user,
        farmerData: newFarmerData ? JSON.parse(newFarmerData) : experiencedFarmerData ? JSON.parse(experiencedFarmerData) : null,
      },
    }));
  } catch (error) {
    console.warn('App initialization error:', error);
    setAuthState((prev) => ({
      ...prev,
      authError: error.message,
    }));
  } finally {
    setAppReady(true);
    await SplashScreen.hideAsync();
  }
};

  useEffect(() => {
    prepareApp();
  }, []);

  // Context value with all state and setters
  const contextValue = {
    ...authState,
    setIsZaoAppOnboarded: (value) =>
      setAuthState((prev) => ({ ...prev, isZaoAppOnboarded: value })),
    setIsRegistered: (value) =>
      setAuthState((prev) => ({ ...prev, isRegistered: value })),
    setIsLoggedIn: (value) =>
      setAuthState((prev) => ({ ...prev, isLoggedIn: value })),
    setUser: (userData) =>
      setAuthState((prev) => ({ ...prev, user: userData })),
    setIsLoading: (value) =>
      setAuthState((prev) => ({ ...prev, isLoading: value })),
    setAuthError: (error) =>
      setAuthState((prev) => ({ ...prev, authError: error })),
  };

  // Determine initial route based on auth state
  const getInitialRoute = () => {
    // Still loading or error state
    if (authState.authError) {
      return <ErrorScreen error={authState.authError} />;
    }

    // First-time user flow
    if (authState.isZaoAppOnboarded === false) {
      return <OnboardingStack />;
    }

    // Registered or unregistered user who needs to authenticate
    if (authState.isZaoAppOnboarded && !authState.isLoggedIn) {
      return <AuthStack />;
    }

    if (authState.isZaoAppOnboarded && authState.isLoggedIn) {
      return <AuthStack/>;
    }


    // Logged-in user - go to home
    return <Home />;
  };

  // Prevent rendering until initialization completes
  if (!appReady || authState.isZaoAppOnboarded === null) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <onBoardingContext.Provider value={contextValue}>
        <NavigationContainer>
          {getInitialRoute()}
          <StatusBar style="auto" />
        </NavigationContainer>
      </onBoardingContext.Provider>
      <Toast config={ToastConfig} />
    </GestureHandlerRootView>
  );
}
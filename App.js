// import { Home } from "./app";
import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AsyncStorage } from '@react-native-async-storage/async-storage'; 
import { Home } from "./screens"
import { Login } from "./screens"
import { useEffect, useState } from "react";
import OnboardingStack from "./components/navigators/OnboardingStacks";
import {onBoardingContext} from './utils/context';
import { getData } from './utils/storage';


console.log(" App file logs", Home);

SplashScreen.preventAutoHideAsync();


export default function App() {

    const [isZaoAppOnboarded, setIsZaoAppOnboarded] = useState(false)
    const [appReady, setAppReady] = useState(false);


    // prepare app as splash screen goes 
    const prepareApp = async () => {
        try {

          // AsyncStorage.removeItem('@ZaoAPP:Onboarding')

          // Check if onboarding is completed
          const onboardingStatus = await getData('@ZaoAPP:Onboarding');
          if (onboardingStatus === 'true') {
            setIsZaoAppOnboarded(true);
          }
          // app initialization 
          console.log('prepareApp: Initialization complete');
        } catch (error) {
          console.warn('prepareApp error:', error);
        } finally {
          setAppReady(true);
          await SplashScreen.hideAsync();
        }
      };

    // Use effect to prepare the app
    useEffect(() => {
        prepareApp()
    }, []);

    if (!appReady) {
        return null; // Prevent rendering until splash screen hides
      }


      return (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <onBoardingContext.Provider value={{ isZaoAppOnboarded, setIsZaoAppOnboarded }}>
            <NavigationContainer>
              {isZaoAppOnboarded ? <Login /> : <OnboardingStack />}
              <StatusBar style="auto" />
            </NavigationContainer>
          </onBoardingContext.Provider>
        </GestureHandlerRootView>
      );
}

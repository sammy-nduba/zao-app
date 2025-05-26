import { createContext } from "react";

export const onBoardingContext = createContext({
  // Onboarding state
  isZaoAppOnboarded: false,
  setIsZaoAppOnboarded: () => {},
  
  // Authentication states
  isRegistered: false,
  setIsRegistered: () => {},
  
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  
  // User data
  user: null,
  setUser: () => {},
  
  // Loading states
  isLoading: false,
  setIsLoading: () => {},
  
  // Error handling
  authError: null,
  setAuthError: () => {},
});
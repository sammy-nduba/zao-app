// src/utils/AuthContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import container from '../infrastructure/di/Container';
import { AuthViewModel } from '../viewModel/AuthViewModel';

interface AuthState {
  isZaoAppOnboarded: boolean | null;
  isRegistered: boolean;
  isLoggedIn: boolean;
  user: any; // Replace with user type
  isLoading: boolean;
  authError: string | null;
}

interface AuthContextType extends AuthState {
  setIsZaoAppOnboarded: (value: boolean) => void;
  setIsRegistered: (value: boolean) => void;
  setIsLoggedIn: (value: boolean) => void;
  setUser: (userData: any) => void; // Replace with user type
  // setIsLoading: (value: boolean) => void;
  setAuthError: (error: string | null) => void;
  initialize: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [viewModel] = useState(() => new AuthViewModel(container.get('storageService')));
  const [authState, setAuthState] = useState<AuthState>(viewModel.getState());

  const contextValue: AuthContextType = {
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
    // setIsLoading: (value) => {
    //   viewModel.setIsLoading(value);
    //   setAuthState(viewModel.getState());
    // },
    setAuthError: (error) => {
      viewModel.setAuthError(error);
      setAuthState(viewModel.getState());
    },
    initialize: async () => {
      await viewModel.initialize();
      setAuthState(viewModel.getState());
    },
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
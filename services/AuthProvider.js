
import React, { createContext, useState, useContext } from 'react';
import { AuthService } from '../services/AuthService';

console.log("AuthContext", AuthContext)

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const register = async (firstName, lastName, email, password) => {
    setLoading(true);
    try {
      const userData = await AuthService.register(firstName, lastName, email, password);
      setUser(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const login = async (email, password) => {
    setLoading(true);
    try {
      const userData = await AuthService.login(email, password);
      setUser(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }

    // const newFarmer = async (email, password) => {
    //   setLoading(true);
    //   try {
    //     const userData = await AuthService.login(email, password);
    //     setUser(userData);
    //   } catch (err) {
    //     setError(err.message);
    //   } finally {
    //     setLoading(false);
    //   }


    // const experiencedFarmer = async (email, password) => {
    //   setLoading(true);
    //   try {
    //     const userData = await AuthService.login(email, password);
    //     setUser(userData);
    //   } catch (err) {
    //     setError(err.message);
    //   } finally {
    //     setLoading(false);
    //   }
  };

  // logout(), etc.

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
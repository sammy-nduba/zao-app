// src/services/authService.js

import { storeData } from '../utils/storage';





export const AuthService = {
  async login(email, password) {


    // TODO: Replace with actual API call
    const response = await fetch('https://api', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    await storeData('@ZaoAPP:Token', data.token);
    return data;
  },

  async register(userData) {
    // TODO: Replace with actual API call
    const response = await fetch('https://api', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return await response.json();
  },

  async socialLogin(provider, token) {
    // Handle Google/Facebook/Apple login
  },
};
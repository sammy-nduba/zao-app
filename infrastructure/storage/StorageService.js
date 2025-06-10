import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export class StorageService {
  constructor() {
    this.namespace = '@ZaoAPP';
    this.maxRetries = 3;
    console.log('StorageService initialized, AsyncStorage:', AsyncStorage); 
    if (!AsyncStorage) {
      console.error('AsyncStorage is undefined in StorageService constructor');
    }
  }

  async storeSecureItem(key, value) {
    try {
      console.log(`Storing secure item ${this.namespace}:${key}`); 
      await SecureStore.setItemAsync(`${this.namespace}:${key}`, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to store secure item ${this.namespace}:${key}:`, error); 
      throw error;
    }
  }

  async storeItem(key, value, retries = this.maxRetries) {
    const namespacedKey = `${this.namespace}:${key}`;
    try {
      console.log(`Storing ${namespacedKey}:`, value, 'AsyncStorage:', AsyncStorage); 
      if (!AsyncStorage) {
        throw new Error('AsyncStorage is undefined in storeItem');
      }
      const stringValue = JSON.stringify(value);
      await AsyncStorage.setItem(namespacedKey, stringValue);
    } catch (error) {
      console.error(`Failed to store ${namespacedKey}:`, error); // Debug
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return this.storeItem(key, value, retries - 1);
      }
      throw new Error(`Storage error: ${error.message}`);
    }
  }

  async storeItemDebounced(key, value) {
    clearTimeout(this.debounceTimer);
    return new Promise((resolve) => {
      this.debounceTimer = setTimeout(async () => {
        await this.storeItem(key, value);
        resolve();
      }, 300);
    });
  }

  async storeRegistrationStatus(value) {
    try {
      console.log('Storing registration status:', value); // Debug
      await this.storeItem('Registration', value);
    } catch (error) {
      console.error('Failed to store registration status:', error); // Debug
      throw error;
    }
  }

  async getItem(key, retries = this.maxRetries) {
    const namespacedKey = `${this.namespace}:${key}`;
    try {
      console.log(`Getting ${namespacedKey}`); // Debug
      const stringValue = await AsyncStorage.getItem(namespacedKey);
      return stringValue != null ? JSON.parse(stringValue) : null;
    } catch (error) {
      console.error(`Failed to get ${namespacedKey}:`, error); // Debug
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return this.getItem(key, retries - 1);
      }
      throw new Error(`Storage error: ${error.message}`);
    }
  }

  async removeItem(key) {
    const namespacedKey = `${this.namespace}:${key}`;
    try {
      console.log(`Removing ${namespacedKey}`); // Debug
      await AsyncStorage.removeItem(namespacedKey);
    } catch (error) {
      console.error(`Failed to remove ${namespacedKey}:`, error); // Debug
      throw new Error(`Storage error: ${error.message}`);
    }
  }

  async clear() {
    try {
      console.log('Clearing storage'); // Debug
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter((key) => key.startsWith(this.namespace));
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      console.error(`Failed to clear storage:`, error); // Debug
      throw new Error(`Storage error: ${error.message}`);
    }
  }
}
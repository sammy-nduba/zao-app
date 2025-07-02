import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export class StorageService {
  constructor() {
    this.namespace = '@ZaoAPP';
    this.maxRetries = 3;
    this.isReady = false;
    this.debounceTimer = null;
    console.log('StorageService: Constructor called, AsyncStorage:', !!AsyncStorage, 'SecureStore:', !!SecureStore);
    if (!AsyncStorage) {
      console.error('StorageService: AsyncStorage is undefined');
    }
    if (!SecureStore) {
      console.error('StorageService: SecureStore is undefined');
    }
  }

  async initialize() {
    if (this.isReady) return;
    try {
      // Test AsyncStorage availability
      await AsyncStorage.getItem(`${this.namespace}:test`);
      // Test SecureStore availability
      await SecureStore.isAvailableAsync();
      this.isReady = true;
      console.log('StorageService: Initialized successfully');
    } catch (error) {
      console.error('StorageService: Initialization failed:', error);
      throw new Error('Failed to initialize storage service. Please check AsyncStorage and SecureStore.');
    }
  }

  async storeSecureItem(key, value) {
    if (!this.isReady) await this.initialize();
    const namespacedKey = `${this.namespace}:${key}`;
    try {
      console.log(`StorageService: Storing secure item ${namespacedKey}`);
      await SecureStore.setItemAsync(namespacedKey, JSON.stringify(value));
    } catch (error) {
      console.error(`StorageService: Failed to store secure item ${namespacedKey}:`, error);
      throw new Error(`Secure storage error: ${error.message}`);
    }
  }

  async storeItem(key, value, retries = this.maxRetries) {
    if (!this.isReady) await this.initialize();
    const namespacedKey = `${this.namespace}:${key}`;
    try {
      console.log(`StorageService: Storing ${namespacedKey}:`, value);
      if (!AsyncStorage) {
        throw new Error('AsyncStorage is undefined');
      }
      const stringValue = JSON.stringify(value);
      await AsyncStorage.setItem(namespacedKey, stringValue);
    } catch (error) {
      console.error(`StorageService: Failed to store ${namespacedKey}:`, error);
      if (retries > 0) {
        console.log(`StorageService: Retrying store ${namespacedKey}, ${retries} attempts left`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        return this.storeItem(key, value, retries - 1);
      }
      throw new Error(`Storage error: ${error.message}`);
    }
  }

  async storeItemDebounced(key, value) {
    if (!this.isReady) await this.initialize();
    clearTimeout(this.debounceTimer);
    return new Promise((resolve) => {
      this.debounceTimer = setTimeout(async () => {
        try {
          await this.storeItem(key, value);
          resolve();
        } catch (error) {
          console.error(`StorageService: Debounced store failed for ${key}:`, error);
          throw error;
        }
      }, 300);
    });
  }

  async storeRegistrationStatus(value) {
    if (!this.isReady) await this.initialize();
    const key = 'Registration';
    try {
      console.log('StorageService: Storing registration status:', value);
      await this.storeItem(key, value);
    } catch (error) {
      console.error('StorageService: Failed to store registration status:', error);
      throw new Error(`Failed to store registration status: ${error.message}`);
    }
  }

  async getItem(key, retries = this.maxRetries) {
    if (!this.isReady) await this.initialize();
    const namespacedKey = `${this.namespace}:${key}`;
    try {
      console.log(`StorageService: Getting ${namespacedKey}`);
      const stringValue = await AsyncStorage.getItem(namespacedKey);
      return stringValue != null ? JSON.parse(stringValue) : null;
    } catch (error) {
      console.error(`StorageService: Failed to get ${namespacedKey}:`, error);
      if (retries > 0) {
        console.log(`StorageService: Retrying get ${namespacedKey}, ${retries} attempts left`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        return this.getItem(key, retries - 1);
      }
      throw new Error(`Storage error: ${error.message}`);
    }
  }

  async getSecureItem(key) {
    if (!this.isReady) await this.initialize();
    const namespacedKey = `${this.namespace}:${key}`;
    try {
      console.log(`StorageService: Getting secure item ${namespacedKey}`);
      const stringValue = await SecureStore.getItemAsync(namespacedKey);
      return stringValue != null ? JSON.parse(stringValue) : null;
    } catch (error) {
      console.error(`StorageService: Failed to get secure item ${namespacedKey}:`, error);
      throw new Error(`Secure storage error: ${error.message}`);
    }
  }

  async removeItem(key) {
    if (!this.isReady) await this.initialize();
    const namespacedKey = `${this.namespace}:${key}`;
    try {
      console.log(`StorageService: Removing ${namespacedKey}`);
      await AsyncStorage.removeItem(namespacedKey);
    } catch (error) {
      console.error(`StorageService: Failed to remove ${namespacedKey}:`, error);
      throw new Error(`Storage error: ${error.message}`);
    }
  }

  async clear() {
    if (!this.isReady) await this.initialize();
    try {
      console.log('StorageService: Clearing storage');
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter((key) => key.startsWith(this.namespace));
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      console.error(`StorageService: Failed to clear storage:`, error);
      throw new Error(`Storage error: ${error.message}`);
    }
  }
}
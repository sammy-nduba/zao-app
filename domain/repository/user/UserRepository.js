
import { User } from "../../entities/User";

export class UserRepository {
    async register(user) {
      // TODO: Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('User registered:', user);
          resolve(user);
        }, 1000);
      });
    }
  }
  
  export class SocialAuthService {
    async register(provider) {
      // TODO: Simulate social auth
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(new User(`${provider}User`, 'LastName', `${provider.toLowerCase()}@example.com`, '+254700000000', ''));
        }, 500);
      });
    }
  }
  
  export class StorageService {
    constructor(storage) {
      this.storage = storage;
    }
  
    async storeRegistrationStatus(isRegistered) {
      return this.storage.storeData('@ZaoAPP:Registration', isRegistered);
    }
  }
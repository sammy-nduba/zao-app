import AsyncStorage from '@react-native-async-storage/async-storage';
import { FarmerRepository } from '../../../domain/repository/farmer/FarmerRepository';

export class AsyncStorageFarmerRepository extends FarmerRepository {
  async saveFarmer(farmer) {
    const key = farmer.farmerType === 'new' 
      ? '@ZaoAPP:NewFarmerForm' 
      : '@ZaoAPP:ExperiencedFarmerForm';
    try {
      await AsyncStorage.setItem(key, JSON.stringify(farmer));
      return farmer;
    } catch (error) {
      throw new Error('Failed to save farmer data');
    }
  }

  async getFarmer(farmerType) {
    const key = farmerType === 'new' 
      ? '@ZaoAPP:NewFarmerForm' 
      : '@ZaoAPP:ExperiencedFarmerForm';
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      throw new Error('Failed to retrieve farmer data');
    }
  }
}
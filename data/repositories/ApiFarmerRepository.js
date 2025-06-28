import { FarmerRepository } from '../../domain/repository/farmer/FarmerRepository';
import { Farmer } from '../../domain/entities/Farmer';

export class ApiFarmerRepository extends FarmerRepository {
  constructor(apiClient) {
    super();
    this.apiClient = apiClient;
  }

  async saveFarmer(farmer, userId) {
    try {
      console.log('ApiFarmerRepository.saveFarmer called with:', { farmer, userId });
      const response = await this.apiClient.post(`/api/farmers/${userId}`, farmer);
      console.log('ApiFarmerRepository.saveFarmer response:', response.data);
      return new Farmer(response.data);
    } catch (error) {
      console.error('ApiFarmerRepository.saveFarmer error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || `Failed to save farmer data: ${error.message}`);
    }
  }

  async getFarmer(farmerType) {
    try {
      console.log('ApiFarmerRepository.getFarmer called with:', farmerType);
      const response = await this.apiClient.get(`/api/farmers/${farmerType}`);
      console.log('ApiFarmerRepository.getFarmer response:', response.data);
      return response.data ? new Farmer(response.data) : null;
    } catch (error) {
      console.error('ApiFarmerRepository.getFarmer error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || `Failed to retrieve farmer data: ${error.message}`);
    }
  }
}
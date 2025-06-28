
export class SaveFarmerData {
  constructor(farmerRepository) {
    this.farmerRepository = farmerRepository;
  }

  async execute(farmerData, userId) {
    try {
      console.log('SaveFarmerData.execute called with:', { farmerData, userId });
      const farmer = await this.farmerRepository.saveFarmer(farmerData, userId);
      console.log('SaveFarmerData.execute success:', farmer);
      return farmer;
    } catch (error) {
      console.error('SaveFarmerData.execute error:', error.message);
      throw new Error(error.message);
    }
  }
}
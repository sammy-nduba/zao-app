

export class SaveFarmerData {
    constructor(farmerRepository) {
      this.farmerRepository = farmerRepository;
    }
  
    async execute(farmer) {
      return await this.farmerRepository.saveFarmer(farmer);
    }
  }
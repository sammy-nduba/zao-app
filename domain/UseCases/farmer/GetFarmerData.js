

export class GetFarmerData {
    constructor(farmerRepository) {
      this.farmerRepository = farmerRepository;
    }
  
    async execute(farmerType) {
      return await this.farmerRepository.getFarmer(farmerType);
    }
  }
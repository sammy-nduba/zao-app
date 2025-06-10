
  // DashboardUseCase
  export class GetDashboardDataUseCase {
    constructor(dashboardRepository) {
      this.dashboardRepository = dashboardRepository;
    }
    
    async execute() {
      const [cropData, alerts] = await Promise.all([
        this.dashboardRepository.getCropData(),
        this.dashboardRepository.getAlerts()
      ]);
      return { cropData, alerts };
    }
  }
  
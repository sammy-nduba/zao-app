



// Weather Usecase
export class GetWeatherUseCase {
    constructor(weatherRepository) {
      this.weatherRepository = weatherRepository;
    }
    
    async execute() {
      const [current, forecast] = await Promise.all([
        this.weatherRepository.getCurrentWeather(),
        this.weatherRepository.getWeatherForecast()
      ]);
      return { current, forecast };
    }
  }

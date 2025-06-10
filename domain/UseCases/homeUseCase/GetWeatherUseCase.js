export class GetWeatherUseCase {
  constructor(weatherRepository) {
    this.weatherRepository = weatherRepository;
  }

  async execute() {
    console.log('GetWeatherUseCase.execute called'); 
    try {
      const results = await Promise.allSettled([
        this.weatherRepository.getCurrentWeather(),
        this.weatherRepository.getWeatherForecast(),
      ]);
      console.log('GetWeatherUseCase results:', results);

      const [currentResult, forecastResult] = results;
      const current = currentResult.status === 'fulfilled' ? currentResult.value : null;
      const forecast = forecastResult.status === 'fulfilled' ? forecastResult.value : [];

      console.log('GetWeatherUseCase result:', { current, forecast });
      return { current, forecast };
    } catch (error) {
      console.error('GetWeatherUseCase error:', error); 
      return { current: null, forecast: [] };
    }
  }
}
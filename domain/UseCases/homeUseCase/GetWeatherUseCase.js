export class GetWeatherUseCase {
  constructor(weatherRepository) {
    this.weatherRepository = weatherRepository;
  }

  async execute(location = 'Nairobi') {
    console.log('GetWeatherUseCase.execute called', { location });
    const results = await Promise.allSettled([
      this.weatherRepository.getCurrentWeather(location),
      this.weatherRepository.getWeatherForecast(location),
    ]);
    console.log('GetWeatherUseCase results:', results);

    const [currentResult, forecastResult] = results;
    const current = currentResult.status === 'fulfilled' ? currentResult.value : null;
    const forecast = forecastResult.status === 'fulfilled' ? forecastResult.value : [];

    if (currentResult.status === 'rejected' || forecastResult.status === 'rejected') {
      const error = currentResult.status === 'rejected' 
        ? currentResult.reason 
        : forecastResult.reason;
      console.error('GetWeatherUseCase error:', {
        message: error.message,
        stack: error.stack,
      });
    }

    console.log('GetWeatherUseCase result:', { current, forecast });
    return { 
      current, 
      forecast, 
      error: currentResult.status === 'rejected' || forecastResult.status === 'rejected' 
        ? error.message 
        : null 
    };
  }
}
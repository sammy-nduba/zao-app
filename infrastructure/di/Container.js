import { AsyncStorageFarmerRepository } from '../../domain/repository/farmer/AsyncStorageFarmerRepository';
import { ApiFarmerRepository } from '../../data/repositories/ApiFarmerRepository';
import { SaveFarmerData } from '../../domain/UseCases/farmer/SaveFarmerData';
import { ValidateFarmerData } from '../../domain/UseCases/farmer/ValidateFarmerData';
import { GetFarmerData } from '../../domain/UseCases/farmer/GetFarmerData';
import { ApiUserRepository } from '../../data/repositories/ApiUserRepository';
import { StorageService } from '../../infrastructure/storage/StorageService';
import { SocialAuthService } from '../../data/repositories/SocialAuthService';
import { RegisterUserUseCase } from '../../domain/UseCases/user/RegisterUserUseCase';
import { SocialRegisterUseCase } from '../../domain/UseCases/user/RegisterUserUseCase';
import { ValidationService } from '../../services/ValidationService';
import { ApiWeatherRepository } from '../../data/repositories/ApiWeatherRepository';
import { ApiNewsRepository } from '../../data/repositories/ApiNewsRepository';
import { AsyncStorageNewsRepository } from '../../data/repositories/AsyncStorageNewsRepository';
import { AsyncStorageWeatherRepository } from '../../data/repositories/AsyncStorageWeatherRepository';
import { LocalDashboardRepository } from '../../domain/repository/dataLayer/LocalDashboardRepository';
import { GetWeatherUseCase } from '../../domain/UseCases/homeUseCase/GetWeatherUseCase';
import { GetDashboardDataUseCase } from '../../domain/UseCases/homeUseCase/GetDashboardDataUseCase';
import { GetNewsUseCase } from '../../domain/UseCases/homeUseCase/GetNewsUseCase';
import { LoginUserUseCase } from '../../domain/UseCases/user/LoginUseCase';
import { SocialLoginUseCase } from '../../domain/UseCases/user/LoginUseCase';
import { ApiClient } from '../api/ApiClient';
import { LanguageRepositoryImpl } from '../../domain/repository/language/LanguageRepositoryImpl';
import { GetAvailableLanguagesUseCase } from '../../domain/UseCases/language/GetAvailableLanguagesUseCase';
import { SelectLanguageUseCase } from '../../domain/UseCases/language/SelectLanguageUseCase';
import { GetSelectedLanguageUseCase } from '../../domain/UseCases/language/GetSelectedLanguageUseCase';
import { LanguageSelectionPresenter } from '../../viewModel/LanguageSelectionPresenter';

class Container {
  constructor() {
    this.dependencies = new Map();
    console.log('Container: Initializing');
    try {
      this.register();
      console.log('Container: Initialized successfully');
    } catch (error) {
      console.error('Container: Initialization failed', error);
      throw error;
    }
  }

  register() {
    // Api Clients
    this.dependencies.set('weatherApiClient', new ApiClient('http://api.weatherapi.com/v1'));
    this.dependencies.set('newsApiClient', new ApiClient('https://newsapi.org/v2'));
    this.dependencies.set('appApiClient', new ApiClient('https://zao-backend-api.onrender.com'));


    // Farmer dependencies
    this.dependencies.set('asyncStorageFarmerRepository', new AsyncStorageFarmerRepository());
    this.dependencies.set('apiFarmerRepository', new ApiFarmerRepository(this.get('appApiClient')));
    this.dependencies.set('saveFarmerData', new SaveFarmerData(
      this.get('apiFarmerRepository'),
      this.get('asyncStorageFarmerRepository')
    ));
    this.dependencies.set('validateFarmerData', new ValidateFarmerData());
    this.dependencies.set('getFarmerData', new GetFarmerData(
      this.get('apiFarmerRepository'),
      this.get('asyncStorageFarmerRepository')
    ));

    // User dependencies
    this.dependencies.set('validationService', new ValidationService());
    this.dependencies.set('userRepository', new ApiUserRepository(this.get('appApiClient')));
    this.dependencies.set('socialAuthService', new SocialAuthService(this.get('appApiClient')));
    this.dependencies.set('storageService', new StorageService());
    this.dependencies.set('registerUserUseCase', new RegisterUserUseCase(
      this.get('userRepository'),
      this.get('validationService'),
      this.get('storageService')
    ));
    this.dependencies.set('socialRegisterUseCase', new SocialRegisterUseCase(
      this.get('socialAuthService'),
      this.get('storageService')
    ));
    this.dependencies.set('loginUserUseCase', new LoginUserUseCase(
      this.get('userRepository'),
      this.get('validationService'),
      this.get('storageService')
    ));
    this.dependencies.set('socialLoginUseCase', new SocialLoginUseCase(
      this.get('socialAuthService'),
      this.get('storageService')
    ));

    // Home screen dependencies
    this.dependencies.set('weatherRepository', new ApiWeatherRepository(this.get('weatherApiClient')));
    this.dependencies.set('asyncStorageWeatherRepository', new AsyncStorageWeatherRepository());
    this.dependencies.set('newsRepository', new ApiNewsRepository(this.get('newsApiClient')));
    this.dependencies.set('asyncStorageNewsRepository', new AsyncStorageNewsRepository());
    this.dependencies.set('dashboardRepository', new LocalDashboardRepository());
    this.dependencies.set('getWeatherUseCase', new GetWeatherUseCase(
      this.get('weatherRepository'),
      this.get('asyncStorageWeatherRepository')
    ));
    this.dependencies.set('getNewsUseCase', new GetNewsUseCase(
      this.get('newsRepository'),
      this.get('asyncStorageNewsRepository')
    ));
    this.dependencies.set('getDashboardDataUseCase', new GetDashboardDataUseCase(
      this.get('dashboardRepository'),
      this.get('asyncStorageFarmerRepository')
    ));

    // Language selection dependencies
    this.dependencies.set('languageRepository', new LanguageRepositoryImpl());
    this.dependencies.set('getAvailableLanguagesUseCase', new GetAvailableLanguagesUseCase(this.get('languageRepository')));
    this.dependencies.set('selectLanguageUseCase', new SelectLanguageUseCase(this.get('languageRepository')));
    this.dependencies.set('getSelectedLanguageUseCase', new GetSelectedLanguageUseCase(this.get('languageRepository')));
    this.dependencies.set('languageSelectionPresenter', new LanguageSelectionPresenter(
      this.get('getAvailableLanguagesUseCase'),
      this.get('selectLanguageUseCase'),
      this.get('getSelectedLanguageUseCase')
    ));
  }

  get(key) {
    if (!this.dependencies.has(key)) {
      throw new Error(`Dependency ${key} not found`);
    }
    return this.dependencies.get(key);
  }
}

const container = new Container();
export default container;
export class HomeViewModel {
  constructor(getWeatherUseCase, getNewsUseCase, getDashboardDataUseCase, initialCategory = 'kenya') {
    this.getWeatherUseCase = getWeatherUseCase;
    this.getNewsUseCase = getNewsUseCase;
    this.getDashboardDataUseCase = getDashboardDataUseCase;
    this.state = {
      weatherData: null,
      newsData: [],
      dashboardData: null,
      loading: true,
      error: null,
      selectedNewsCategory: initialCategory,
    };
    console.log('HomeViewModel initialized with category:', initialCategory);
  }

  async loadData() {
    console.log('HomeViewModel.loadData started');
    this.state = { ...this.state, loading: true, error: null };

    try {
      const results = await Promise.allSettled([
        this.getWeatherUseCase.execute(),
        this.getNewsUseCase.execute(this.state.selectedNewsCategory),
        this.getDashboardDataUseCase.execute(),
      ]);

      const [weatherResult, newsResult, dashboardResult] = results;
      console.log('Fetch results:', { weather: weatherResult, news: newsResult, dashboard: dashboardResult });

      const weatherData = weatherResult.status === 'fulfilled' ? weatherResult.value : null;
      const newsData = newsResult.status === 'fulfilled' ? newsResult.value.news || [] : [];
      const dashboardData = dashboardResult.status === 'fulfilled' ? dashboardResult.value : null;

      const errors = results
        .filter((result) => result.status === 'rejected')
        .map((result) => result.reason?.message || 'Unknown error');
      const newsError = newsResult.status === 'fulfilled' ? newsResult.value.error : null;

      this.state = {
        ...this.state,
        loading: false,
        weatherData,
        newsData,
        dashboardData,
        error: errors.length ? errors.join('; ') : newsError,
      };
    } catch (error) {
      console.error('HomeViewModel.loadData error:', error);
      this.state = {
        ...this.state,
        loading: false,
        error: `Failed to load data: ${error.message}`,
        newsData: [],
      };
    }
    console.log('HomeViewModel.loadData completed, state:', this.state);
  }

  async loadNews() {
    console.log('HomeViewModel.loadNews started for category:', this.state.selectedNewsCategory);
    this.state = { ...this.state, loading: true, error: null };

    try {
      const { news, error } = await this.getNewsUseCase.execute(this.state.selectedNewsCategory);
      console.log('Fetched news:', news);
      this.state = {
        ...this.state,
        loading: false,
        newsData: Array.isArray(news) ? news : [],
        error,
      };
    } catch (error) {
      console.error('HomeViewModel.loadNews error:', error);
      this.state = {
        ...this.state,
        loading: false,
        error: `Failed to fetch news: ${error.message}`,
        newsData: [],
      };
    }
    console.log('HomeViewModel.loadNews completed, state:', this.state);
  }

  async searchNews(query) {
    console.log('HomeViewModel.searchNews started with query:', query);
    this.state = { ...this.state, loading: true, error: null };

    try {
      const { news, error } = await this.getNewsUseCase.execute(query);
      console.log('Searched news:', news);
      this.state = {
        ...this.state,
        loading: false,
        newsData: Array.isArray(news) ? news : [],
        error,
      };
    } catch (error) {
      console.error('HomeViewModel.searchNews error:', error);
      this.state = {
        ...this.state,
        loading: false,
        error: `Failed to search news: ${error.message}`,
        newsData: [],
      };
    }
    console.log('HomeViewModel.searchNews completed, state:', this.state);
  }

  setSelectedNewsCategory(category) {
    console.log('Setting news category:', category);
    this.state = { ...this.state, selectedNewsCategory: category };
    this.loadNews();
  }

  getState() {
    return { ...this.state };
  }
}
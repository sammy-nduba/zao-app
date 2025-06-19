// src/domain/UseCases/homeUseCase/GetNewsUseCase.js
export class GetNewsUseCase {
  constructor(newsRepository) {
    this.newsRepository = newsRepository;
  }

  async execute(category = 'agriculture') {
    console.log('GetNewsUseCase.execute called with category:', category);
    try {
      // Normalize category
      const newsCategory = category === 'all' || !category ? 'agriculture' : category;

      const news = await this.newsRepository.getLatestNews(newsCategory);
      console.log('GetNewsUseCase result:', news);

      // Validate news
      if (!Array.isArray(news)) {
        console.warn('GetNewsUseCase: Invalid news data, expected array, got:', news);
        return { news: [], error: 'Invalid news data' };
      }

      return { news, error: null };
    } catch (error) {
      console.error('GetNewsUseCase error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return { news: [], error: `Failed to fetch news: ${error.message}` };
    }
  }
}
// src/data/repositories/ApiNewsRepository.js
import { NewsRepository } from '../../domain/repository/NewsRepository';
import { NewsArticle } from '../../domain/entities/NewsArticle';

export class ApiNewsRepository extends NewsRepository {
  constructor(apiClient) {
    super();
    this.apiClient = apiClient;
  }

  async getLatestNews(category = 'agriculture') {
    try {
      console.log('ApiNewsRepository.getLatestNews called', { category });
      const query = category === 'agriculture' ? 'agriculture' : `agriculture ${category}`;
      const response = await this.apiClient.get('/everything', {
        params: {
          q: query,
          apiKey: process.env.NEWS_API_KEY || 'b3075ce86ddd47b2866543f66c7bc382', // Use .env
          language: 'en',
          sortBy: 'publishedAt',
        },
      });
      console.log('ApiNewsRepository.getLatestNews response:', response.data);

      // Validate articles
      if (!response.data.articles || !Array.isArray(response.data.articles)) {
        console.warn('ApiNewsRepository: Invalid articles data', response.data);
        return [];
      }

      return response.data.articles.map((article, index) => new NewsArticle(
        index + 1,
        article.title || 'No title',
        article.description || 'No description available',
        article.author || 'Unknown',
        '4 min read', // Placeholder
        Math.floor(Math.random() * 15000), // Simulated likes
        article.urlToImage || 'https://via.placeholder.com/340x174',
        category
      ));
    } catch (error) {
      console.error('ApiNewsRepository.getLatestNews error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(`Failed to fetch news: ${error.message}`);
    }
  }
}
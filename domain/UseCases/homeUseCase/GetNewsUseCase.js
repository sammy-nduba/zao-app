 

  export class GetNewsUseCase {
    constructor(newsRepository) {
      this.newsRepository = newsRepository;
    }
  
    async execute(category) {
      try {
        console.log('GetNewsUseCase.execute called with category:', category); 
        const news = await this.newsRepository.getLatestNews( category === 'all' ? '' : category);
        console.log('GetNewsUseCase result:', news); 
        return news;
      } catch (error) {
        console.error('GetNewsUseCase error:', error); 
        throw new Error(`Failed to fetch news: ${error.message}`);
      }
    }
  }
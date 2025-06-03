 
 
 // NewsUseCase
 export class GetNewsUseCase {
    constructor(newsRepository) {
      this.newsRepository = newsRepository;
    }
    
    async execute(category = 'all') {
      return await this.newsRepository.getLatestNews(category);
    }
  }
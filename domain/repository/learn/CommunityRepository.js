import { CommunityPost } from "domain/entities/zaoLearn/CommunityPost";

export class CommunityRepository {
    async getPosts() {
      return [
        new CommunityPost(
          1,
          "James Kinyanjui",
          "👨‍🌾",
          "How do you decide which crops or livestock to invest in each season, and what factors influence your decision-making process?",
          22,
          5
        ),
        new CommunityPost(
          2,
          "Amos Wako",
          "👨‍🌾",
          "What strategies do you use to maximize yield while maintaining soil health and sustainability on your farm?",
          22,
          5
        ),
      ];
    }
  }
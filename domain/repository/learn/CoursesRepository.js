import { Course } from "domain/entities/zaoLearn/Course";

export class CourseRepository {
    async getCourses() {
      // Mock data - in real app, this would call API
      return [
        new Course(1, "Disease Prevention in crops", "Learn how to prevent common crop diseases", "🌱", 0),
        new Course(2, "Sustainable Farming", "Modern sustainable farming techniques", "🚜", 0),
      ];
    }
  }
  
  
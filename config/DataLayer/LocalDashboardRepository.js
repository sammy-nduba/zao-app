import { DashboardRepository } from "../Repository/DashboardRepository";
import { CropData } from '../model/CropData'
import {Alert } from '../model/Alert'

export class LocalDashboardRepository extends DashboardRepository {
    async getCropData() {
      return new CropData(
        'Hass Avocado',
        'Flush Phase',
        0,
        [
          { type: 'soil_test', title: 'Conduct Soil Test', completed: true },
          { type: 'agronomist', title: 'Book Agronomist', completed: false },
          { type: 'visit', title: 'Visit Nearby Farmer', completed: false }
        ]
      );
    }
    
    async getAlerts() {
      return [
        new Alert(
          1,
          'weather',
          'Hailstorm falling in the next one week',
          'Use Protective Netting – Install hail nets over vulnerable crops',
          'high'
        )
      ];
    }
  }
  
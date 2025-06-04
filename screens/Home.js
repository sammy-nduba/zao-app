import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
  StatusBar, Image, Dimensions, ImageBackground} from 'react-native';
  import { colors } from '../config/theme'
  import { useNavigation } from '@react-navigation/native';
import { GetWeatherUseCase } from '../config/UseCases/GetWeatherUseCase';
import {GetNewsUseCase }  from '../config/UseCases/GetNewsUseCase';
import { GetDashboardDataUseCase } from '../config/UseCases/GetDashboardDataUseCase';
import { LocalWeatherRepository } from '../config/DataLayer/LocalWeatherRepository';
import { LocalNewsRepository} from '../config/DataLayer/LocalNewsRepository';
import { LocalDashboardRepository} from '../config/DataLayer/LocalDashboardRepository';


console.log("Home", GetDashboardDataUseCase, GetNewsUseCase, GetWeatherUseCase)


const insightBackground = require("../assets/insights/header-background.png")


const { width } = Dimensions.get('window');

const useDashboardData = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNewsCategory, setSelectedNewsCategory] = useState('kenya');

  
  useEffect(() => {
    const loadData = async () => {
      try {
        const weatherRepo = new LocalWeatherRepository();
        const newsRepo = new LocalNewsRepository();
        const dashboardRepo = new LocalDashboardRepository();
        
        const weatherUseCase = new GetWeatherUseCase(weatherRepo);
        const newsUseCase = new GetNewsUseCase(newsRepo);
        const dashboardUseCase = new GetDashboardDataUseCase(dashboardRepo);
        
        const [weather, news, dashboard] = await Promise.all([
          weatherUseCase.execute(),
          newsUseCase.execute(selectedNewsCategory),
          dashboardUseCase.execute()
        ]);
        
        setWeatherData(weather);
        setNewsData(news);
        setDashboardData(dashboard);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [selectedNewsCategory]);
  
  return { 
    weatherData, 
    newsData, 
    dashboardData, 
    loading, 
    selectedNewsCategory, 
    setSelectedNewsCategory 
  };
};

// Greeting Section Component
const GreetingAndWeatherSection = ({ weatherData }) => {
  if (!weatherData) return null;
  
  const { current } = weatherData;
  
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'partly_cloudy': return '⛅';
      case 'rain': return '🌧️';
      case 'partly_cloudy_rain': return '🌦️';
      default: return '🌤️';
    }
  };

  const formatDate = () => {
    const now = new Date();
    const options = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    const time = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
    return `${now.toLocaleDateString('en-US', options)} - ${time}`;
  };

  return (
    <ImageBackground source={insightBackground} style={styles.greetingWeatherContainer} resizeMode="cover">
      <View style={styles.greetingWeatherOverlay}>

        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Good Afternoon Annie!</Text>
          <Text style={styles.dateTime}>{formatDate()}</Text>
        </View>

        {/* Weather Section */}
        <View style={styles.weatherMain}>
          <View style={styles.weatherLeft}>
            <Text style={styles.weatherIcon}>{getWeatherIcon(current.condition)}</Text>
            <Text style={styles.temperature}>{current.temperature}°C</Text>
            <Text style={styles.location}>{current.location}</Text>
          </View>
          
          <View style={styles.weatherStats}>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherStatIcon}>💧</Text>
              <Text style={styles.weatherStatLabel}>Precipitation: {current.precipitation}%</Text>
            </View>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherStatIcon}>💨</Text>
              <Text style={styles.weatherStatLabel}>Wind: {current.wind} km/h</Text>
            </View>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherStatIcon}>💦</Text>
              <Text style={styles.weatherStatLabel}>Humidity: {current.humidity}%</Text>
            </View>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherStatIcon}>🌅</Text>
              <Text style={styles.weatherStatLabel}>Sunset: {current.sunset}%</Text>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};
const WeatherForecast = ({ weatherData }) => {
  if (!weatherData) return null;
  
  const { forecast } = weatherData;
  
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'partly_cloudy': return '⛅';
      case 'rain': return '🌧️';
      case 'partly_cloudy_rain': return '🌦️';
      default: return '🌤️';
    }
  };
  
  return (
    <View style={styles.forecastContainer}>
      <Text style={styles.forecastTitle}>Seven Day Forecast</Text>
      <View style={styles.forecastDays}>
        {forecast.map((day, index) => (
          <View key={index} style={[styles.forecastDay, day.isToday && styles.forecastDayToday]}>
            <Text style={[styles.forecastDayText, day.isToday && styles.forecastDayTextToday]}>
              {day.day}
            </Text>
            <Text style={styles.forecastIcon}>{getWeatherIcon(day.condition)}</Text>
            <Text style={[styles.forecastTemp, day.isToday && styles.forecastTempToday]}>
              {day.temperature}°
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Alert Component
const AlertCard = ({ alert }) => (
  <View style={styles.alertContainer}>
    <View style={styles.alertIcon}>
      <Text style={styles.alertIconText}>🔔</Text>
    </View>
    <View style={styles.alertContent}>
      <Text style={styles.alertTitle}>Alert: {alert.title}</Text>
      <Text style={styles.alertMessage}>{alert.message}</Text>
    </View>
  </View>
);

// Crop Summary Component
const CropSummary = ({ cropData, onSeeMore }) => (
  <View style={styles.cropContainer}>
    <View style={styles.cropHeader}>
      <Text style={styles.cropTitle}>My Crop</Text>
      <TouchableOpacity onPress={onSeeMore}>
        <Text style={styles.seeMoreText}>See More</Text>
      </TouchableOpacity>
    </View>
    
    <View style={styles.cropContent}>
      <View style={styles.cropCard}>
        <Text style={styles.cropName}>{cropData.name}</Text>
        <Text style={styles.cropPhase}>{cropData.phase}</Text>
        <Text style={styles.cropHealth}>Farm Health - {cropData.healthPercentage}%</Text>
      </View>
      
      <View style={styles.taskCalendar}>
        <Text style={styles.taskCalendarTitle}>Task Calendar</Text>
        <View style={styles.taskCalendarDays}>
          <Text style={styles.taskCalendarDay}>S</Text>
          <Text style={styles.taskCalendarDay}>M</Text>
          <Text style={styles.taskCalendarDay}>T</Text>
          <Text style={styles.taskCalendarDay}>W</Text>
          <Text style={styles.taskCalendarDay}>T</Text>
          <Text style={styles.taskCalendarDay}>F</Text>
          <Text style={styles.taskCalendarDay}>S</Text>
        </View>
        <View style={styles.taskCalendarNumbers}>
          <View style={[styles.taskCalendarNumber, styles.taskCalendarNumberActive]}>
            <Text style={styles.taskCalendarNumberText}>9</Text>
          </View>
          <View style={styles.taskCalendarNumber}>
            <Text style={styles.taskCalendarNumberText}>10</Text>
          </View>
          <View style={styles.taskCalendarNumber}>
            <Text style={styles.taskCalendarNumberText}>11</Text>
          </View>
          <View style={styles.taskCalendarNumber}>
            <Text style={styles.taskCalendarNumberText}>12</Text>
          </View>
          <View style={styles.taskCalendarNumber}>
            <Text style={styles.taskCalendarNumberText}>13</Text>
          </View>
          <View style={[styles.taskCalendarNumber, styles.taskCalendarNumberHighlight]}>
            <Text style={styles.taskCalendarNumberText}>14</Text>
          </View>
          <View style={styles.taskCalendarNumber}>
            <Text style={styles.taskCalendarNumberText}>15</Text>
          </View>
        </View>
        
        <View style={styles.taskLegend}>
          <View style={styles.taskLegendItem}>
            <View style={[styles.taskLegendDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.taskLegendText}>Conduct Soil Test</Text>
          </View>
          <View style={styles.taskLegendItem}>
            <View style={[styles.taskLegendDot, { backgroundColor: '#e0e0e0' }]} />
            <Text style={styles.taskLegendText}>Book Agronomist</Text>
          </View>
          <View style={styles.taskLegendItem}>
            <View style={[styles.taskLegendDot, { backgroundColor: '#e0e0e0' }]} />
            <Text style={styles.taskLegendText}>Visit Nearby Farmer</Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

// News Component
const NewsSection = ({ newsData, selectedCategory, onCategoryChange }) => {
  const categories = ['Kenya', 'Africa', 'Global'];
  
  return (
    <View style={styles.newsContainer}>
      <Text style={styles.newsTitle}>Latest News</Text>
      
      <View style={styles.newsTabs}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.newsTab,
              selectedCategory === category.toLowerCase() && styles.newsTabActive
            ]}
            onPress={() => onCategoryChange(category.toLowerCase())}
          >
            <Text style={[
              styles.newsTabText,
              selectedCategory === category.toLowerCase() && styles.newsTabTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {newsData.map((article) => (
        <TouchableOpacity key={article.id} style={styles.newsArticle}>
          <View style={styles.newsImageContainer}>
            <View style={styles.newsImagePlaceholder}>
              <Text style={styles.newsImageIcon}>🥑</Text>
            </View>
          </View>
          <View style={styles.newsContent}>
            <Text style={styles.newsArticleTitle}>{article.title}</Text>
            <View style={styles.newsArticleMeta}>
              <Text style={styles.newsTime}>1hr</Text>
              <View style={styles.newsStats}>
                <Text style={styles.newsLikes}>❤️ {article.likes / 1000}k</Text>
                <Text style={styles.newsAuthor}>By {article.author}</Text>
                <Text style={styles.newsReadTime}>{article.readTime}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.learnMore}>
              <Text style={styles.learnMoreText}>Learn More →</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity style={styles.seeAllButton}>
        <Text style={styles.seeAllText}>See All</Text>
      </TouchableOpacity>
    </View>
  );
};

// Main Dashboard Screen
const Home = () => {

  const { 
    weatherData, 
    newsData, 
    dashboardData, 
    loading, 
    selectedNewsCategory, 
    setSelectedNewsCategory 
  } = useDashboardData();

  const navigation = useNavigation();


  
  const handleSeeMore = () => {
    if (navigation) {
      navigation.navigate('MyCropScreen', { cropData: dashboardData.cropData });
    } else {
      console.log('Navigation not available');
    }
  };
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Greeting and Weather Section */}
        <GreetingAndWeatherSection weatherData={weatherData} />
        
        {/* Weather Forecast Section */}
        <WeatherForecast weatherData={weatherData} />
        
        {/* Alert Section */}
        {dashboardData?.alerts?.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
        
        {/* Crop Summary */}
        {dashboardData?.cropData && (
          <CropSummary 
            cropData={dashboardData.cropData} 
            onSeeMore={handleSeeMore}
          />
        )}
        
        {/* News Section */}
        <NewsSection 
          newsData={newsData}
          selectedCategory={selectedNewsCategory}
          onCategoryChange={setSelectedNewsCategory}
        />
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.background
  },
  // Combined Greeting and Weather Section Styles
  greetingWeatherContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  greetingWeatherOverlay: {
    // Add overlay if needed for better text readability
  },
  greetingSection: {
    marginTop: 30,
    alignItems: 'center',
    marginBottom: 30,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 5,
  },
  dateTime: {
    fontSize: 14,
    color: '#E3F2FD',
  },
  weatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherLeft: {
    alignItems: 'center',
    flex: 1,
  },
  weatherIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  temperature: {
    fontSize: 32,
    fontWeight: '300',
    color: '#fff',
    marginBottom: 5,
  },
  location: {
    fontSize: 18,
    color: '#E3F2FD',
    fontWeight: '500',
  },
  weatherStats: {
    flex: 1,
    paddingLeft: 20,
  },
  weatherStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weatherStatIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  weatherStatLabel: {
    fontSize: 14,
    color: '#E3F2FD',
  },
  forecastContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  forecastTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 15,
  },
  forecastDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastDay: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    minWidth: 40,
  },
  forecastDayToday: {
    backgroundColor: '#FF9800',
  },
  forecastDayText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  forecastDayTextToday: {
    color: '#fff',
    fontWeight: '600',
  },
  forecastIcon: {
    fontSize: 16,
    marginBottom: 5,
  },
  forecastTemp: {
    fontSize: 12,
    color: '#666666',
  },
  forecastTempToday: {
    color: '#fff',
    fontWeight: '600',
  },
  alertContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFEBEE',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  alertIcon: {
    marginRight: 15,
  },
  alertIconText: {
    fontSize: 24,
    color: '#F44336',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
    marginBottom: 5,
  },
  alertMessage: {
    fontSize: 14,
    color: '#B71C1C',
  },
  cropContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  cropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cropTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  seeMoreText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
  cropContent: {
    flexDirection: 'row',
    gap: 15,
  },
  cropCard: {
    backgroundColor: colors.primary[400],
    borderRadius: 15,
    padding: 20,
    height: 184,
    flex: 1,
    justifyContent: 'center',
  },
  cropName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  cropPhase: {
    fontSize: 14,
    color: '#E8F5E8',
    marginBottom: 15,
  },
  cropHealth: {
    fontSize: 14,
    color: '#E8F5E8',
  },
  taskCalendar: {
    backgroundColor: '#FFF8E1',
    borderRadius: 15,
    padding: 15,
    flex: 1,
  },
  taskCalendarTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  taskCalendarDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taskCalendarDay: {
    fontSize: 12,
    color: '#666',
    width: 20,
    textAlign: 'center',
  },
  taskCalendarNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  taskCalendarNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskCalendarNumberActive: {
    backgroundColor: '#4CAF50',
  },
  taskCalendarNumberHighlight: {
    backgroundColor: '#FF9800',
  },
  taskCalendarNumberText: {
    fontSize: 12,
    color: '#333',
  },
  taskLegend: {
    gap: 5,
  },
  taskLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  taskLegendText: {
    fontSize: 10,
    color: '#666',
  },
  newsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  newsTabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  newsTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  newsTabActive: {
    borderBottomColor: '#4CAF50',
  },
  newsTabText: {
    fontSize: 16,
    color: '#666',
  },
  newsTabTextActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  newsArticle: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsImageContainer: {
    width: 120,
    height: 100,
  },
  newsImagePlaceholder: {
    flex: 1,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsImageIcon: {
    fontSize: 40,
  },
  newsContent: {
    flex: 1,
    padding: 15,
  },
  newsArticleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  newsArticleMeta: {
    marginBottom: 10,
  },
  newsTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  newsStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  newsLikes: {
    fontSize: 12,
    color: '#666',
  },
  newsAuthor: {
    fontSize: 12,
    color: '#666',
  },
  newsReadTime: {
    fontSize: 12,
    color: '#666',
  },
  learnMore: {
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  seeAllButton: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  seeAllText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 100,
  },
});

export default Home;
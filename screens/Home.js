import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { colors } from '../config/theme';
import { useNavigation } from '@react-navigation/native';
import { HomeViewModel } from '../viewModel/HomeViewModel';
import container from '../infrastructure/di/Container';
import GreetingAndWeatherSection from '../components/home/GreetingAndWeatherSection';
import WeatherForecast from '../components/home/WeatherForecast';
import AlertCard from '../components/home/AlertCard';
import CropSummary from '../components/home/CropSummary';
import NewsSection from '../components/home/NewsSection';
import Toast from 'react-native-toast-message';

const Home = () => {
  const navigation = useNavigation();
  const [viewModel] = useState(() => new HomeViewModel(
    container.get('getWeatherUseCase'),
    container.get('getNewsUseCase'),
    container.get('getDashboardDataUseCase')
  ));
  const [state, setState] = useState(viewModel.getState());

  useEffect(() => {
    const loadData = async () => {
      console.log('Home.js: Loading data');
      await viewModel.loadData();
      const newState = viewModel.getState();
      console.log('Home.js: State updated:', newState);
      setState(newState);
      if (newState.error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: newState.error,
        });
      }
    };
    loadData();
  }, [viewModel]);

  const handleSeeMore = () => {
    console.log('Navigating to MyCropScreen with cropData:', state.dashboardData?.cropData);
    navigation.navigate('MyCropScreen', { cropData: state.dashboardData?.cropData });
  };

  const handleCategoryChange = (category) => {
    console.log('Home.js: Changing news category:', category);
    viewModel.setCategory(category);
    setState(viewModel.getState());
  };

  if (state.loading) {
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
        {state.error && <Text style={styles.errorText}>Error: {state.error}</Text>}
        <GreetingAndWeatherSection weatherData={state.weatherData} />
        <WeatherForecast weatherData={state.weatherData} />
        {state.dashboardData?.alerts?.length ? (
          state.dashboardData.alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))
        ) : (
          <Text style={styles.noDataText}>No alerts available</Text>
        )}
        {state.dashboardData?.cropData ? (
          <CropSummary
            cropData={state.dashboardData.cropData}
            onSeeMore={handleSeeMore}
          />
        ) : (
          <Text style={styles.noDataText}>No crop data available</Text>
        )}
        <NewsSection
          newsData={state.newsData}
          selectedCategory={state.selectedNewsCategory}
          onCategoryChange={handleCategoryChange}
        />
        <TouchableOpacity
  style={styles.seeAllButton}
  onPress={() =>
    navigation.navigate('MainTabs', {
      screen: 'HomeStack',
      params: {
        screen: 'LatestNewsScreen',
        params: { category: state.selectedNewsCategory },
      },
    })
  }
>
  <Text style={styles.seeAllText}>See All</Text>
</TouchableOpacity>

        
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
    backgroundColor: colors.background,
  },
  errorText: {
    color: 'red',
    padding: 10,
  },
  seeAllButton: {
    alignContent: 'flex-end',
    paddingVertical: 15,
    marginEnd: 50,
  },
  seeAllText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    textAlign: 'right',
  },
  noDataText: {
    color: colors.grey[600],
    padding: 10,
  },
  bottomPadding: {
    height: 100,
  },
});

export default Home;
// src/screens/Home.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image
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
    viewModel.setSelectedNewsCategory(category);
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

  console.log('Home.js: Rendering with state:', state); // Debug

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="light-content" backgroundColor={colors.background} /> */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {state.error && <Text style={styles.errorText}>Error: {state.error}</Text>}
        <GreetingAndWeatherSection weatherData={state.weatherData || { current: null, forecast: [] }} />
        <WeatherForecast weatherData={state.weatherData || { current: null, forecast: [] }} />
        <View style={styles.vectorContainer}>
        <Image source={require('../assets/Vector1.png')} style={styles.vector1} />
        <Image source={require('../assets/Vector.png')} style={styles.vector2} />
      </View>
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
          newsData={Array.isArray(state.newsData) ? state.newsData : []}
          selectedCategory={state.selectedNewsCategory || 'kenya'}
          onCategoryChange={handleCategoryChange}
        />
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={() =>
            navigation.navigate('MainTabs', {
              screen: 'HomeStack',
              params: {
                screen: 'LatestNewsScreen',
                params: { category: state.selectedNewsCategory || 'kenya' },
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
  vectorContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
    marginTop: 400
  },
  // vector1: {
  //   position: 'absolute',
  //   width: 130,
  //   height: 128,
  //   top: 100,
  //   left: 250,
  //   opacity: 0.1,
  //   transform: [{ rotate: '-161.18deg' }],
  // },
  vector2: {
    position: 'absolute',
    width: 200,
    height: 200,
    top: 300,
    left: 200,
    opacity: 0.05,
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
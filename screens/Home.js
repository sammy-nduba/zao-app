import React from 'react';
import { View, StatusBar, StyleSheet, FlatList } from 'react-native';
import { colors } from '../config/theme';
import WeatherHeader from '../components/insights/WeatherHeader';
import AlertBanner from '../components/insights/AlertBanner';
import CropTaskSection from '../components/insights/CropTaskSection';
import NewsSection from '../components/insights/NewsSection';
import useHomeScreenData from '../config/useHomeScreenData';
import { BottomNavBar } from '../components';

const Home = () => {
  const { dateTime, forecast, alert, cropData, tasks, news } = useHomeScreenData();

  const sections = [
    // {type: 'foreacst', data: {day, climate}},
    { type: 'weather', data: { dateTime, forecast } },
    { type: 'alert', data: { alert } },
    { type: 'crop', data: { cropData, tasks } },
    { type: 'news', data: { news } },
  ];

  const renderSection = ({ item }) => {
    switch (item.type) {
      case 'weather':
        return <WeatherHeader dateTime={item.data.dateTime} forecast={item.data.forecast} />;
      case 'crop':
        return <CropTaskSection cropData={item.data.cropData} tasks={item.data.tasks} />;
        case 'alert':
        return <AlertBanner alert={item.data.alert} />;
      case 'news':
        return <NewsSection news={item.data.news} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item) => item.type}
        contentContainerStyle={styles.contentContainer}
      />
      {/* <BottomNavBar/> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: 100, // Space for bottom 
  },
});

export default Home;
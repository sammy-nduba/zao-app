import { useState } from 'react';

const useHomeScreenData = () => {

  const [activeTab, setActiveTab] = useState('home');
  
  const dateTime = 'Tue, 20 December 2025 - 3.30 PM';
  
  const forecast = [
    { abbreviation: 'S', temperature: 24 },
    { abbreviation: 'M', temperature: 26 },
    { abbreviation: 'W', temperature: 25 },
    { abbreviation: 'F', temperature: 23 },
  ];
  
 
  
  const cropData = {
    name: 'Hass Avocado',
    phase: 'Flush Phase',
    calendar: ['9', '10', '11', '12', '13', '14', '15'],
  };

  

  const alert = {
    title: 'Hallstorm falling in the next one week',
    message: 'Use Protective Netting – Install hall nets over vulnerable crops',
  };
  
  const tasks = [
    'Conduct Soil Test',
    'Book Agronomist',
    'Visit Nearby Farmer',
  ];
  
  const news = [
    {
      id: '1',
      title: 'Government Announces Subsidy for Avocado Farmers',
      time: '1hr',
      stats: '12k',
      source: 'By Ministry of Agriculture | 4min read',
    },
    {
      id: '2',
      title: 'Avocado Prices Rise in Local and Export Markets',
      time: '1hr',
      stats: '12k',
      source: 'By Kenya Export | 4min read',
    },
  ];

  return {
    activeTab,
    setActiveTab,
    dateTime,
    forecast,
    alert,
    cropData,
    tasks,
    news,
  };
};

export default useHomeScreenData;
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../../screens/Home';
import MyCropScreen from '../../screens/insights/MyCropScreen';
import LatestNewsScreen from '../../screens/zaoNews/LatestNewsScreen';
import { FarmDetails } from 'screens';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="MyCropScreen" component={MyCropScreen} />
      <Stack.Screen name="LatestNewsScreen" component={LatestNewsScreen} options={{ title: 'Latest News' }} />
      <Stack.Screen name ="FarmDetails" component={FarmDetails}/>
    </Stack.Navigator>
  );
};

export default HomeStack;
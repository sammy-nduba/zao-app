
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../../screens/Home';
import MyCropScreen from '../../screens/insights/MyCropScreen';
import { ConnectScreen, LearnScreen, MarketScreen, AIScreen } from '../../screens';
import BottomNavStack from './BottomNavStack';


const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      
      <Stack.Screen name = "Connect" component= {ConnectScreen} />

      <Stack.Screen name = "Learn" component= {LearnScreen} />

      <Stack.Screen name = "Market" component= {MarketScreen} />

      <Stack.Screen name = "AI" component= {AIScreen} />

      <Stack.Screen name="MyCropScreen" component={MyCropScreen} />

    </Stack.Navigator>
  );
};

export default HomeStack;
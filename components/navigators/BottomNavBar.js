import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import { colors, spacing } from '../../config/theme';
import { useNavigation } from '@react-navigation/native';
import Home from '../../screens/Home';
import ConnectScreen from '../../screens/insights/connect/ConnectScreen';
import LearnScreen from '../../screens/insights/learn/LearnScreen';
import MarketScreen from '../../screens/insights/market/MarketScreen';
import AIScreen from '../../screens/insights/ai/AiScreen';
import { HeaderShownContext } from '@react-navigation/elements';

const centralIcon = require('../../assets/insights/cropImage.png');

export const BottomNavBar = () => {
  const navigation = useNavigation();

  const _renderIcon = (routeName, selectedTab) => {
    let icon = '';
    switch (routeName) {
      case 'Home':
        return null; 
      case 'connect':
        icon = 'account-group';
        break;
      case 'learn':
        icon = 'tablet';
        break;
      case 'market':
        icon = 'cart';
        break;
      case 'ai':
        icon = 'brain';
        break;
    }
    return (
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={routeName === selectedTab ? colors.primary : colors.grey}
      />
    );
    
  };

  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    if (routeName === 'Home') return null; // Home is handled by central button
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routeName);
          navigate(routeName);
        }}
        style={styles.tab}
      >
        {_renderIcon(routeName, selectedTab)}
        <Text
          style={[
            styles.tabLabel,
            routeName === selectedTab && styles.activeTabLabel,
          ]}
        >
          {routeName.charAt(0).toUpperCase() + routeName.slice(1)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <CurvedBottomBar.Navigator
      type="UP"
      style={styles.bottomBar}
      height={100}
      circleWidth={55}
      bgColor={colors.primary[800]}
      backgroundColor={colors.primary[300]}
      borderTopLeftRight
      strokeColor={colors.white}
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
      renderCircle={({ selectedTab, navigate }) => (
        <TouchableOpacity
          style={styles.btnCircleUp}
          onPress={() => {
            navigation.navigate('Home');
            navigate('Home');
          }}
        >
          <Image
            source={centralIcon}
            style={styles.centralIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
      tabBar={renderTabBar}
    >
      <CurvedBottomBar.Screen
        name="Home"
        component={Home}
        position="CENTER"
      />
      <CurvedBottomBar.Screen
        name="connect"
        position="LEFT"
        component={ConnectScreen}
        options={{ headerShown: false }}
      />
      <CurvedBottomBar.Screen
        name="learn"
        position="LEFT"
        component={LearnScreen}
        options={{ headerShown: false }}
      />
      <CurvedBottomBar.Screen
        name="market"
        position="RIGHT"
        component={MarketScreen}
        options={{ headerShown: false }}
      />
      <CurvedBottomBar.Screen
        name="ai"
        position="RIGHT"
        component={AIScreen}
        options={{ headerShown: false }}
      />
    </CurvedBottomBar.Navigator>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: colors.primary,
    
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.small,
  },
  tabLabel: {
    marginTop: spacing.tiny,
    fontSize: 10,
    color: colors.gray,
  },
  activeTabLabel: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    bottom: 25,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 3,
  },
  centralIcon: {
    width: 30,
    height: 30,
    tintColor: colors.white,
    color: colors.white
  },
});

export default BottomNavBar;
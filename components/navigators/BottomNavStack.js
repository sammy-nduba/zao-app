import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import { colors, spacing } from '../../config/theme';
import { useNavigation } from '@react-navigation/native';
import ConnectScreen from '../../screens/insights/connect/ConnectScreen';
import ZaoLearnScreen from '../../screens/zaoLearn/ZaoLearnScreen';
import MarketScreen from '../../screens/insights/market/MarketScreen';
import {ZaoAIScreen} from '../../screens/ZaoAIScreen/ZaoAIScreen';
import HomeStack from './HomeStack';

const centralIcon = require('../../assets/insights/cropImage.png');

export const BottomNavStack = () => {
  const navigation = useNavigation();

  const _renderIcon = (routeName, selectedTab) => {
    let icon = '';
    switch (routeName) {
      case 'HomeStack':
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
        color={routeName === selectedTab ? colors.white : colors.white} // Always white now
      />
    );
  };

  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    if (routeName === 'HomeStack') return null; 
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
    <View style={styles.container}>
      <CurvedBottomBar.Navigator
        type="UP"
        style={styles.bottomBar}
        height={70}
        circleWidth={65}
        bgColor={colors.primary[800]}
        initialRouteName="HomeStack"
        borderTopLeftRight
        strokeWidth={0}
        strokeColor={colors.primary[800]}
        screenOptions={{ headerShown: false }}
        renderCircle={({ selectedTab, navigate }) => (
          <TouchableOpacity
            style={styles.btnCircleUp}
            onPress={() => {
              navigation.navigate('HomeStack');
              navigate('HomeStack');
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
        <CurvedBottomBar.Screen name="HomeStack" component={HomeStack} position="CENTER"/>
        <CurvedBottomBar.Screen name="connect" position="LEFT" component={ConnectScreen} options={{ headerShown: false }} />
        <CurvedBottomBar.Screen name="learn" position="LEFT" component={ZaoLearnScreen} options={{ headerShown: false }}/>
        <CurvedBottomBar.Screen name="market" position="RIGHT" component={MarketScreen} options={{ headerShown: false }}/>
        <CurvedBottomBar.Screen name="ai" position="RIGHT" component={ZaoAIScreen} options={{ headerShown: false }} />
      </CurvedBottomBar.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
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
    color: colors.white, // Changed to white
  },
  activeTabLabel: {
    color: colors.white, // Changed to white
    fontWeight: 'bold',
  },
  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[800],
    bottom: 30,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 3,
    borderWidth: 3,
    borderColor: colors.white,
  },
  centralIcon: {
    width: 30,
    height: 30,
    tintColor: colors.white,
  },
});

export default BottomNavStack;
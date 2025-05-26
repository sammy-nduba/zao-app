import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { StyledButton, StyledText, ScrollableMainContainer } from '../components';
import { colors } from '../config/theme';
import { onBoardingContext } from '../utils/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';


const Home = () => {
  const { setIsLoggedIn, setUser, user } = useContext(onBoardingContext);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@ZaoAPP:Login');
      setIsLoggedIn(false);
      setUser(null);
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'You have been logged out successfully',
      });
    } catch (error) {
      console.warn('Logout error:', error);
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: 'An error occurred while logging out',
      });
    }
  };

  return (
    <ScrollableMainContainer contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <StyledText style={styles.title}>Welcome to Zao App</StyledText>
        <StyledText style={styles.subtitle}>
          {user?.farmerData
            ? `Farmer: ${user.farmerData.selectedCrops.join(', ')} in ${user.farmerData.location}`
            : 'You are logged in!'}
        </StyledText>
      </View>
      <View style={styles.buttonContainer}>
        <StyledButton
          title="Log Out"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>
    </ScrollableMainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 420,
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.grey[600],
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.grey[500],
    fontWeight: '400',
  },
  buttonContainer: {
    marginBottom: 24,
  },
  logoutButton: {
    width: '100%',
    height: 56,
    borderRadius: 32,
    backgroundColor: colors.primary[600],
  },
});

export default Home;
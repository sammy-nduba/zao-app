import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { BottomNavBar } from '../../../components';



const MarketScreen = () => {
  return(
    <View style={styles.container}>
      <Text>Market Screen</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default MarketScreen;
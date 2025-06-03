import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../../../config/theme';
import { BottomNavBar } from '../../../components/';



const ConnectScreen = () => (
    <View style = {styles.container}>
      <Text>Connect Screen</Text>
      {/* <BottomNavBar/> */}
    </View>
  );


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: colors.background
    }
  });

  export default ConnectScreen;


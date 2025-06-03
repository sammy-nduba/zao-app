import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { BottomNavBar } from "../../../components";


const LearnScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Learn Screen</Text>
      {/* <BottomNavBar/> */}
    </View>
  )
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default LearnScreen;

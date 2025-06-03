import React from "react";
import { View, Text, StyleSheet} from 'react-native';
import { BottomNavBar } from "../../../components";


const AIScreen = () => {
  return (
    <View >
      <Text>AI Screen</Text>
      {/* <BottomNavBar activeTab={activeTab} onTabPress={setActiveTab} /> */}

    </View>
  )
};

  const styles = StyleSheet.create({
    container: { flex: 1 },
  });

  export default AIScreen
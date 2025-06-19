import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const Header = ({ title, onBackPress, onNotificationPress }) => {
  return (
    <View style={styles.header}>
      <View style={styles.vectorContainer}>
        <Image source={require('../../assets/Vector1.png')} style={styles.vector1} />
        <Image source={require('../../assets/Vector.png')} style={styles.vector2} />
      </View>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <Icon name="arrow-back" size={24} color="#1F2937" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity style={styles.notificationButton} onPress={onNotificationPress}>
        <Icon name="notifications-none" size={24} color="#1F2937" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  vectorContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  // vector1: {
  //   position: 'absolute',
  //   width: 130.41,
  //   height: 128.5,
  //   top: 2065.92,
  //   left: 272.59,
  //   transform: [{ rotate: '-161.18deg' }],
  // },
  vector2: {
    position: 'absolute',
    width: 200,
    height: 200,
    left: 217,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  backButton: {
    padding: 8,
  },
  notificationButton: {
    padding: 8,
  },
})
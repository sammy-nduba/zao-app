import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export const CapabilityCard = ({ title, description }) => {
  return (
    <View style={styles.capabilityCard}>
      <Text style={styles.capabilityTitle}>{title}</Text>
      <Text style={styles.capabilityDescription}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  capabilityCard: {
    backgroundColor: '#FFF9E5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    width: '100%',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  capabilityTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#818381',
    marginBottom: 8,
    textAlign: 'center',
  },
  capabilityDescription: {
    fontSize: 14,
    color: '#818381',
    textAlign: 'center',
    lineHeight: 20,
  },

});
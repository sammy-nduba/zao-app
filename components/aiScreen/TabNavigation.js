import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const TabNavigation = ({ tabs, activeTab, onTabPress }) => {
  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.tab, activeTab === index && styles.activeTab]}
          onPress={() => onTabPress(index)}
        >
          <Text style={[
            styles.tabTitle,
            activeTab === index && styles.activeTabTitle
          ]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#10B981',
  },
  tabTitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabTitle: {
    color: '#10B981',
    fontWeight: '600',
  },
})
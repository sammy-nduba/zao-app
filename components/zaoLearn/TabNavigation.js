import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const TabNavigation = ({ activeTab, onTabChange }) => {
    const tabs = ['Courses', 'My Learning', 'Certificates'];
    
    return (
      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === index && styles.activeTab]}
            onPress={() => onTabChange(index)}
          >
            <Text style={[
              styles.tabText,
              activeTab === index && styles.activeTabText
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
        backgroundColor: '#fff',
        paddingHorizontal: 16,
      },
      tab: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginRight: 24,
      },
      activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#4CAF50',
      },
      tabText: {
        fontSize: 16,
        color: '#666',
      },
      activeTabText: {
        color: '#4CAF50',
        fontWeight: '600',
      },
  })
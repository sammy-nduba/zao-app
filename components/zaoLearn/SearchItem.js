import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const SearchItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.searchItem} onPress={() => onPress(item)}>
      <View style={styles.searchItemIcon}>
        <Text>{item.icon}</Text>
      </View>
      <Text style={styles.searchItemText}>{item.title}</Text>
      <Text style={styles.searchArrow}>🔍</Text>
    </TouchableOpacity>
  );

  
  const styles = StyleSheet.create({
    searchItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
      },
      searchItemIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
      },
      searchItemText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
      },
      searchArrow: {
        fontSize: 16,
        color: '#666',
      },
  })
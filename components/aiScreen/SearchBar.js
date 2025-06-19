import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const SearchBar = ({ value, onChangeText, onFilterPress, placeholder }) => {
  return (
    <View style={styles.searchContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.searchWrapper}>
          <Icon name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <Icon name="tune" size={24} color="#10B981" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    flex: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: '#6B7280',
  },
  filterButton: {
    padding: 8,
  },
})
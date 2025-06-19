import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const ChatInput = ({ value, onChangeText, onSend, onAttach, onVoice, placeholder }) => {
  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity onPress={onAttach}>
        <Icon name="attach-file" size={24} color="#6B7280" />
      </TouchableOpacity>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          multiline
        />
      </View>
      <TouchableOpacity onPress={onVoice}>
        <Icon name="mic" size={24} color="#6B7280" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.sendButton} onPress={onSend}>
        <Icon name="send" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#EAEBEA',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    border: 1
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: '#1F2937',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

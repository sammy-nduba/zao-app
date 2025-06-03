import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StyledButton } from '../../components';
import StyledText from '../../components/Texts/StyledText';
import { colors } from '../../config/theme';

// console.log("Error Screen", StyledButton, StyledText)

const ErrorScreen = ({ error }) => {
  return (
    <View style={styles.container}>
      <StyledText style={styles.title}>Something Went Wrong</StyledText>
      <StyledText style={styles.message}>{error || 'An unexpected error occurred'}</StyledText>
      <StyledButton
        title="Try Again"
        onPress={() => {
          // Reload app or reset state
          // For simplicity, navigate to Welcome
          // In production, - implement proper retry logic
          window.location.reload();
        }}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.grey[600],
    marginBottom: 16,
  },
  message: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.grey[500],
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 32,
    backgroundColor: colors.primary[600],
  },
});

export default ErrorScreen;
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { StyledText } from '../../components';
import { colors } from '../../config/theme';
import { AntDesign } from '@expo/vector-icons';

const StyledButton = ({ title, icon, onPress, style, isSocial = false, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSocial ? styles.socialButton : styles.primaryButton,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && (
        <AntDesign
          name={icon}
          size={24}
          color={isSocial ? colors.grey[800] : '#FFFFFF'}
          style={styles.icon}
        />
      )}
      <StyledText style={[styles.buttonText, isSocial && styles.socialButtonText]}>
        {title}

  

      </StyledText>

      
    </TouchableOpacity>

  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  primaryButton: {
    width: 120,
    height: 56,
    backgroundColor: colors.primary[600],
  },
  socialButton: {
    width: '100%',
    height: 50,
    backgroundColor: colors.grey[100],
    borderWidth: 1,
    borderColor: colors.grey[300],
  },
  disabledButton: {
    backgroundColor: colors.grey[500],
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  socialButtonText: {
    color: colors.grey[800],
  },
  icon: {
    marginRight: 10,
  },
});

export default StyledButton;
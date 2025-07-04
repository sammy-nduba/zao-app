import React, { useContext } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from "../../config/theme";
import { onIOS } from "../../config/constants";
import { HeaderHeightContext } from '@react-navigation/elements';

const MainContainer = ({ children, style, ...props }) => {
  return (
    <View 
      style={[{ flex: 1, backgroundColor: colors.background }, style]}
      {...props}
    >
      <KeyboardAvoidingView
        behavior={onIOS ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={useContext(HeaderHeightContext) ?? 0}
      >
        {children}
      </KeyboardAvoidingView>
    </View>
  );
};

export default MainContainer;
import React, { useContext } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { colors } from "../../config/theme";
import { onIOS } from "../../config/constants";
import { HeaderHeightContext } from '@react-navigation/elements';

const ScrollableMainContainer = ({ children, style, contentContainerStyle, ...props }) => {
  return (
    <KeyboardAvoidingView
      behavior={onIOS ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={useContext(HeaderHeightContext) ?? 0}
    >
      <ScrollView 
        style={[{ flex: 1, backgroundColor: colors.background }, style]}
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        {...props}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ScrollableMainContainer;
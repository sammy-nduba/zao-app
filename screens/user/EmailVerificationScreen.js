import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { container } from './../../infrastructure/di/Container'

export const EmailVerificationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const apiRepo = container.get('apiUserRepository');
  const token = route.params?.token;

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        navigation.navigate('Error', { error: 'No verification token provided' });
        return;
      }

      try {
        await apiRepo.verifyEmail(token);
        navigation.navigate('Success');
      } catch (error) {
        navigation.navigate('Error', { 
          error: error.response?.data?.message || 'Verification failed' 
        });
      }
    };

    verify();
  }, [token]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text>Verifying your email...</Text>
    </View>
  );
};
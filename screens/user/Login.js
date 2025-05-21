import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import {ScrollableMainContainer, StyledTextInput, StyledButton, StyledText } from '../../components';
import { colors } from '../../config/theme';
import { onBoardingContext } from '../../utils/context';
import { useNavigation } from '@react-navigation/native';
import { storeData } from '../../utils/storage';

console.log("Login Screen", ScrollableMainContainer)

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setIsZaoAppOnboarded } = useContext(onBoardingContext);
    const navigation = useNavigation();

    const handleLogin = async ()=> {
        setIsLoading(true);
        try {
            // todo {Implement email/password authentication (e.g., Firebase)}
            // For now, simulate successful login
            await storeData('@ZaoAPP:Onboarding', false); // Navigate to Welcome
            navigation.navigate('Welcome');
          } catch (error) {
            console.warn('Login error:', error);
          } finally {
            setIsLoading(false);
          }
        };

        const handleSocialLogin = (provider) => {
            setIsLoading(true);
            // Placeholder: Implement social sign-in (Google, Facebook, Apple)
            console.log(`Sign in with ${provider}`);
            setTimeout(() => {
              setIsLoading(false);
              navigation.navigate('Welcome');
            }, 500);
          };

    return (
        <ScrollableMainContainer contentContainerStyle={styles.container}>
          <StyledText style={styles.title}>Login to Zao</StyledText>
          <StyledTextInput
            icon="mail"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <StyledTextInput
            icon="lock"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <StyledButton
            title="Login"
            onPress={handleLogin}
            disabled={isLoading || !email || !password}
            style={styles.loginButton}
          />
          <StyledText style={styles.orText}>Or sign in with</StyledText>
          <StyledButton
            title="Google"
            icon="google"
            onPress={() => handleSocialLogin('Google')}
            isSocial
            style={styles.socialButton}
          />
          <StyledButton
            title="Facebook"
            icon="facebook"
            onPress={() => handleSocialLogin('Facebook')}
            isSocial
            style={styles.socialButton}
          />
          <StyledButton
            title="Apple"
            icon="apple1"
            onPress={() => handleSocialLogin('Apple')}
            isSocial
            style={styles.socialButton}
          />
        </ScrollableMainContainer>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
        backgroundColor: colors.background,
      },
      title: {
        fontFamily: 'Roboto',
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary[600],
        marginBottom: 30,
        textAlign: 'center',
      },
      input: {
        width: '100%',
        marginBottom: 15,
      },
      loginButton: {
        marginVertical: 20,
      },
      orText: {
        fontFamily: 'Roboto',
        fontSize: 16,
        color: colors.grey[600],
        marginVertical: 15,
      },
      socialButton: {
        marginBottom: 10,
      },
    });
    
    export default Login;
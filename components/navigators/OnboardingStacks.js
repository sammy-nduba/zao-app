import React, { useContext, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyledButton } from '../../components';
import Welcome from '../../screens/Welcome';
import LanguageSelectionScreen from '../../screens/LanguageSelectionScreen';
import { AuthContext } from '../../utils/AuthContext';
import { colors } from '../../config/theme';
import container from '../../infrastructure/di/Container';
import { useTranslation } from 'react-i18next';

const Stack = createStackNavigator();

const LanguageSelectionScreenWrapper = (props) => (
  <LanguageSelectionScreen
    presenter={container.get('languageSelectionPresenter')}
    navigation={props.navigation}
  />
);

const OnboardingStack = () => {
  const { t } = useTranslation();
  const { setIsZaoAppOnboarded } = useContext(AuthContext);
  const [completingOnboarding, setCompletingOnboarding] = useState(false);

  const completeOnboarding = async (navigation) => {
    try {
      setCompletingOnboarding(true);
      await setIsZaoAppOnboarded(true);
      navigation.replace('Auth');
    } catch (error) {
      console.warn('Error completing onboarding:', error);
    } finally {
      setCompletingOnboarding(false);
    }
  };

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: ({ current, layouts }) => ({
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
        }),
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="LanguageSelection"
        component={LanguageSelectionScreenWrapper}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={({ navigation }) => ({
          headerRight: () => (
            <StyledButton
              onPress={() => completeOnboarding(navigation)}
              isLoading={completingOnboarding}
              style={{
                width: 'auto',
                height: 'auto',
                padding: 10,
                backgroundColor: 'transparent',
              }}
              textStyle={{
                color: colors.grey[600],
                fontSize: 14,
                fontWeight: '500',
              }}
            >
              {t('common.skip')}
            </StyledButton>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default OnboardingStack;
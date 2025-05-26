import React from 'react';
import { useContext, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {StyledButton} from "../../components";
import { Welcome, Register } from '../../screens'; 
import { onBoardingContext } from "../../utils/context";
import { storeData } from "../../utils/storage";
import { colors } from "../../config/theme";

const Stack = createStackNavigator();

const OnboardingStack = () => {
    const { setIsZaoAppOnboarded } = useContext(onBoardingContext);
    const [completingOnboarding, setCompletingOnboarding] = useState(false);

    const completeOnboarding = async () => {
        try {
            setCompletingOnboarding(true);
            await storeData("@ZaoAPP:Onboarding", true);
            setIsZaoAppOnboarded(true);
        } catch (error) {
            console.warn(error);
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
                            }
                        ]
                    }
                }),
                headerRight: () => (
                    <StyledButton 
                        onPress={completeOnboarding}
                        isLoading={completingOnboarding}
                        style={{
                            width: 'auto', 
                            height: 'auto',
                            padding: 10,
                            backgroundColor: 'transparent'
                        }}
                        textStyle={{  
                            color: colors.grey[600],
                            fontSize: 14,
                            fontWeight: '500',
                        }}
                    >
                        Skip
                    </StyledButton>
                )
            }}
        >
            <Stack.Screen 
                name="Welcome" 
                component={Welcome} 
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default OnboardingStack;
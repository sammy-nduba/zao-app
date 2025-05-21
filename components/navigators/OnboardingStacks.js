import React from 'react';
import { useContext, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StyledButton from "../Buttons/StyledButton";
import  { Welcome } from "../../screens";
import { Home }  from '../../screens'; 
import {Login} from '../../screens';
import { onBoardingContext } from "../../utils/context";
import { storeData } from "../../utils/storage";
import { colors } from "../../config/theme";

// console.log( " ONBOARDING STACK", StyledButton, Home, Welcome, StyledButton)




const Stack = createStackNavigator();

const OnboardingStack =  () => {
    
    const { setIsZaoAppOnboarded} = useContext(onBoardingContext);
    const [ completingOnboarding, setCompletingOnboarding] = useState(false);

  const completeOnboarding = async () => {
    try {
      setCompletingOnboarding(true);
      
      await storeData("@ZaoAPP:Onboarding", true)

     setTimeout(() => {setIsZaoAppOnboarded(true);
      setCompletingOnboarding(false)}, 200);

    } catch (error) {
      console.warn(error)
      setCompletingOnboarding(false);
    }
  };

    return ( 
        <Stack.Navigator screenOptions={{
            headerRight: () => 
            <StyledButton onPress = {completeOnboarding}
            isLoading = {completingOnboarding}
            style = {{
                width: 'auto', 
                height: 'auto',
                padding: 10,
                backgroundColor: 'transparent'

            
            }}
            textStyle = {{  color: colors.grey[600],
                fontSize: 14,
                fontWeight: '500',
            }}>Skip</StyledButton>

       }}>

            <Stack.Screen name="Welcome" component = {Welcome} options={{ headerShown: false }}/>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
             <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
        </Stack.Navigator>
    );

}

export default OnboardingStack;
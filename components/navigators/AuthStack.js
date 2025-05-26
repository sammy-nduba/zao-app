// components/navigators/AuthStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { FarmDetails, Login, Register, 
    ForgotPassword, OTPScreen, NewFarmerForm, ExperiencedFarmerForm } from '../../screens';
   


const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
           
             <Stack.Screen name="Register" component={Register} />

             <Stack.Screen name="Login" component={Login} />

            <Stack.Screen name="FarmDetails" component={FarmDetails} />

            <Stack.Screen name="NewFarmerForm" component={NewFarmerForm} />
            
            
            <Stack.Screen name="ExperiencedFarmerForm" component={ExperiencedFarmerForm} />
            
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            
            <Stack.Screen name="OTPScreen" component={OTPScreen} />

            {/* <Stack.Screen name="UserAgreement" component={UserAgreement} />
      
      
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} /> */}
           
        </Stack.Navigator>
    );
};

export default AuthStack;
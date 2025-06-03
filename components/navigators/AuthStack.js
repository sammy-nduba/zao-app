import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { FarmDetails, Login, Register, 
    ForgotPassword, OTPScreen, NewFarmerForm, ExperiencedFarmerForm, 
    Home, LanguageSelectionScreen, Welcome} from '../../screens';


    console.log("AuthStack", FarmDetails)
       


const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator initialRouteName="Register" screenOptions={{ headerShown: false }}>

            {/* <Stack.Screen name="LanguageSelectionScreen" component={LanguageSelectionScreen} /> */}

            {/* <Stack.Screen name = " Welcome" component={Welcome} /> */}
           
             <Stack.Screen name="Register" component={Register} />

             <Stack.Screen name="FarmDetails" component={FarmDetails} />

             <Stack.Screen name="NewFarmerForm" component={NewFarmerForm} />

             <Stack.Screen name="ExperiencedFarmerForm" component={ExperiencedFarmerForm} />

             <Stack.Screen name="Login" component={Login} />

             <Stack.Screen name ="Home" component={Home} />
            
            
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            
            <Stack.Screen name="OTPScreen" component={OTPScreen} />

            {/* <Stack.Screen name="UserAgreement" component={UserAgreement} />
      
      
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} /> */}
           
        </Stack.Navigator>
    );
};

export default AuthStack;
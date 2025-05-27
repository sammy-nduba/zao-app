import { useContext } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import { colors } from "../../config/theme";
import { onIOS } from "../../config/constants";
import { HeaderHeightContext } from '@react-navigation/elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';




const ScrollableMainContainer = ({ children, style, contentContainerStyle, ...props} ) => {
    
    return (
        <KeyboardAwareScrollView
            behavior = { onIOS ? "padding" : undefined}
            style = {{ flex: 1 }}
            keyboardVerticalOffset = {useContext(HeaderHeightContext) ?? 0} >


                
                <ScrollView 
                style = {[{flex: 1, backgroundColor:  colors.background}, style ]} 
                showsVerticalScrollIndicator = {false}
                contentContainerStyle = {contentContainerStyle}
                {...props}
                >

                     {children}
                     
                </ScrollView>
          
            </KeyboardAwareScrollView>


            
    );
};



export default ScrollableMainContainer;
import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import StyledText from "../Texts/StyledText";
import { colors } from "../../config/theme";


const StyledButton = (children, style, textStyle, icon, onPress, isLoading) => {

    return (
    <TouchableOpacity styles = {[styles.container, style]} onPress={onPress}>

        {isLoading && <ActivityIndicator size = "small" 
        color = {textStyle?.color || 
            colors.onPrimary } 
            /> }

            {!isLoading && <> (
            

        <StyledText styles = {[styles.text, textStyle]}>
            {children}
        </StyledText>
        </>
        }
    </TouchableOpacity>
        
    );
};

const styles  = StyleSheet.create ({
    container : {
        height: 60,
        width: '100%',
        justificationContent: 'center',
        alignItems: 'center',
        backgroundColors: colors.primary,
        borderRadius: 15,


    },
    text: {
        color: colors.onPrimary
    }

})


export default StyledButton;
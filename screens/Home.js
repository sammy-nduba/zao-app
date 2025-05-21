import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StyledText } from '../components';
import { colors } from "../config/theme"


console.log("Home screen logs", StyledText, Text)

export default function APP() {
    return(
        <View style = {styles.container}>
            <StyledText style = {styles.mainText}>
                Zao app
            </StyledText>
        </View>
    );
}


const styles = StyleSheet.create( {
    container: {
        flex: 1,
        backgroundColor: colors.tertiary,
        fontSize: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    mainText: {
        fontSize: 40,
        color:  colors.tint
    }

})
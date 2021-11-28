import React, { useState } from 'react'
import { Text, View, Image, StyleSheet, useWindowDimensions, ScrollView } from 'react-native'

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';

const ForgotPasswordScreen = () => {
    
    const [username, setUsername] = useState('');


    const onSendPressed = () => {
        console.warn("onSendPressed");
    }

    const onResendPress = () => {
        console.warn("onResendPress")
    }
    
    const onSignInPress = () => {
        console.warn("onSignInPress")
    }

    
    
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style= {styles.root}>
                <Text style = {styles.title}>Reset your Password</Text>

            <CustomInput 
                placeholder="username" 
                value={username} 
                setValue={setUsername}/>
            

            <CustomButton text="Send" onPress={onSendPressed} />
        
            <CustomButton
                text="Back to Sign in" 
                onPress={onSignInPress}
                type="TERTIARY"/>
            </View>
            </ScrollView>
        );
    
};

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
    },
    
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color : '#051C60',
        margin: 10,
    },
    text: {
        color:'grey',
        marginVertical: 10,
    },
    link: {
        color:'#FDB075'

    }
})

export default ForgotPasswordScreen

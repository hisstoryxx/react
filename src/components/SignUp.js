import React from 'react';
import {View, Text, Button, TextInput} from 'react-native'

export default function SignUp(props){
    //if(props.authState === 'signUp')
    return (
        <View>
            <Text>SignUp</Text>
            <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth:1}}
                onChangeText={text => console.log(text)}
                value={''}
            />
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth:1}}
            onChangeText={text => console.log(text)}
            value={''}
        />
            <Button
                onPress= {() => props.onStateChange('singIn',{})}
                title = "back to Sign In"
                textColor = 'black'
                accessibilityLabel="back to signIn"
            />
            <Button
                onPress= {() => props.onStateChange('confirmSignUp',{})}
                title = "confirm a code"
                color = ''
                accessibilityLabel="back to confirm code"
            />
        </View>
    );
    //else return <></>;
}
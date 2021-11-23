import React, {useState} from 'react';
import {
    View, 
    Text, 
    Button, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet,
    Dimensions,
    Alert
} from 'react-native';

import { validateEmail } from '../validation';
import { FormStyles } from '../styles/FormStyles';

import {Auth} from 'aws-amplify';




export default function ForgotPassword(props){
    const [state, setState] = useState({
        email: '',
        confirmationCode: '',
        phone: '',
    });
    const [error, setErrors] = useState({
        email: '', 
        
    })

    
    async function onSubmit  ()  {
        const{ confirmationCode : code ,phone: username }= state;
        const emailError = validateEmail(state.email);
        //const passwordError = validatePassword(state.password);
        if(!emailError)
        setErrors({email: emailError});
        else  {
           try  {
               const user = await Auth.forgotPassword(username
            
               );

               // setState({confirmationCode: ''});
               //props.onStateChange('forgotPasswordSubmit');
        }
            catch (error){
                Alert.alert(error.message);
            }
        }
    }

    if(props.authState === 'forgotPassword')
    return (
        <View style = {FormStyles.container}>
            <Text style = {FormStyles.title}>Forgot Password</Text>
            <Text style = {FormStyles.label}>phone number</Text>
            <TextInput
                style={FormStyles.input}
                onChangeText={text => setState({...state, phone: text})}
                placeholder= "Enter email"
                value={state.phone}
            />
            <Text style= {FormStyles.error}>{error.email}</Text>
            
            {/* <Text style= {FormStyles.error}>{error.confirmationCode}</Text> */}
             <TouchableOpacity
                style={FormStyles.button}
                onPress={()=> onSubmit()}>
                <Text style = {FormStyles.buttonText}>Confirm Code</Text>
            </TouchableOpacity>
            
            <View style = { FormStyles.links}>
                <Button
                    onPress= {() => props.onStateChange('singIn',{})}
                    title = "back to Sign In"
                    color = 'black'
                    accessibilityLabel="back to signIn"
                />
                <Button
                    onPress= {() => props.onStateChange('signUp',{})}
                    title = "back to Sign Up"
                    color = 'black'
                    accessibilityLabel="back to Signup"
                />
            </View>
            
        </View>
    );
    else return <></>;
}


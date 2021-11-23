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




export default function ConfirmSignUp(props){
    const [state, setState] = useState({
        email: '',
        confirmationCode: '',
    });
    const [error, setErrors] = useState({
        email: '', 
        
    })

    async function onSubmit  ()  {
        const{email: username, confirmationCode : code} = state;
        const emailError = validateEmail(state.email);
        //const passwordError = validatePassword(state.password);
        if(emailError)
        setErrors({email: emailError});
        else  {
           try  {
               const user = await Auth.confirmSignUp(username,code);

               setState({confirmationCode: ''});
               props.onStateChange('signIn');
        }
            catch (error){
                Alert.alert(error.message);
            }
        }
    }

    if(props.authState === 'confirmSignUp')
    return (
        <View style = {FormStyles.container}>
            <Text style = {FormStyles.title}>Confirm SignUp</Text>
            <Text style = {FormStyles.label}>Email</Text>
            <TextInput
                style={FormStyles.input}
                onChangeText={text => setState({...state, email: text.toLowerCase()})}
                placeholder= "Enter email"
                value={state.email}
            />
            <Text style= {FormStyles.error}>{error.email}</Text>
            <Text style = {FormStyles.label}>Confirmation Code</Text>
            <TextInput
                style={FormStyles.input}
                onChangeText={text => setState({...state, confirmationCode: text})}
                placeholder= "Enter confirmation code"
                value={state.confirmationCode}
            />
            {/* <Text style= {FormStyles.error}>{error.confirmationCode}</Text> */}
             <TouchableOpacity
                style={FormStyles.button}
                onPress={()=> onSubmit()}>
                <Text style = {FormStyles.buttonText}>Confirm Signup</Text>
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


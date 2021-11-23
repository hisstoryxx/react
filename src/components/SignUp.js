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

import { validateEmail, validatePassword } from '../validation';
import { FormStyles } from '../styles/FormStyles';

import {Auth} from 'aws-amplify';




export default function SignUp(props){
    const [state, setState] = useState({
        email: '',
        password: '',
        phone: '',
    });
    const [error, setErrors] = useState({
        email: '', 
        password: '',
        
    })

    async function onSubmit  ()  {

        const{email: username, password : password, phone: phone_number} = state;
        const emailError = validateEmail(state.email);
        const passwordError = validatePassword(state.password);
        if(emailError || passwordError )
        setErrors({email: emailError, password: passwordError})
        else  {
           try  {
               const user = await Auth.signUp({
                username,
                password,
                attributes:{
                    phone_number
                }
            });
            props.onStateChange('confirmSignUp', user);
        }
            catch (error){
                Alert.alert(error.message);
            }
        }
    }

    if(props.authState === 'signUp')
    return (
        <View style = {FormStyles.container}>
            <Text style = {FormStyles.title}>SignUp</Text>
            <Text style = {FormStyles.label}>email</Text>
            <TextInput
                style={FormStyles.input}
                onChangeText={text => setState({...state, email: text.toLowerCase()})}
                placeholder= "Enter email"
                value={state.email}
            />
            <Text style= {FormStyles.error}>{error.email}</Text>
            <Text style = {FormStyles.label}>password</Text>
            <TextInput
                style={FormStyles.input}
                onChangeText={text => setState({...state, password: text})}
                placeholder= "Enter password"
                value={state.password}
                secureTextEntry = {true}
            />
            <TextInput
                style={FormStyles.input}
                onChangeText={text => setState({...state, phone: text})}
                placeholder= "Phone number"
                value={state.phone}
                
            />
            <Text style= {FormStyles.error}>{error.password}</Text>
             <TouchableOpacity
                style={FormStyles.button}
                onPress={()=> onSubmit()}>
                <Text style = {FormStyles.buttonText}>Sign up</Text>
            </TouchableOpacity>
            
            <View style = { FormStyles.links}>
                <Button
                    onPress= {() => props.onStateChange('signIn',{})}
                    title = "back to Sign In"
                    color = 'black'
                    accessibilityLabel="back to signIn"
                />
                <Button
                    onPress= {() => props.onStateChange('confirmSignUp',{})}
                    title = "confirm a code"
                    color = 'black'
                    accessibilityLabel="back to confirm code"
                />
            </View>
            
        </View>
    );
    else return <></>;
}


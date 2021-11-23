import React from 'react';
import {Text,View, StyleSheet, SafeAreaView} from 'react-native';
import Amplify from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { 
  Authenticator, 
  
  SignIn,  
  SignUp,
  ConfirmSignUp,
  ForgotPassword,

  ConfirmSignIn, 
   } from 'aws-amplify-react-native';

// import SignUp from './src/components/SignUp'
// import ConfirmSignUp from './src/components/ConfirmSignUp'
// import ForgotPassword from './src/components/ForgotPassword';


import { render } from 'react-dom';

Amplify.configure(awsconfig);

console.disableYellowBox = true;

const Home = (props) => {
  if (props.authState === 'signedIn')
  
  return <Text>Home</Text>;
  
  else return <></>;
};

const App = () => {


  return(
    
    <View style = {styles.container}>
      <Authenticator 
        
        hideDefault= {true}
        authState='signIn'
        onStateChange={(authState) => console.log('authState', authState)}>

        <Home/>
        <SignUp/>
        <SignIn/>
        <ConfirmSignUp/>
        <ConfirmSignIn/>
        <ForgotPassword/>
      </Authenticator>
    </View>
    
  )
  
}

const styles = StyleSheet.create({
  container : {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})


export default App
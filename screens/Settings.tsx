import { Auth, DataStore } from 'aws-amplify';
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { PRNG, generateKeyPair, encrypt, decrypt } from '../utills/crypto';

const Settings = () => { 

    const logOut = async () => {
        await DataStore.clear()
        Auth.signOut();
    
    };

    const updateKeyPair = async () => { 
        // generate private/public key 
        const {publicKey, secretKey} = generateKeyPair();
        console.log(publicKey, secretKey);

        // save private key to Async storage

        // save public key to UserModel in Datastore 
    };
     
    return(
        <View>
            <Text>Settings</Text>

            <Pressable 
                onPress ={updateKeyPair} 
                style ={{ 
                    backgroundColor : 'white', 
                    margin: 10, height: 50, 
                    borderRadius: 10, 
                    justifyContent: 'center', 
                    alignItems: 'center' }}>
            <Text>Update keypair</Text>
            </Pressable>
            <Pressable 
                onPress ={logOut} 
                style ={{ 
                    backgroundColor : 'white', 
                    margin: 10, height: 50, 
                    borderRadius: 10, 
                    justifyContent: 'center', 
                    alignItems: 'center' }}>
            <Text>Logout</Text>
            </Pressable>
        </View>
    )
}
export default Settings
import { Auth, DataStore } from 'aws-amplify';
import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { PRNG, generateKeyPair, encrypt, decrypt } from '../utills/crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User as UserModel} from '../src/models'

export const PRIVATE_KEY = "PRIVATE_KEY";

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
        await AsyncStorage.setItem(PRIVATE_KEY, secretKey.toString());
        console.log("secret key was saved");

        // save public key to UserModel in Datastore 
        const userData = await Auth.currentAuthenticatedUser();
        const dbUser = await DataStore.query(UserModel, userData.attributes.sub);

        if (!dbUser) {
            Alert.alert("User not found!");
            return;
        }

        await DataStore.save(UserModel.copyOf(dbUser, (updated) => {
            updated.publicKey = publicKey.toString();
        }));

        console.log(dbUser);

        Alert.alert("Successfully updated the keypair.");
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
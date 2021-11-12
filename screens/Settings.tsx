import { Auth, DataStore } from 'aws-amplify';
import React from 'react';
import { View, Text, Pressable } from 'react-native';

const Settings = () => { 

    const logOut = async () => {
        await DataStore.clear()
        Auth.signOut();
    
    };

      
    return(
        <View>
            <Text>Settings</Text>

            <Pressable 
                onPress ={logOut} 
                style ={{ 
                    backgroundColor : 'red', 
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
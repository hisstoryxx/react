import React from 'react';
import { MaterialCommunityIcons} from "@expo/vector-icons";
import { View } from 'react-native';
import styles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const NewMwssageButton = () => {

    const navigation = useNavigation();

    const onPress = () => {
        navigation.navigate('Contacts');

    }
    return (
     
            <View style = {styles.container}>
                <TouchableOpacity onPress = {onPress}>
                    <MaterialCommunityIcons
                        name = "message-reply-text"
                        size = {28}
                        color = "white"
                    />
                </TouchableOpacity>
               </View>
    
    )
}

export default NewMwssageButton;
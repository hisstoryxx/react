import React from 'react';
import { View,
         Text,
         Image, 
         TouchableWithoutFeedback
         } from "react-native"
import { ChatRoom } from '../../types';
import styles from './style';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import Navigation from '../../navigation';

export type ChatListItemProps = {
    chatRoom: ChatRoom;
}

const ChatListItem = (props: ChatListItemProps) => {
    const { chatRoom } = props;
    
    const user = chatRoom.users[1];

    const navigation = useNavigation();

    const onClick = () => {
        // console.warn('Clicked on ${user.name}')
        navigation.navigate('ChatRoom', { 
            id: chatRoom.id,
            name: user.name,
        })
        
    }



    return (
        <TouchableWithoutFeedback onPress={onClick}>
              <View style={styles.container}>
                <View style ={ styles.leftContainer}>
                 <Image source = {{uri: user.imageUri}} style = { styles.avatar}/>  
          
                 <View style={styles.midContainer}>
                    <Text style={styles.username}>{user.name}</Text>
                    <Text style={styles.lastMessage}>{chatRoom.lastMessage.content}</Text>
                 </View>
            </View>

             <Text style = {styles.time}>
                 {moment(chatRoom.lastMessage.createdAt).format("MM/DD/YYYY")}
             </Text>

        </View>

        </TouchableWithoutFeedback>
      
    )
};


export default ChatListItem; 
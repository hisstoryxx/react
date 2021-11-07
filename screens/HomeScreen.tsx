import React, {useState, useEffect} from 'react';

import { Text, Image, View, StyleSheet, FlatList, Pressable } from 'react-native';
import ChatRoomItem from '../components/ChatRoomItem';
import { Auth, DataStore } from 'aws-amplify';
import { ChatRoom, ChatRoomUser } from '../src/models';
import chatRoomsData from '../assets/dummy-data/ChatRooms';

export default function TabOneScreen() {

  const [ chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  useEffect ( () => {
    const fetchChatRooms = async () => {
      const userData = await Auth.currentAuthenticatedUser();

      const chatRooms = (await DataStore.query(ChatRoomUser))
      .filter(chatRoomUser => chatRoomUser.user.id === userData.attributes.sub)
      .map(chatRoomUser => chatRoomUser.chatroom );
      console.log(chatRooms)
    
    setChatRooms(chatRooms);


    };
    fetchChatRooms();
  }, [] );

  const logOut = async () => {
    await DataStore.clear()
    Auth.signOut();

  }

  return (
    <View style={styles.page}>
       <FlatList 
        data={chatRooms}
        renderItem={({ item }) => <ChatRoomItem chatRoom={item} />}
        showsVerticalScrollIndicator={false}
      />
      <Pressable onPress ={logOut} style ={{ backgroundColor : 'red', margin: 10, height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Logout</Text>
      </Pressable>
    </View>
    
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex: 1
  }
});
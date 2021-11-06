import React, { useState, useEffect } from 'react';

import { View, StyleSheet, FlatList, Text, Pressable, SafeAreaView} from 'react-native';
import UserItem from '../components/UserItem';

import Users from '../assets/dummy-data/Users';

import NewGroupButton from '../components/NewGroupButton';
import { useNavigation } from '@react-navigation/native';

import { Auth, DataStore } from 'aws-amplify';
import { ChatRoom, User, ChatRoomUser } from '../src/models';


export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [isNewGroup, setIsNewGroup] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    DataStore.query(User).then(setUsers);
  }, [])

  // useEffect(() => {
  //   // query users
  //   const fetchUsers = async () => {
  //     const fetchedUsers = await DataStore.query(User);
  //     setUsers(fetchedUsers);
  //   };
  //   fetchUsers();
  // }, [])

  const addUserToChatRoom = async (user, chatroom) => {
    DataStore.save(new ChatRoomUser({
      user,
      chatroom,
    })
  )
  }

  const createChatRoom = async (users) => {
    // Create a chat room

    const newChatRoom = await DataStore.save(new ChatRoom({newMessages:0}));

    // connect authenticated user with the chat room
    const authUser = await Auth.currentAuthenticatedUser();
    const dbUser = await DataStore.query(User, authUser.attributes.sub);
    if (dbUser) { 
        await addUserToChatRoom(dbUser, newChatRoom);
     
    }

    // connect clicked user with the chat room 
    await Promise.all(
      users.map(user => addUserToChatRoom(user, newChatRoom))
  );
    
    navigation.navigate('ChatRoom', { id : newChatRoom.id });

  };

  const onUserPress = async (user) => {
    await createChatRoom([user]);
  }

  return (
    
    <SafeAreaView style={styles.page}>
       <FlatList 
        data={users}
        renderItem={({ item }) => <UserItem user={item} onPress ={()=> onUserPress(item)} isSeleted={true}/>}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent = {() => <NewGroupButton onPress ={() => setIsNewGroup(!isNewGroup) }/>}
      />
      {isNewGroup && <Pressable style = {styles.button}>
        <Text style = { styles.buttonText}>Save group</Text>
      </Pressable>}

    </SafeAreaView>
  
  );
}

const styles = StyleSheet.create({
  button:{
    backgroundColor: '#2ef',
    marginHorizontal: 10,
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText:{
    color: "white",
    fontWeight: 'bold'
    
  },
  page: {
    backgroundColor: 'white',
    flex: 1
  }
});
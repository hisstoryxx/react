import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { DataStore } from '@aws-amplify/datastore';
import { User, Message as MessageModel } from '../../src/models';
import { Auth, Storage } from 'aws-amplify';
import { S3Image } from 'aws-amplify-react-native';
import AudioPlayer from '../AudioPlayer';

import { Ionicons } from '@expo/vector-icons';

const blue = '#3777f0';
const grey = 'lightgrey';

const Message = (props) => {
  const [message, setMessage] = useState<MessageModel>(props.message);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isMe, setIsMe] = useState<boolean | null>(null);
  const [soundURI, setSoundURI] = useState<string | any>(null);

  useEffect(() => {
    DataStore.query(User, message.userID).then(setUser);
  }, []);

  useEffect( () => { 
    const subscription = DataStore.observe(MessageModel, message.id).subscribe(msg => {
      if (msg.model === MessageModel && msg.opType === 'UPDATE'){
        setMessage((message) => ({...message, ...msg.element}));
      }
    }); // Real time 
    
    return () => subscription.unsubscribe();
  }, []);

  useEffect(()=> {
    setAsRead();
  },[isMe, message]);

  useEffect(() => {
    if (message.audio) {
      Storage.get(message.audio).then(setSoundURI);
    }
  }, [message]);

  useEffect(() => {
    const checkIfMe = async () => {
      if (!user) {
        return;
      }
      const authUser = await Auth.currentAuthenticatedUser();
      setIsMe(user.id === authUser.attributes.sub)
    }
    checkIfMe();
  }, [user]);

  const setAsRead = async () => { 
    if (isMe === false && message.status !== "READ"){
      await DataStore.save(MessageModel.copyOf(message, (updated) => {
        updated.status = "READ"
      }));
    }
  }



  if (!user) {
    return < ActivityIndicator />
  }


  return (
    <View
      style={[
        styles.container,
        isMe ? styles.rightContainer : styles.leftContainer,
        { width: soundURI ? '75%' : 'auto' }
      ]}
    >
      {message.image && (
        <View style={{ marginBottom: message.content ? 10 : 0 }} >
          <S3Image
            imgKey={message.image}
            style={{ width: "100%", aspectRatio: 4 / 3 }}
            resizeMode="contain"
          />
        </View>
      )}
      {soundURI && (<AudioPlayer soundURI={soundURI} />)}
      {!!message.content && (
        <Text style={{ color: isMe ? 'black' : 'white' }}>
          {message.content} 
        </Text>
      )}

    {isMe && !!message.status && message.status !== "SENT"  && ( 
          <Ionicons  
            name={message.status === 'DELIVERED' ? "checkmark" : "checkmark-done"} 
            size={16} 
            color="gray" 
            style = {{ marginHorizontal: 5}} />) }
            
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    maxWidth: '75%',
    flexDirection: 'row',
    alignItems: "flex-end"
  },
  leftContainer: {
    backgroundColor: blue,
    marginLeft: 10,
    marginRight: 'auto'
  },
  rightContainer: {
    backgroundColor: grey,
    marginLeft: 'auto',
    marginRight: 10,
  }
});

export default Message;

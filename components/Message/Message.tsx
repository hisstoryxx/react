import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { DataStore } from '@aws-amplify/datastore';
import { User } from '../../src/models';
import { Auth }  from 'aws-amplify';
import { S3Image } from 'aws-amplify-react-native';

const blue = '#3777f0';
const grey = 'lightgrey';

const Message = ({ message }) => {
  const [user, setUser] = useState<User|undefined>(undefined);
  const [isMe, setIsMe] = useState<boolean>(false);

  useEffect(( ) => {
    DataStore.query(User, message.userID).then(setUser);
  }, []);

  useEffect( () => {
    const checkIfMe = async () => {
      if (!user) {
        return;
      }
      const authUser = await Auth.currentAuthenticatedUser();
      setIsMe(user.id === authUser.attributes.sub)
    }
    checkIfMe();
  },[user])

  if (!user) {
    return < ActivityIndicator /> 
  }

  
  return (
    <View 
      style={[
          styles.container, 
          isMe ? styles.rightContainer : styles.leftContainer
          ]}
        >
          {message.image && (
            <View style = {{ marginBottom: 10}} >
              <S3Image 
                imgKey = {message.image} 
                style = {{width: "100%", aspectRatio: 4/3}}
                resizeMode = "contain"
                />
            </View>
            
          )}
      <Text style={{ color: isMe ? 'black' : 'white'}}>{message.content}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    maxWidth: '75%',
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

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform,
  Image, 
} from 'react-native';
import { SimpleLineIcons, Feather, MaterialCommunityIcons, AntDesign, Ionicons } from '@expo/vector-icons'; 
import { DataStore } from '@aws-amplify/datastore'
import { Message, ChatRoom } from '../../src/models';
import { Auth, Storage} from 'aws-amplify';
import EmojiSelector from 'react-native-emoji-selector';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { ScreenStackHeaderBackButtonImage } from 'react-native-screens';

const MessageInput = ({chatRoom}) => {
  const [message, setMessage] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [image, setImage] = useState<string|null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const libraryResponse = 
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        const photoResponse = await ImagePicker.requestCameraPermissionsAsync();
      
      
        if (
          libraryResponse.status !== 'granted'  || 
          photoResponse.status !== 'granted' 
          ) {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);


  const sendMessage = async () => {
    // send message
    const user = await Auth.currentAuthenticatedUser();
    const newMessage = await DataStore.save(new Message({
      content: message,
      userID: user.attributes.sub,
      chatroomID: chatRoom.id,
    }))

    updateLastMessage(newMessage);

    setMessage("");
    setIsEmojiPickerOpen(false);
  }

  const updateLastMessage = async (newMessage) => { 
    DataStore.save(ChatRoom.copyOf(chatRoom, updatedChatRoom => {
      updatedChatRoom.LastMessage = newMessage;
    }))
  }

  const onPlusClicked = () => {
    console.warn("On plus clicked");
  }

  const onPress = () => {
    if (image) { 
      sendImage();
    } else if (message) {
      sendMessage();
    } else {
      onPlusClicked();
    }
  }

  // Image picker

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const sendImage = async () => { 
    if(!image) { 
      return;
    }
    const blob = await getImageBlob();
    await Storage.put("test.png", blob);
  };

  const getImageBlob = async () => {
    if(!image) {
      return null;
    };

    const respone = await fetch(image);
    const blob = await respone.blob();
    return blob;
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.root, {height: isEmojiPickerOpen ? "50%" : "auto"}]} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      {image &&(
        <View style= {styles.sendImageConatainer}>
          <Image 
            source = {{ uri: image}} 
            style ={{width: 100, height: 100, borderRadius:10, }} />

          <Pressable onPress ={ () => setImage(null)}>
            <FontAwesome 
              name="close" 
              size={24} 
              color="black" 
              style={{ margin: 5}} 
            />
          </Pressable>
        </View>
      )}

      <View style = {styles.row}>
      <View style={styles.inputContainer}>
        <Pressable
          onPress ={ () => setIsEmojiPickerOpen((currentValue) => !currentValue)
          }
        >
          <SimpleLineIcons 
            name="emotsmile" 
            size={24} 
            color="#595959" 
            style={styles.icon} 
          />
        </Pressable>
        
        
        <TextInput 
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Signal message..."
        />

        <Pressable onPress={ pickImage} >
          <Feather 
            name="image" 
            size={24} 
            color="#595959" 
            style={styles.icon} 
          />
        </Pressable>
        
        <Pressable onPress = {takePhoto}>
          <Feather 
            name="camera" 
            size={24} 
            color="#595959" 
            style={styles.icon} 
          />
        </Pressable>
        

        <MaterialCommunityIcons 
          name="microphone-outline" 
          size={24} 
          color="#595959" 
          style={styles.icon} 
        />

      </View>


      <Pressable onPress={onPress} style={styles.buttonContainer}>
        {message || image ? <Ionicons name="send" size={18} color="white" /> : <AntDesign name="plus" size={24} color="white" />}
      </Pressable>

      </View>
      

      {isEmojiPickerOpen&& (
      <EmojiSelector 
        onEmojiSelected={emoji => setMessage(currentMessage => currentMessage + emoji)} 
        columns={8}
      />
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: {
    padding: 10,
  },
  row: { 
    flexDirection: 'row',

  },
  inputContainer: {
    backgroundColor: '#f2f2f2',
    flex: 1,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#dedede',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
  },
  icon: {
    marginHorizontal: 5,
  },
  buttonContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#3777f0',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 35,
  },
  sendImageConatainer: { 
    flexDirection: 'row',
    marginVertical: 10, 
    alignSelf: "stretch",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 10,
  },
});

export default MessageInput

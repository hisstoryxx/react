import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import{
  Auth,
  API,
  graphqlOperation,

} from 'aws-amplify';
import { getUser } from './src/graphql/queries';
import { createUser } from './src/graphql/mutations';

import { withAuthenticator } from 'aws-amplify-react-native'
import Amplify from 'aws-amplify'
import config from './src/aws-exports'
import { useEffect } from 'react';
Amplify.configure(config)

const randomImages = [
  'https://hieumobile.com/wp-content/uploads/avatar-among-us-2.jpg',
  'https://hieumobile.com/wp-content/uploads/avatar-among-us-3.jpg',
  'https://hieumobile.com/wp-content/uploads/avatar-among-us-6.jpg',
]


function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const getRandomImage = () => {
    return randomImages[Math.floor(Math.random() * randomImages.length)];

  }

  //run this snippet only when App is first mounted
  useEffect( ()=> {
    const fetchUser = async () =>{
      // get Authenticated user from Auth
      const userInfo = await Auth.currentAuthenticatedUser({bypassCache: true});
      console.log(userInfo);

      if (userInfo) {
        // get the user from Bacend with the user SUB from Auth
        const userData = await API.graphql(
          graphqlOperation(
            getUser,
            {id: userInfo.attributes.sub}
            )
        )


        if (userData.data.getUser) {
          console.log("User is already registed in database");
          return;
        }

        const newUser = {
          id: userInfo.attributes.sub,
          name: userInfo.username,
          imageUri: getRandomImage(),
          status: 'Hey, I am using WhatsApp',


        }

      console.log(newUser);

        await API.graphql(
          graphqlOperation(
            createUser,
            {input: newUser},

          )
        )

      }

      // if there is no user in DB with the id, then create one
    }

    fetchUser();
  }, [])

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}


export default withAuthenticator(App)
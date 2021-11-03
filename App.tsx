import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Amplify, { Auth, DataStore, Hub } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native';
import config from './src/aws-exports';
import { Message } from './src/models';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer'])

Amplify.configure(config);

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  useEffect(()=> {
    // Create listener
    console.log("registering listener")
  const listener = Hub.listen('datastore', async hubData => {
    const  { event, data } = hubData.payload;
    if (event === 'outboxMutationProcessed' 
      && data.model === Message 
      && !["DELIVERED", "READ"].includes(data.element.status)){
        // set the message status to delivered
        DataStore.save(
          Message.copyOf(data.element, (updated) => {
            updated.status = "DELIVERED";
          })
        );
      }
    });

// Remove listener
  return () => listener();

  }, []);

  Auth.currentAuthenticatedUser().then(console.log);



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

export default withAuthenticator(App);

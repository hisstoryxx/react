import React from 'react'
import { StatusBar, ScrollView } from 'react-native'
import Amplify from 'aws-amplify'
import { Authenticator } from 'aws-amplify-react-native'
import config from './src/aws-exports'

import { AmplifyTheme } from './src/components'

Amplify.configure({
  ...config,
  Analytics: {
    disabled: true
  }
})

const signUpConfig = {
    hideAllDefaults: true,
    signUpFields: [
      {
        label: 'Email',
        key: 'email',
        required: true,
        displayOrder: 1,
        type: 'string',
      },
      {
        label: 'Password',
        key: 'password',
        required: true,
        displayOrder: 2,
        type: 'password',
      },
    ],
  }
  


const App = () => {
  return (
    <>
    <ScrollView>
      <StatusBar barStyle="dark-content" />
      <Authenticator usernameAttributes="email" signUpConfig={signUpConfig} theme = {AmplifyTheme}  />
    </ScrollView>
    </>
  )
}

export default App


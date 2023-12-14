import { View, Text } from 'react-native'
import React from 'react'
import { Login, Onboarding, Splash,Register } from '../screens/index';
import VideoStreaming from '../screens/DetectionScreen/VideoStreaming';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


export default function AuthNavigator() {
  const AuthStack = createNativeStackNavigator();
  return (
    <AuthStack.Navigator
      initialRouteName="splashScreen"
    >

      <AuthStack.Screen
        name='splashScreen'
        component={Splash}
        options={{ headerShown: false }}
      >
      </AuthStack.Screen>

      <AuthStack.Screen
        name='OnboardingScreen'
        component={Onboarding}
        options={{ headerShown: false }}
      >
      </AuthStack.Screen>



      <AuthStack.Screen
        name='LoginScreen'
        component={Login}
        options={{ headerShown: false }}
      >
      </AuthStack.Screen>


      <AuthStack.Screen
        name='RegisterScreen'
        component={Register}
        options={{ headerShown: false }}
      >
      </AuthStack.Screen>


      {/* <AuthStack.Screen
        name='StreamVideo'
        component={VideoStreaming}
        options={{ headerShown: false }}
      >
      </AuthStack.Screen> */}

    </AuthStack.Navigator>
  )
}
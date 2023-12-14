import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import AppNavidationContainer from './src/navigations';
// import 'react-native-worklets-core';
import { ToastProvider } from 'react-native-toast-notifications'



export default function App() {
  return (
    <ToastProvider
    placement="bottom"
    duration={3500}
    animationType='slide-in'
    animationDuration={250}
    textStyle={{ fontSize: 20 }}
    offset={50} // offset for both top and bottom toasts
    offsetTop={30}
    offsetBottom={40}
    swipeEnabled={true}
    >
      <AppNavidationContainer />
    </ToastProvider>
  );
}
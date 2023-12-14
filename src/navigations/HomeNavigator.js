import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VideoStreaming from '../screens/DetectionScreen/VideoStreaming';
import HomeScreen from '../screens/HomeScreen/HomeScreen';

const HomeNavigator = () => {

    const HomeStack = createNativeStackNavigator();

    return (
        <HomeStack.Navigator
            initialRouteName="HomeScreen"
        >

            <HomeStack.Screen
                name='HomeScreen'
                component={HomeScreen}
                options={{ headerShown: false }}
            >
            </HomeStack.Screen>

        </HomeStack.Navigator>
    );
}

const styles = StyleSheet.create({})

export default HomeNavigator;

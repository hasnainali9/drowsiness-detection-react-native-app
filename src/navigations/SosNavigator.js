import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import Sos from '../screens/Sos/Sos';
import AddSos from '../screens/Sos/AddSos';
import EditSos from '../screens/Sos/EditSos';

const SosNavigator = () => {
    const SosStack = createNativeStackNavigator();

    return (
        <SosStack.Navigator
            initialRouteName="Sos"
        >
            <SosStack.Screen
                name='Sos'
                component={Sos}
                options={{ headerShown: false }}
            >
            </SosStack.Screen>

            <SosStack.Screen
                name='AddSos'
                component={AddSos}
                options={{ headerShown: false }}
            >
            </SosStack.Screen>

            <SosStack.Screen
                name='EditSos'
                component={EditSos}
                options={{ headerShown: false }}
            >
            </SosStack.Screen>

        </SosStack.Navigator>
    );
}

const styles = StyleSheet.create({})

export default SosNavigator;

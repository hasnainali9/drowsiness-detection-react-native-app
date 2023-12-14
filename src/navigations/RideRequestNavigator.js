import React from 'react';
import {View, StyleSheet} from 'react-native';
import RideRequestList from '../screens/RideRequest/RideRequestList';
import RideScreen from '../screens/RideRequest/RideScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateNewRide from '../screens/RideRequest/CreateNewRide';
import ViewRidesRequest from '../screens/RideRequest/ViewRidesRequest';
import ChooseLocation from '../screens/RideRequest/ChooseLocation';
import LiveRideRequest from '../screens/RideRequest/LiveRideRequest';

const RideRequestNavigator = () => {
    const RideRequestStack = createNativeStackNavigator();
    return (
        <RideRequestStack.Navigator
            initialRouteName="RideRequestList"
        >
            <RideRequestStack.Screen
                name='RideRequestList'
                component={RideRequestList}
                options={{ headerShown: false }}
            >
            </RideRequestStack.Screen>


            <RideRequestStack.Screen
                name='ViewRidesRequest'
                component={ViewRidesRequest}
                options={{ headerShown: false }}
            >
            </RideRequestStack.Screen>

            {/* <RideRequestStack.Screen
                name='RideScreen'
                component={RideScreen}
                options={{ headerShown: false }}
            >
            </RideRequestStack.Screen> */}


            <RideRequestStack.Screen
                name='CreateNewRide'
                component={CreateNewRide}
                options={{ headerShown: false }}
            >
            </RideRequestStack.Screen>


            <RideRequestStack.Screen
                name='ChooseLocation'
                component={ChooseLocation}
                options={{ headerShown: false }}
            >
            </RideRequestStack.Screen>

            <RideRequestStack.Screen
                name='LiveRideRequest'
                component={LiveRideRequest}
                options={{ headerShown: false }}
            >
            </RideRequestStack.Screen>

            

        </RideRequestStack.Navigator>
    );
}

const styles = StyleSheet.create({})

export default RideRequestNavigator;

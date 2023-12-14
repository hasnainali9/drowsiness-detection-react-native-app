import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeNavigator from './HomeNavigator';
import { Dimensions } from 'react-native';
import SosNavigator from './SosNavigator';
import RideRequestNavigator from './RideRequestNavigator';
import {Colors} from '../constants/index';
import SettingNavigator from './SettingNavigator';


const BottomNavigator = () => {
    const navigation = useNavigation();
    const Tab = createBottomTabNavigator();
    const HEIGHT = Dimensions.get('window').height;

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'relative', // Typo corrected ('posiotion' to 'position')
                    elevation: 0,
                    backgroundColor: '#FFFFFF',
                },
                tabBarShowLabel: false
            }}
            initialRouteName=''
        >

            <Tab.Screen name='HomeNavigtor' component={HomeNavigator} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                        <Ionicons name="home-sharp" size={30} color={focused ? Colors.primary : Colors.secondary} />
                        <Text
                            style={{
                                color: focused ? Colors.primary : Colors.secondary,
                                fontSize: 1.4,
                                paddingTop: '0.4%'
                            }}>
                            HOME
                        </Text>
                    </View>
                )
            }} />





            <Tab.Screen name='RideRequestNavigator' component={RideRequestNavigator} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                        <Icon name="map-marker" size={30} color={focused ? Colors.primary : Colors.secondary} />
                        <Text
                            style={{
                                color: focused ? Colors.primary : Colors.secondary,
                                fontSize: 1.4,
                                paddingTop: '0.4%'
                            }}>
                            Ride Request
                        </Text>
                    </View>
                )
            }} />


            <Tab.Screen name='SosNavigator' component={SosNavigator} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                        <MaterialIcons name="sos" size={30} color={focused ? Colors.primary : Colors.secondary} />
                        <Text
                            style={{
                                color: focused ? Colors.primary : Colors.secondary,
                                fontSize: 1.4,
                                paddingTop: '0.4%'
                            }}>
                            SOS
                        </Text>
                    </View>
                )
            }} />




            <Tab.Screen name='SettingNavigator' component={SettingNavigator} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                        <Ionicons name="settings" size={30} color={focused ? Colors.primary : Colors.secondary} />
                        <Text
                            style={{
                                color: focused ? Colors.primary : Colors.secondary,
                                fontSize: 1.4,
                                paddingTop: '0.4%'
                            }}>
                            Settings
                        </Text>
                    </View>
                )
            }} />


        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({})

export default BottomNavigator;

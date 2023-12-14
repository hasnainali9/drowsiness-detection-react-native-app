import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import SettingScreen from '../screens/SettingScreens/SettingScreen';
import AppSettingScreen from '../screens/SettingScreens/AppSettingScreen';
import ProfileSettings from '../screens/SettingScreens/ProfileSettings';
import PasswordSettings from '../screens/SettingScreens/PasswordSettings';
import FAQS from '../screens/SettingScreens/FAQS';
import AboutUs from '../screens/SettingScreens/AboutUs';
import TermsCondition from '../screens/SettingScreens/TermsCondition';
import PrivacyPolicy from '../screens/SettingScreens/PrivacyPolicy';

const SettingNavigator = () => {
    const SettingStack = createNativeStackNavigator();

    return (
        <SettingStack.Navigator
            initialRouteName="Settings"
        >
            <SettingStack.Screen
                name='Settings'
                component={SettingScreen}
                options={{ headerShown: false }}
            >
            </SettingStack.Screen>



            <SettingStack.Screen
                name='AppSettings'
                component={AppSettingScreen}
                options={{ headerShown: false }}
            >
            </SettingStack.Screen>


            <SettingStack.Screen
                name='ProfileSettings'
                component={ProfileSettings}
                options={{ headerShown: false }}
            >
            </SettingStack.Screen>


            <SettingStack.Screen
                name='PasswordSettings'
                component={PasswordSettings}
                options={{ headerShown: false }}
            >
            </SettingStack.Screen>


            <SettingStack.Screen
                name='AboutUs'
                component={AboutUs}
                options={{ headerShown: false }}
            >
            </SettingStack.Screen>



            <SettingStack.Screen
                name='TermsCondition'
                component={TermsCondition}
                options={{ headerShown: false }}
            >
            </SettingStack.Screen>


            <SettingStack.Screen
                name='PrivacyPolicy'
                component={PrivacyPolicy}
                options={{ headerShown: false }}
            >
            </SettingStack.Screen>


            <SettingStack.Screen
                name='FAQS'
                component={FAQS}
                options={{ headerShown: false }}
            >
            </SettingStack.Screen>

            
            

        </SettingStack.Navigator>
    );
}

const styles = StyleSheet.create({})

export default SettingNavigator;

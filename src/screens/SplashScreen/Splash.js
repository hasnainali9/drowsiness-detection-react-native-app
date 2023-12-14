import React from 'react'
import { StyleSheet, Text, View,StatusBar,Image } from 'react-native'
import {Colors} from '../../constants/index'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Splash = () => {
    const navigation=useNavigation();

    setTimeout(async ()=>{

        try {
            const firstTimeUser = await AsyncStorage.getItem('firstTimeUser');
            if (firstTimeUser === 'false') {
                navigation.navigate('LoginScreen');
            }else{
                navigation.navigate('OnboardingScreen');
            }
        } catch (error) {
            console.error('Error reading firstTimeUser:', error);
        }
    },3000)
    return (
        <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center',backgroundColor:Colors.white}} >
            <StatusBar barStyle="light-content" hidden={false} backgroundColor="#465bd8" />
            <Image source={require('../../assets/images/icon.png')} style={{width:250,height:250}}  />    
            {/* <Text style={{fontFamily:'OpenSans-Bold',fontSize:30,color:Colors.white}} >Nuntium</Text> */}
        </View>
    )
}

export default Splash

const styles = StyleSheet.create({})

import { NavigationContainer, useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { StyleSheet, Text, View,StatusBar,Image,ImageBackground,TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import {Colors} from '../../constants/index'
import Buttons from '../../components/Buttons'


const Onboarding = () => {
    const navigation= useNavigation();

    const saveFirstTimeUser = async () => {
        try {
            // Use AsyncStorage to save a value indicating that the app has been run for the first time
            await AsyncStorage.setItem('firstTimeUser', 'false');
        } catch (error) {
            console.error('Error saving firstTimeUser:', error);
        }
    };


    const handleGetStarted = () => {
        saveFirstTimeUser();
        navigation.navigate("LoginScreen");
    };



    useEffect(() => {
        // Check if the app is running for the first time when the component mounts
        async function checkFirstTimeUser() {
            try {
                const firstTimeUser = await AsyncStorage.getItem('firstTimeUser');
                if (firstTimeUser === 'false') {
                    navigation.navigate('Login');
                }
            } catch (error) {
                console.error('Error reading firstTimeUser:', error);
            }
        }

        checkFirstTimeUser();
    }, []);



    return (
        <View style={{flex:1,backgroundColor:Colors.white}} >
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            {/* handshake image */}
            <View style={{flex:3,flexDirection:"column",backgroundColor:'#ddd'}} >
                <ImageBackground source={require('../../assets/images/handshake.png')}
                style={{flex:1,width:'100%',backgroundColor:'#fff'}}  />
            </View>

            {/* button and text */}
            <View style={{flex:2,backgroundColor:'#fff'}} >
                {/* Text part */}
                <View style={{flex:1,flexDirection:'column',justifyContent:'flex-start',alignItems:'center',backgroundColor:'#fff'}} >
                    <Text style={{fontFamily:'OpenSans-Bold',color:Colors.black,fontSize:30}} >Nuntium</Text>
                    <Text style={{maxWidth:'50%', fontFamily:'OpenSans-Medium',color:"#999",fontSize:14, textAlign:'center',paddingTop:10}} >All new in one place, be the first to know last new</Text>
                </View>   

                {/* Button */}
                <View style={{flex:1,flexDirection:'column',justifyContent:'flex-end',alignItems:'center'}} >
                    {/* <TouchableOpacity style={{justifyContent:'center',width:'90%',backgroundColor:Colors.primary,height:50,marginBottom:30,borderRadius:10}} 
                    onPress={()=>navigation.navigate("Login")}
                    >
                        <Text style={{fontSize:15,letterSpacing:1.5,textAlign:'center',position:'relative',fontFamily:'OpenSans-SemiBold',color:Colors.white}} >Get Started</Text>


                    </TouchableOpacity> */}
                    <Buttons btn_text={"Get Started"} on_press={handleGetStarted} />
                    
                    

                </View>

            </View>
            
        </View>
    )
}

export default Onboarding

const styles = StyleSheet.create({})

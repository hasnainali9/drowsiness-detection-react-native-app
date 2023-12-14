import React,{useState} from 'react'
import { StyleSheet, Text, ScrollView,View,StatusBar,Image,TextInput, TouchableOpacity } from 'react-native'
import {Colors} from '../../constants/index'
import Icon from 'react-native-vector-icons/FontAwesome'
import Buttons from '../../components/Buttons'
import { useNavigation } from '@react-navigation/native';
import {SERVER} from './../../constants';
import { useToast } from "react-native-toast-notifications";
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import LoadingIndicator from '../../components/LoadingIndicator'





const Login = () => {
    const navigation= useNavigation();
    const toast = useToast();
    const { signIn } = React.useContext(AuthContext);
    const [loading,setLoading]=useState(false);


    const [formData,setformData] = useState({
        email:'test@gmail.com',
        password:'Hasnainu4@'
    })


    const handleFormSubmit=()=>{
        setLoading(true);
                // Validation logic
        if (!formData.email || !formData.password) {
            toast.show('Please fill in all fields.',{type:'danger'})
            setLoading(false);
            return;
        }
        if(SERVER.DEMO_MODE){
            
            signIn("token");
        }else{
            axios.post(SERVER.LOGIN_URL, formData)
            .then(async (response) => {
              // Handle the response from the server (e.g., show a success message)
              if(response?.data?.success){
                signIn(response?.data?.data?.access_token);
                toast.show('Logged In!',{type:'success'})
              }else{
                toast.show('Logged Fail! Check Login Details or Try again.',{type:'danger'})
              }
              console.log('Form submitted successfully:', response.data);
              
                
            })
            .catch((error) => {
              // Handle any errors that occurred during the request (e.g., display an error message)
              toast.show('Logged Fail! Check Login Details or Try again.',{type:'danger'})
              console.log('Error submitting form:', error);
            }).finally(()=>{
                setLoading(false);
            });
        }

    }




    return (
        <ScrollView style={{flex:1,backgroundColor:'#fff',flexDirection:'column'}}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            {/* login form section */}
            <View style={{flex:2,flexDirection:'column',backgroundColor:'#fff',paddingTop:10,paddingHorizontal:'3%'}} >
                <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}} >
                    <Text style={{fontFamily:'OpenSans-SemiBold',fontSize:30,color:Colors.black}} >Welcome Back</Text>
                    <Image source={require('../../assets/images/waving_hand.png')} style={{width:30,height:30}}  />
                </View>
                <Text style={{fontFamily:"OpenSans-Regular",fontSize:14,paddingTop:10,color:"#777"}} >I am happy to see you again. You can continue where you left off by logging in</Text>

                <View style={{flexDirection:'column',paddingTop:20}} >
                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#ededed',width:'95%',borderRadius:10,height:60,paddingLeft:20}} >
                        <Icon name="envelope-o" size={22} color="#818181" />
                        <TextInput value={formData.email} onChangeText={(text)=>{setformData((prevState)=>({...prevState,email:text}))}} style={styles.input} placeholder="Enter Email" placeholderTextColor="#818181" />

                    </View>

                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#ededed',width:'95%',borderRadius:10,height:60,paddingLeft:20,marginTop:20}} >
                        <Icon name="lock" size={22} color="#818181" />
                        <TextInput value={formData.password} onChangeText={(text)=>{setformData((prevState)=>({...prevState,password:text}))}} style={styles.input} placeholder="Enter Password" secureTextEntry={true} placeholderTextColor="#818181" />
                    </View>

                    <View style={{width:'95%',marginBottom:10}} >
                        <Text style={{fontSize:17,fontFamily:'OpenSans-SemiBold',
                    color:'#818181',alignSelf:'flex-end',paddingTop:10}} >Forgot Password?</Text>
                    </View>

                    <Buttons  btn_text={"Sign In"} on_press={handleFormSubmit} />
                </View>
            </View>

            {/* social login section */}
            <View style={{flex:2,backgroundColor:'#fff',flexDirection:'column',paddingHorizontal:'3%'}} >
                <Text style={{fontFamily:"OpenSans-Bold",textAlign:'center',marginVertical:35,color:'#818181',fontSize:20}} >Or</Text>

                {/* <View style={{flexDirection:'column',alignItems:'center',width:'95%'}} >
                    <TouchableOpacity onPress={()=>console.log("google login")} style={styles.social_btn} >
                        <Image style={styles.social_img} source={require('../../assets/images/google_icon.png')} />
                        <Text style={{width:'80%',textAlign:'center',fontSize:16,fontFamily:'OpenSans-Medium'}} >Sign in with Google </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>console.log("facebook login")} style={styles.social_btn} >
                        <Image style={styles.social_img} source={require('../../assets/images/facebook_icon.png')} />
                        <Text style={{width:'80%',textAlign:'center',fontSize:16,fontFamily:'OpenSans-Medium'}} >Sign in with Facebook </Text>
                    </TouchableOpacity>
                </View> */}
                
                <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'flex-end',backgroundColor:'#fff',marginBottom:40}} >
                    <Text style={{fontFamily:'OpenSans-Medium',fontSize:17,color:'#818181'}} >Don't have a account? </Text>
                    <TouchableOpacity  onPress={()=>{
                            navigation.navigate('RegisterScreen')
                    }} >
                        <Text style={{fontSize:18,fontFamily:'OpenSans-SemiBold',color:'#333'}}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
                 
                

            </View>
            <LoadingIndicator isLoading={loading}/>
            
        </ScrollView>
    )
}

export default Login

const styles = StyleSheet.create({
    input:{
        position:'relative',
        height:'100%',
        width:'90%',
        fontFamily:'OpenSans-Medium',
        paddingLeft:20,
        color:'#000000'
    },
    social_btn:{
        height:55,
        width:'100%',
        borderWidth:1,
        borderRadius:10,
        borderColor:'#ddd',
        flexDirection:'row',
        alignItems:'center',
        marginBottom:20
    },
    social_img:{
        width:25,
        height:25,
        marginLeft:15
    }
})

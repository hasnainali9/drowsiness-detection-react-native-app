import React, { useState } from 'react'
import { StyleSheet, Text, ScrollView, View, StatusBar, Image, TextInput, TouchableOpacity } from 'react-native'
import { Colors, SERVER } from '../../constants/index'
import Icon from 'react-native-vector-icons/FontAwesome'
import Buttons from '../../components/Buttons'
import { useNavigation } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications'
import axios from 'axios'
import LoadingIndicator from '../../components/LoadingIndicator'




const Register = () => {
    const navigation = useNavigation();
    const toast=useToast();
    const [loading,setLoading]=useState(false);

    const [formData, setformData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })


    const handleFormSubmit = () => {
        setLoading(true);
        // Validation logic
        if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation) {
            toast.show('Please fill in all fields.', { type: 'danger' })
            setLoading(false);
            return;
        }
        if (SERVER.DEMO_MODE) {
            setLoading(false);
            signIn("token");
        } else {
            axios.post(SERVER.SIGNUP_URL, formData)
                .then(async (response) => {
                    // Handle the response from the server (e.g., show a success message)
                    if (response?.data?.success) {
                        setformData({
                            name: '',
                            email: '',
                            password: '',
                            password_confirmation: ''
                        });
                        toast.show('Sign Up Successful!', { type: 'success' })
                    } else {
                        toast.show('There is an issue while creating account. Try again later.', { type: 'danger' })
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.status === 422) {
                        const errorMessage = error.response.data.message || "Validation failed.";
                        const emailError = error.response.data.errors && error.response.data.errors.email
                            ? error.response.data.errors.email[0]
                            : "";
                
                        if (emailError) {
                            toast.show(emailError, { type: 'danger' });
                        } else {
                            toast.show(errorMessage, { type: 'danger' });
                        }
                    } else {
                        console.error('Error submitting form:', error);
                    }
                }).finally(()=>{
                    setLoading(false);
                });
        }

    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff', flexDirection: 'column' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            {/* login form section */}
            <View style={{ flex: 2, flexDirection: 'column', backgroundColor: '#fff', paddingTop: 10, paddingHorizontal: '3%' }} >
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} >
                    <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 30, color: Colors.black }} >Create Your Account</Text>
                </View>
                <Text style={{ fontFamily: "OpenSans-Regular", fontSize: 14, paddingTop: 10, color: "#777" }} >Only Account For all your Safety Measures.</Text>

                <View style={{ flexDirection: 'column', paddingTop: 20 }} >
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ededed', width: '95%', borderRadius: 10, height: 60, paddingLeft: 20 }} >
                        <Icon name="user-o" size={22} color="#818181" />
                        <TextInput value={formData.name} onChangeText={(text) => { setformData((prevState) => ({ ...prevState, name: text })) }} style={styles.input} placeholder="Enter Full Name" placeholderTextColor="#818181" />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ededed', width: '95%', borderRadius: 10, height: 60, paddingLeft: 20, marginTop: 20 }} >
                        <Icon name="envelope-o" size={22} color="#818181" />
                        <TextInput value={formData.email} onChangeText={(text) => { setformData((prevState) => ({ ...prevState, email: text })) }} style={styles.input} placeholder="Enter Email" placeholderTextColor="#818181" />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ededed', width: '95%', borderRadius: 10, height: 60, paddingLeft: 20, marginTop: 20 }} >
                        <Icon name="lock" size={22} color="#818181" />
                        <TextInput value={formData.password} onChangeText={(text) => { setformData((prevState) => ({ ...prevState, password: text })) }} style={styles.input} placeholder="Enter Password" secureTextEntry={true} placeholderTextColor="#818181" />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ededed', width: '95%', borderRadius: 10, height: 60, paddingLeft: 20, marginTop: 20 }} >
                        <Icon name="lock" size={22} color="#818181" />
                        <TextInput value={formData.password_confirmation} onChangeText={(text) => { setformData((prevState) => ({ ...prevState, password_confirmation: text })) }} style={styles.input} placeholder="Confirm Password" secureTextEntry={true} placeholderTextColor="#818181" />
                    </View>

                    <View style={{ marginTop: 20 }} >
                        <Buttons btn_text={"Sign Up"} on_press={handleFormSubmit} />
                    </View>


                </View>
            </View>

            {/* social login section */}
            <View style={{ flex: 2, backgroundColor: '#fff', flexDirection: 'column', paddingHorizontal: '3%' }} >
                <Text style={{ fontFamily: "OpenSans-Bold", textAlign: 'center', marginVertical: 35, color: '#818181', fontSize: 20 }} >Or</Text>

                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', backgroundColor: '#fff', marginBottom: 40 }} >
                    <Text style={{ fontFamily: 'OpenSans-Medium', fontSize: 17, color: '#818181' }} >Already have account? </Text>
                    <TouchableOpacity onPress={() => {
                        navigation.goBack()
                    }} >
                        <Text style={{ fontSize: 18, fontFamily: 'OpenSans-SemiBold', color: '#333' }}>Login Here</Text>
                    </TouchableOpacity>
                </View>



            </View>
            <LoadingIndicator isLoading={loading}/>
        </ScrollView>
    )
}

export default Register

const styles = StyleSheet.create({
    input: {
        position: 'relative',
        height: '100%',
        width: '90%',
        fontFamily: 'OpenSans-Medium',
        paddingLeft: 20,
    },
    social_btn: {
        height: 55,
        width: '100%',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    social_img: {
        width: 25,
        height: 25,
        marginLeft: 15
    }
})

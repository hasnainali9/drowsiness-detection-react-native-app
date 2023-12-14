import { useRoute } from '@react-navigation/native';
import { Buttons, LoadingIndicator, ScreenHeader } from '../../components/index';
import React, { useState } from 'react';
import { View, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { SERVER } from '../../constants/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ProfileSettings = () => {
    const route = useRoute();
    const { profile } = route.params;
    const [name, setName] = useState(profile?.name);
    const [email, setEmail] = useState(profile?.email);
    const [image, setImage] = useState(null);
    const [loading,setLoading] = useState(false);
    const toast = useToast();

    // Placeholder function for handling image upload
    const handleImageUpload = () => {
        // Implement image upload logic here
    };

    // Placeholder function for handling profile update
    const handleProfileUpdate = async () => {
        // Add your profile update logic here
    
        // Perform validation (you can add more validation based on your requirements)
        if (!name || !email) {
            toast.show('Name and email are required', { type: 'error' });
            return;
        }
        setLoading(true);
        try {
            const accessToken = await AsyncStorage.getItem('token');
            const response = await axios.post(SERVER.UDATE_USER_PROFILE, {
                name,
                email,
                // Add other profile data as needed
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
    
            if (response?.data?.success) {
                setLoading(false);
                toast.show('Profile Updated', { type: 'success' });
            } else {
                setLoading(false);
                toast.show('Error Occurred While Updating Profile.', { type: 'error' });
            }
        } catch (error) {
            setLoading(false);
            console.error('Error submitting form:', error);
            toast.show('Error Occurred While Updating Profile.', { type: 'error' });
        }
    };
    


    return (
        <View>
            <ScreenHeader title={'Profile Settings'} />

            <View style={styles.container}>
                <TouchableOpacity onPress={handleImageUpload}>
                    <Image
                        source={image ? { uri: image } : require('../../assets/images/user.png')}
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType="email-address"
                />
                <Buttons
                    on_press={handleProfileUpdate}
                    btn_text='Update Profile'
                />
            </View>
            <LoadingIndicator isLoading={loading}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 15,
        width: '100%',
    },
});

export default ProfileSettings;

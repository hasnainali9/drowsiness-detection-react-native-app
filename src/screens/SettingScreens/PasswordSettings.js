import Colors from '../../constants/Colors';
import { Buttons, LoadingIndicator, ScreenHeader } from '../../components/index';
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { SERVER } from '../../constants/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useToast } from 'react-native-toast-notifications';

const PasswordSettings = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading,setLoading] = useState(false);
    const toast = useToast();

    const handleUpdatePassword = async () => {
        // Add your password update logic here
        if (newPassword === confirmPassword) {
            
            setLoading(true);
            try {
                const accessToken = await AsyncStorage.getItem('token');
                const response = await axios.post(SERVER.UDATE_USER_PASSWORD_PROFILE,{
                    old_password:oldPassword,
                    new_password:newPassword,
                    new_password_confirmation:confirmPassword
                }, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                if (response?.data?.success) {
                    setLoading(false);
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    toast.show('Password Updated', { type: 'success' });
                } else {
                    toast.show('Error Occured While Updating Password.', { type: 'error' });
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                setLoading(false);
            }
        } else {
            // Display an error message for password mismatch
            toast.show('Passwords do not match', { type: 'error' });
        }
    };

    return (
        <View>
            <ScreenHeader title={'Change Password'} />
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Old Password"
                    secureTextEntry
                    value={oldPassword}
                    onChangeText={setOldPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm New Password"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <Buttons btn_text='Update Password' on_press={handleUpdatePassword} />
            </View>
            <LoadingIndicator isLoading={loading}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,

    },
    input: {
        width:'95%',
        marginLeft:'auto',
        marginRight:'auto',
        borderColor: Colors.border,
        borderWidth: 1.5,
        borderRadius:6,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
});

export default PasswordSettings;

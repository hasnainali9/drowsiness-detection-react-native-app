import { Colors, SERVER } from '../../constants/index';
import ScreenHeader from '../../components/ScreenHeader';
import React, { useRef, useState } from 'react';
import { View, TextInput, Text, Switch, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import LoadingIndicator from '../../components/LoadingIndicator';
import PhoneInput from 'react-native-phone-input'


const AddSos = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [makeCall, setMakeCall] = useState(false);
    const [sendMessage, setSendMessage] = useState(false);
    const toast = useToast();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const phoneInput = useRef(null);

    const handleSubmit = async () => {
        // Basic form validation
        if (!phoneInput.current?.isValidNumber()) {
            console.log('phoneNumber',phoneNumber)
            toast.show('Please enter a valid phone number', { type: 'danger' })
            return;
        }
        setLoading(true);

        try {
            const accessToken = await AsyncStorage.getItem('token');
            const formData = {
                phone_no: phoneInput.current?.getValue(),
                call: makeCall ? 1 : 0,
                message: sendMessage ? 1 : 0,
            };
            const response = await axios.post(SERVER.SOS.CREATE, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (response?.data?.success) {
                setLoading(false);
                toast.show('SOS number added successfully', { type: 'success' })
                navigation.replace('Sos');
            } else {
                toast.show('Error occurred while adding SOS number', { type: 'danger' })
                setLoading(false);
            }
        } catch (error) {
            // Handle any errors that occurred during the request (e.g., display an error message)
            console.error('Error submitting form:', formData);
            setLoading(false);
        }
    };


  
    return (
        <>
            <ScreenHeader
                title={'Add SOS'}
            />
            <View style={styles.container}>
                <PhoneInput
                    ref={phoneInput}
                    style={styles.input}
                    defaultValue={phoneNumber}
                    defaultCode="PK"
                    onValueChange={(text)=>{
                        console.log(text);
                        setPhoneNumber(text);
                    }}
                    withDarkTheme
                    withShadow
                    autoFocus
                />

                <View style={styles.sliderContainer}>
                    <Text style={styles.textTitle}>Make Call:</Text>
                    <Switch
                        value={makeCall}
                        onValueChange={(value) => setMakeCall(value)}
                    />
                </View>
                <View style={styles.sliderContainer}>
                    <Text style={styles.textTitle}>Send Message:</Text>
                    <Switch
                        value={sendMessage}
                        onValueChange={(value) => setSendMessage(value)}
                    />
                </View>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Add SOS No.</Text>
                </TouchableOpacity>
                <LoadingIndicator isLoading={loading} />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: Colors.border,
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
        borderRadius: 8,
        color: '#000000',
    },
    textTitle: {
        color: '#000000',
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: Colors.defaultWhite,
        fontSize: 16,
    },
});

export default AddSos;

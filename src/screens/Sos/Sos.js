import { useNavigation } from '@react-navigation/native';
import ScreenHeader from '../../components/ScreenHeader';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Colors, SERVER } from '../../constants/index';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from "react-native-toast-notifications";
import LoadingIndicator from '../../components/LoadingIndicator';

const Sos = () => {
    const navigation = useNavigation();
    const [sosNumbers, setSosNumbers] = useState([]);
    const toast = useToast();
    const [loading,setLoading]=useState(false);


    const getSOSList = async () => {
        setLoading(true);
        try {
            // Assuming you have the token stored in a variable called 'accessToken'
            const accessToken = await AsyncStorage.getItem('token');


            const response = await axios.get(SERVER.SOS.LIST, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    // Add any other headers as needed
                },
            });

            // Handle the response from the server (e.g., show a success message)
            if (response?.data?.success) {
                setSosNumbers(response?.data?.data);
                setLoading(false);
            } else {
                toast.show('Error Occured While Fetching.', { type: 'error' });
                setLoading(false);
            }

        } catch (error) {
            // Handle any errors that occurred during the request (e.g., display an error message)
            console.error('Error submitting form:', error);
            setLoading(false);
        }
    };





    const handleDeleteSOS = async (sosId) => {
        try {
            const accessToken = await AsyncStorage.getItem('token');

            const response = await axios.delete(`${SERVER.SOS.DELETE}/${sosId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (response?.data?.success) {
                // Refresh the SOS list after successful deletion
                getSOSList();
                toast.show('SOS number deleted successfully', { type: 'success' });
            } else {
                toast.show('Error Occurred While Deleting.', { type: 'error' });
            }
        } catch (error) {
            console.error('Error deleting SOS number:', error);
        }
    };





    useEffect(() => {


        navigation.addListener('focus', () => {
            getSOSList();
        });
    }, [/* dependencies */]);


    return (
        <View style={{ height: '100%' }}>
            <ScreenHeader
                title={'SOS'}
            />

            {/* SOS Numbers List */}
            <ScrollView style={{ paddingHorizontal: 16, marginBottom: '10%' }}>
                {sosNumbers.map((sos) => (
                    <View key={sos.id} style={styles.sosItem}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.phone_no}>{sos.phone_no}</Text>
                            {sos.call?
                                <Ionicons name="call-outline" size={20} color={Colors.primary} style={{ marginLeft: 8 }} />
                            :<></>}
                            {sos.message?
                                <Ionicons name="mail-outline" size={20} color={Colors.primary} style={{ marginLeft: 8 }} />
                            :<></>} 
                        </View>
                        <View style={styles.iconContainer}>
                            {/* Edit Icon */}
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('EditSos', {
                                    sos: sos
                                })
                            }} style={styles.icon}>
                                <Ionicons name="create-outline" size={20} color={Colors.secondary} />
                            </TouchableOpacity>

                            {/* Delete Icon */}
                            {/* Delete Icon */}
                            <TouchableOpacity
                                onPress={() => {
                                    // Show confirmation dialog before deleting
                                    Alert.alert(
                                        'Confirm Deletion',
                                        'Are you sure you want to delete this SOS number?',
                                        [
                                            {
                                                text: 'Cancel',
                                                style: 'cancel',
                                            },
                                            {
                                                text: 'Delete',
                                                onPress: () => handleDeleteSOS(sos.id), // Call a function to handle deletion
                                                style: 'destructive',
                                            },
                                        ],
                                        { cancelable: true }
                                    );
                                }}
                                style={styles.icon}
                            >
                                <Ionicons name="trash-outline" size={20} color={Colors.danger} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>


            {/* Add button */}
            <TouchableOpacity onPress={() => {
                navigation.navigate('AddSos');
            }} style={styles.addButton}>
                <Ionicons name='add' color={Colors.defaultWhite} size={20} />
            </TouchableOpacity>
            <LoadingIndicator isLoading={loading}/>
        </View>
    );
};

const styles = StyleSheet.create({
    addButton: {
        position: 'absolute',
        bottom: 16,
        alignSelf: 'center',
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    addButtonText: {
        color: Colors.defaultWhite,
        fontSize: 16,
    },

    sosItem: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    iconContainer: {
        flexDirection: 'row'
    },
    phone_no: {
        color: '#000000'
    }

});

export default Sos;

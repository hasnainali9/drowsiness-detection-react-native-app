import { useNavigation } from '@react-navigation/native';
import ScreenHeader from '../../components/ScreenHeader';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors, SERVER} from '../../constants/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from 'react-native-toast-notifications';
import axios from 'axios';
import LoadingIndicator from '../../components/LoadingIndicator';

const RideRequestList = () => {
    const navigation = useNavigation();
    const toast = useToast();
    const [rideRequest, setRideRequest] = useState([]);
    const [loading,setLoading]=useState(false);


    const getRideList = async () => {
        setLoading(true);
        try {
            const accessToken = await AsyncStorage.getItem('token');
            const response = await axios.get(SERVER.RideRequest.LIST, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (response?.data?.success) {
                setLoading(false);
                setRideRequest(response?.data?.data);
                if (response?.data?.pending_ride?.status=="pending") {
                    navigation.replace('ChooseLocation', { ride:response?.data?.pending_ride });
                }else if (response?.data?.pending_ride?.status=="started") {
                    navigation.replace('LiveRideRequest', { ride:response?.data?.pending_ride });
                } 
            } else {
                setLoading(false);
                toast.show('Error Occured While Fetching.', { type: 'error' });
            }
        } catch (error) {
            setLoading(false);
            console.error('Error submitting form:', error);
        }
    };

    useEffect(() => {
        navigation.addListener('focus', () => {
            getRideList();
        });
    }, [/* dependencies */]);

    return (
        <View style={{ height: '100%' }}>
            <ScreenHeader
                title={'Rides List'}
            />

            <ScrollView style={{ paddingHorizontal: 16, marginBottom: '10%' }}>
                {rideRequest.map((ride) => (
                    <View key={ride.id} style={styles.rideItem}>
                        <View style={styles.textContainer}>
                            <View style={styles.inlineContainer}>
                                <Text style={styles.sourceText}>Source: </Text>
                                <Text style={styles.destinationText}>{ride.source}</Text>
                            </View>
                            <View style={styles.inlineContainer}>
                                <Text style={styles.sourceText}>Destination: </Text>
                                <Text style={styles.destinationText}>{ride.destination}</Text>
                            </View>
                        </View>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('ViewRidesRequest',{
                                    ride:ride
                                })
                            }} style={styles.icon}>
                                <Ionicons name="arrow-forward-outline" size={20} color={Colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>


            {/* Add button */}
            <TouchableOpacity onPress={() => {
                navigation.navigate('CreateNewRide');
            }} style={styles.addButton}>
                <Ionicons name='add' color={Colors.defaultWhite} size={20} />
                <Text style={{ color:Colors.defaultWhite}}>Create New Ride</Text>
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
        flexDirection: 'row'
    },
    addButtonText: {
        color: Colors.defaultWhite,
        fontSize: 16,
    },

    rideItem: {
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
    textContainer: {
        flex: 1,
    },
    inlineContainer:{
        flexDirection:'row'
    },
    sourceText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color:'#000000',
        maxWidth: '80%',
    },
    destinationText: {
        fontSize: 14,
        color: '#555',
        maxWidth: '80%',
    },

});

export default RideRequestList;


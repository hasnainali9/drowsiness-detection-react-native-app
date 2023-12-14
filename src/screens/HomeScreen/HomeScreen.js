import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER } from '../../constants/index';
import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import LoadingIndicator from '../../components/LoadingIndicator';

const HomeScreen = () => {
    
    const [profile,setProfile]=useState([]);
    const navigation = useNavigation();
    const toast = useToast();
    const [loading,setLoading]=useState(false);


    const getProfile = async () => {
        setLoading(true);
        try {
            const accessToken = await AsyncStorage.getItem('token');
            const response = await axios.get(SERVER.USER_PROFILE, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (response?.data?.success) {
                setLoading(false);
                setProfile(response?.data?.data);
                if (response?.data?.data?.pending_ride?.id) {
                    navigation.navigate('RideRequestNavigator');
                }
                
            } else {
                toast.show('Error Occured While Fetching.', { type: 'error' });
                setLoading(false);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setLoading(false);
        }
    };



    
    useEffect(() => {
        navigation.addListener('focus', () => {
            getProfile();
        });
    }, [/* dependencies */]);



    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome, {profile?.name}!</Text>

            <View style={styles.gridContainer}>
                <TouchableOpacity style={[styles.card, { backgroundColor: '#3498db' }]}>
                    <Text style={styles.cardText}>{profile?.analytics?.no_of_rides??0}</Text>
                    <Text style={styles.cardLabel}>No of Rides</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.card, { backgroundColor: '#e74c3c' }]}>
                    <Text style={styles.cardText}>{profile?.analytics?.total_sos??0}</Text>
                    <Text style={styles.cardLabel}>Total SOS</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.card, { backgroundColor: '#2ecc71' }]}>
                    <Text style={styles.cardText}>{profile?.analytics?.no_of_drownies??0}</Text>
                    <Text style={styles.cardLabel}>No Drownies Detected</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.card, { backgroundColor: '#f39c12' }]}>
                    <Text style={styles.cardText}>{profile?.analytics?.average_detection_rate??0}%</Text>
                    <Text style={styles.cardLabel}>Average Detection Rate</Text>
                </TouchableOpacity>
            </View>
            <LoadingIndicator isLoading={loading}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color:'#000000'
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    card: {
        width: '48%', // Adjust as needed
        height: 150,
        marginVertical: 8,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    cardLabel: {
        fontSize: 16,
        color: 'white',
    },
});

export default HomeScreen;

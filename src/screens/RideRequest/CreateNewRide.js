import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import AddressPickup from '../../components/AddressPickup';
import { useNavigation } from '@react-navigation/native';
import ScreenHeader from '../../components/ScreenHeader';
import { Colors, SERVER } from '../../constants/index';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useToast } from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import LoadingIndicator from '../../components/LoadingIndicator';


const CreateNewRide = () => {
    const [source, setSource] = useState(null);
    const [destination, setDestination] = useState(null);
    const [multipleStops, setMultipleStops] = useState([]);
    const navigation = useNavigation();
    const toast=useToast();
    const [loading,setLoading]=useState(false);



    useEffect(() => {
        // Check and request location permission when the component mounts
        const requestLocationPermission = async () => {
            try {
                const result = await check(
                    Platform.OS === 'ios'
                        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
                );

                if (result === RESULTS.DENIED) {
                    const permissionResult = await request(
                        Platform.OS === 'ios'
                            ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                            : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
                    );
                    if (permissionResult !== RESULTS.GRANTED) {
                        // Handle permission denied
                        console.log('Location permission denied');
                    }
                }

                // Fetch user's current location after permission is granted
                Geolocation.getCurrentPosition(
                    position => {
                        const { latitude, longitude } = position.coords;
                
                        // Reverse geocoding using Google Maps Geocoding API
                        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${SERVER.GOOGLE_MAP_KEY}`;
                        setLoading(true);
                        fetch(apiUrl)
                            .then(response => response.json())
                            .then(data => {
                                if (data.results.length > 0) {
                                    const locationName = data.results[0].formatted_address;
                                    console.log("Location Name:", locationName);
                                    setSource({ latitude, longitude, location:locationName });
                                } else {
                                    setSource({ latitude, longitude, location:'Unknown Place' });
                                }
                            })
                            .catch(error => {
                                console.error("Error fetching reverse geocoding data:", error);
                            }).finally(()=>{
                                setLoading(false);
                            });
                    },
                    error => {
                        console.log(error);
                        // Handle error if location retrieval fails
                    },
                    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
                );
                
            } catch (error) {
                console.log(error);
            }
        };

        requestLocationPermission();
    }, []);





    const handleSourceSelection = (location, details) => {
        var newStop = {
            location:location?.description,
            latitude: details?.geometry?.location?.lat,
            longitude: details?.geometry?.location?.lng,
        }
        setSource(newStop);
    };





    const handleDestinationSelection = (location, details) => {
        var newStop = {
            location:location?.description,
            latitude: details?.geometry?.location?.lat,
            longitude: details?.geometry?.location?.lng,
        }
        setDestination(newStop);
    };


    const handleAddStop = (stop, details) => {
        var newStop = {
            latitude: details?.geometry?.location?.lat,
            longitude: details?.geometry?.location?.lng,
        }
        setMultipleStops([...multipleStops, newStop]);
    };

    const handleRemoveStop = (index) => {
        const updatedStops = [...multipleStops];
        updatedStops.splice(index, 1);
        setMultipleStops(updatedStops);
    };


    const handleSubmit = async () => {
            setLoading(true);
            if (!source) {
                toast.show('Please Select Source Correctly.', { type: 'danger' });
                setLoading(false);
                return;
            }
            if( !destination){
                toast.show('Please Select Destination Correctly.', { type: 'danger' });
                setLoading(false);
                return;
            }

        
            
            try {
                const accessToken = await AsyncStorage.getItem('token');
                const formData = {
                    source:source.location,
                    source_lat:source.latitude,
                    source_long:source.longitude,
                    destination:destination.location,
                    destination_lat:destination.latitude,
                    destination_long:destination.longitude
                };
                const response = await axios.post(SERVER.RideRequest.CREATE, formData, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                if (response?.data?.success) {
                    setLoading(false);
                    toast.show(response?.data?.message, { type: 'success' })
                    navigation.navigate('ChooseLocation', { ride:response?.data?.data });
                } else {
                    setLoading(false);
                    toast.show('Error occurred while adding SOS number', { type: 'danger' })
                }
            } catch (error) {
                setLoading(false);
                // Handle any errors that occurred during the request (e.g., display an error message)
                console.error('Error submitting form:', formData);
            }
            

    };

    return (
        <View keyboardShouldPersistTaps="handled" style={{ height:'100%' }}>
            <ScreenHeader
                title={'Choose Location'}
            />

            <AddressPickup
                placeholder={"Enter Source Location"}
                handleSelection={handleSourceSelection}
                value={source}
            />
            <AddressPickup
                placeholder={"Enter Destination Location"}
                handleSelection={handleDestinationSelection}
                value={destination}
            />
            {multipleStops.map((stop, index) => (
                <AddressPickup
                    key={index}
                    placeholder={`Enter Stop #${index + 1}`}
                    handleSelection={(location) => handleAddStop(location)}
                    value={stop}
                />
            ))}
            {/* <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.addButton} onPress={handleAddStop}>
                    <Text style={styles.btnText}>Add Stop</Text>
                </TouchableOpacity>
                {multipleStops.length > 0 && (
                    <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveStop(multipleStops.length - 1)}>
                        <Text style={styles.btnText}>Remove Last Stop</Text>
                    </TouchableOpacity>
                )}
            </View> */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.btnText}>Confirm Location</Text>
                </TouchableOpacity>
            </View>
            <LoadingIndicator isLoading={loading}/>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        paddingHorizontal: 10
    },
    addButton: {
        flex: 1,
        backgroundColor: Colors.success,
        padding: 10,
        marginHorizontal: 5,
        alignItems: 'center',
        borderRadius: 5,
    },
    removeButton: {
        flex: 1,
        backgroundColor: Colors.danger,
        padding: 10,
        marginHorizontal: 5,
        alignItems: 'center',
        borderRadius: 5,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        padding: 15,
        width: '100%',
        marginVertical: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    btnText: {
        color: Colors.defaultWhite,
    }
});

export default CreateNewRide;


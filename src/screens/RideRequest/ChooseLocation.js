import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import ScreenHeader from '../../components/ScreenHeader';
import { Colors, SERVER } from '../../constants/index';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useToast } from 'react-native-toast-notifications';
import LoadingIndicator from '../../components/LoadingIndicator';

const ChooseLocation = ({ route }) => {
    const mapRef = useRef(null);
    const [source, setSource] = useState();
    const [destination, setDestination] = useState();
    const [rideTime, setRideTime] = useState();
    const [rideDistance, setRideDistance] = useState();
    const [multipleStops, setMultipleStops] = useState([]);
    const [initialRegion, setInitialRegion] = useState(null);

    const navigation = useNavigation();
    const { ride } = route.params;
    const toast=useToast();
    const [loading,setLoading]=useState(false);

    useEffect(() => {
        //     // Retrieve source, destination, and multipleStops from the route parameters
        

        setSource({
            location: ride?.source,
            latitude: ride?.source_lat,
            longitude: ride?.source_long,
        });
        setDestination({
            location: ride?.destination,
            latitude: ride?.destination_lat,
            longitude: ride?.destination_long,
        });
        // setMultipleStops(multipleStops);
    }, [route.params]);

    useEffect(()=>{
        if (mapRef.current && source && destination) {
            const coordinates = [source, destination];
            mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    },[mapRef.current])


    const startRideNow = async () => {

        setLoading(true);
        try {
            const accessToken = await AsyncStorage.getItem('token');
            const formData = {
                _method:'PUT',
                source:source.location,
                source_lat:source.latitude,
                source_long:source.longitude,
                destination:destination.location,
                destination_lat:destination.latitude,
                destination_long:destination.longitude,
                status:'started'
            };
            const response = await axios.post(SERVER.RideRequest.UPDATE+'/'+ride?.id, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (response?.data?.success) {
                setLoading(false);
                toast.show(response?.data?.message, { type: 'success' })
                navigation.navigate('LiveRideRequest', {ride:response?.data?.data});
            } else {
                setLoading(false);
                toast.show('Error occurred while adding SOS number', { type: 'danger' })
            }
        } catch (error) {
            setLoading(false);
            // Handle any errors that occurred during the request (e.g., display an error message)
            console.error('Error submitting form:', error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ScreenHeader title={'Rides List'} />
            <View style={{ flex: 1 }}>
                <MapView
                    ref={mapRef}
                    style={{ flex: 1 }}
                    initialRegion={initialRegion}

                >
                    {source && <Marker coordinate={source} title="Source" />}
                    {destination && <Marker coordinate={destination} title="Destination" />}
                    {multipleStops.map((stop, index) => (
                        <Marker key={index} coordinate={stop} title={`Stop ${index + 1}`} />
                    ))}
                    {source && destination && (
                        <MapViewDirections
                            origin={source}
                            waypoints={multipleStops}
                            destination={destination}
                            apikey={SERVER.GOOGLE_MAP_KEY}
                            strokeWidth={3}
                            strokeColor="hotpink"
                            onReady={result => {
                                setRideDistance(parseFloat(result.distance).toFixed(2));
                                setRideTime(parseFloat(result.duration).toFixed(2));
                                console.log(`Distance: ${result.distance} km`)
                                console.log(`Duration: ${result.duration} min.`)
                            }}
                        />
                    )}
                </MapView>
            </View>
            <View style={styles.bottomCard}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.boldText}>Estimated Travel Time : </Text>
                    <Text>{rideTime} m</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.boldText}>Estimated Travel Distance : </Text>
                    <Text>{rideDistance} km</Text>
                </View>
                <TouchableOpacity style={styles.inputStyle} onPress={startRideNow}>
                    <Text style={styles.inputText}>Start Ride Now</Text>
                </TouchableOpacity>
            </View>
            <LoadingIndicator isLoading={loading}/>

        </View>
    );
};

const styles = StyleSheet.create({
    bottomCard: {
        backgroundColor: 'white',
        width: '100%',
        padding: 30,
        borderTopEndRadius: 24,
        borderTopStartRadius: 24
    },
    boldText: {
        fontWeight: 'bold',
    },
    inputStyle: {
        backgroundColor: Colors.primary,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        paddingVertical: 16,
    },
    inputText: {
        color: Colors.defaultWhite
    }


});

export default ChooseLocation;

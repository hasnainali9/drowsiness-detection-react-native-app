import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, PermissionsAndroid, Platform, Vibration } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import ScreenHeader from '../../components/ScreenHeader';
import { Colors, SERVER } from '../../constants/index';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useToast } from 'react-native-toast-notifications';
import LoadingIndicator from '../../components/LoadingIndicator';
import { CameraType } from 'react-native-camera-kit';

const LiveRideRequest = ({ route }) => {
    const mapRef = useRef(null);
    const [source, setSource] = useState();
    const [destination, setDestination] = useState();
    const [rideTime, setRideTime] = useState();
    const [rideDistance, setRideDistance] = useState();
    const [multipleStops, setMultipleStops] = useState([]);
    const navigation = useNavigation();

    const { hasPermission, requestPermission } = useCameraPermission()
    const { ride } = route.params;
    const [loading,setLoading]=useState(false);



    const cameraRef = useRef(null);
    // const device = useCameraDevice('front');
    const device = useCameraDevice('back', {
        physicalDevices: [
          'ultra-wide-angle-camera',
          'wide-angle-camera',
          'telephoto-camera'
        ]
      });

    const toast=useToast();


    const requestStoragePermission = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission',
                        message: 'This app needs access to your storage to save videos.',
                        buttonPositive: 'OK',
                    }
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Storage permission granted');
                    // Now you can save the vide
                } else {
                    console.log('Storage permission denied');
                }
            } else {
                // Handle permissions for other platforms if needed
                console.log('Not on Android, permission not needed.');
            }
        } catch (error) {
            console.log('Error requesting storage permission:', error);
        }
    };


    const SaveVideo = async (path) => {
        requestStoragePermission();
        console.log('pathpath',path)
        await CameraRoll.save(`file://${path}`, {
            type: 'video',
        });

    }


    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'This app needs access to your location.',
                    buttonPositive: 'OK',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Location permission granted');
            } else {
                console.log('Location permission denied');
            }
        } catch (error) {
            console.error('Error requesting location permission:', error);
        }
    };
    


    const getCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                position => resolve(position),
                error => reject(error),
                {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 1000,
                    showLocationDialog: true, // Prompt user to enable location services
                }
            );
        });
    };
    
    
    const getPlaceNameFromCoordinates = async (latitude, longitude) => {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${SERVER.GOOGLE_MAP_KEY}`);
            const data = await response.json();
    
            // console.log('Geocode API response:', data);
    
            if (data.results.length > 0) {
                const formattedAddress = data.results[0].formatted_address;
                // console.log('Formatted Address:', formattedAddress); // Log the formatted address for debugging
                return formattedAddress;
            } else {
                return 'Unknown Place';
            }
        } catch (error) {
            console.error('Error getting place name:', error);
            return 'Unknown Place';
        }
    };
    


    const CheckDrowniessDetection = async (path) => {
        try {
            const currentLocation = await getCurrentLocation();
    
            const formData = new FormData();
            formData.append('file', {
                uri: `file://${path}`,
                type: 'video/mp4',
                name: 'video.mp4',
            });
            console.log(SERVER.RECORDING_PROCESSING_URL,'Sending MP4 File');
            await axios.post(SERVER.RECORDING_PROCESSING_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(async (res) => {
                if (res.data.drowsy) {
                    const { latitude, longitude } = currentLocation.coords;
                    var placeName =await getPlaceNameFromCoordinates(latitude, longitude);
                    Vibration.vibrate(15 * 1000);
                    toast.show(`Drowsiness detected `, { type: 'warning' });
                    // Send additional information to the server if needed
                    SendSOSRequestToServer(res.data, latitude,longitude, placeName);
                }else{
                    console.log(res);
                }
                console.log(SERVER.RECORDING_PROCESSING_URL,'Sending MP4 File Complete');
            }).catch((error) => {
                console.log('Sending Recording Error',error);
            });
        } catch (error) {
            console.log('Error Sending File:', error);
        }
        console.log(SERVER.RECORDING_PROCESSING_URL,'Sending MP4 File End');
    };
    
   
    
    
    
    const SendSOSRequestToServer = async (output, lat,long, placeName) => {
        try {
            const accessToken = await AsyncStorage.getItem('token');
            const formData = {
                ride_request_id: ride.id,
                place: placeName,
                video:`${SERVER.DETECTION_URL}/${output.video}`,
                image:`${SERVER.DETECTION_URL}/${output.image}`,
                place_lat: lat,
                place_long:long
            };
            console.log('SOSo ',formData)
            const response = await axios.post(SERVER.RideRequest.DETECTION, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (response?.data?.success) {
                toast.show(`SOS Alert Send`, { type: 'danger' });
            } else {
                toast.show('Error occurred while adding SOS number', { type: 'danger' });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    




    useEffect(() => {
        const handleFocus = async () => {
            requestLocationPermission();
            try {
                    // Get drowsinessDetectionTime from AsyncStorage, use 10 seconds if empty
                const drowsinessDetectionTime = await AsyncStorage.getItem('drowsinessDetectionTime');

                // Get videoRecordingTime from AsyncStorage, use 30 seconds if empty
                const videoRecordingTime = await AsyncStorage.getItem('videoRecordingTime');
    
                // Convert times to integers (you might want to parse and validate them)
                const drowsinessDetectionTimeInt = parseInt(drowsinessDetectionTime, 10);
                const videoRecordingTimeInt = parseInt(videoRecordingTime, 10);
    
                // Define your function for video recording
                const startRecording = () => {
                    if (cameraRef?.current != null) {
                        console.log('Recording Triggered');
                        var placeName=getPlaceNameFromCoordinates(33.66071746666667, 73.25625459999999);
                        console.log(placeName)
                        cameraRef.current.startRecording({
                            // flash: 'on',
                            // fileType: 'mpeg',
                            onRecordingFinished: (video) => {
                                const path = video.path;
                                SaveVideo(path);
                                CheckDrowniessDetection(path)
                            },
                            onRecordingError: (error) => console.error(error),
                        });
                    }
                };
    
                const stopRecording = async () => {
                    if (cameraRef?.current != null) {
                        console.log('Function executed after 10 seconds');
                        await cameraRef.current.stopRecording();
                    }
                };
    
                // Set initial timeout to start recording after 10 seconds
                var recordingTimeout = setTimeout(startRecording, 10000);
    
                // Set timeout for the duration of recording (Video Recording Time)
                var recordingDurationTimeout = setTimeout(stopRecording, videoRecordingTimeInt || 30000);
    
                // Set timeout for the drowsiness detection time (wait time between recordings)
                var drowsinessDetectionTimeout = setTimeout(() => {
                    // Call the startRecording function again after drowsiness detection time
                    startRecording();
    
                    // Set the timeout for the next recording duration
                    recordingDurationTimeout = setTimeout(stopRecording, videoRecordingTimeInt || 30000);
                }, drowsinessDetectionTimeInt || 45000);
    
              
            } catch (error) {
                console.error('Error in handleFocus:', error);
            }


            return () => {
                clearTimeout(recordingTimeout);
                clearTimeout(recordingDurationTimeout);
                clearTimeout(drowsinessDetectionTimeout);
            };
            
        };
    
        // Add event listener for focus
        const unsubscribeFocus = navigation.addListener('focus', handleFocus);
    
        // Clean up the event listener if the component is unmounted
        return () => {
            unsubscribeFocus();
        };
    }, [navigation, cameraRef]);
    




    





    useEffect(() => {




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



        if (!hasPermission) {
            // If not granted, request permission
            requestPermission();
            // You may want to handle the case where permission is not granted immediately.
            // For example, show a message to the user or navigate to a different screen.
            return;
        }








       
    }, [route.params]);


    useEffect(() => {
        // Get current location and focus the camera on it
        Geolocation.getCurrentPosition(
            position => {
                if(position?.coords?.longitude){
                const { latitude, longitude } = position.coords;
                mapRef.current.animateToRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                });
            }

                // If you want the camera to follow the user's location, uncomment the following line
                // mapRef.current.followUserLocation(true);
            },
            error => console.log('Error getting current location:', error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
         // Watch for changes in the user's location and update the map
         const watchId = Geolocation.watchPosition(
            position => {
                const { latitude, longitude } = position.coords;
                mapRef.current.animateToRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.0421,
                    longitudeDelta: 0.0421,
                });
                fetchRouteInformation({ latitude, longitude }, destination, multipleStops);
            },
            error => console.log('Error watching position:', error),
            { enableHighAccuracy: true, distanceFilter: 10 } // Adjust the distance filter as needed
        );

        // Clean up the watchPosition when the component is unmounted
        return () => Geolocation.clearWatch(watchId);
    }, [mapRef.current]);



    const fetchRouteInformation = async (origin, destination, waypoints) => {
        try {
            const apiKey = SERVER.GOOGLE_MAP_KEY;
            const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&waypoints=${waypoints
                .map(waypoint => `${waypoint.latitude},${waypoint.longitude}`)
                .join('|')}&key=${apiKey}`;

            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.routes.length > 0) {
                const route = data.routes[0];
                const distance = route.legs.reduce((total, leg) => total + leg.distance.value, 0) / 1000; // Convert meters to kilometers
                const duration = route.legs.reduce((total, leg) => total + leg.duration.value, 0) / 60; // Convert seconds to minutes

                setRideDistance(distance.toFixed(2));
                setRideTime(duration.toFixed(2));
            } else {
                console.error('No routes found');
                return { distance: 0, duration: 0 };
            }
        } catch (error) {
            console.error('Error fetching route information:', error);
            return { distance: 0, duration: 0 };
        }
    };


    const endRideNow = async () => {
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
                status:'ended'
            };
            const response = await axios.post(SERVER.RideRequest.UPDATE+'/'+ride?.id, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (response?.data?.success) {
                setLoading(false);
                toast.show(response?.data?.message, { type: 'success' })
                navigation.replace('RideRequestList');
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
            <View style={{ flex: 1, position: 'relative' }}>
                <MapView
                    ref={mapRef}
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0421,
                        longitudeDelta: 0.0421,
                    }}
                    rotateEnabled={false}
                    showsUserLocation
                    followsUserLocation
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
                {hasPermission ?
                    <Camera
                        ref={cameraRef}
                        style={{
                            height: '30%',
                            width: '40%',
                            position: 'absolute',
                            bottom: 0,
                            right: 0

                        }}
                        video={true}
                        device={device}
                        isActive={true}
                    /> : <></>}
            </View>
            <View style={styles.bottomCard}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.boldText}>Remaining Travel Time : </Text>
                    <Text>{rideTime} m</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.boldText}>Remaining Travel Distance : </Text>
                    <Text>{rideDistance} km</Text>
                </View>
                <TouchableOpacity style={styles.inputStyle} onPress={endRideNow}>
                    <Text style={styles.inputText}>End Ride</Text>
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

export default LiveRideRequest;


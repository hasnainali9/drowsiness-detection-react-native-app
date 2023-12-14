import { SERVER } from '../../constants/index';
import ScreenHeader from '../../components/ScreenHeader';
import React, { useRef } from 'react';
import { View, StyleSheet, Image, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useRoute } from '@react-navigation/native';

const ViewRidesRequest = () => {
  const mapRef = useRef(null);
  const route = useRoute();
  const { ride } = route.params;

  // Dummy source and destination values
  const source = {
    latitude: ride?.source_lat,
    longitude: ride?.source_long,
    address: ride?.source,
  };

  const destination = {
    latitude: ride?.destination_lat,
    longitude: ride?.destination_long,
    address: ride?.destination,
  };

   


  const fitToSourceAndDestination = () => {
    const markers = [source, destination];
    mapRef.current.fitToCoordinates(markers, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader title={'Ride Details'} />
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onMapReady={fitToSourceAndDestination}
      >
        {source && <Marker coordinate={source} title="Source" />}
        {destination && <Marker coordinate={destination} title="Destination" />}


        {ride?.ride_drownies.map((result) => (
          <Marker
            key={result.id}
            coordinate={{ latitude: result.lat, longitude: result.long }}
            title="Drowsiness Detected"
            description="Click for details"
            onCalloutPress={() => {
              if(result?.video){
                Linking.openURL(result?.video);
              }
            }}
          >
            <Image
              source={{uri:result.image}}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          </Marker>
        ))}

        {source && destination && (
          <MapViewDirections
            origin={source}
            destination={destination}
            apikey={SERVER.GOOGLE_MAP_KEY}
            strokeWidth={3}
            strokeColor="hotpink"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ViewRidesRequest;

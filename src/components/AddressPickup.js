import { SERVER } from '../constants/index';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const AddressPickup = ({placeholder,handleSelection, value}) => {
    navigator.geolocation = require('@react-native-community/geolocation');

    return (
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                placeholder={placeholder}
                onPress={handleSelection}
                fetchDetails={true}
                query={{
                    key: SERVER.GOOGLE_MAP_KEY,
                    language: 'en',
                }}
                styles={{
                    textInputContainer: styles.containerStyle,
                    textInput: styles.textInput,
                }}
                currentLocation={true}
                currentLocationLabel='Current location'
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    containerStyle:{
        backgroundColor:'white',
        padding:15
    },
    textInput:{
        backgroundColor:'#F3F3F3',
        height:48,
        fontSize:16,
        color:'black'
    }
})

export default AddressPickup;

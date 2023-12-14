import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';


const LoadingIndicator = ({ isLoading }) => {
  return (
    <>
      {isLoading ? (
        <View style={{  
        backgroundColor: '#F5FCFF88',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'}}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

export default LoadingIndicator;

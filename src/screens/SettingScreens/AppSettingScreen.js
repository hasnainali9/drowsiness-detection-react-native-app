import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Button, Text } from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Buttons from '../../components/Buttons';
import { useToast } from 'react-native-toast-notifications';

const AppSettingScreen = () => {
  const [drowsinessDetectionTime, setDrowsinessDetectionTime] = useState('');
  const [videoRecordingTime, setVideoRecordingTime] = useState('');
  const toast = useToast();

  // Load initial values from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedDrowsinessDetectionTime = await AsyncStorage.getItem('drowsinessDetectionTime');
        const storedVideoRecordingTime = await AsyncStorage.getItem('videoRecordingTime');

        if (storedDrowsinessDetectionTime) {
          setDrowsinessDetectionTime(storedDrowsinessDetectionTime);
        }

        if (storedVideoRecordingTime) {
          setVideoRecordingTime(storedVideoRecordingTime);
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };
    loadData();
  }, []);

  // Save values to AsyncStorage when they change
  const saveData = async () => {
    try {
      await AsyncStorage.setItem('drowsinessDetectionTime', drowsinessDetectionTime);
      await AsyncStorage.setItem('videoRecordingTime', videoRecordingTime);
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
    }
  };

  return (
    <View style={{ height: '100%' }}>
      <ScreenHeader title={'Settings'} />

      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Drowsiness Detection Time</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor={'#A9A9A9'}
            keyboardType="numeric"
            value={drowsinessDetectionTime}
            onChangeText={(text) => setDrowsinessDetectionTime(text)}
          />
          <Text style={styles.unit}>s</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Video Recording Time</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor={'#A9A9A9'}
            keyboardType="numeric"
            value={videoRecordingTime}
            onChangeText={(text) => setVideoRecordingTime(text)}
          />
          <Text style={styles.unit}>s</Text>
        </View>

        <Buttons
                on_press={saveData}
                btn_text='Save Setting'

            />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    flex: 1,
    color:'#000000'
  },
  input: {
    flex: 1,
    color:'#000000',
    textAlign:'right',
    borderColor: 'gray',
    borderWidth: 1,
    borderTopWidth: 0, // Remove top border
    borderLeftWidth: 0, // Remove left border
    borderRightWidth: 0, // Remove right border
    paddingHorizontal: 8,
    marginRight: 8,
  },
  unit: {
    fontSize: 16,
    color:'#000000'
  },
});

export default AppSettingScreen;

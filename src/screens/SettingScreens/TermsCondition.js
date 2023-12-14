import { useNavigation } from '@react-navigation/native';
import { LoadingIndicator, ScreenHeader } from '../../components/index';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { SERVER } from '../../constants/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useToast } from 'react-native-toast-notifications';

const TermsCondition = () => {
    const [html, setHtml] = useState(null);
    const [loading, setLoading] = useState([]);
    const navigation = useNavigation();
    const toast = useToast();


    const source = {
        html: html
    };




    const getTermsCondition = async () => {
        setLoading(true);
        try {
            const accessToken = await AsyncStorage.getItem('token');
            const response = await axios.get(SERVER.TERMS, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (response?.data?.success) {
                setLoading(false);
                setHtml(response?.data?.data?.value);
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
            getTermsCondition();
        });
    }, [/* dependencies */]);



    const { width } = useWindowDimensions();

    return (
        <ScrollView style={{ height: '100%' }}>
            <ScreenHeader title={"Terms & Condition"} />
            <View style={{ padding: 16 }}>
                {html ?
                    <RenderHtml
                        contentWidth={width}
                        source={source}
                    /> : <></>}
            </View>
            <LoadingIndicator isLoading={loading} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({})

export default TermsCondition;

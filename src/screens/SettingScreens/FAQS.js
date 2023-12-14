import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoadingIndicator, ScreenHeader } from '../../components/index';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { SERVER } from '../../constants/index';
import { useNavigation } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';

const FAQS = () => {
    const [faqsData,setFaqsData] = useState([]);
    const [loading,setLoading] = useState([]);
    const navigation=useNavigation();
    const toast = useToast();
    
    

    const [expandedIndex, setExpandedIndex] = useState(null);

    const toggleAnswer = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };




    const getFAQs = async () => {
        setLoading(true);
        try {
            const accessToken = await AsyncStorage.getItem('token');
            const response = await axios.get(SERVER.FAQS_LIST, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (response?.data?.success) {
                setLoading(false);
                setFaqsData(response?.data?.data);
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
            getFAQs();
        });
    }, [/* dependencies */]);


    return (
        <ScrollView style={{height:'100%'}}>
            <ScreenHeader title={"FAQ's"} />
            <View style={styles.container}>
                {faqsData.map((faq, index) => (
                    <View key={index} style={styles.faqItem}>
                        <TouchableOpacity onPress={() => toggleAnswer(index)}>
                            <Text style={styles.questionText}>{faq.question}</Text>
                        </TouchableOpacity>
                        {expandedIndex === index && <Text style={styles.answerText}>{faq.answer}</Text>}
                    </View>
                ))}
            </View>

            <LoadingIndicator isLoading={loading} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    faqItem: {
        marginBottom: 16,
    },
    questionText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    answerText: {
        fontSize: 14,
    },
});

export default FAQS;

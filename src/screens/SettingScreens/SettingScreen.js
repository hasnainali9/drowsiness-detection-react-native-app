import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Button, Text, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome or any other icon library you are using
import Colors from '../../constants/Colors';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useToast } from 'react-native-toast-notifications';
import LoadingIndicator from '../../components/LoadingIndicator';
import { SERVER } from '../../constants/index';



const SettingScreen = () => {
    const { signOut } = React.useContext(AuthContext);
    const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
    const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] = useState(false);
    const [profile, setProfile] = useState([]);
    const navigation = useNavigation();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const handleNavigation = (screen,params) => {
        navigation.navigate(screen,params)
    };




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




    const handleDeleteProfile = async () => {
        setLoading(true);
        setIsDeleteAccountModalVisible(false)
        try {
            const accessToken = await AsyncStorage.getItem('token');
            const response = await axios.post(SERVER.DELETE_USER_PROFILE, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (response?.data?.success) {
                signOut();
                setLoading(false);
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
        <ScrollView style={{ flex: 1 }}>
            <ScreenHeader title={'Settings'} />

            <View style={styles.container}>
                {/* User Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../assets/images/user.png')}
                        style={styles.userImage}
                        resizeMode="cover"
                    />
                    <Text style={styles.userName}> {profile?.name}</Text>

                </View>

                {/* Navigation Buttons with Icons */}
                <View style={styles.navigationContainer}>

                    <TouchableOpacity style={styles.button} onPress={() => handleNavigation('ProfileSettings',{profile:profile})}>
                        <Icon name="user" size={25} color={Colors.primary} />
                        <Text style={styles.buttonText}>Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => handleNavigation('PasswordSettings')}>
                        <Icon name="lock" size={25} color={Colors.primary} />
                        <Text style={styles.buttonText}>Change Password</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => handleNavigation('AppSettings')}>
                        <Icon name="cog" size={25} color={Colors.primary} />
                        <Text style={styles.buttonText}>App Settings</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => handleNavigation('AboutUs')}>
                        <Icon name="info" size={25} color={Colors.primary} />
                        <Text style={styles.buttonText}>About Us</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => handleNavigation('TermsCondition')}>
                        <Icon name="book" size={25} color={Colors.primary} />
                        <Text style={styles.buttonText}>Terms & Conditions</Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.button} onPress={() => handleNavigation('PrivacyPolicy')}>
                        <Icon name="book" size={25} color={Colors.primary} />
                        <Text style={styles.buttonText}>Privacy Policy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => handleNavigation('FAQS')}>
                        <Icon name="question" size={25} color={Colors.primary} />
                        <Text style={styles.buttonText}>FAQ</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={()=>{setIsDeleteAccountModalVisible(true);}}>
                        <Icon name="trash" size={25} color={Colors.danger} />
                        <Text style={styles.buttonText}>Delete Account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={()=>{setLogoutModalVisible(true);}}>
                        <Icon name="sign-out" size={25} color={Colors.danger} />
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </View>

            </View>




            {/* Logout Confirmation Modal */}
            <Modal
                visible={isDeleteAccountModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsDeleteAccountModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Are you sure you want to Delete Your Account?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={handleDeleteProfile}>
                                <Text style={styles.modalButton}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{
                                setIsDeleteAccountModalVisible(false);
                            }}>
                                <Text style={styles.modalButton}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            {/* Logout Confirmation Modal */}
            <Modal
                visible={isLogoutModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setLogoutModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Are you sure you want to logout?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={()=>{
                                 signOut();
                                setLogoutModalVisible(false);
                            }}>
                                <Text style={styles.modalButton}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{
                                setLogoutModalVisible(false);
                            }}>
                                <Text style={styles.modalButton}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <LoadingIndicator isLoading={loading} />

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    userName: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: 'bold',
    },
    userImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    navigationContainer: {
        flex: 1,
        gap: 10,
        marginTop: 16,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'start',
        borderColor: Colors.primary, // Border color
        borderWidth: 1, // Border width
        borderRadius: 8, // Border radius
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginBottom: 5,
    },
    buttonText: {
        color: Colors.primary,
        marginLeft: 8,
    },




    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalContent: {
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        width: '80%',
    },

    modalText: {
        fontSize: 16,
        marginBottom: 16,
    },

    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },

    modalButton: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 8,
    },
});

export default SettingScreen;

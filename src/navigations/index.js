import React, { useEffect, useMemo, useReducer } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {AuthContext} from "../context/AuthContext"

import AuthNavigator from './AuthNavigator';
import BottomNavigator from './BottomNavigator';
import { SERVER } from '../constants/index';

const initialLoginState = {
  isLoading: true,
  userName: null,
  userToken: null,
};

const LOGIN_ACTIONS = {
  RETRIEVE_TOKEN: 'RETRIEVE_TOKEN',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  REGISTER: 'REGISTER',
};

const VERIFY_LOGGED_IN_USER = 'YOUR_VERIFY_LOGGED_IN_USER_ENDPOINT';

const loginReducer = (prevState, action) => {
  switch (action.type) {
    case LOGIN_ACTIONS.RETRIEVE_TOKEN:
      return {
        ...prevState,
        userToken: action.token,
        isLoading: false,
      };
    case LOGIN_ACTIONS.LOGIN:
    case LOGIN_ACTIONS.REGISTER:
      return {
        ...prevState,
        userName: action.id,
        userToken: action.token,
        isLoading: false,
      };
    case LOGIN_ACTIONS.LOGOUT:
      return {
        ...prevState,
        userName: null,
        userToken: null,
        isLoading: false,
      };
    default:
      return prevState;
  }
};

const AppNavigationContainer = () => {
  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  const authContext = useMemo(() => ({
    signIn: async (tokenId) => {
      try {
        await AsyncStorage.setItem('token', tokenId);
        dispatch({ type: LOGIN_ACTIONS.LOGIN, token: tokenId });
      } catch (error) {
        console.error(error);
      }
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('token');
        console.log('Token removed');
      } catch (error) {
        console.error(error);
      }
      dispatch({ type: LOGIN_ACTIONS.LOGOUT });
    }
  }), []);

  const checkLogged = async (token) => {
    try {
      const response = await axios.get(SERVER.USER_PROFILE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Handle the response as needed
    } catch (error) {
      console.error('Error:', error);
      authContext.signOut();
    }
  };

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log(token);
        if (token) {
          checkLogged(token);
          dispatch({ type: LOGIN_ACTIONS.RETRIEVE_TOKEN, token });
        } else {
          dispatch({ type: LOGIN_ACTIONS.RETRIEVE_TOKEN, token: null });
        }
      } catch (error) {
        console.error(error);
      }
    };

    setTimeout(retrieveToken, 1000);
  }, []);

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
      {loginState.userToken != null?(
          <>
          <BottomNavigator/> 
          </>
        ):(<AuthNavigator />)}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default AppNavigationContainer;

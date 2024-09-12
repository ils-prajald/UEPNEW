import { View, Text, Platform } from 'react-native';
import React, { useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/Navigation/UEPNavigation';
import env from './src/constants/env';
import { decryptData } from './src/utilities/Crypto';
import { store } from './src/store/Store';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginContext } from './src/Context/LoginProvider';

const App = () => {
  // const { setIsChecking } = useContext(LoginContext);

  useEffect(() => {
    axios
      .get(env.BASE_URL + "/user/api/getHeaderText")
      .then(async (res) => {
        res.data = await decryptData(res.data);
        store.setTextData(res.data.data);
        getUser();
      })
      .catch((err) => {
        getUser();
      });
  }, []);

  const getUser = async () => {
    const asyncStorageKeys = await AsyncStorage.getAllKeys();
    if (asyncStorageKeys.length > 0) {
      if (Platform.OS === 'android') {
        await AsyncStorage.clear();
      }
      if (Platform.OS === 'ios') {
        await AsyncStorage.multiRemove(asyncStorageKeys);
      }
    }
    store.clearToken();
    // setIsChecking(false);
  };

  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
};

export default App;

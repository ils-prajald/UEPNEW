import React, { useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toastr } from '../Screens/utilities';
import { store } from '../store/Store';
export const LoginContext = React.createContext();

export default LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setIsChecking] = useState(true);
  const [profile, setProfile] = useState("");
  const [WiFi, setWiFi] = useState(false);
  const [SelectedPackage, setSelectedPackage] = useState({});
  const [packageListArray, setPackageListArray] = useState([]);
  const [isPersonal, setIsPersonal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [deviceToken, setDeviceToken] = useState("");
  const [initialRoute, setInitialRoute] = useState("Home");
  const [imagesData, setImagesData] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [userId, setUserId] = useState(null);
  const [initialRoute1, setInitialRoute1] = useState("EventSearch");
  const [initialParams, setInitialParams] = useState(null);
  const [images1, setImages1] = useState([]);

  const logOut = async () => {
    global.guestIndex = 2;
    global.userIndex = 0;
    setUserId(null);
    setCartCount(0);
    setNotificationCount(0);
    setIsChecking(true);
    setInitialRoute("Home");
    setIsLoggedIn(false);
    setInitialParams(null);
    setInitialRoute1(null);
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
    setIsChecking(false);
  };

  return (
    <LoginContext.Provider value={{
      isLoggedIn,
      isPersonal,
      setIsPersonal,
      packageListArray,
      setPackageListArray,
      setIsLoggedIn,
      profile,
      setProfile,
      WiFi,
      setWiFi,
      checking,
      setIsChecking,
      SelectedPackage,
      setSelectedPackage,
      cartCount,
      setCartCount,
      notificationCount,
      setNotificationCount,
      deviceToken,
      setDeviceToken,
      initialRoute,
      setInitialRoute,
      imagesData,
      setImagesData,
      isFavourite,
      setIsFavourite,
      userId,
      setUserId,
      initialRoute1,
      setInitialRoute1,
      initialParams,
      setInitialParams,
      images1,
      setImages1,
      clearAllDetails: async () => {
        toastr.warning(store.textData.session_expired_text);
        logOut();
      },
      deleteAccount: async () => {
        toastr.success(store.textData.delete_profile_success_text);
        logOut();
      },
      commonLogout: () => logOut()
    }}>
      {children}
    </LoginContext.Provider>
  );
};

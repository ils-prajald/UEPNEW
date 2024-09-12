import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  StatusBar,
  TouchableOpacity,
  Text
} from "react-native";

// import { LoginContext } from "../Context/LoginProvider";
// import { useNavigation } from '@react-navigation/native';
// import { store } from '../store/Store'
// import { toastr } from '../../src/screens/utilities/index';
// import WifiManager from "react-native-wifi-reborn";
// import globals from "../constants/globals";
// import AsyncStorage from "@react-native-async-storage/async-storage";


const Header = (props) => {
  // const navigation = useNavigation();
  // const { WiFi, cartCount, notificationCount } = React.useContext(LoginContext);

  const setScreen = async () => {
    try {
      await AsyncStorage.setItem("isScreen", '0');
    } catch (e) {
    }
  };
  return (
    <View style={styles.mainView}>
      <StatusBar barStyle="light-content" />

      {/* Left Menu View  */}
      <View style={styles.leftMenuView}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image
            source={require("../assets/auth/leftMenu.png")}
            style={styles.leftMenuImage}
          />
        </TouchableOpacity>
      </View>

      {/* Brand View */}
      <View style={styles.bandView}>
        <View style={styles.headerView}>
          <Image
            source={require("../assets/UEPcopy.png")}
            style={styles.headerImage}
          />
        </View>
      </View>

      {/* Wifi View  */}
      <TouchableOpacity style={styles.wifiView}>

      </TouchableOpacity>
      <TouchableOpacity style={styles.wifiView} onPress={() => {
        // if (store.token != "") {
        //   navigation.navigate('MyCartScreen');
        // }
        // else {
        //   setTimeout(() => {
        //     toastr.warning(store.textData.login_to_check_item_text);
        //   }, 1000)
        // }
      }}>
        <View style={styles.cartView}>
          <Image
            resizeMode="contain"
            source={require("../assets/auth/cart.png")}
            style={styles.cartImage}
          />
        </View>
        {/* {cartCount > 0 && (
          <View style={{
            height: 20,
            width: 20,
            borderRadius: 10,
            backgroundColor: "#EA377C",
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            right: -5,
            top: 20,
          }}>
            <Text style={{ color: '#FFF' }}>{cartCount}</Text>
          </View>
        )} */}
      </TouchableOpacity>

      {/* Notifications View  */}
      <TouchableOpacity style={styles.wifiView} onPress={() => {
        setScreen();
        // if (store.token != "") {
        //   navigation.navigate('NotificationList');
        // }
        // else {
        //   setTimeout(() => {
        //     toastr.warning(store.textData.login_to_check_notification);
        //   }, 1000)
        // }
      }}>
        <View style={styles.notificationsView}>
          <Image
            resizeMode="contain"
            source={require("../assets/auth/notifications.png")}
            style={styles.notificationImage}
          />
        </View>
        {/* {notificationCount > 0 && (
          <>
            {notificationCount < 100 && (
              <View style={{
                height: 20,
                width: 20,
                borderRadius: 10,
                backgroundColor: "#EA377C",
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                right: 0, top: 20
              }}>
                <Text style={{ color: '#FFF' }}>{notificationCount}</Text>
              </View>
            )}
            {notificationCount >= 100 && (
              <View style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                backgroundColor: "#EA377C",
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                right: -2, top: 15
              }}>
                <Text style={{ color: '#FFF' }}>{notificationCount}</Text>
              </View>
            )}
          </>
        )} */}

      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerView: {
    height: 80,
    marginTop: 0,
    marginLeft: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    resizeMode: "stretch",
    width: Dimensions.get("window").width - 200,
    height: Dimensions.get("window").height / 18,
  },

  mainView: {
    height: 80,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: "2%",
  },

  leftMenuImage: {
    width: 30,
    height: 30,
  },
  cartImage: {
    width: 30,
    height: 30,
  },
  wifiImage: {
    width: 35,
    height: 30,
  },
  noWifiImage: {
    width: 35,
    height: 30,
  },
  notificationImage: {
    width: 30,
    height: 30,
    tintColor: "white",
  },
  leftMenuView: {
    height: 80,
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  bandView: {
    height: 80,
    width: "60%",
  },
  cartView: {
    height: 80,
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  wifiView: {
    height: 80,
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationsView: {
    height: 80,
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
});

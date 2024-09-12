import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  PermissionsAndroid,
  Platform,
  StatusBar,
} from "react-native";
import { store } from "../../store/Store";
import QRCodeScanner from "react-native-qrcode-scanner";
import WifiManager from "react-native-wifi-reborn";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import { RFValue } from "react-native-responsive-fontsize";
import Spinner from "react-native-loading-spinner-overlay";
import { View } from "native-base";
import CancelButton from "../../components/CancelButton";
import { SafeAreaView } from "react-native-safe-area-context";
import globals from "../../constants/globals";

export default class Scanner extends Component {
  state = {
    qr: "",
    spinner: false,
  };

  constructor(props) {
    super(props);
    this.handleiOSWiFi = this.handleiOSWiFi.bind(this);
    this.handleAndroidWiFi = this.handleAndroidWiFi.bind(this);
    this.loadWifiList = this.loadWifiList.bind(this);
  }
  loadWifiList = async () => {
    WifiManager.loadWifiList().then((response) => {
    }).catch((error) => {
    })
  }

  componentDidMount() {
    Platform.OS === "android" && this.loadWifiList();
  }

  handleiOSWiFi = async () => {
    this.setState({
      spinner: true,
    });

    WifiManager.connectToProtectedSSID(globals.SSID, globals.PASSWORD, false).then(
      () => {
        this.props.navigation.navigate("ConnectedWiFi");
        this.setState({
          spinner: false,
        });
      },
      (reason) => {
      }
    );
  };

  handleAndroidWiFi = async () => {
    WifiManager.setEnabled(true);
    WifiManager.disconnect();
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Need location permission to enable wifi",
        buttonNegative: "DENY",
        buttonPositive: "ALLOW",
      }
    ).then((granted) => {
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000,
        })
          .then(() => {
            WifiManager.connectToProtectedSSID(
              globals.SSID,
              globals.PASSWORD,
              false
            ).then(
              () => {
                this.props.navigation.navigate("ConnectedWiFi");
              },
              (reason) => {
              }
            );
          })
          .catch((err) => {
          });
      }
    });
  };
  onRead = (e) => {
    this.setState({ qr: e.data });
    let data = e.data;
    if (data.includes(globals.SSID)) {
      //alert("Valid QR code");
      Platform.OS === "android"
        ? this.handleAndroidWiFi()
        : this.handleiOSWiFi();
    } else {
      this.props.navigation.goBack();
    }
  };
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <SafeAreaView>
          <CancelButton onPress={() => { this.props.navigation.goBack() }} />
        </SafeAreaView>

        <StatusBar hidden={true} />
        <Spinner visible={this.state.spinner} />
        <QRCodeScanner
          onRead={this.onRead}
          //flashMode={RNCamera.Constants.FlashMode.torch}
          topContent={
            <Text style={styles.centerText}>
              {store.textData.scan_code_text}
            </Text>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    fontSize: RFValue(18),
    justifyContent: "center",
    alignItems: "center",
  },
  textBold: {
    fontWeight: "500",
    color: "#000",
  },
  buttonText: {
    fontSize: 21,
    color: "rgb(0,122,255)",
  },
  buttonTouchable: {
    padding: 16,
  },
});

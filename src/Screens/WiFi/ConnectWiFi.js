import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { store } from '../../store/Store';
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import CancelButton from "../../components/CancelButton";
import UEPButton from "../../components/UEPButton";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";

const brand_img = require("../../assets/UEPcopy.png");
const wifi_img = require("../../assets/wifi-signal.png");

const ConnectWiFi = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <CancelButton onPress={() => { navigation.goBack() }} />
        <View style={styles.contentView}>
          <ScrollView>
            <View style={{ alignItems: "center" }}>
              <Image
                source={brand_img}
                style={styles.brandImage}
                resizeMode="contain"
              />
            </View>

            <View>
              <Text style={styles.viewAndPurchaseText}>
                {store.textData.view_and_purchased_text}
              </Text>
            </View>

            <View style={{ marginVertical: "2%" }}>
              <Text style={styles.infoText}>
                {store.textData.connect_your_device_text}
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Image
                source={wifi_img}
                style={styles.wifiImage}
                resizeMode="contain"
              />
            </View>
            <View>
              <UEPButton
                title={store.textData.connect_uep_wifi_text}
                onPressButton={() => {
                  navigation.navigate("Scanner");
                }}
              />
            </View>

            <View style={{ marginVertical: "2%" }}>
              <Text style={styles.botoomInfoText}>
                {store.textData.wifi_account_holder_access_text}
              </Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ConnectWiFi;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.screen_bg,
    alignItems: "center",
  },
  contentView: {
    marginHorizontal: "4%",
  },
  brandImage: {
    width: Dimensions.get("window").width - 100,
    height: Dimensions.get("window").height / 15,
    marginVertical: "10%",
  },
  wifiImage: {
    width: Dimensions.get("window").width - 50,
    height: Dimensions.get("window").height / 3,
  },
  viewAndPurchaseText: {
    color: "white",
    fontFamily: fonts.AvenirNextCondensedBold,
    fontSize: RFValue(20),
    marginHorizontal: "5%",
    textAlign: "center",
  },
  infoText: {
    color: "white",
    fontFamily: fonts.AvenirNextCondensedRegular,
    fontSize: RFValue(15),
    marginHorizontal: "2%",
    marginTop: "2%",
  },
  botoomInfoText: {
    color: "white",
    fontFamily: fonts.AvenirNextCondensedRegular,
    fontSize: RFValue(15),
    marginHorizontal: "2%",
  },
  //Scanner Style
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: "#777",
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

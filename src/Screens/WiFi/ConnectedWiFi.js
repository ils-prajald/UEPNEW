import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import UEPButton from "../../components/UEPButton";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import { store } from "../../store/Store";
const brand_img = require("../../assets/UEPcopy.png");
const wifi_img = require("../../assets/wifi-signal.png");

import { LoginContext } from "../../Context/LoginProvider";

const ConnectedWiFi = ({ navigation }) => {
  const { setWiFi } = React.useContext(LoginContext);

  useEffect(() => {
    setWiFi(true);
  }, []);
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.topSafeArea} />

      <SafeAreaView>

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
              <Text style={styles.viewAndPurchaseText}>YOU'RE CONNECTED!</Text>
            </View>

            <View style={{ alignItems: "center", marginVertical: "10%" }}>
              <Image
                source={wifi_img}
                style={styles.wifiImage}
                resizeMode="contain"
              />
            </View>
            <View>
              <UEPButton
                title={store.textData.start_viewing_text}
                onPressButton={() => {
                  // navigation.navigate("UserLogin");
                  navigation.navigate("HomeScreen");
                }}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ConnectedWiFi;

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
    tintColor: colors.uep_pink,
  },
  viewAndPurchaseText: {
    color: "white",
    fontFamily: fonts.AvenirNextCondensedBold,
    fontSize: RFValue(30),
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

import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import Header from "../../components/Header";
import colors from "../../constants/colors";
const img = require("../../assets/uep-network.gif");

const UEPNetwork = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      alert("Wifi not available");
    }, 5000);
  }, []);
  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <StatusBar barStyle="light-content" hidden={false} />
        <View>
          <LinearGradient colors={["#393838", "#222222"]}>
            <Header />
          </LinearGradient>
        </View>
        <View>
          <Image source={img} style={styles.img} resizeMode="cover" />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default UEPNetwork;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgb(248,247,249)",
  },
  img: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 2.5,
  },
});

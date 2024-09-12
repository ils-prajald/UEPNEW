import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import fonts from "../constants/fonts";

const ScreenHeader = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.text}</Text>
    </View>
  );
};

export default ScreenHeader;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "1%",
  },
  text: {
    color: "white",
    padding: 3,
    fontSize: RFValue(18),
    borderWidth: 2,
    borderColor: "white",
    fontFamily: fonts.AvenirNextCondensedDemiBold,
    minWidth: 170,
    textAlign: "center",
  },
});

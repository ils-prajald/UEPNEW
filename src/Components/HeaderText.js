import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import fonts from "../constants/fonts";

const HeaderText = (props) => {
  return (
    <View style={styles.headerView}>
      <Text style={styles.text}>{props.text}</Text>
    </View>
  );
};

export default HeaderText;

const styles = StyleSheet.create({
  headerView: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "3%",
  },
  text: {
    fontSize: RFValue(20),
    marginHorizontal: "10%",
    color: "white",
    fontFamily: fonts.AvenirNextCondensedBold,
    textAlign: "center",
    lineHeight: 30
  },
});

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import fonts from "../constants/fonts";

const InfoHeader = (props) => {
  return (
    <Text style={styles.textStyle} color={props.color}>
      {props.text}
    </Text>
  );
};

export default InfoHeader;

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: fonts.AvenirNextCondensedRegular,
    fontSize: RFValue(16),
    color: "white",
    marginHorizontal: 18,
  },
});

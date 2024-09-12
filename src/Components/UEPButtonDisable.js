import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "native-base";
import fonts from "../constants/fonts";
import { RFValue } from "react-native-responsive-fontsize";
import colors from "../constants/colors";

const UEPButtonDisable = (props) => {
  return (
    <View style={styles.buttonView}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>{props.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UEPButtonDisable;

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgb(89,63,76)',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    height: 50,
  },
  buttonText: {
    color: "gray",
    fontSize: RFValue(19),
    fontFamily: fonts.BebasNeueRegular,
  },
  buttonView: {
    marginVertical: "4%",
  },
});

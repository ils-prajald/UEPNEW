import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "native-base";
import fonts from "../constants/fonts";
import { RFValue } from "react-native-responsive-fontsize";
import colors from "../constants/colors";

const UEPButton = (props) => {
  return (
    <View style={styles.buttonView}>
      <TouchableOpacity style={styles.button} onPress={props.onPressButton}>
        <Text style={styles.buttonText}>{props.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UEPButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.uep_pink,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    height: 50,
  },
  buttonText: {
    color: "white",
    fontSize: RFValue(22),
    fontFamily: fonts.BebasNeueRegular,
  },
  buttonView: {
    marginVertical: "4%",
  },
});

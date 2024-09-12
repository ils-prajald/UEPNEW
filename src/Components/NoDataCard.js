import { Button } from "native-base";
import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
const NoDataCard = (props) => {
  return (
    <View style={styles.screen}>
      <View style={styles.cardView}>
        <Image source={require("../assets/info.png")} style={styles.image} />
        <Text style={styles.infoText}>
          {props.title}
        </Text>
        {props.showButton && (
          <Button style={styles.button} onPress={props.onPress}>
            <Text style={styles.buttonText}>{props.btnTitle}</Text>
          </Button>
        )}
      </View>
    </View>
  );
};

export default NoDataCard;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardView: {
    padding: 20,
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: fonts.AvenirNextCondensedBoldItalic,
    marginBottom: 10
  },
  button: {
    backgroundColor: "#EA377C",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    // height: 35,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontFamily: fonts.AvenirBlack,
    paddingHorizontal: 10
  },
  image: {
    width: 40,
    height: 40,
    tintColor: colors.uep_pink,
    marginVertical: 10,
  },
});

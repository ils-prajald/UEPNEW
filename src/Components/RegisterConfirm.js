import React from "react";
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import { store } from '../store/Store';
const RegisterConfirm = ({ props, navigation }) => {
  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <View style={styles.cardView}>
          <Image
            source={require("../assets/auth/success.png")}
            style={styles.image}
          />
          <Text style={styles.infoText}>{store.textData.congratulations_text}</Text>
          <Text style={styles.infoText}>
            {store.textData.account_creation_text}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("UserLogin");
            }}
          >
            <Text style={styles.buttonText}>{store.textData.login_here_text}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default RegisterConfirm;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3F3F3F",
  },
  cardView: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontSize: RFValue(18),
    textAlign: "center",
    fontFamily: fonts.AvenirNextCondensedMediumItalic,
  },
  button: {
    backgroundColor: "#EA377C",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    height: 40,
  },
  buttonText: {
    color: "white",
    fontSize: RFValue(15),
    fontFamily: fonts.AvenirNextCondensedBold,
  },
  image: {
    width: 40,
    height: 40,
    tintColor: colors.uep_pink,
    marginVertical: 10,
  },
});

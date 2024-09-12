import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import fonts from "../constants/fonts";

const PackageItem = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.container}>
        <View style={styles.nameView}>
          <Text style={styles.nameText} numberOfLines={1} ellipsizeMode='tail'>{props.name}</Text>
        </View>
        <View style={styles.priceView}>
          <Text style={styles.priceText}>{props.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PackageItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: "1%",
    justifyContent: "space-between",
    height: 50,
    marginHorizontal: "3%",
  },
  nameView: {
    backgroundColor: "white",
    width: "79%",
    borderRadius: 5,
    justifyContent: "center",
  },
  priceView: {
    width: "19%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  nameText: {
    fontFamily: fonts.AvenirNextCondensedRegular,
    paddingLeft: "4%",
    paddingRight: '1%',
    fontSize: RFValue(14),
  },
  priceText: {
    fontFamily: fonts.AvenirNextCondensedRegular,
    fontSize: RFValue(14),
  },
});

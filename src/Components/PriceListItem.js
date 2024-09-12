import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import fonts from "../constants/fonts";
import { store } from '../store/Store';
const PriceListItem = (props) => {
  return (
    <View style={styles.priceItem}>
      <Text style={styles.routine}>{props.routine}</Text>
      <Text style={styles.divide}>-</Text>
      <Text style={styles.price}>{props.price}</Text>
      <Text style={styles.perRouteText}>{store.textData.per_routine_text}</Text>
    </View>
  );
};

export default PriceListItem;

const styles = StyleSheet.create({
  priceItem: {
    flexDirection: "row",
    marginVertical: "1%",
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  routine: {
    color: "white",
    fontFamily: fonts.AvenirNextCondensedBold,
    fontSize: RFValue(22),
  },
  divide: {
    color: "white",
    fontFamily: fonts.AvenirNextCondensedBold,
    fontSize: RFValue(22),
  },
  price: {
    color: "white",
    fontFamily: fonts.AvenirNextCondensedBold,
    fontSize: RFValue(22),
  },
  perRouteText: {
    color: "white",
    marginTop: "2%",
    fontFamily: fonts.AvenirNextCondensedRegular,
    paddingLeft: "1%",
    fontSize: RFValue(16),
  },
});

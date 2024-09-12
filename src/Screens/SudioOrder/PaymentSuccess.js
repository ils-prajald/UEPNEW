import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import ContentHeader from "../../components/ContentHeader";
//Components
import Header from "../../components/Header";
import UEPButton from "../../components/UEPButton";
import fonts from "../../constants/fonts";
import { store } from "../../store/Store";
import { CommonActions } from '@react-navigation/native';
const PaymentSuccess = ({ navigation, route }) => {

  const { order_number, cartTotal } = route.params;
  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <LinearGradient colors={["#393838", "#222222"]}>
          <Header />
        </LinearGradient>
        <ScrollView>
          <View style={{ marginTop: "5%" }}>
            <ContentHeader text={"Order # " + order_number} />
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontFamily: fonts.AvenirNextCondensedRegular,
                fontSize: RFValue(40),
                marginHorizontal: "10%",
                marginTop: "5%",
              }}
            >
              {store.textData.thank_you_for_order_text}
            </Text>
            <Text
              style={{
                color: "white",
                marginHorizontal: "5%",
                lineHeight: 30,
                fontFamily: fonts.AvenirNextCondensedRegular,
                fontSize: RFValue(20),
                marginTop: "5%",
              }}
            >
              {store.textData.order_complete_text}
            </Text>
          </View>

        </ScrollView>
        <View style={{ marginHorizontal: "5%", marginTop: "20%" }}>
          <UEPButton
            title={store.textData.place_another_order_text}
            onPressButton={() => {
              // navigation.navigate("HomeScreen");
              // navigation.navigate("Home");
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    { name: 'Home' }
                  ],
                })
              );
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default PaymentSuccess;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#3F3F3F",
    alignItems: "center",
  },
});

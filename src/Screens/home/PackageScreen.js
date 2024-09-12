import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Image,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import Header from "../../components/Header";
import LinearGradient from "react-native-linear-gradient";
import colors from "../../constants/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import UEPButton from "../../components/UEPButton";
import fonts from "../../constants/fonts";
import { store } from "../../store/Store";

import { RFValue } from "react-native-responsive-fontsize";
const PackageScreen = ({ navigation, route }) => {
  const { eventID, imageUrl, fileName, file_id, flag } = route.params;

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <LinearGradient colors={["#393838", "#222222"]}>
          <Header />
        </LinearGradient>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "2%",
          }}
        >
          <Text
            style={{
              color: colors.header,
              fontFamily: fonts.BebasNeueRegular,
            }}
          >
            {fileName}
          </Text>
        </View>
        <ImageBackground
          resizeMode="cover"
          source={{ uri: imageUrl }}
          style={styles.imageBG}
        >
          <View style={styles.packageView}>
            <Text style={styles.selectHeaderText}>
              {store.textData.select_package_menu_text}
            </Text>

            <TouchableOpacity
              style={styles.studioOrderText}
              onPress={() => {
                navigation.navigate("PricesListScreen", {
                  eventID: eventID,
                  flag: route.params.flag
                });
              }}
            >
              <Text style={styles.studioText}>
                {store.textData.studio_order_text}
              </Text>
            </TouchableOpacity>
            <View style={styles.packageListView}>
              <ScrollView
                style={{
                  marginBottom: Platform.OS === "ios" ? "12%" : "15%",
                  paddingHorizontal: "3%",
                }}
              >
                {packageList.map((item) => (
                  <PackageItem
                    name={item.routine_name}
                    price={item.price}
                    key={item.routine_name}
                    onPress={() => {
                      navigation.navigate("ViewPackageScreen");
                    }}
                  />
                ))}
              </ScrollView>
            </View>
          </View>
        </ImageBackground>
        <View style={{ marginHorizontal: "4%" }}>
          <UEPButton
            title={store.textData.tap_here_to_view_all_available_product_text}
            onPressButton={() => { }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default PackageScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.screen_bg,
    alignItems: "center",
  },
  imageBG: {
    flex: 1,
    justifyContent: "center",
  },

  tapToViewText: {
    color: "white",
    padding: 10,
  },
});

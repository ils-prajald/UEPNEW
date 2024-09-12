import React from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";

import LinearGradient from "react-native-linear-gradient";
//Components
import Header from "../../components/Header";

const PricesListScreen = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <LinearGradient colors={["#393838", "#222222"]}>
          <Header />
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
};

export default PricesListScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#3F3F3F",
    alignItems: "center",
  },
});

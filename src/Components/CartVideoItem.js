import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import fonts from "../constants/fonts";
import colors from "../constants/colors";
import { store } from '../store/Store';
const video_img = require("../assets/cart-video.png");

const CartVideoItem = (props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        marginVertical: "1%",
      }}
    >
      {/* File ID View */}
      <View
        style={{
          width: "10%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontFamily: fonts.AvenirNextCondensedDemiBold,
            fontSize: 15,
          }}
        >
          {props.event_file_id} .
        </Text>
      </View>
      {/* Image View  */}
      <View
        style={{
          width: "30%",
          alignItems: "center",
          justifyContent: "center",
          width: 100,
          height: 150,
          backgroundColor: colors.uep_pink,
        }}
      >
        <Image
          source={video_img}
          style={{ width: 60, height: 50, tintColor: "white" }}
          resizeMode="cover"
        />
      </View>
      {/* Details View */}
      <View
        style={{
          width: "60%",
          justifyContent: "center",
          marginHorizontal: "2%",
        }}
      >
        <View style={{ flexDirection: "row", width: "100%" }}>
          <View style={{ width: "70%" }}>
            <Text
              style={{
                color: "white",
                fontFamily: fonts.AvenirNextCondensedDemiBold,
                fontSize: 15,
              }}
            >
              {props.routine_name}
            </Text>
            <Text
              style={{
                color: "white",
                fontFamily: fonts.AvenirNextCondensedDemiBold,
                fontSize: 15,
              }}
            >
              {props.file_name}
            </Text>
            <TouchableOpacity onPress={props.remove}>
              <Text
                style={{
                  color: "#73CBF9",
                  fontFamily: fonts.AvenirNextCondensedDemiBold,
                  fontSize: 15,
                }}
              >
                {store.textData.remove_text}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: "30%" }}>
            <Text
              style={{
                color: "white",
                fontFamily: fonts.AvenirNextCondensedDemiBold,
                fontSize: 15,
              }}
            >
              {props.price}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartVideoItem;

const styles = StyleSheet.create({
  line: {
    height: 2,
    backgroundColor: "rgb(51,51,51)",
    marginTop: "5%",
  },
});

import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";

const videoPlayButton = require("../assets/home/video-play.png");
const cartButton = require("../assets/home/add-cart.png");

const VideoItem = (props) => {
  return (
    <TouchableOpacity onPress={props.onGoToPlayer}>
      <View style={styles.video}>
        <Image source={videoPlayButton} style={styles.image} />
        <View style={styles.bottomView}>
          <View style={styles.titleView}>
            <Text style={styles.title}>{props.title}</Text>
          </View>
          <View style={styles.cartButtonView}>
            <TouchableOpacity onPress={props.addToCart}>
              <Image source={cartButton} style={styles.cartImage} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default VideoItem;

const styles = StyleSheet.create({
  video: {
    backgroundColor: "white",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width - 70,
    marginVertical: 5,
    marginLeft: 5,
  },

  image: {
    width: 50,
    height: 50,
    tintColor: colors.uep_pink,
  },

  title: {
    fontFamily: fonts.AvenirBlack,
    fontSize: 12,
    marginHorizontal: 5,
  },
  bottomView: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    padding: 5,
    flexDirection: "row",
  },
  cartImage: {
    width: 30,
    height: 30,
  },
  titleView: {
    width: "90%",
    justifyContent: "center",
  },
  cartButtonView: {
    justifyContent: "center",
  },
});

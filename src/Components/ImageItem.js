import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Image,
} from "react-native";
import colors from "../constants/colors";

const water_mark_img = require("../assets/home/water_mark.png");
const fav = require("../assets/home/fav.png");

const ImageItem = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.imageView}>
        <ImageBackground
          source={{ uri: props.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        >
          <View style={styles.faviconView}>
            <View>
              <TouchableOpacity>
                <Image source={fav} style={styles.favIconImage} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.waterMarkImageView}>
            <Image source={water_mark_img} style={styles.waterMarkImage} />
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

export default ImageItem;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageView: {
    width: Dimensions.get("window").width / 2,
    height: Dimensions.get("window").height / 4,
    marginBottom: 5,
    marginRight: 5,
    justifyContent: "space-evenly",
  },
  waterMarkImageView: {},
  waterMarkImage: {
    width: 100,
    height: 84,
  },
  faviconView: {
    top: 0,
    position: "absolute",
    flexDirection: "row",
    width: "100%",
    padding: 2,
  },
  favIconImage: {
    width: 25,
    height: 25,
    tintColor: colors.uep_pink,
  },
});

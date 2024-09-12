import { StyleSheet, View, Image, ImageBackground, Text } from 'react-native'
import React from 'react'
import colors from '../constants/colors';

const place_holder_img = require("../assets/place_holder_img.png");

const VideoPlaceHolder = () => {
    return (
        <View style={styles.container}>
            <ImageBackground source={place_holder_img}
                style={styles.imageStyle}
                resizeMode="contain">
                <Text>test</Text>
            </ImageBackground>
        </View>
    )
}

export default VideoPlaceHolder

const styles = StyleSheet.create({
    container: {
        width: 48,
        height: 138 / 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.uep_pink,
    },
    imageStyle: {
        width: 48,
        height: 138 / 2,
        transform: [{ rotate: `270deg` }, { scale: 1.5 }],
        tintColor: colors.uep_pink
    }
})
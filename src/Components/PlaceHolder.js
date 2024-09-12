import { StyleSheet, View, Image } from 'react-native'
import React from 'react'

const place_holder_img = require("../assets/place_holder_img.png");

const PlaceHolder = () => {
    return (
        <View style={styles.container}>
            <Image
                source={place_holder_img}
                style={styles.imageStyle}
                resizeMode="contain"
            />
        </View>
    )
}

export default PlaceHolder

const styles = StyleSheet.create({
    container: {
        width: 48,
        height: 144 / 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: 'grey',
    },
    imageStyle: {
        width: 48,
        height: 144 / 2,
        transform: [{ rotate: `270deg` }, { scale: 1.5 }]
    }
})
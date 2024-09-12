import { View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
const wifi_cancel = require("../assets/wifi/cancel.png")


const CancelButton = (props) => {
    return (
        <View style={{
            alignSelf: 'flex-end',
            marginHorizontal: '2%',
            marginTop: '2%'
        }}>
            <TouchableOpacity onPress={props.onPress}>
                <Image source={wifi_cancel} style={{
                    width: 30,
                    height: 30,
                    tintColor: 'red'
                }} />
            </TouchableOpacity>
        </View>
    );
};

export default CancelButton;


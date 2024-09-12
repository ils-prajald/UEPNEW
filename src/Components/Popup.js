import { Button } from "native-base";
import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
const Popup = (props) => {
    return (
        <View style={styles.screen}>
            <View style={styles.cardView}>
                <View
                    style={{
                        height: 250,
                        backgroundColor: "white",
                        marginHorizontal: "6%",
                        borderRadius: 5,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Image source={require("../assets/info.png")} style={styles.image} />
                    <Text style={styles.infoText}>
                        {props.msg}
                    </Text>

                    <View style={{ flexDirection: "row" }}>
                        <Button style={styles.button1} onPress={() => props.noClick()}>
                            <Text style={styles.buttonText1}>{props.notxt}</Text>
                        </Button>

                        <Button style={styles.button} onPress={() => props.yesClick()}>
                            <Text style={styles.buttonText}>{props.yestxt}</Text>
                        </Button>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Popup;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    cardView: {
        padding: 20,
        width: "80%",
        backgroundColor: "white",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    infoText: {
        fontSize: 18,
        textAlign: "center",
        fontFamily: fonts.AvenirNextCondensedBoldItalic,
        marginBottom: 10
    },
    button1: {
        backgroundColor: '#FFF',
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 15,
        marginHorizontal: 10,
        borderRadius: 10,
        // height: 35,
        borderColor: '#000',
        borderWidth: 1
    },
    button: {
        backgroundColor: "#EA377C",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 15,
        marginHorizontal: 10,
        borderRadius: 10,
        // height: 35,
    },
    buttonText: {
        color: "white",
        fontSize: 15,
        fontFamily: fonts.AvenirBlack,
    },
    buttonText1: {
        color: "#000",
        fontSize: 15,
        fontFamily: fonts.AvenirBlack,
    },
    image: {
        width: 40,
        height: 40,
        tintColor: colors.uep_pink,
        marginVertical: 10,
    },
});

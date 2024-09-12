import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ImageBackground,
    TouchableOpacity,
    Alert, Modal, TouchableWithoutFeedback, Linking
} from "react-native";
import Header from "../../components/Header";
import LinearGradient from "react-native-linear-gradient";
import colors from "../../constants/colors";
import { store } from "../../store/Store";
import fonts from "../../constants/fonts";
import { LoginContext } from "../../Context/LoginProvider";
import { RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NoDataCard from "../../components/NoDataCard";
//BG Images
const img1 = require("../../assets/home/purchased.jpg");
const img2 = require("../../assets/home/DancerLeapingcopy1.jpg");
const img3 = require("../../assets/home/Photographercopy1.jpg");
const img4 = require("../../assets/home/staff4.jpeg");

const GuestHomeScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            global.guestIndex = 2;
        }, [])
    );

    return (
        <View style={styles.screen}>
            <SafeAreaView>
                <LinearGradient colors={["#393838", "#222222"]}>
                    <Header />
                </LinearGradient>
                <View style={styles.mainView}>
                    <View style={styles.gridView}>
                        <View style={styles.gridTopView}>
                            <View style={styles.purchasedView}>
                                <ImageBackground
                                    source={img3}
                                    style={styles.bgImage3}
                                    resizeMode="stretch"
                                >
                                    <View style={styles.actionContainerView}>
                                        <View style={styles.actionView1}>
                                            {/* <TouchableOpacity style={styles.actionButtonView} onPress={() => setModalVisible(!modalVisible)}> */}
                                            <TouchableOpacity style={styles.actionButtonView}>
                                                <Text style={styles.actionText}>{store.textData.view_my_profile_text}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </ImageBackground>

                            </View>
                            <View style={styles.mediaView}>
                                <ImageBackground
                                    source={img2}
                                    style={styles.bgImage}
                                    resizeMode="cover"
                                >
                                    <View style={styles.actionContainerView}>
                                        <View style={styles.actionView}>
                                            <TouchableOpacity
                                                style={styles.actionButtonView}
                                                onPress={() => {
                                                    navigation.navigate("EventSearch");
                                                }}
                                            >
                                                <Text style={styles.actionText}>
                                                    {store.textData.search_for_event_media_text}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </View>
                        </View>
                        <View style={styles.gridBottomView}>
                            <View style={styles.profileView}>
                                <ImageBackground
                                    source={img1}
                                    style={styles.bgImage}
                                    resizeMode="cover"
                                >
                                    <View style={styles.actionContainerView}>
                                        <View style={styles.actionView1}>
                                            {/* <TouchableOpacity style={styles.actionButtonView} onPress={() => setModalVisible(!modalVisible)}> */}
                                            <TouchableOpacity style={styles.actionButtonView}>
                                                <Text style={styles.actionText}>
                                                    {store.textData.view_purchased_media_text}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </ImageBackground>

                            </View>
                            <View style={styles.contactView}>
                                <ImageBackground
                                    source={img4}
                                    style={styles.bgImage}
                                    resizeMode="stretch"
                                >
                                    <View style={styles.actionContainerView}>
                                        <View style={styles.actionView1}>
                                            {/* <TouchableOpacity
                                                style={styles.actionButtonView}
                                                onPress={() => {
                                                    navigation.navigate("ContactUEP");
                                                }}
                                            > */}
                                            <TouchableOpacity
                                                style={styles.actionButtonView}
                                            >
                                                <Text style={styles.actionText}>{store.textData.contact_uep_text}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </View>

                        </View>
                    </View>

                    {/* Bottom View  */}
                    <View style={styles.bottomView}>
                        <TouchableOpacity onPress={async () => await Linking.openURL('https://www.uephd.com/contactless-order-form-landing')}>
                            <Text>
                                <Text style={styles.placeAnOrderText}>
                                    {store.textData.place_pre_order_for_upcoming_event_text}
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <TouchableOpacity
                    style={styles.modal}
                    activeOpacity={1}
                // onPressOut={() => setModalVisible(!modalVisible)}
                >
                    <TouchableWithoutFeedback>
                        <NoDataCard
                            btnTitle={store.textData.get_started_text}
                            title={store.textData.not_register_or_login_text}
                            showButton={true}
                            activeOpacity={1}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                setTimeout(() => {
                                    navigation.navigate("UserLogin");
                                }, 500);
                            }}
                        />
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default GuestHomeScreen;

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        backgroundColor: '#212121',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    screen: {
        flex: 1,
        backgroundColor: "#3F3F3F",
        alignItems: "center",
        opacity: 1,
    },
    mainView: {
        flex: 1,
        backgroundColor: "white",
    },
    gridView: {
        height: "90%",
    },
    gridTopView: {
        height: "50%",
        flexDirection: "row",
    },
    purchasedView: {
        width: "50%",
        justifyContent: "center",
        borderColor: "gray",
        borderWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    mediaView: {
        width: "50%",
        borderColor: "gray",
        borderWidth: 0,
    },
    profileView: {
        width: "50%",
        borderColor: "gray",
        borderWidth: 0,
        borderRightWidth: 0,
    },
    contactView: {
        width: "50%",
        borderColor: "gray",
        borderWidth: 0,
        borderTopWidth: 0,
    },
    gridBottomView: {
        height: "50%",
        flexDirection: "row",
    },

    bgImage: {
        flex: 1,
        justifyContent: "center",
        height: "100%",
        width: "100%",
    },
    bgImage3: {
        flex: 1,
        justifyContent: "center",
        height: "100%",
        width: "100%",
    },
    actionView: {
        backgroundColor: colors.uep_pink,
        flex: 1,
        position: "absolute",
        bottom: 15,
        marginHorizontal: 15,
        padding: 10,
        borderRadius: 5,
        width: "85%",
        height: 60,
        justifyContent: "center",
    },
    actionView1: {
        backgroundColor: '#808080',
        flex: 1,
        position: "absolute",
        bottom: 15,
        marginHorizontal: 15,
        padding: 10,
        borderRadius: 5,
        width: "85%",
        height: 60,
        justifyContent: "center",
    },
    actionText: {
        color: "white",
        textAlign: "center",
        fontFamily: fonts.AvenirNextCondensedBold,
        marginHorizontal: "6%",
    },
    actionContainerView: {
        flex: 1,
        alignItems: "center",
    },
    actionButtonView: {
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: "-7%",
    },
    bottomView: {
        height: "10%",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: "2%",
    },
    placeAnOrderText: {
        color: colors.uep_pink,
        fontSize: RFValue(15),
        marginHorizontal: "1%",
        fontFamily: fonts.AvenirNextCondensedDemiBold,
    },
});

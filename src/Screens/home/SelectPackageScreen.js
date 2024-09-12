import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ImageBackground,
    Dimensions,

} from "react-native";
import Header from "../../components/Header";
import LinearGradient from "react-native-linear-gradient";
import colors from "../../constants/colors";
import UEPButton from "../../components/UEPButton";
import fonts from "../../constants/fonts";
import { store } from "../../store/Store";
import { RFValue } from "react-native-responsive-fontsize";
import { LoginContext } from "../../Context/LoginProvider";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { toastr } from "../utilities/index";

import axios from "axios";
import env from "../../constants/env";
import Spinner from "react-native-loading-spinner-overlay";

const SelectPackageScreen = ({ navigation, route }) => {
    const [images] = useState(route.params.images);
    const { no_of_files, routine_name } = route.params;
    const [spinner, setSpinner] = useState(false);
    const scrollRef = React.useRef(null);
    const [isRender, setIsRender] = useState(false);

    return (
        <View style={styles.screen}>
            <SafeAreaView>
                <Spinner visible={spinner} />
                <LinearGradient colors={["#393838", "#222222"]}>
                    <Header />
                </LinearGradient>

                <SwiperFlatList
                    ref={scrollRef}
                    data={images}
                    extraData={isRender}
                    renderItem={({ item, index }) => (
                        <View>
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
                                    {item.file_name}
                                </Text>
                            </View>
                            <ImageBackground
                                source={{ uri: item.file_url }}
                                style={{
                                    width: Dimensions.get("screen").width - 6,
                                    height: "100%",
                                    marginHorizontal: 3,
                                    backgroundColor: "gray",
                                }}
                            >
                            </ImageBackground>
                        </View>
                    )}
                />
                <View
                    style={{
                        marginHorizontal: "5%",
                    }}
                >
                    <UEPButton
                        title={store.textData.add_to_package_text}
                        onPressButton={() => {
                            var file_url = images[scrollRef.current.getCurrentIndex()].file_url;
                        }}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
};

export default SelectPackageScreen;

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
    brandImageView: {
        justifyContent: "center",
        alignItems: "center",
    },
    brandImage: {
        width: "82%",
        height: "70%",
    },
    bottomView: {
        backgroundColor: colors.uep_pink,
        justifyContent: "center",
        alignItems: "center",
    },
    tapToViewText: {
        color: "white",
        padding: 10,
    },
    modalStyle: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height - 200,
        backgroundColor: "transparent",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "rgb(61,61,61)",
        width: Dimensions.get("window").width - 45,
        height: Dimensions.get("window").height / 2,
        position: "absolute",
        bottom: 0,
        borderRadius: 10,
    },
    selectHeaderText: {
        color: "white",
        justifyContent: "center",
        textAlign: "center",
        padding: 5,
        fontSize: RFValue(16),
        fontFamily: fonts.BebasNeueRegular,
        marginVertical: "2%",
    },
    studioOrderText: {
        backgroundColor: "#FFB31A",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        marginHorizontal: 10,
        borderRadius: 5,
        height: 50,
    },
    studioText: {
        fontSize: RFValue(14),
        fontFamily: fonts.AvenirNextCondensedDemiBold,
    },

    packageListView: {
        marginTop: "2%",
        marginBottom: "28%",
    },
    favAndAddVideoToCartView: {
        flexDirection: "row",
        marginHorizontal: "4%",
        // justifyContent: "center",
        marginBottom: 5,
        paddingVertical: 10
    },
    favView: {
        width: "60%",
        alignItems: "center",
        flexDirection: "row",
    },
    cartView: {
        width: "40%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between'
    },
});

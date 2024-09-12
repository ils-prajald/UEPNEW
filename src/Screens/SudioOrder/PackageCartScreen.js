import axios from "axios";
import React, { useState, useEffect } from "react";
import {
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    BackHandler,
    TouchableOpacity,
    Platform
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
//Components
import Header from "../../components/Header";
import ScreenHeader from "../../components/ScreenHeader";
import UEPButton from "../../components/UEPButton";
import env from "../../constants/env";
import Spinner from "react-native-loading-spinner-overlay";
import { store } from "../../store/Store";
import CartItem from "../../components/CartItem";
import fonts from "../../constants/fonts";
import { RFValue } from "react-native-responsive-fontsize";
import { LoginContext } from "../../Context/LoginProvider";
import UEPButtonDisable from "../../components/UEPButtonDisable";
import { useFocusEffect } from "@react-navigation/native";
import Modal from "react-native-modalbox";
import colors from "../../constants/colors";
import {
    encryptData,
    decryptData
} from '../../utilities/Crypto';
const borderRadius = 10;
const PackageCartScreen = ({ navigation, route }) => {
    const { clearAllDetails } = React.useContext(LoginContext);
    //const { quantity, studioID } = route.params;
    const [cartTotal, setCartTotal] = useState(0);
    const [spinner, setSpinner] = useState(false);
    let [cartData, setCartData] = useState([]);
    const [cartImages, setCartImages] = useState([]);
    const [cartVideos, setCartVideos] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(0);
    const [sID, setSID] = useState(0);
    cartData = [...cartImages];
    const info_img = require("../../assets/Warning.png");

    useFocusEffect(
        React.useCallback(() => {
            //global.userIndex = 0;
            const onBackPress = () => {
                // navigation.navigate("MyCartScreen");
                return true;
            };
            BackHandler.addEventListener("hardwareBackPress", onBackPress);

            return () => {
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);
            };
        }, [])
    );

    useEffect(() => {
        handleCartData();
    }, []);

    const handleCartData = () => {
        setSpinner(true);
        axios
            .get(env.BASE_URL + "/preorder/api/getCartDetail", {
                headers: { Authorization: `Bearer ${store.token}` },
            })
            .then(async (res) => {
                res.data = await decryptData(res.data);
                setCartImages(res.data.data.images_cart_details);
                setCartVideos(res.data.data.videos_cart_details)
                setCartTotal(res.data.data.total_price);
            })
            .catch((err) => {
                if (err.response.status == "400") {
                    if (err.response.data.message == "jwt expired") {
                        clearAllDetails();
                    } else if (err.response.data.message == "No item found in your cart.") {
                        setCartData([])
                    }
                }
            })
            .finally(() => {
                setSpinner(false);
            });
    };

    const handleRemove = () => {
        setOpenModal(true);
        const cred = {
            id: itemToDelete,
        };
        axios
            .put(env.BASE_URL + "/preorder/api/removeCartItem", encryptData(cred), {
                headers: { Authorization: `Bearer ${store.token}` },
            })
            .then(async (res) => {
                // res = await decryptData(res);
                setCartTotal(0);
                handleCartData();
                setItemToDelete(0);
                setOpenModal(false);
            })
            .catch((err) => {
            });
    };



    function EmptyCart() {
        return (
            <View style={{
                justifyContent: 'center',
                marginHorizontal: '10%',
                alignItems: 'center',
                height: Dimensions.get("window").height - 300,
            }}>
                <Image />
                <Text style={{
                    color: 'white',
                    fontFamily: fonts.AvenirNextCondensedBold,
                    fontSize: RFValue(30)
                }}>{store.textData.cart_empty_text}</Text>
                <Text style={{
                    color: 'white',
                    fontFamily: fonts.AvenirNextCondensedMediumItalic,
                    fontSize: RFValue(16),
                    textAlign: 'center'
                }}>Before proceed to checkout you must add some products to your cart.</Text>
            </View>
        )
    }

    function MyCart() {
        return (
            <View
                style={{
                    marginHorizontal: "5%",
                }}
            >
                <FlatList
                    keyExtractor={(item, index) => {
                        item.id;
                    }}
                    bounces={false}
                    style={{ maxHeight: 430 }}
                    data={cartData}
                    renderItem={(itemData) => (
                        <View
                            style={{
                                borderBottomColor: "rgb(51,51,51)",
                                borderBottomWidth: 3,
                                justifyContent: "center",
                                paddingVertical: "5%",
                            }}
                        >
                            <CartItem
                                event_file_id={itemData.item.serial_number}
                                file_url={itemData.item.file_url}
                                file_type={itemData.item.file_type}
                                act_no_count={
                                    itemData.item.act_no_count === null
                                        ? "---"
                                        : itemData.item.act_no_count
                                }

                                file_name={
                                    itemData.item.file_name === null
                                        ? "---"
                                        : "Studio Order"
                                }
                                price={
                                    itemData.item.price === null
                                        ? "---"
                                        : "$ " + itemData.item.price + ".00"
                                }
                                remove={(id) => {
                                    setOpenModal(true);
                                    setItemToDelete(itemData.item.id);
                                }}
                            />
                        </View>
                    )
                    }
                />
            </View >
        )
    }

    function MyCartData() {
        if (cartData.length === 0) {
            return <EmptyCart />;
        }
        return <MyCart />;
    }

    return (
        <View style={styles.screen}>
            <SafeAreaView>
                <Spinner visible={spinner} />
                <LinearGradient colors={["#393838", "#222222"]}>
                    <Header />
                </LinearGradient>
                <View style={styles.contentView}>
                    <ScreenHeader text={store.textData.my_cart_text} />
                    <View style={styles.line}></View>
                    {/* Cart images  */}
                    <MyCartData />

                </View>


            </SafeAreaView>
            <View style={styles.bottomContainer}>
                <View>
                    <Text
                        style={{
                            alignSelf: "flex-end",
                            marginHorizontal: "10%",
                            color: "white",
                            fontFamily: fonts.AvenirNextCondensedBold,
                            fontSize: RFValue(18),
                        }}
                    >
                        CART TOTAL $ {cartTotal + ".00"}
                    </Text>
                </View>
                <View style={{ marginHorizontal: "5%" }}>
                    {cartData.length === 0 ? (
                        <UEPButtonDisable
                            title={store.textData.checkout_text}

                        />
                    ) : (
                        <UEPButton
                            title={store.textData.checkout_text}
                            onPressButton={() => {
                                navigation.navigate("GoodNewsScreen", {
                                    cartTotal: cartTotal,
                                    cartData: cartData,
                                    //quantity: quantity,
                                    studioID: sID,
                                });
                            }}
                        />
                    )}

                </View>
                <View style={{ marginVertical: "-4%", marginHorizontal: "5%" }}>
                    <UEPButton
                        title={store.textData.continue_viewing_media_text}
                        onPressButton={() => {
                            navigation.navigate("EventSearch");
                        }}
                    />
                </View>
            </View>
            {/* Remove cart item modal  */}
            <Modal
                style={styles.modalStyle}
                isOpen={openModal}
                position="center"
                backdropPressToClose={false}
            >
                <View style={{
                    flex: 1,
                    alignItems: 'center',

                }}>
                    <View style={{ marginVertical: '2%' }}>
                        <Image source={info_img} style={{ width: 40, height: 35 }} />
                    </View>

                    <Text style={{
                        fontFamily: fonts.AvenirNextCondensedDemiBold,
                        fontSize: RFValue(16),
                        textAlign: 'center',
                        marginHorizontal: '5%', marginVertical: '5%'

                    }}>Are you sure, You want to remove this item from cart ?</Text>
                    <View style={{
                        flexDirection: 'row',
                        width: '100%',
                        marginVertical: '5%',
                        justifyContent: 'space-around',
                    }}>
                        <TouchableOpacity style={{
                            backgroundColor: colors.uep_pink,
                            width: '30%',
                            alignItems: 'center',
                            height: 30,
                            justifyContent: 'center',
                            borderRadius: 5
                        }} onPress={() => { setOpenModal(false) }}>
                            <Text
                                style={{
                                    color: 'white',
                                }}>No</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            backgroundColor: colors.uep_pink,
                            width: '30%',
                            alignItems: 'center',
                            height: 30,
                            justifyContent: 'center',
                            borderRadius: 5,

                        }} onPress={handleRemove}>
                            <Text style={{
                                color: 'white',
                            }}>Yes</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
            {/* End remove cart item modal  */}
        </View>
    );
};

export default PackageCartScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#3F3F3F",
        alignItems: "center",
    },
    contentView: {
        marginVertical: "5%",
        color: "transparent",
    },
    line: {
        height: 2,
        backgroundColor: "rgb(51,51,51)",
        marginTop: "5%",
    },
    bottomContainer: {
        position: "absolute",
        width: "100%",
        bottom: "3%",
    },
    modalStyle: {
        width: Dimensions.get("window").width - 60,
        height: Dimensions.get("window").height / 3.8,
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
    },

});

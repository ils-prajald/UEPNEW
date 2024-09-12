import React, { useState } from "react";
import {
    StyleSheet,
    ScrollView,
    Text,
    View,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Alert, Modal, TouchableWithoutFeedback, TouchableOpacity
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import env from "../../constants/env";
import axios from "axios";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import Spinner from "react-native-loading-spinner-overlay";
import { store } from "../../store/Store";
import { LoginContext } from "../../Context/LoginProvider";

//Components
import Header from "../../components/Header";
import UEPButton from "../../components/UEPButton";

import { toastr, yupSchema } from "../utilities/index";
import UEPTextInput from "../../components/UEPTextInput";
import ContentHeader from "../../components/ContentHeader";
import { RFValue } from "react-native-responsive-fontsize";
import NoDataCard from '../../components/NoDataCard';
import { encryptData, decryptData } from "../../utilities/Crypto";

const Personalized = ({ props, route, navigation }) => {
    const { clearAllDetails, SelectedPackage, setSelectedPackage, packageListArray, setPackageListArray, setIsPersonal, setCartCount } = React.useContext(LoginContext);
    const [performerName, setPerformerName] = useState("");
    let { packageDet, event_id, act_number } = route.params;
    console.log('event_id---', event_id);
    console.log("routeitem", route.params);
    const [spinner, setSpinner] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);

    const submitData = () => {
        yupSchema
            .validatePerformer()
            .validate({
                performer_name: performerName
            })
            .then(() => {
                var fid = [];
                if (packageDet.is_different == 0) {
                    fid = [route.params.fid];
                }
                else {
                    if (packageListArray.length > 0) {
                        for (var i = 0; i < packageListArray.length; i++) {
                            fid.push(packageListArray[i].file_id);
                        }
                    }
                }
                setSpinner(true);
                console.log("FileId----", fid);
                axios.post(env.BASE_URL + "/media/api/addFilesToCart", encryptData({
                    file_ids: (packageDet.is_quick_buy == 1 || packageDet.is_quick_buy == 2 || packageDet.is_quick_buy == 3) ? [] : fid,
                    performer_name: performerName,
                    event_id: event_id,
                    event_package_id: packageDet.event_package_id,
                    search_by: act_number,
                    is_quick_buy: packageDet.is_quick_buy,
                    source_screen: route.params.flag == "purchased" ? 'purchased_media' : 'view_media'
                }), {
                    headers: { Authorization: `Bearer ${store.token}` },
                })
                    .then(async (res) => {
                        res.data = await decryptData(res.data);
                        console.log("resz", res.data);
                        setSpinner(false);
                        if (res.data.data) {
                            setCartCount(res.data.data.user_cart_count);
                            setSelectedPackage({});
                            setPackageListArray([]);
                            if (packageDet.is_different == 0) {
                                if (Platform.OS == "android") {
                                    setModalVisible(!modalVisible);
                                }
                                else {
                                    Alert.alert(
                                        store.textData.packges_added_to_cart_text,
                                        "",
                                        [
                                            { text: store.textData.okay_text, onPress: () => navigation.goBack() }
                                        ]
                                    );
                                }
                            }
                            else {
                                if (Platform.OS == "android") {
                                    setModalVisible1(!modalVisible1);
                                }
                                else {
                                    Alert.alert(
                                        store.textData.files_added_cart_text,
                                        "",
                                        [
                                            { text: store.textData.okay_text, onPress: () => navigation.navigate("MyCartScreen") }
                                        ]
                                    );
                                }
                            }
                        }
                        else {
                            setTimeout(() => {
                                console.log("error");
                                toastr.warning(res.data.message);
                            }, 5000);
                        }
                    })
                    .catch((err) => {
                        setSpinner(false);
                        if (err.response.status == "400") {
                            if (err.response.data.message == "jwt expired") {
                                clearAllDetails();
                            } else {
                                setTimeout(() => {
                                    console.log("error", err.response.data.message);
                                    toastr.warning(err.response.data.message);
                                }, 5000);
                            }
                        } else {
                            setTimeout(() => {
                                toastr.warning(err.response.data.message);
                            }, 5000);
                        }
                    })
            })
            .catch((err) => {
                console.log(err);
                // toastr.warning(err.errors[0]);
            });
    };

    return (
        <View style={styles.screen}>
            <SafeAreaView>
                <Spinner visible={spinner} />
                <LinearGradient colors={["#393838", "#222222"]}>
                    <Header />
                </LinearGradient>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    style={{ flex: 1 }}
                >
                    <View style={styles.contentView}>
                        <ScrollView>
                            {/* <Text style={{
                                color: colors.header,
                                fontSize: RFValue(18),
                                // textAlign: "center",
                                fontFamily: fonts.AvenirNextCondensedBold,
                                lineHeight: 25,
                                marginVertical: "3%",
                            }}></Text> */}

                            <Text style={{
                                fontSize: RFValue(18),
                                marginBottom: '2%',
                                marginLeft: 15,
                                color: colors.header,
                                fontFamily: fonts.AvenirNextCondensedDemiBold,
                                marginTop: '5%'
                            }}>
                                {store.textData.personalize_performer_name_text}
                            </Text>

                            <View style={styles.formView}>
                                {/* Verify Account */}
                                <UEPTextInput
                                    onChangeText={(e) => {
                                        setPerformerName(e);
                                    }}
                                    value={performerName}
                                    placeholder="Enter The Performer’s Name"
                                    keyboardType="default"
                                    textAlign="center"
                                />
                            </View>
                        </ScrollView>
                    </View>
                    <View style={{ marginHorizontal: "5%" }}>
                        <UEPButton
                            title={store.textData.continue_text}
                            onPressButton={() => {
                                submitData();
                                Keyboard.dismiss();
                            }}
                        />
                    </View>
                </KeyboardAvoidingView>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                        navigation.goBack();
                    }}
                >
                    <TouchableOpacity
                        style={styles.modal}
                        activeOpacity={1}
                    >
                        <TouchableWithoutFeedback>
                            <NoDataCard
                                btnTitle={store.textData.okay_text}
                                title={store.textData.packges_added_to_cart_text}
                                activeOpacity={1}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                    navigation.goBack();
                                }}
                                showButton={true}
                            />
                        </TouchableWithoutFeedback>
                    </TouchableOpacity>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible1}
                    onRequestClose={() => {
                        setModalVisible1(!modalVisible1);
                        setTimeout(() => {
                            navigation.navigate("MyCartScreen");
                        }, 500);
                    }}
                >
                    <TouchableOpacity
                        style={styles.modal}
                        activeOpacity={1}
                    >
                        <TouchableWithoutFeedback>
                            <NoDataCard
                                btnTitle={store.textData.okay_text}
                                title={store.textData.files_added_cart_text}
                                activeOpacity={1}
                                onPress={() => {
                                    setModalVisible1(!modalVisible1);
                                    setTimeout(() => {
                                        navigation.navigate("MyCartScreen");
                                    }, 500);
                                }}
                                showButton={true}
                            />
                        </TouchableWithoutFeedback>
                    </TouchableOpacity>
                </Modal>

            </SafeAreaView>
        </View>
    );
};

export default Personalized;

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        // backgroundColor: '#212121',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    screen: {
        flex: 1,
        backgroundColor: "#3F3F3F",
        alignItems: "center",
    },
    contentView: {
        flex: 1,
        marginTop: "2%",
        marginHorizontal: "8%",
    },
    formView: {
        marginHorizontal: 10,
        marginVertical: 20,
    },
});

import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    ScrollView,
    Text,
    View,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    FlatList,
    TouchableOpacity,
    Modal,
    Image,
    ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import env from "../../constants/env";
import fonts from "../../constants/fonts";
import axios from "axios";
import colors from "../../constants/colors";
import Spinner from "react-native-loading-spinner-overlay";
import { store } from "../../store/Store";
import { LoginContext } from "../../Context/LoginProvider";
import UEPButton from "../../components/UEPButton";
import { BlurView } from '@react-native-community/blur';
import AsyncStorage from "@react-native-async-storage/async-storage";
//Components
import Header from "../../components/Header";
import {
    encryptData,
    decryptData
} from '../../utilities/Crypto';

import { toastr, yupSchema } from "../utilities/index";
import UEPTextInput from "../../components/UEPTextInput";
import HeaderText from "../../components/HeaderText";
import ContentHeader from "../../components/ContentHeader";

const CheerModeScreen = ({ props, route, navigation }) => {
    const { clearAllDetails, setSelectedPackage, setPackageListArray } = React.useContext(LoginContext);
    const [actNumber, setActNumber] = useState("");
    const [teamList, setTeamList] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [loader, setLoader] = useState(false);
    const [modalVisible, setModalVisible] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const eventID = route.params.eventID;

    let selectCompetitionDetails = "";

    if (store.token) {
        selectCompetitionDetails = "/media/api/selectCompetitionDetails";
    } else {
        selectCompetitionDetails = "/guest/api/selectCompetitionDetails";
    }



    useFocusEffect(
        React.useCallback(() => {
            setSelectedPackage({});
            setPackageListArray([]);
        }, [])

    );


    useEffect(() => {
        setLoader(true);
        getData();
        eventCheck();
        handleADEvent();
    }, []);

    let eventCheck = async () => {
        try {
            let serializedArray1 = await AsyncStorage.getItem('eventList');
            if (serializedArray1 == route.params.eventID) {
                setModalVisible(false);
            }
        } catch (e) { }
    }

    const getData = () => {
        const cred = {
            producer_id: route.params.cred.producer_id,
            event_id: route.params.cred.event_id,
            start_date: route.params.cred.start_date,
        };
        yupSchema
            .validateEventSearch()
            .validate(cred)
            .then(() => {
                setSpinner(true);
                axios
                    .post(env.BASE_URL + selectCompetitionDetails, encryptData(cred), {
                        headers: { Authorization: `Bearer ${store.token}` },
                    })
                    .then(async (res) => {
                        setSpinner(false);
                        res.data = await decryptData(res.data);
                        setImageUrl(res.data.data.event_ad_url);
                        console.log("data", res.data);
                    })
                    .catch((err) => {
                        setSpinner(false);
                        if (err.response.status == "400") {
                            if (err.response.data.message == "jwt expired") {
                                clearAllDetails();
                            } else {
                                setTimeout(() => {
                                    toastr.warning(err.response.data.message);
                                }, 500);
                            }
                        } else {
                            setTimeout(() => {
                                toastr.warning(err.response.data.message);
                            }, 500);
                        }
                    })
                    .finally(() => {
                        setSpinner(false);
                    });
            })
            .catch(function (err) {
                setSpinner(false);
                toastr.warning(err.errors[0]);
            });
    };



    const handleImageLoad = () => {
        setLoader(false);
        setImageLoaded(true);
    };

    const handleEvent = () => {
        {
            imageLoaded &&
                setModalVisible(false);
        }
    };

    let viewMediaDetails = "";
    if (store.token) {
        viewMediaDetails = "/media/api/viewMediaDetails";
    } else {
        viewMediaDetails = "/guest/api/viewMediaDetails";
    }

    searchEvent = (searchTerm) => {
        let apiURL = "";
        if (store.token) {
            apiURL = "/media/api/searchTeamName";
        } else {
            apiURL = "/guest/api/searchTeamName";
        }
        if (searchTerm.includes("&") || searchTerm.includes("#") || searchTerm.includes("+") || searchTerm.includes("!")) {
            searchTerm = encodeURIComponent(searchTerm);
        };
        axios
            .get(env.BASE_URL + apiURL + '?team_name=' + searchTerm + '&event_id=' + route.params.eventID, {
                headers: { Authorization: `Bearer ${store.token}` },
            })
            .then(async ({ data }) => {
                data = await decryptData(data);
                setTeamList(data.data.team_name);
                // setEvents(data.data.event_list);
            })
            .catch((err) => {
                setSpinner(false);
                if (err.response.status == "400") {
                    if (err.response.data.message == "jwt expired") {
                        clearAllDetails();
                    } else {
                        setTimeout(() => {
                            toastr.warning(err.response.data.message);
                        }, 500);
                    }
                } else {
                    setTimeout(() => {
                        toastr.warning(err.response.data.message);
                    }, 500);
                }
            })
            .finally(() => {
            });
    }

    const submitData = (folder_name) => {
        const cred = {
            team_name: folder_name,
            event_id: String(eventID),
            limit: 100,
            page: 1,
        };
        setSpinner(true);
        axios
            .post(env.BASE_URL + viewMediaDetails, encryptData(cred), {
                headers: { Authorization: `Bearer ${store.token}` },
            })
            .then(async (res) => {
                res.data = await decryptData(res.data);
                setSpinner(false);
                setTimeout(() => {
                    navigation.navigate("ViewMediaScreen", {
                        cred: cred,
                        eventID: eventID,
                        event_name: route.params.event_name
                    });
                    return;
                }, 500);
            })
            .catch((err) => {
                setSpinner(false);
                if (err.response.status == "400") {
                    if (err.response.data.message == "jwt expired") {
                        clearAllDetails();
                    } else {
                        setTimeout(() => {
                            toastr.warning(err.response.data.message);
                        }, 500);
                    }
                } else {
                    setTimeout(() => {
                        toastr.warning(err.response.data.message);
                    }, 500);
                }
            })
            .finally(() => {
                setSpinner(false);
            });
    };

    const handleADEvent = async () => {
        try {
            {
                let eventID = route?.params?.eventID;
                let serializedArray = JSON.stringify(eventID);
                await AsyncStorage.setItem("eventList", serializedArray);
            }
        } catch (e) { }
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
                    keyboardShouldPersistTaps={"handled"}
                >
                    <View style={styles.contentView}>
                        <ScrollView keyboardShouldPersistTaps={"handled"}>
                            <HeaderText text={route.params.event_name} />
                            <View style={{ marginHorizontal: "5%" }}>
                                <ContentHeader text={store.textData.team_search_text} />
                            </View>

                            <View style={styles.formView}>
                                {/* Verify Account */}
                                <UEPTextInput
                                    onChangeText={(e) => {
                                        setActNumber(e);
                                        if (e != "") {
                                            searchEvent(e);
                                        }
                                        else {
                                            setTeamList([])
                                        }
                                    }}
                                    value={actNumber}
                                    placeholder="Team Name"
                                    keyboardType="default"
                                    textAlign="center"
                                    multiline={Platform.OS === 'android' ? true : false}
                                />
                            </View>
                            {actNumber != "" && (
                                <FlatList
                                    keyExtractor={() => {
                                        new Date();
                                    }}
                                    bounces={false}
                                    keyboardShouldPersistTaps={"handled"}
                                    data={teamList}
                                    contentContainerStyle={{ marginVertical: 20 }}
                                    renderItem={({ item }) =>
                                        <TouchableOpacity onPress={() =>
                                            setTimeout(() => {
                                                submitData(item.team_name)
                                            }, 500)
                                        }>
                                            <View style={{ width: '90%', backgroundColor: colors.uep_pink, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 15, minHeight: 50, borderRadius: 10, padding: 5 }}>
                                                <Text style={{ fontFamily: fonts.BebasNeueRegular, color: '#FCFAFA', textAlign: 'center', letterSpacing: 0.7, fontSize: 25, }}>{item.team_name}</Text>
                                            </View>
                                        </TouchableOpacity>

                                    }
                                />
                            )}
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>

            {imageUrl !== "" && imageUrl != null && (
                <>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(false);
                        }}
                    >
                        <SafeAreaView >
                            <BlurView blurType="light">
                                <View style={{ marginTop: '0%', height: '100%', width: '100%', justifyContent: 'center', alignSelf: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', flexDirection: 'column', }}>
                                    <View>
                                        {/* <TouchableOpacity style={{ marginTop: Platform.OS === 'android' ? '30%' : '40%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginHorizontal: 20 }} disabled={loader} onPress={() => setModalVisible(false)}>
                                            <Text style={{ color: "white", fontFamily: 'BebasNeue-Regular', fontSize: 24, }}>CONTINUE &nbsp;</Text>
                                            <Image source={require('../../assets/continue.png')} style={{ height: 18, width: 30 }} />
                                        </TouchableOpacity> */}
                                        {/* <TouchableOpacity style={{ marginTop: Platform.OS === 'android' ? '35%' : '40%', alignItems: 'center' }} onPress={() => setModalVisible(false)}>
                                            <View style={styles.buttonContainer}>
                                                <Text style={styles.buttonText1}>CONTINUE</Text>
                                            </View>
                                        </TouchableOpacity> */}
                                    </View>
                                    <View style={{ height: '88%', marginTop: '15%', }}>
                                        {/* <Text style={{ color: "white", fontFamily: 'BebasNeue-Regular', fontSize: 18, letterSpacing: 1, alignSelf: 'flex-start', marginHorizontal: 20, }}>ADVERTISEMENT</Text> */}

                                        {loader ?
                                            < View style={{ marginTop: 5, top: 200, left: 0, right: 0, bottom: 0, justifyContent: 'flex-start', alignItems: 'center', position: 'absolute', }}>
                                                <ActivityIndicator size={"large"} hidesWhenStopped={true} color={"white"} />
                                            </View> : null
                                        }
                                        <TouchableOpacity style={{ marginTop: 5, flex: 1 }} onPress={handleEvent}>
                                            <Image source={{ uri: imageUrl }} style={{ width: '90%', height: '95%', alignSelf: 'center', resizeMode: 'stretch' }} onLoad={handleImageLoad} />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={handleEvent}>
                                        <View style={styles.buttonContainer}>
                                            <Text style={styles.buttonText1}>CONTINUE</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </BlurView>
                        </SafeAreaView>
                    </Modal></>
            )}
        </View >
    );
};

export default CheerModeScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#3F3F3F",
        alignItems: "center",
    },
    contentView: {
        flex: 1,
        marginTop: "2%",
        marginHorizontal: "5%",
    },
    formView: {
        marginHorizontal: 10,
        marginVertical: 20,
    },
    buttonContainer: {
        // backgroundColor: 'transparent',
        // borderWidth: 1,
        // borderColor: '#FFFFFF',
        // height: 40,
        // width: 280,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 0,
        justifyContent: 'flex-start',
        bottom: "50%",
    },
    buttonText1: {
        color: 'white',
        fontSize: 26,
        textAlign: 'center',
        fontFamily: 'BebasNeue-Regular',
    },
});

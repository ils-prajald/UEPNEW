import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    ScrollView,
    View,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Keyboard,
    Text,
    FlatList,
    TouchableOpacity
} from "react-native";

import { Select } from "native-base";
import fonts from "../../constants/fonts";

import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import env from "../../constants/env";
import axios from "axios";
import colors from "../../constants/colors";
import Spinner from "react-native-loading-spinner-overlay";

//Components
import Header from "../../components/Header";
import UEPButton from "../../components/UEPButton";
import ScreenHeader from "../../components/ScreenHeader";
import { toastr, yupSchema, storage } from "../utilities/index";
import {
    encryptData,
    decryptData
} from '../../utilities/Crypto';
import moment from "moment";
import { store } from "../../store/Store";
import { LoginContext } from "../../Context/LoginProvider";
import { useFocusEffect } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";

const BillingInfoScreen = ({ navigation, route }) => {
    const { clearAllDetails, setNotificationCount } = React.useContext(LoginContext);
    const [notifications, setNotifications] = useState([]);
    const [statesList, setStatesList] = useState([]);
    const [citiesList, setCitiesList] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [street, setStreet] = useState("");
    const [apartment, setApartment] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [countryID, setCountryID] = useState("");
    const [stateID, setStateID] = useState("");
    const [cityID, setCityID] = useState("");
    const [spinner, setSpinner] = useState(false);
    const [savedUser, setSavedUser] = useState("");

    useFocusEffect(
        React.useCallback(() => {
            handleFetch();
        }, [])
    );

    const handleFetch = () => {
        setSpinner(true);
        axios
            .get(env.BASE_URL + "/notification/api/getUserTimelineNotifications", {
                headers: { Authorization: `Bearer ${store.token}` },
            })
            .then(async ({ data }) => {
                data = await decryptData(data);
                setNotifications(data.data.notificationDetails);
                setSpinner(false);
                if (data.data.notificationDetails.length > 0) {
                    var notiarray = [];
                    for (var i = 0; i < data.data.notificationDetails.length; i++) {
                        notiarray.push(data.data.notificationDetails[i].id);
                    }
                    readNotifications(notiarray);
                }
            })
            .catch(async (err) => {
                setNotifications([]);
                setSpinner(false);
                if (err.response.status == "400") {
                    if (err.response.data.message == "jwt expired") {
                        clearAllDetails();
                    } else {
                        setTimeout(() => {
                            toastr.warning(err.response.data.message);
                        }, 300);
                    }
                } else {
                    setTimeout(() => {
                        toastr.warning(err.response.data.message);
                    }, 300);
                }
            });
    }

    const readNotifications = (notiarray) => {
        axios
            .put(env.BASE_URL + "/notification/api/updateNotificationReadStatus", encryptData({ notification_ids: notiarray }), {
                headers: { Authorization: `Bearer ${store.token}` },
            })
            .then(async (res) => {
                // res = await decryptData(res);
                setNotificationCount(0);
            })
            .catch((err) => {
            });
    }

    return (
        <View style={styles.screen}>
            <SafeAreaView>
                <Spinner visible={spinner} />
                <LinearGradient colors={["#393838", "#222222"]}>
                    <Header />
                </LinearGradient>
                {/* {notifications.length > 0 && (
                    <TouchableOpacity>
                        <Text style={{ alignSelf: 'flex-end', color: '#FFF', fontFamily: fonts.AvenirNextCondensedDemiBold, fontSize: RFValue(16), marginRight: 15, marginTop: 10 }}>Clear All</Text>
                    </TouchableOpacity>
                )} */}
                <FlatList
                    bounces={false}
                    data={notifications}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ marginHorizontal: 15, paddingVertical: 25 }}
                    renderItem={({ item, index, separators }) => (
                        <View style={{ borderBottomColor: colors.header, borderBottomWidth: 0.5, paddingVertical: 15, fontFamily: fonts.AvenirNextCondensedDemiBold }}>
                            <Text style={{ color: '#FFF', fontSize: RFValue(14), marginLeft: 10 }}>{item.message}</Text>
                            <Text style={{ color: '#FFF', fontSize: RFValue(11), marginLeft: 10, marginTop: 5 }}>{moment(item.created_datetime).format('MMM D, YYYY HH:mm A')}</Text>
                        </View>
                    )}
                />
            </SafeAreaView>
        </View>
    );
};

export default BillingInfoScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#3F3F3F",
        alignItems: "center"
    }
});

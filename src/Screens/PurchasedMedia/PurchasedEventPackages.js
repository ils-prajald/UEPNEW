import React, { useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, ScrollView, Text, TextInput, FlatList, TouchableOpacity } from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
//Components
import Header from "../../components/Header";
import { useFocusEffect } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
import fonts from "../../constants/fonts";
import {
    encryptData,
    decryptData
} from '../../utilities/Crypto';
import colors from "../../constants/colors";
import axios from "axios";
import { LoginContext } from "../../Context/LoginProvider";
import env from "../../constants/env";
import { store } from "../../store/Store";
import { toastr } from "../utilities/index";

const PurchasedEventPackages = ({ props, route, navigation }) => {
    const { clearAllDetails, setSelectedPackage, setPackageListArray, } = React.useContext(LoginContext);
    const [spinner, setSpinner] = useState(false);
    const [eventPackages, setEventPackages] = useState([]);
    const [event_mode_id, setEvent_mode_id] = useState(1);

    useFocusEffect(
        React.useCallback(() => {
            setSelectedPackage({});
            setPackageListArray([]);
            global.userIndex = 2;
            getActsList();
        }, [])
    );

    getActsList = () => {
        setSpinner(true);
        axios
            .get(env.BASE_URL + '/media/api/getPurchasedEventActOrTeamList?event_id=' + route.params.event_id, {
                headers: { Authorization: `Bearer ${store.token}` },
            })
            .then(async ({ data }) => {
                data = await decryptData(data);
                console.log("data==", data.data);
                setEvent_mode_id(data.data.event_mode_id)
                setEventPackages(data.data.ActOrTeamList)
                setSpinner(false);
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
    }


    return (
        <View style={styles.screen}>
            <SafeAreaView>
                <Spinner visible={spinner} />
                <LinearGradient colors={["#393838", "#222222"]}>
                    <Header />
                </LinearGradient>
                {eventPackages.length > 0 ? (
                    <View style={{ marginVertical: 20 }}>
                        <Text style={{ fontFamily: fonts.BebasNeueRegular, color: '#FCFAFA', textAlign: 'center', letterSpacing: 0.9, fontSize: 28 }}>{"Please tap on the routine"}</Text>
                        <Text style={{ fontFamily: fonts.BebasNeueRegular, color: '#FCFAFA', textAlign: 'center', letterSpacing: 0.9, fontSize: 28 }}>{"you wish to view"}</Text>
                    </View>
                ) : null}
                <View style={styles.contentView}>
                    <FlatList
                        bounces={false}
                        keyExtractor={() => {
                            new Date();
                        }}
                        data={eventPackages}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => navigation.navigate('PurchasedMediaHome', { search_by: event_mode_id == 1 ? item.folder_name : item.team_name, event_id: route.params.event_id })}>
                                <View style={{ width: '90%', backgroundColor: colors.uep_pink, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 15, minHeight: 70, borderRadius: 10, padding: 5 }}>
                                    {event_mode_id == 1 ?
                                        <Text style={{ fontFamily: fonts.BebasNeueRegular, color: '#FCFAFA', textAlign: 'center', letterSpacing: 0.7, fontSize: 22, }}>ACT # {item.folder_name}</Text>
                                        : <Text style={{ fontFamily: fonts.BebasNeueRegular, color: '#FCFAFA', textAlign: 'center', letterSpacing: 0.7, fontSize: 22, }}>{item.team_name}</Text>}
                                </View>
                            </TouchableOpacity>
                        }
                    />
                </View>
            </SafeAreaView>
        </View>
    );
};

export default PurchasedEventPackages;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#3F3F3F",
        alignItems: "center",
    },
    contentView: {
        marginTop: "2%",
        marginHorizontal: "3%",
        marginVertical: "85%"
    },
});

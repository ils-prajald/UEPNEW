import React, { useState, useEffect } from "react";
import { StyleSheet, View, KeyboardAvoidingView, ScrollView, Text, TextInput, FlatList, TouchableOpacity, Platform } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
//Components
import Header from "../../components/Header";
import { useFocusEffect } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
import fonts from "../../constants/fonts";
import colors from "../../constants/colors";
import env from "../../constants/env";
import { store } from "../../store/Store";
import axios from "axios";
import { LoginContext } from "../../Context/LoginProvider";
import { toastr } from "../utilities/index";
import moment from "moment";
import {
    encryptData,
    decryptData
} from '../../utilities/Crypto';

const PurchasedList = ({ navigation }) => {
    const { clearAllDetails } = React.useContext(LoginContext);
    const [spinner, setSpinner] = useState(false);
    const [events, setEvents] = useState([]);
    const [searchval, setSearchval] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            global.userIndex = 2;
            getAllEvents();
        }, [])
    );

    getAllEvents = () => {
        setSearchval('');
        setSpinner(true);
        axios
            .get(env.BASE_URL + '/media/api/getPurchasedEventList', {
                headers: { Authorization: `Bearer ${store.token}` },
            })
            .then(async ({ data }) => {
                data = await decryptData(data);
                setSpinner(false);
                setEvents(data.data.event_list);
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

    searchEvent = (searchTerm) => {
        axios
            .get(env.BASE_URL + '/media/api/getPurchasedEventList?search_by=' + searchTerm, {
                headers: { Authorization: `Bearer ${store.token}` },
            })
            .then(async ({ data }) => {
                data = await decryptData(data);
                setEvents(data.data.event_list);
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
                    <FlatList
                        keyExtractor={() => {
                            new Date();
                        }}
                        bounces={false}
                        data={events}
                        contentContainerStyle={{ marginVertical: 20 }}
                        ListHeaderComponent={(
                            <>
                                <View style={{ marginVertical: 20 }}>
                                    <Text style={{ fontFamily: fonts.BebasNeueRegular, color: '#FCFAFA', textAlign: 'center', letterSpacing: 0.9, fontSize: 28 }}>{store.textData.which_routine_would_text}</Text>
                                    <Text style={{ fontFamily: fonts.BebasNeueRegular, color: '#FCFAFA', textAlign: 'center', letterSpacing: 0.9, fontSize: 28 }}>{store.textData.you_like_to_view_text}</Text>
                                </View>

                                <TextInput placeholder="SEARCH" style={{
                                    height: 50,
                                    width: '75%',
                                    backgroundColor: '#FFF',
                                    borderRadius: 5,
                                    alignSelf: 'center',
                                    fontSize: 20,
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 15,
                                    color: "black"
                                }} multiline={Platform.OS === 'android' ? true : false} value={searchval} textAlign={'center'} placeholderTextColor={'#A9A9A9'} onChangeText={(search) => {
                                    setSearchval(search);
                                    if (search != '') {
                                        searchEvent(search);
                                    }
                                    else {
                                        getAllEvents();
                                    }
                                }} />
                            </>
                        )}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => navigation.navigate('PurchasedEventPackages', {
                                event_id: item.event_id
                            })}>
                                <View style={{ width: '90%', backgroundColor: colors.uep_pink, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 15, minHeight: 65, borderRadius: 10, padding: 5 }}>
                                    <Text style={{ fontFamily: fonts.BebasNeueRegular, color: '#FCFAFA', textAlign: 'center', letterSpacing: 0.7, fontSize: 24, }}>{item.event_name}</Text>
                                    <Text style={{ fontFamily: fonts.BebasNeueRegular, color: '#FCFAFA', textAlign: 'center', letterSpacing: 0.5, fontSize: 20, }}>{(item.start_date)} - {(item.end_date)}</Text>
                                </View>
                            </TouchableOpacity>
                        }
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                    <TouchableOpacity onPress={() => navigation.navigate('PurchasedOrderHistory')}>
                        <View style={{ width: '100%', backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', minHeight: 70, padding: 5 }}>
                            <Text style={{ fontFamily: fonts.BebasNeueRegular, color: colors.uep_pink, textAlign: 'center', letterSpacing: 0.7, fontSize: 25, }}>{store.textData.view_order_history_text}</Text>
                            {/* <Text style={{
                                color: colors.uep_pink,
                                fontSize: RFValue(15),
                                marginHorizontal: "1%",
                                fontFamily: fonts.AvenirNextCondensedDemiBold
                            }}>VIEW ORDER HISTORY</Text> */}
                        </View>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

export default PurchasedList;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#3F3F3F",
        alignItems: "center",
    },
    contentView: {
        marginTop: "2%",
        marginHorizontal: "3%",
    },
});

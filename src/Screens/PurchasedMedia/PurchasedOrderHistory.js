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
import moment from "moment";

const PurchasedOrderHistory = ({ navigation }) => {
    const { clearAllDetails } = React.useContext(LoginContext);
    const [spinner, setSpinner] = useState(false);
    const [orders, setOrders] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            global.userIndex = 8;
            getOrderHistory();
        }, [])
    );

    getOrderHistory = () => {
        setSpinner(true);
        axios
            .get(env.BASE_URL + '/orderHistory/api/orderReceiptList', {
                headers: { Authorization: `Bearer ${store.token}` },
            })
            .then(async ({ data }) => {
                data = await decryptData(data);
                setOrders(data.data.orderList);
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
                <View style={styles.contentView}>
                    <FlatList
                        keyExtractor={() => {
                            new Date();
                        }}
                        bounces={false}
                        data={orders}
                        contentContainerStyle={{ marginVertical: 20, paddingBottom: 10 }}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => navigation.navigate('OrderReceipt', { order_id: item.id, order_number: item.order_number })}>
                                <View style={{ width: '90%', backgroundColor: colors.uep_pink, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 15, minHeight: 70, borderRadius: 10, padding: 5 }}>
                                    <Text style={{ fontFamily: fonts.BebasNeueRegular, color: '#FCFAFA', textAlign: 'center', letterSpacing: 0.7, fontSize: 22, }}>{item.order_number}</Text>
                                    <Text style={{ fontFamily: fonts.BebasNeueRegular, color: '#FCFAFA', textAlign: 'center', letterSpacing: 0.5, fontSize: 18, }}>{moment(item.purchase_datetime).format('MM/DD/YYYY hh:mm A')}</Text>
                                </View>
                            </TouchableOpacity>
                        }
                    />
                </View>
            </SafeAreaView>
        </View>
    );
};

export default PurchasedOrderHistory;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#3F3F3F",
        alignItems: "center",
    },
    contentView: {
        marginTop: "2%",
        marginHorizontal: "3%",
        flex: 1
    },
});

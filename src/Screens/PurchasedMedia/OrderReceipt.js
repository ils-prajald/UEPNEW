import React, { useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, ScrollView, Text, TextInput, FlatList, TouchableOpacity, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
//Components
import Header from "../../components/Header";
import { useFocusEffect } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
import fonts from "../../constants/fonts";
import colors from "../../constants/colors";
import axios from "axios";
import { LoginContext } from "../../Context/LoginProvider";
import env from "../../constants/env";
import { store } from "../../store/Store";
import { toastr } from "../utilities/index";
import moment from "moment";
import {
    encryptData,
    decryptData
} from '../../utilities/Crypto';
import Pdf from 'react-native-pdf';

const OrderReceipt = ({ navigation, route }) => {
    const { clearAllDetails } = React.useContext(LoginContext);
    const [spinner, setSpinner] = useState(false);
    const [orderDetails, setOrderDetails] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [receiptUrl, setReceiptUrl] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            global.userIndex = 8;
            getOrderDetail();
        }, [])
    );

    getOrderDetail = () => {
        setSpinner(true);
        // axios
        //     .get(env.BASE_URL + '/orderHistory/api/viewOrderReceipt?order_id=' + route.params.order_id, {
        //         headers: { Authorization: `Bearer ${store.token}` },
        //     })
        //     .then(async ({ data }) => {
        //         data = await decryptData(data);
        //         setOrderDetails(data.data);
        //         setDataLoaded(true);
        //         setSpinner(false);
        //     })
        //     .catch((err) => {
        //         setSpinner(false);
        //         if (err.response.status == "400") {
        //             if (err.response.data.message == "jwt expired") {
        //                 clearAllDetails();
        //             } else {
        //                 setTimeout(() => {
        //                     toastr.warning(err.response.data.message);
        //                 }, 500);
        //             }
        //         } else {
        //             setTimeout(() => {
        //                 toastr.warning(err.response.data.message);
        //             }, 500);
        //         }
        //     })
        //     .finally(() => {
        //         setSpinner(false);
        //     });
        axios
            .get(env.BASE_URL + '/preorder/api/sentInvoiceToUser?order_number=' + route.params.order_number, {
                headers: { Authorization: `Bearer ${store.token}` },
            })
            .then(async ({ data }) => {
                data.data.responseObj = await decryptData(data.data.responseObj)
                setReceiptUrl(data.data.responseObj.uploaded_file_url);
                setDataLoaded(true);
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
        <SafeAreaView style={styles.screen}>
            <Spinner visible={spinner} />
            <Header />
            <LinearGradient colors={["#393838", "#222222"]} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {dataLoaded && (
                    <View style={styles.container}>
                        <Pdf
                            source={{ uri: receiptUrl, cache: true }}
                            style={styles.pdf} />
                    </View>
                    // <ScrollView
                    //     contentContainerStyle={{
                    //         flexGrow: 1,
                    //         justifyContent: 'center',
                    //         flexDirection: 'column',
                    //     }} bounces={false}>
                    //     <View style={{
                    //         backgroundColor: '#FFF',
                    //         paddingHorizontal: 20,
                    //         paddingVertical: 30,
                    //         marginHorizontal: 25,
                    //     }}>
                    //         {orderDetails?.order_details && (
                    //             <>
                    //                 <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    //                     <View style={{ width: '55%' }}>
                    //                         <Text style={{
                    //                             color: '#222222',
                    //                             fontSize: 14,
                    //                             marginVertical: 3
                    //                         }}>Order No.:</Text>
                    //                         <Text style={{
                    //                             color: '#222222',
                    //                             fontSize: 14,
                    //                             marginVertical: 3
                    //                         }}>{orderDetails.order_details.order_number}</Text>
                    //                         <Text style={{
                    //                             color: '#222222',
                    //                             fontSize: 14,
                    //                             marginVertical: 3
                    //                         }}>Order Type: {orderDetails.order_details.order_mode_name}</Text>
                    //                     </View>
                    //                     <View style={{ width: '45%', alignItems: 'flex-end' }}>
                    //                         <Text style={{ textAlign: 'right', color: '#222222', fontSize: 14, marginVertical: 3 }}>Date: {moment(orderDetails.order_details.purchase_datetime).format('MM/DD/YYYY')}</Text>
                    //                         <Text style={{ textAlign: 'right', color: '#222222', fontSize: 14, marginVertical: 3 }}>Time: {moment(orderDetails.order_details.purchase_datetime).format('hh:mm:SS A')}</Text>
                    //                     </View>
                    //                 </View>
                    //                 <View style={{ borderTopWidth: 2, paddingVertical: 10, borderTopColor: '#222', marginTop: 10 }}>
                    //                     <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    //                         <View style={{ width: '10%' }}>
                    //                             <Text style={{ fontSize: 14, color: '#999999' }}>#</Text>
                    //                         </View>
                    //                         <View style={{ width: '50%' }}>
                    //                             <Text style={{ fontSize: 14, color: '#999999' }}>Title</Text>
                    //                         </View>
                    //                         <View style={{ width: '20%' }}>
                    //                             <Text style={{ fontSize: 14, color: '#999999' }}>Qty.</Text>
                    //                         </View>
                    //                         <View style={{ width: '20%', alignItems: 'flex-end', paddingRight: 10 }}>
                    //                             <Text style={{ fontSize: 14, color: '#999999' }}>Amt.</Text>
                    //                         </View>
                    //                     </View>
                    //                     {orderDetails?.ordered_packages.map((item, index) => {
                    //                         return (
                    //                             <View style={{ flexDirection: 'row', marginBottom: 10, flexWrap: 'wrap' }}>
                    //                                 <View style={{ width: '10%' }}>
                    //                                     <Text style={{ fontSize: 14, color: '#202020', fontFamily: fonts.AvenirNextCondensedDemiBold }}>{index + 1}.</Text>
                    //                                 </View>
                    //                                 <View style={{ width: '50%' }}>
                    //                                     <Text style={{ fontSize: 14, color: '#202020', fontFamily: fonts.AvenirNextCondensedDemiBold }}>{item.routine_name}</Text>
                    //                                 </View>
                    //                                 <View style={{ width: '20%' }}>
                    //                                     <Text style={{ fontSize: 14, color: '#202020', fontFamily: fonts.AvenirNextCondensedDemiBold }}>{item.quantity}</Text>
                    //                                 </View>
                    //                                 <View style={{ width: '20%', alignItems: 'flex-end', paddingRight: 10 }}>
                    //                                     <Text style={{ fontSize: 14, color: '#202020', fontFamily: fonts.AvenirNextCondensedDemiBold }}>$ {item.price}</Text>
                    //                                 </View>
                    //                             </View>
                    //                         );
                    //                     })}

                    //                 </View>

                    //                 <View style={{ flexDirection: 'row', flexWrap: 'wrap', borderTopWidth: 2, borderTopColor: '#222', justifyContent: 'space-between' }}>
                    //                     <Text style={{ color: '#202020', fontSize: 14, marginVertical: 3, marginLeft: 15 }}>
                    //                         Sub Total
                    //                     </Text>
                    //                     <Text style={{ color: '#202020', fontSize: 14, marginVertical: 3, marginRight: 10, alignSelf: 'flex-end', textAlign: 'right' }}>{orderDetails.total_price}</Text>
                    //                 </View>
                    //                 {orderDetails.shipping_fee != '$ 0' && (
                    //                     <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    //                         <Text style={{ color: '#202020', fontSize: 14, marginVertical: 3, marginLeft: 15 }}>
                    //                             Shipping Charges
                    //                         </Text>
                    //                         <Text style={{ color: '#202020', fontSize: 14, marginVertical: 3, marginRight: 10, alignSelf: 'flex-end', textAlign: 'right' }}>{orderDetails.shipping_fee}</Text>
                    //                     </View>
                    //                 )}
                    //                 <View style={{ flexDirection: 'row', flexWrap: 'wrap', borderTopWidth: 2, paddingVertical: 10, borderTopColor: '#222', justifyContent: 'space-between' }}>
                    //                     <Text style={{ fontWeight: 'bold', color: '#202020', fontSize: 18, marginLeft: 15 }}>Grand Total</Text>
                    //                     <Text style={{ fontWeight: 'bold', color: '#202020', fontSize: 18, marginRight: 10, alignSelf: 'flex-end', textAlign: 'right' }}>{orderDetails.grand_total}</Text>
                    //                 </View>
                    //             </>
                    //         )}
                    //     </View>
                    // </ScrollView>
                )}
                <TouchableOpacity
                    style={{
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 50,
                        position: 'absolute',
                        bottom: 10,
                        left: 10,
                        height: 50,
                        borderRadius: 100,
                        backgroundColor: colors.uep_pink
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name='chevron-left' size={30} color='#FFF' style={{ paddingRight: 3 }} />
                </TouchableOpacity>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default OrderReceipt;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.screen_bg
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
});
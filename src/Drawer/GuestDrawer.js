import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Alert, Platform, Modal, TouchableWithoutFeedback } from "react-native";
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from "@react-navigation/drawer";
import { store } from "../store/Store";
import { LoginContext } from "../Context/LoginProvider";
import { RFValue } from "react-native-responsive-fontsize";
import fonts from "../constants/fonts";
import colors from "../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNExitApp from 'react-native-exit-app';
import Popup from "../components/Popup";
import { CommonActions } from '@react-navigation/native';

const GuestDrawer = (props) => {
    const { commonLogout, isLoggedIn,
        initialParams,
        setInitialParams,
        setInitialRoute1 } = React.useContext(LoginContext);
    const [modalVisible, setModalVisible] = useState(false);

    const logOut = async () => {
        if (isLoggedIn) {
            commonLogout();
        }
        else {
            RNExitApp.exitApp();
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <TouchableOpacity style={styles.listcntr} onPress={() => {
                    setInitialRoute1('EventSearch');
                    global.guestIndex = 0;
                    props.navigation.closeDrawer();
                    props.navigation.dispatch(
                        CommonActions.reset({
                            routes: [
                                { name: 'EventSearch' }
                            ],
                        })
                    );
                }}>
                    <View style={styles.txtcntr}>
                        {/* <Text style={global.guestIndex == 0 ? styles.seltxtlbl : styles.txtlbl}>Search For A Routine</Text> */}
                        <Text style={global.guestIndex == 0 ? styles.seltxtlbl : styles.txtlbl}>Search For Event Media</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.listcntr} onPress={() => {
                    if (initialParams) {
                        global.guestIndex = 3;
                        if (initialParams.screen == 'ActNumberScreen') {
                            setInitialRoute1('ActNumberScreen');
                            setInitialParams(initialParams);
                            props.navigation.closeDrawer();
                            props.navigation.dispatch(
                                CommonActions.reset({
                                    routes: [
                                        { name: 'EventSearch' }
                                    ],
                                })
                            );
                        }
                        else {
                            setInitialRoute1('CheerModeScreen');
                            setInitialParams(initialParams);
                            props.navigation.closeDrawer();
                            props.navigation.dispatch(
                                CommonActions.reset({
                                    routes: [
                                        { name: 'EventSearch' }
                                    ],
                                })
                            );
                        }
                    }
                    else {
                        setInitialRoute1('EventSearch');
                        global.guestIndex = 0;
                        props.navigation.dispatch(
                            CommonActions.reset({
                                routes: [
                                    { name: 'EventSearch' }
                                ],
                            })
                        );
                    }
                }}>
                    <View style={styles.txtcntr}>
                        <Text style={global.guestIndex == 3 ? styles.seltxtlbl : styles.txtlbl}>Search For Another Routine</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.listcntr} onPress={() => {
                    global.guestIndex = 1;
                    props.navigation.closeDrawer();
                    props.navigation.dispatch(
                        CommonActions.reset({
                            routes: [
                                { name: 'ContactUEP' }
                            ],
                        })
                    );
                }}>
                    <View style={styles.txtcntr}>
                        <Text style={global.guestIndex == 1 ? styles.seltxtlbl : styles.txtlbl}>Contact UEP</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.listcntr} onPress={() => {
                    global.guestIndex = 2;
                    props.navigation.closeDrawer();
                    props.navigation.dispatch(
                        CommonActions.reset({
                            routes: [
                                { name: 'Login' }
                            ],
                        })
                    );
                }}>
                    <View style={styles.txtcntr}>
                        <Text style={global.guestIndex == 2 ? styles.seltxtlbl : styles.txtlbl}>Login</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.listcntr} onPress={async () => {
                    props.navigation.closeDrawer();
                    if (Platform.OS == "android") {
                        setModalVisible(!modalVisible);
                    }
                    else {
                        Alert.alert(
                            store.textData.exist_test,
                            "",
                            [
                                {
                                    text: "No",
                                    onPress: async () => {
                                        // alert('no')
                                    },
                                    style: "cancel"
                                },
                                {
                                    text: "Yes", onPress: async () => {
                                        logOut();
                                    }
                                }
                            ]
                        );
                    }
                }}>
                    <View style={styles.txtcntr}>
                        <Text style={styles.txtlbl}>Exit</Text>
                    </View>
                </TouchableOpacity>
            </DrawerContentScrollView>
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
                        <Popup
                            noClick={() => {
                                setModalVisible(!modalVisible);
                            }}
                            yesClick={() => {
                                setModalVisible(!modalVisible);
                                logOut();
                            }}
                            msg={store.textData.exist_test}
                            yestxt={'Yes'}
                            notxt={'No'}
                        />
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
};

export default GuestDrawer;

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        backgroundColor: '#212121',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    listcntr: { height: 50, flexDirection: 'row', alignItems: 'center' },
    txtlbl: {
        color: "white",
        fontSize: RFValue(17),
        fontFamily: fonts.AvenirNextCondensedBold,
        paddingLeft: "5%"
    },
    seltxtlbl: {
        fontSize: RFValue(17),
        fontFamily: fonts.AvenirNextCondensedBold,
        paddingLeft: "5%",
        color: colors.header,
    },
});

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
import { CommonActions } from '@react-navigation/native';
import Popup from "../components/Popup";

const CustomDrawer = (props) => {
  const {
    profile,
    commonLogout,
    isLoggedIn,
    WiFi,
    initialParams,
    setInitialParams,
    setInitialRoute1
  } = React.useContext(LoginContext);
  const [name, setName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);


  const getUserName = async () => {
    try {
      const value = await AsyncStorage.getItem("USER_NAME");
      if (value !== null) {
        setName(value);
      }
    } catch (e) {
    }
  };

  const logOut = async () => {
    if (isLoggedIn) {
      commonLogout();
    }
    else {
      RNExitApp.exitApp();
    }
  };

  useEffect(() => {
    getUserName();
  }, []);

  const setScreen = async () => {
    console.log('Vikalp123')
    try {
      await AsyncStorage.setItem("isScreen", '0');
    } catch (e) {
    }
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          marginTop: "10%",
          margin: "5%",
        }}
      >
        <View>
          <Text
            style={{
              color: "white",
              fontSize: RFValue(20),
              fontFamily: fonts.AvenirNextCondensedMediumItalic,
              paddingLeft: "5%",
              color: colors.header,
            }}
          >
            {isLoggedIn || name !== "" ? profile || name : null}
          </Text>
        </View>
      </View>
      <DrawerContentScrollView {...props}>
        <TouchableOpacity style={styles.listcntr} onPress={() => {
          setScreen();
          setInitialRoute1('EventSearch');
          global.userIndex = 0;
          props.navigation.closeDrawer();
          props.navigation.dispatch(
            CommonActions.reset({
              routes: [
                { name: 'Home' }
              ],
            })
          );
        }}>
          <View style={styles.txtcntr}>
            <Text style={global.userIndex == 0 ? styles.seltxtlbl : styles.txtlbl}>My Dashboard</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listcntr} onPress={() => {
          setScreen();
          setInitialRoute1('EventSearch');
          // setInitialParams(null);
          global.userIndex = 3;
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
            <Text style={global.userIndex == 3 ? styles.seltxtlbl : styles.txtlbl}>Search For Event Media</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listcntr} onPress={() => {
          setScreen();
          if (initialParams) {
            global.userIndex = 7;
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
            global.userIndex = 3;
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
            <Text style={global.userIndex == 7 ? styles.seltxtlbl : styles.txtlbl}>Search For Another Routine</Text>
          </View>
        </TouchableOpacity>

        {WiFi ? null :
          <TouchableOpacity style={styles.listcntr} onPress={() => {
            global.userIndex = 2;
            props.navigation.closeDrawer();
            // props.navigation.navigate('PurchasedMedia');
            props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  { name: 'PurchasedMedia' }
                ],
              })
            );
          }}>
            <View style={styles.txtcntr}>
              <Text style={global.userIndex == 2 ? styles.seltxtlbl : styles.txtlbl}>View My Purchased Media</Text>
            </View>
          </TouchableOpacity>
        }

        <TouchableOpacity style={styles.listcntr} onPress={() => {
          setScreen();
          setInitialRoute1('PurchasedOrderHistory');
          // setInitialParams(null);
          global.userIndex = 8;
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
            <Text style={global.userIndex == 8 ? styles.seltxtlbl : styles.txtlbl}>View Order History</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listcntr} onPress={() => {
          setScreen();
          global.userIndex = 4;
          props.navigation.closeDrawer();
          // props.navigation.navigate('UnderDev');
          props.navigation.dispatch(
            CommonActions.reset({
              routes: [
                { name: 'MyCartScreen' }
              ],
            })
          );
        }}>
          <View style={styles.txtcntr}>
            <Text style={global.userIndex == 4 ? styles.seltxtlbl : styles.txtlbl}>View My Cart</Text>
          </View>
        </TouchableOpacity>

        {WiFi ? null :
          <TouchableOpacity style={styles.listcntr} onPress={() => {
            setScreen();
            global.userIndex = 5;
            props.navigation.closeDrawer();
            // props.navigation.navigate('UnderDev');
            props.navigation.dispatch(
              CommonActions.reset({
                routes: [
                  { name: 'MyCartScreen' }
                ],
              })
            );
          }}>
            <View style={styles.txtcntr}>
              <Text style={global.userIndex == 5 ? styles.seltxtlbl : styles.txtlbl}>Check Out</Text>
            </View>
          </TouchableOpacity>
        }

        {WiFi ? null :
          <TouchableOpacity style={styles.listcntr} onPress={() => {
            setScreen();
            global.userIndex = 1;
            props.navigation.closeDrawer();
            // props.navigation.navigate('UserProfile');
            props.navigation.dispatch(
              CommonActions.reset({
                routes: [
                  { name: 'UserProfile' }
                ],
              })
            );
          }}>
            <View style={styles.txtcntr}>
              <Text style={global.userIndex == 1 ? styles.seltxtlbl : styles.txtlbl}>View My Profile</Text>
            </View>
          </TouchableOpacity>
        }

        {WiFi ? null :
          <TouchableOpacity style={styles.listcntr} onPress={() => {
            setScreen();
            global.userIndex = 6;
            props.navigation.closeDrawer();
            // props.navigation.navigate('ContactUEP');
            props.navigation.dispatch(
              CommonActions.reset({
                routes: [
                  { name: 'ContactUEP' }
                ],
              })
            );
          }}>
            <View style={styles.txtcntr}>
              <Text style={global.userIndex == 6 ? styles.seltxtlbl : styles.txtlbl}>Contact UEP</Text>
            </View>
          </TouchableOpacity>
        }

        <TouchableOpacity style={styles.listcntr} onPress={async () => {
          setScreen();
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
            <Text style={styles.txtlbl}>Log Out</Text>
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

export default CustomDrawer;

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

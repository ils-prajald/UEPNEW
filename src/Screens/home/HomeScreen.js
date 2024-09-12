import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  BackHandler,
  Alert, Platform, Modal, TouchableWithoutFeedback, Linking
} from "react-native";
import Header from "../../components/Header";
import LinearGradient from "react-native-linear-gradient";
import colors from "../../constants/colors";
import { store } from "../../store/Store";
import fonts from "../../constants/fonts";
import { LoginContext } from "../../Context/LoginProvider";
import { RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNExitApp from 'react-native-exit-app';
import { StackActions, CommonActions } from '@react-navigation/native';
//BG Images
const img1 = require("../../assets/home/purchased.jpg");
const img2 = require("../../assets/home/DancerLeapingcopy1.jpg");
const img3 = require("../../assets/home/Photographercopy1.jpg");
const img4 = require("../../assets/home/staff4.jpeg");
import Popup from '../../components/Popup';

const HomeScreen = ({ navigation }) => {
  const {
    setIsLoggedIn,
    setIsChecking,
    isLoggedIn,
    setCartCount,
    setNotificationCount,
    setInitialRoute,
    setUserId,
    WiFi } = React.useContext(LoginContext);
  const [savedUser, setSavedUser] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const getUser = async () => {
    try {
      const value = await AsyncStorage.getItem("USER");
      if (value !== null) {
        // value previously stored
        setSavedUser(value);
      }
    } catch (e) {
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      global.userIndex = 0;
      const onBackPress = () => {
        // navigation.navigate("Exit");
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
        // Return true to stop default back navigaton
        // Return false to keep default back navigaton
        return true;
      };
      // Add Event Listener for hardwareBackPress
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        // Once the Screen gets blur Remove Event Listener
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  const logOut = async () => {
    global.guestIndex = 2;
    global.userIndex = 0;
    if (isLoggedIn) {
      setUserId(null);
      setCartCount(0);
      setNotificationCount(0);
      setIsChecking(true);
      setInitialRoute("Home");
      setIsLoggedIn(false);
      //await AsyncStorage.clear();
      const asyncStorageKeys = await AsyncStorage.getAllKeys();
      if (asyncStorageKeys.length > 0) {
        if (Platform.OS === 'android') {
          await AsyncStorage.clear();
        }
        if (Platform.OS === 'ios') {
          await AsyncStorage.multiRemove(asyncStorageKeys);
        }
      }
      store.clearToken();
      setIsChecking(false);
    }
    else {
      RNExitApp.exitApp();
    }
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <LinearGradient colors={["#393838", "#222222"]}>
          <Header />
        </LinearGradient>
        <View style={styles.mainView}>
          <View style={styles.gridView}>
            <View style={styles.gridTopView}>
              <View style={styles.purchasedView}>
                <ImageBackground
                  source={img3}
                  style={styles.bgImage3}
                  resizeMode="stretch"
                >
                  <View style={styles.actionContainerView}>
                    {WiFi === false ?
                      <View style={styles.actionView}>
                        {store.token || savedUser !== "" ? (
                          <TouchableOpacity
                            style={styles.actionButtonView}
                            onPress={() => {
                              navigation.navigate("UserProfile");
                            }}
                          >
                            <Text style={styles.actionText}>{store.textData.view_my_profile_text}</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity style={styles.actionButtonView}>
                            <Text style={styles.actionText}>{store.textData.view_my_profile_text}</Text>
                          </TouchableOpacity>
                        )}
                      </View> :
                      <View style={styles.wifiActionView}>
                        <Text style={styles.actionText}>
                          {store.textData.view_my_profile_text}
                        </Text>
                      </View>}
                  </View>
                </ImageBackground>

              </View>
              <View style={styles.mediaView}>
                <ImageBackground
                  source={img2}
                  style={styles.bgImage}
                  resizeMode="cover"
                >
                  <View style={styles.actionContainerView}>
                    <View style={styles.actionView}>
                      <TouchableOpacity
                        style={styles.actionButtonView}
                        onPress={() => {
                          // navigation.navigate("EventSearch");
                          navigation.dispatch(
                            CommonActions.reset({
                              index: 0,
                              routes: [
                                { name: 'EventSearch' },
                              ],
                            })
                          );
                        }}
                      >
                        <Text style={styles.actionText}>
                          {store.textData.search_for_event_media_text}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            </View>
            <View style={styles.gridBottomView}>
              <View style={styles.profileView}>
                <ImageBackground
                  source={img1}
                  style={styles.bgImage}
                  resizeMode="cover"
                >
                  <View style={styles.actionContainerView}>
                    {WiFi === false ?
                      <View style={styles.actionView}>
                        {store.token || savedUser !== "" ? (
                          <TouchableOpacity
                            style={styles.actionButtonView}
                            onPress={() => {
                              //navigation.navigate("PurchasedMedia");
                              navigation.dispatch(
                                CommonActions.reset({
                                  index: 0,
                                  routes: [
                                    { name: 'PurchasedMedia' },
                                  ],
                                })
                              );
                            }}
                          >
                            <Text style={styles.actionText}>
                              {store.textData.view_purchased_media_text}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity style={styles.actionButtonView}>
                            <Text style={styles.actionText}>
                              {store.textData.view_purchased_media_text}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View> :
                      <View style={styles.wifiActionView}>
                        <Text style={styles.actionText}>
                          {store.textData.view_purchased_media_text}
                        </Text>
                      </View>
                    }
                  </View>
                </ImageBackground>
              </View>
              <View style={styles.contactView}>
                <ImageBackground
                  source={img4}
                  style={styles.bgImage}
                  resizeMode="cover"
                >
                  <View style={styles.actionContainerView}>
                    {WiFi === false ?
                      <View style={styles.actionView}>
                        <TouchableOpacity
                          style={styles.actionButtonView}
                          onPress={() => {
                            navigation.navigate("ContactUEP");
                          }}
                        >
                          <Text style={styles.actionText}>{store.textData.contact_uep_text}</Text>
                        </TouchableOpacity>
                      </View> : <View style={styles.wifiActionView}>
                        <Text style={styles.actionText}>
                          {store.textData.contact_uep_text}
                        </Text>
                      </View>}
                  </View>
                </ImageBackground>
              </View>
            </View>
          </View>
          <View style={styles.bottomView}>
            <TouchableOpacity onPress={async () => await Linking.openURL('https://www.uephd.com/contactless-order-form-landing')}>
              <Text>
                <Text style={styles.placeAnOrderText}>
                  {store.textData.place_pre_order_for_upcoming_event_text}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: '#212121',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  screen: {
    flex: 1,
    backgroundColor: "#3F3F3F",
    alignItems: "center",
    opacity: 1,
  },
  mainView: {
    flex: 1,
    backgroundColor: "white",
  },
  gridView: {
    height: "90%",
  },
  gridTopView: {
    height: "50%",
    flexDirection: "row",
  },
  purchasedView: {
    width: "50%",
    justifyContent: "center",
    borderColor: "gray",
    borderWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  mediaView: {
    width: "50%",
    borderColor: "gray",
    borderWidth: 0,
  },
  profileView: {
    width: "50%",
    borderColor: "gray",
    borderWidth: 0,
    borderRightWidth: 0,
  },
  contactView: {
    width: "50%",
    borderColor: "gray",
    borderWidth: 0,
    borderTopWidth: 0,
  },
  gridBottomView: {
    height: "50%",
    flexDirection: "row",
  },

  bgImage: {
    flex: 1,
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  bgImage3: {
    flex: 1,
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  actionView: {
    backgroundColor: colors.uep_pink,
    flex: 1,
    position: "absolute",
    bottom: 15,
    marginHorizontal: 15,
    padding: 10,
    borderRadius: 5,
    width: "85%",
    height: 60,
    justifyContent: "center",
  },
  wifiActionView: {
    backgroundColor: 'gray',
    flex: 1,
    position: "absolute",
    bottom: 15,
    marginHorizontal: 15,
    padding: 10,
    borderRadius: 5,
    width: "85%",
    height: 60,
    justifyContent: "center",
  },
  actionText: {
    color: "white",
    textAlign: "center",
    fontFamily: fonts.AvenirNextCondensedBold,
    marginHorizontal: "6%",
  },
  actionContainerView: {
    flex: 1,
    alignItems: "center",
  },
  actionButtonView: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: "-7%",
  },
  bottomView: {
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "2%",
  },
  placeAnOrderText: {
    color: colors.uep_pink,
    fontSize: RFValue(15),
    marginHorizontal: "1%",
    fontFamily: fonts.AvenirNextCondensedDemiBold,
  },
});

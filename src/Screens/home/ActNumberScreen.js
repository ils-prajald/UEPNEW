import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import env from "../../constants/env";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
import { store } from "../../store/Store";
import { LoginContext } from "../../Context/LoginProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
//Components
import Header from "../../components/Header";
import UEPButton from "../../components/UEPButton";

import { toastr, yupSchema } from "../utilities/index";
import UEPTextInput from "../../components/UEPTextInput";
import HeaderText from "../../components/HeaderText";
import ContentHeader from "../../components/ContentHeader";
import { encryptData, decryptData } from "../../utilities/Crypto";
import { BlurView } from '@react-native-community/blur';
import { any } from "expect";
import Popup from "../../components/Popup";
import NoDataCard from '../../components/NoDataCard';

const ActNumberScreen = ({ props, route, navigation }) => {
  const { clearAllDetails, setSelectedPackage, setPackageListArray } = React.useContext(LoginContext);
  const [actNumber, setActNumber] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [loader, setLoader] = useState(false);
  const eventID = route.params.eventID;
  const acresRef = React.useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  let [modalVisible2, setModalVisible2] = useState(false);
  let [modalVisible4, setModalVisible4] = useState(false);
  console.log("route", route.params);

  const event_url = route.params.event_url;

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

  const handleStudio = () => {
    if (store.token == "") {
      if (Platform.OS == "android") {
        setModalVisible2(!modalVisible2);
      }
      else {
        Alert.alert(
          store.textData.signed_into_free_account_text,
          "",
          [
            {
              text: store.textData.cancel_text,
              onPress: async () => {
                // alert('no')
              },
              style: "cancel"
            },
            {
              text: store.textData.create_account_text, onPress: async () => {
                navigation.navigate('CreateAccount');
              }
            }
          ]
        );
      }
    } else {
      if (route.params.is_free == 1) {
        // setmodal(false);
        if (Platform.OS == "android") {
          setModalVisible4(!modalVisible4);
        }
        else {
          Alert.alert(

            "There is no need to order digital files, the media is FREE!  All digital files will be delivered to your studio shortly after the competition!",
            "",
            [
              { text: store.textData.okay_text, onPress: () => console.log("") }
            ]
          );
        }

      }
      else {
        navigation.navigate("PricesListScreen", {
          eventID: route.params.cred.event_id,
          flag: 'not_purchased',
        })
      }
    }
  }

  const handleImageLoad = () => {
    setLoader(false);
    setImageLoaded(true);
  };

  let viewMediaDetails = "";
  if (store.token) {
    viewMediaDetails = "/media/api/viewMediaDetails";
  } else {
    viewMediaDetails = "/guest/api/viewMediaDetails";
  }

  const submitData = () => {
    if (actNumber != "") {
      const cred = {
        act_number: actNumber,
        event_id: String(eventID),
        limit: 100,
        page: 1,
      };
      yupSchema
        .validateActNumber()
        .validate(cred)
        .then(() => {
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
        })
        .catch((err) => {
          setSpinner(false);
          toastr.warning(err.errors[0]);
        });
    } else {
      toastr.warning("Please Enter Routine Number");
    }
  };

  const handleEvent = () => {
    {
      imageLoaded &&
        setModalVisible(false);
    }
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

  const acresFocus = () => {
    acresRef.current.blur();
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
            <HeaderText text={route.params.event_name} />
            <View style={{ marginHorizontal: "5%" }}>
              <ContentHeader text={store.textData.act_search_text} />
            </View>

            <View style={styles.formView}>
              {showPassword === false ? (
                <View style={styles.showPasswordView}>
                  <UEPTextInput
                    onChangeText={(e) => {
                      setActNumber(e);
                    }}
                    value={actNumber}
                    placeholder="Routine Number"
                    keyboardType="numeric"
                    textAlign="center"
                    acresRef={acresRef}
                    onFocus={() => setShowIcon(true)}
                    onBlur={() => setShowIcon(false)}
                  />
                  {showIcon && (
                    <View style={styles.iconView}>
                      <TouchableOpacity
                        onPress={() => {
                          setShowPassword(true);
                        }}
                      >
                        <Image
                          source={require("../../assets/keyboard.png")}
                          style={styles.iconImage1}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.showPasswordView}>
                  <UEPTextInput
                    onChangeText={(e) => {
                      setActNumber(e);
                    }}
                    value={actNumber}
                    placeholder="Routine Number"
                    textAlign="center"
                    acresRef={acresRef}
                    onFocus={() => setShowIcon(true)}
                    onBlur={() => setShowIcon(false)}
                  />
                  {showIcon && (
                    <View style={styles.iconView}>
                      <TouchableOpacity
                        onPress={() => {
                          setShowPassword(false);
                        }}
                      >
                        <Image
                          source={require("../../assets/keypad.png")}
                          style={styles.iconImage}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity style={{ marginHorizontal: "15%", marginBottom: 20 }} onPressIn={handleStudio}>
            <Text style={{ fontSize: 26, color: colors.uep_pink, fontFamily: fonts.BebasNeueRegular, textAlign: 'center' }}>TAP HERE TO PLACE A STUDIO ORDER FOR TEN OR MORE ROUTINES</Text>
          </TouchableOpacity>
          <View style={{ marginHorizontal: "5%" }}>
            <UEPButton
              title={store.textData.continue_text}
              onPressButton={() => {
                acresFocus();
                setTimeout(() => {
                  submitData()
                }, 500);
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {/* {imageUrl !== null && imageUrl !== "" && imageUrl !== undefined && imageUrl !== "undefined" && (
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
                <View style={{ marginTop: '0%', height: '100%', width: '100%', justifyContent: 'center', alignSelf: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', flexDirection: 'column', }}>
                  <View>
                    <TouchableOpacity style={{ marginTop: Platform.OS === 'android' ? '30%' : '40%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginHorizontal: 20 }} disabled={loader} onPress={() => setModalVisible(false)}>
                      <Text style={{ color: "white", fontFamily: 'BebasNeue-Regular', fontSize: 24, }}>CONTINUE &nbsp;</Text>
                      <Image source={require('../../assets/continue.png')} style={{ height: 18, width: 30 }} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ height: '100%', marginTop: '10%', }}>
                    <Text style={{ color: "white", fontFamily: 'BebasNeue-Regular', fontSize: 18, letterSpacing: 1, alignSelf: 'flex-start', marginHorizontal: 20, }}>ADVERTISEMENT</Text>
                    {loader ?
                      < View style={{ marginTop: 5, top: 200, left: 0, right: 0, bottom: 0, justifyContent: 'flex-start', alignItems: 'center', position: 'absolute', }}>
                        <ActivityIndicator size={"large"} hidesWhenStopped={true} />
                      </View> : null
                    }
                    <TouchableOpacity style={{ marginTop: 5, flex: 1 }} onPress={() => setModalVisible(false)}>
                      <Image source={{ uri: imageUrl }} style={{ width: '90%', height: '70%', alignSelf: 'center', resizeMode: 'contain' }} onLoad={handleImageLoad} />
                    </TouchableOpacity>
                  </View>
                </View>
              </BlurView>
            </SafeAreaView>
          </Modal></>
      )} */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          setModalVisible2(!modalVisible2);
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
                setModalVisible2(!modalVisible2);
              }}
              yesClick={() => {
                setModalVisible2(!modalVisible2);
                setTimeout(() => {
                  navigation.navigate('CreateAccount');
                }, 500);
              }}
              msg={store.textData.signed_into_free_account_text}
              yestxt={store.textData.create_account_text_2}
              notxt={store.textData.cancel_text}
            />
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
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
                <View style={{ marginTop: '0%', height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', flexDirection: 'column', }}>
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
                      </View>
                      : null
                    }
                    <TouchableOpacity style={{ marginTop: 5, flex: 1 }} onPress={handleEvent}>
                      <Image source={{ uri: imageUrl }} style={{ width: '90%', height: '95%', alignSelf: 'center', resizeMode: 'stretch' }} onLoad={handleImageLoad} />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={{ alignItems: 'center', }} onPress={handleEvent}>
                    <View style={styles.buttonContainer}>
                      <Text style={styles.buttonText1}>CONTINUE</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </BlurView>
            </SafeAreaView>
          </Modal></>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible4}
        onRequestClose={() => {
          setModalVisible4(!modalVisible4);
        }}
      >
        <TouchableOpacity
          style={styles.modal}
          activeOpacity={1}
        // onPressOut={() => setModalVisible(!modalVisible)}
        >
          <TouchableWithoutFeedback>
            <NoDataCard
              btnTitle={store.textData.okay_text}
              title="There is no need to order digital files, the media is FREE!  All digital files will be delivered to your studio shortly after the competition!"
              activeOpacity={1}
              onPress={() => {
                setModalVisible4(!modalVisible4);
              }}
              showButton={true}
            />
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View >
  );
};

export default ActNumberScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#3F3F3F",
    alignItems: "center",
  },
  contentView: {
    flex: 1,
    marginTop: "2%",
    marginHorizontal: "15%",
  },
  formView: {
    marginHorizontal: 10,
    marginVertical: 20,
  },
  iconView: {
    // backgroundColor: "green",
    height: 20,
    width: 40,
    right: "2%",
    marginTop: "4%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  iconImage1: {
    width: 25,
    height: 20,
    tintColor: "white",
  },
  iconImage: {
    width: 25,
    height: 25,
    tintColor: "white",
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
  modal: {
    flex: 1,
    // backgroundColor: '#212121',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
});

import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, Image, FlatList, BackHandler, ImageBackground, Modal, TouchableWithoutFeedback, TouchableOpacity, Platform, Alert } from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
//Components
import Header from "../../components/Header";
import UEPButton from "../../components/UEPButton";
import fonts from "../../constants/fonts";
import { store } from "../../store/Store";
import { LoginContext } from "../../Context/LoginProvider";
import colors from "../../constants/colors";
import axios from "axios";
import env from "../../constants/env";
import { toastr } from "../utilities/index";
import Spinner from "react-native-loading-spinner-overlay";
import { useFocusEffect } from "@react-navigation/native";
import NoDataCard from '../../components/NoDataCard';
import { encryptData, decryptData } from "../../utilities/Crypto";
import Popup from "../../components/Popup";

const ViewPackageScreen = ({ navigation, route }) => {

  const { clearAllDetails, SelectedPackage, setSelectedPackage, packageListArray, setPackageListArray, setIsPersonal, setCartCount } = React.useContext(LoginContext);
  let { packageDet, event_id, imageCount, act_number } = route.params;

  // let [files, setFiles] = useState(store.packageList);
  // let [file_ids] = useState(store.fileIDsList);
  const [spinner, setSpinner] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  let [modalVisible2, setModalVisible2] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // navigation.navigate("MyCartScreen");
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );


  // files.push({
  //   file_id: fileID,
  //   file_url: fileURL,
  // });

  // file_ids.push(fileID);
  // store.setPackageList(files);
  // store.setFileIDsList(file_ids);

  const submitPackage = () => {
    console.log("act number", act_number);
    var fid = [];
    if (packageListArray.length > 0) {
      for (var i = 0; i < packageListArray.length; i++) {
        fid.push(packageListArray[i].file_id);
      }
    }
    // if (fid.length > 0) {
    setSpinner(true);
    console.log("FileId 123", fid);
    console.log('packageListArray----', packageListArray)
    const cred = {
      file_ids: (packageDet.is_quick_buy == 1 || packageDet.is_quick_buy == 2 || packageDet.is_quick_buy == 3) ? [] : fid,
      event_id: event_id,
      event_package_id: packageDet.event_package_id,
      search_by: act_number,
      is_quick_buy: packageDet.is_quick_buy,
      source_screen: route.params.flag == "purchased" ? 'purchased_media' : 'view_media'
    }
    console.log("cred---", cred);
    axios.post(env.BASE_URL + "/media/api/addFilesToCart", encryptData(cred), {
      headers: { Authorization: `Bearer ${store.token}` },
    })
      .then(async (res) => {
        res.data = await decryptData(res.data);
        setSpinner(false);
        if (res.data.data) {
          setCartCount(res.data.data.user_cart_count);
          // setSelectedPackage({});
          // setPackageListArray([]);
          // setTimeout(() => {
          //   toastr.success("Files added to cart successfully");
          // }, 1000)
          // navigation.navigate("MyCartScreen");
          setModalVisible(!modalVisible);
        }
        else {
          setTimeout(() => {
            toastr.warning(res.data.message);
          }, 5000);
        }
      })
      .catch((err) => {
        setSpinner(false);
        if (err.response.status == "400") {
          if (err.response.data.message == "jwt expired") {
            clearAllDetails();
          } else {
            setTimeout(() => {
              toastr.warning(err.response.data.message);
            }, 5000);
          }
        } else {
          setSpinner(false);
          setTimeout(() => {
            toastr.warning(err.response.data.message);
          }, 5000);
        }
      })
    // }
  }

  const stringifyNumber = (n) => {
    var special = ['Zeroth', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth', 'Eleventh', 'Twelvth', 'Thirteenth', 'ourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'];
    var deca = ['twent', 'thirt', 'fourt', 'fift', 'sixt', 'sevent', 'eight', 'ninet'];
    if (n < 20) return special[n];
    if (n % 10 === 0) return deca[Math.floor(n / 10) - 2] + 'ieth';
    return deca[Math.floor(n / 10) - 2] + 'y-' + special[n % 10];
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <Spinner visible={spinner} />
        <LinearGradient colors={["#393838", "#222222"]}>
          <Header />
        </LinearGradient>
        <ScrollView>
          <View style={{
            // marginLeft: '8%',
            // marginRight: '5%',
            // marginVertical: '5%',
            margin: '5%',
            alignItems: 'center'
          }}>
            {packageListArray.length > 0 && (
              <Text style={{
                marginBottom: '2%'
              }}>
                <Text style={styles.text}>You have selected the </Text>
                <Text style={styles.text1}>{stringifyNumber(packageListArray.length)}</Text>
                <Text style={styles.text}> image for this package, Please tap to {packageListArray.length >= packageDet.no_of_files ? 'COMPLETE PACKAGE below to add it to your cart.' : 'CONTINUE below to Select the next image.'}</Text>
              </Text>
            )}

            {packageListArray.map((_item, index) => {
              console.log('packageListArray----', _item);
              return (
                <View style={{
                  flexDirection: 'row',
                  marginVertical: route.params.flag == "purchased" ? -20 : '3%',
                }}>
                  {/* <View style={{ width: '5%' }}></View> */}
                  <View style={{
                    width: '20%',
                    justifyContent: 'center',
                    // alignItems: 'center'
                  }}>
                    <Text style={{
                      color: 'white',
                      fontSize: RFValue(18),
                      marginLeft: 15,
                      fontFamily: fonts.AvenirNextCondensedBold
                    }}>{index + 1}.</Text>
                  </View>
                  {route.params.flag == "purchased" ? (
                    <View style={{ width: '80%', paddingVertical: 0 }}>
                      <ImageBackground
                        source={{ uri: _item.file_url }}
                        // resizeMode="contain" 
                        style={{
                          // width: 200,
                          // height: 133.33,

                          height: 200,
                          width: 133.33,
                          marginLeft: 30,

                          transform: [{ rotate: '90deg' }],
                        }}>
                      </ImageBackground>
                    </View>
                  ) : (
                    <View style={{ width: '80%', }}>
                      <ImageBackground
                        source={{ uri: _item.file_url }}
                        resizeMode="contain" style={{
                          width: 200,
                          height: 133.33,
                        }}>
                        {/* <Image source={{ uri: 'https://storage.googleapis.com/sa-uep-viewer-176-stg/users/watermark(1).png' }} style={{
                         width: 200,
                         height: 133.33,
                         resizeMode: 'contain'
                       }} /> */}
                      </ImageBackground>
                    </View>
                  )}

                </View>
              )
            })}
          </View>

        </ScrollView>

        {packageDet.no_of_files == 0 && (
          <View style={{ marginHorizontal: '5%' }}>
            {imageCount >= packageListArray.length && (
              <View style={styles.buttonView}>
                <TouchableOpacity style={styles.button} onPress={() => {
                  const cred = route.params.event_mode_id === 1 ? {
                    act_number: route.params.act_number,
                    event_id: String(route?.params?.event_id || route?.params?.eventID || route?.params?.cred?.event_id)
                  } :
                    {
                      team_name: route.params.act_number,
                      event_id: String(route?.params?.event_id || route?.params?.eventID || route?.params?.cred?.event_id)
                    }
                  navigation.navigate("ViewImage", {
                    images: route.params.images,
                    imageUrl: route.params.imageUrl,
                    fileName: route.params.fileName,
                    eventID: route.params.eventID,
                    flag: route.params.flag,
                    imageIndex: route.params.imageIndex,
                    event_mode_id: route.params.event_mode_id,
                    videos: route.params.videos,
                    search_by: route.params.search_by,
                    cred: cred,
                  });
                }}>
                  <Text style={styles.buttonText}>{store.textData.continue_text}</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.buttonView}>
              <TouchableOpacity style={styles.button} onPress={() => {
                if (store.token) {
                  if (SelectedPackage.is_personalised) {
                    console.log("flag: route.params.flag", route.params.flag);
                    navigation.navigate("Personalized", {
                      // event_id: event_id,
                      // packageDet: packageDet,
                      // act_number: act_number

                      event_id: eventID,
                      packageDet: item,
                      act_number: route.params.flag == "purchased" ? images[sourceIndex].folder_name : search_by,
                      fid: images[sourceIndex].file_id,
                      flag: route.params.flag,
                      event_mode_id: route.params.event_mode_id,
                      videos: videos,
                      search_by: search_by
                    });
                  }
                  else {
                    submitPackage();
                  }
                } else {
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
                }
              }}>
                <Text style={styles.buttonText}>{store.textData.complete_package_text}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {packageDet.no_of_files != 0 && (
          <>
            {packageListArray.length < packageDet.no_of_files ? (
              <View style={{ marginHorizontal: '5%' }}>
                <View style={styles.buttonView}>
                  <TouchableOpacity style={styles.button} onPress={() => {
                    // navigation.navigate("ViewImage", {
                    //   images: route.params.images,
                    //   imageUrl: route.params.imageUrl,
                    //   fileName: route.params.fileName,
                    //   eventID: route.params.eventID,
                    //   flag: route.params.flag,
                    //   imageIndex: route.params.imageIndex,
                    //   event_mode_id: route.params.event_mode_id,
                    //   videos: route.params.videos,
                    //   search_by: route.params.search_by
                    // });
                    navigation.goBack();
                  }}>
                    <Text style={styles.buttonText}>{store.textData.continue_text}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={{ marginHorizontal: '5%' }}>
                <View style={styles.buttonView}>
                  <TouchableOpacity style={styles.button} onPress={() => {
                    if (store.token) {
                      if (SelectedPackage.is_personalised) {
                        console.log("dsvdsv");
                        navigation.navigate("Personalized", {
                          event_id: event_id,
                          packageDet: packageDet,
                          act_number: act_number,


                          // event_id: event_id,
                          // packageDet: item,
                          // act_number: route.params.flag == "purchased" ? images[sourceIndex].folder_name : search_by,
                          // fid: images[sourceIndex].file_id,
                          flag: route.params.flag,
                          // event_mode_id: route.params.event_mode_id,
                          // videos: videos,
                          // search_by: search_by
                        });
                      }
                      else {
                        submitPackage();
                      }
                    } else {
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
                    }
                  }}>
                    <Text style={styles.buttonText}>{store.textData.complete_package_text}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}

        <View style={{ marginHorizontal: '5%' }}>
          <View style={styles.buttonView}>
            <TouchableOpacity style={styles.button} onPress={() => {
              setSelectedPackage({});
              setPackageListArray([]);
              navigation.goBack();
            }}>
              <Text style={styles.buttonText}>{store.textData.cancel_this_package_text}</Text>
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
              <NoDataCard
                btnTitle={store.textData.okay_text}
                title={store.textData.files_added_cart_text}
                activeOpacity={1}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setTimeout(() => {
                    navigation.navigate("");
                  }, 500);
                }}
                showButton={true}
              />
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>

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
                yestxt={store.textData.create_account_text}
                notxt={store.textData.cancel_text}
              />
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

export default ViewPackageScreen;
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.uep_pink,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    height: 50,
  },
  buttonText: {
    color: "white",
    fontSize: RFValue(22),
    fontFamily: fonts.BebasNeueRegular,
  },
  buttonView: {
    marginBottom: "3%",
  },
  modal: {
    flex: 1,
    // backgroundColor: '#212121',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  screen: {
    flex: 1,
    backgroundColor: "#3F3F3F",
    alignItems: "center",
  },
  text: {
    fontSize: RFValue(18),
    // marginBottom: '2%',
    // marginLeft: 15,
    color: colors.header,
    fontFamily: fonts.AvenirNextCondensedDemiBold
  },
  text1: {
    fontSize: RFValue(18),
    // marginBottom: '2%',
    // marginLeft: 15,
    color: '#FFF',
    textTransform: 'uppercase',
    fontFamily: fonts.AvenirNextCondensedDemiBold
  }
});

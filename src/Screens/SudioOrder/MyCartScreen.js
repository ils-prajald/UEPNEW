import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  BackHandler,
  TouchableOpacity,
  Platform,
  ImageBackground,
  TouchableWithoutFeedback,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
//Components
import Header from "../../components/Header";
import ScreenHeader from "../../components/ScreenHeader";
import UEPButton from "../../components/UEPButton";
import env from "../../constants/env";
import Spinner from "react-native-loading-spinner-overlay";
import { store } from "../../store/Store";
import {
  encryptData,
  decryptData
} from '../../utilities/Crypto';
import fonts from "../../constants/fonts";
import { RFValue } from "react-native-responsive-fontsize";
import { LoginContext } from "../../Context/LoginProvider";
import UEPButtonDisable from "../../components/UEPButtonDisable";
import { useFocusEffect } from "@react-navigation/native";
import Modal from "react-native-modalbox";
import colors from "../../constants/colors";
import { toastr } from "../utilities/index";
import PlaceHolder from "../../components/PlaceHolder";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NoDataCard from '../../components/NoDataCard';

const video_img = require("../../assets/cart-video.png");
const borderRadius = 10;
const info_img = require("../../assets/Warning.png");
const caution_img = require("../../assets/info.png")


const MyCartScreen = ({ navigation, route }) => {
  const { clearAllDetails, setCartCount, setSelectedPackage, setPackageListArray } = React.useContext(LoginContext);
  const [cartTotal, setCartTotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [spinner, setSpinner] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(0);
  const [event_mode_id, setEvent_mode_id] = useState(1);
  const [event_id, setEvent_id] = useState(0);
  const [event_name, setEvent_name] = useState("");
  const [act_number, setAct_number] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [onSiteSale, setOnSiteSale] = useState(0);
  const [screenValue, setScreenValue] = useState("0");
  const [data, setData] = useState([]);
  // const [cartFlag, setCartFlag] = useState(false);
  console.log("flag", typeof route?.params?.flag);
  console.log("flag123", route?.params?.flag);
  const cartFlag = route?.params?.flag;
  const [digitalData, setDigitalData] = useState(false);

  // console.log("cart", cart);


  useFocusEffect(
    React.useCallback(() => {
      setSelectedPackage({});
      setPackageListArray([]);
      handleCartData();
      setTimeout(() => {
        cartEvent();
      }, 500);
      const onBackPress = () => {
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        setCartTotal(0);
        setTotalPrice(0);
        setShippingFee(0);
        setSpinner(false);
        setCartData([]);
        setOpenModal(false);
        setItemToDelete(0);
        setEvent_mode_id(1);
        setEvent_id(0);
        setEvent_name("");
        setAct_number("");
        setDataLoaded(false);
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );
  useEffect(() => {
    console.log("ROUTES", route);
    getScreen();
  }, []);
  // const { cartFlags } = route?.params?.flag;

  // if (route?.params?.flag == "true") {
  //   setCartFlag(true);
  // }

  const cartEvent = () => {
    {
      cartFlag == "true" &&
        console.log("true");
      cartCount();
    }
  }

  const getScreen = async () => {
    try {
      const value = await AsyncStorage.getItem("isScreen");
      console.log('SCREEN VALUE---', value);
      setScreenValue(value);
    } catch (e) {
    }
  };
  const setScreen = async () => {
    try {
      await AsyncStorage.setItem("isScreen", '0');
    } catch (e) {
    }
  };

  const handleEvent = () => {
    console.log("abc")
    setModalVisible4(!modalVisible4);
    setCartTotal(0);
    setTotalPrice(0);
    setShippingFee(0);
    handleCartData();
    cartCount();
  };
  const handleEvent1 = () => {
    setCartTotal(0);
    setTotalPrice(0);
    setShippingFee(0);
    handleCartData();
    cartCount();
  };
  // const cartCount = () => {
  // setCartCount(data);
  const cartCount = () => {
    // setSpinner(true);
    axios
      .get(env.BASE_URL + "/preorder/api/getCartDetail", {
        headers: { Authorization: `Bearer ${store.token}` },
      })
      .then(async (res) => {
        res.data = await decryptData(res.data);
        console.log("cartdata", res.data);
        const imagesCartDetails = res.data.data.images_cart_details;
        const vediosCartDetails = res.data.data.videos_cart_details;
        const studioCartDetails = res.data.data.studio_routines_cart_details;
        const cartCount = imagesCartDetails.length + vediosCartDetails.length + studioCartDetails.length;
        console.log("length", cartCount);
        // Get the length of the array
        setCartCount(cartCount); // Update the cartCount state with the array length
        setDataLoaded(true);
        // setSpinner(false);
      })
      .catch((err) => {
        // setSpinner(false);
        if (err.response.status == "400") {
          if (err.response.data.message == "jwt expired") {
            clearAllDetails();
          } else if (err.response.data.message == "No item found in your cart.") {
            setCartData([]);
          }
        }
      });
  };

  // }

  const handleCartData = () => {
    setSpinner(true);
    axios
      .get(env.BASE_URL + "/preorder/api/getCartDetail", {
        headers: { Authorization: `Bearer ${store.token}` },
      })
      .then(async (res) => {
        res.data = await decryptData(res.data);
        if (res.data.data.is_empty == 0) {
          setEvent_mode_id(res.data.data.event_mode_id);
          setEvent_id(res.data.data.event_id);
          setEvent_name(res.data.data.event_name);
          setAct_number(res.data.data.act_number);
          // setShippingFee("$ 4")
          // alert(shippingFee)
        }
        setData(JSON.stringify(res.data.data.images_cart_details));
        console.log('JSON', JSON.stringify(res.data.data))
        const dig = res.data.data.images_cart_details.map(item => item.is_digital);
        setDigitalData(dig.every((value) => value === 1));
        var tmp = [];
        if (res.data.data.studio_routines_cart_details.length > 0) {
          for (var i = 0; i < res.data.data.studio_routines_cart_details.length; i++) {
            res.data.data.studio_routines_cart_details[i].type = "studio";
            tmp.push(res.data.data.studio_routines_cart_details[i]);
          }
        }
        if (res.data.data.images_cart_details.length > 0) {
          for (var i = 0; i < res.data.data.images_cart_details.length; i++) {
            res.data.data.images_cart_details[i].type = "package";
            res.data.data.images_cart_details[i].collagefiles = [];
            if (res.data.data.images_cart_details[i].files.length > 0) {
              for (var j = 0; j < res.data.data.images_cart_details[i].files.length; j++) {
                if (res.data.data.images_cart_details[i].files[j].file_type == "IMAGE") {
                  res.data.data.images_cart_details[i].collagefiles.push({ 'path': res.data.data.images_cart_details[i].files[j].file_url, type: 'image' });
                }
              }
              if (res.data.data.images_cart_details[i].collagefiles.length <= 3) {

                for (var j = 0; j < res.data.data.images_cart_details[i].files.length; j++) {
                  if (res.data.data.images_cart_details[i].files[j].file_type == "VIDEO") {
                    res.data.data.images_cart_details[i].collagefiles.push({ type: 'video' });
                  }
                }
              }
              setOnSiteSale(res.data.data.is_onsite_sale_available)
              // if (res.data.data.images_cart_details[i].is_digital === 0 && res.data.data.images_cart_details[i].is_onsite_sale_available === 0) {
              //   setShippingFee('$ 4')
              //   // const sum = res.data.data.cart_total
              //   // alert(sum)
              //   // setCartTotal(res.data.data.cart_total);
              // } else if (res.data.data.images_cart_details[i].is_digital === 1 && res.data.data.images_cart_details[i].is_onsite_sale_available === 0) {
              //   setShippingFee(res.data.data.shipping_fee);
              // } else {
              //   setShippingFee(res.data.data.shipping_fee);
              // }
            }
            tmp.push(res.data.data.images_cart_details[i]);
          }
        }
        if (res.data.data.videos_cart_details.length > 0) {
          for (var i = 0; i < res.data.data.videos_cart_details.length; i++) {
            res.data.data.videos_cart_details[i].type = "video";
            tmp.push(res.data.data.videos_cart_details[i]);
          }
        }

        setCartData(tmp);

        if (res.data.data.cart_total) {
          setCartTotal(res.data.data.cart_total);
        }
        if (res.data.data.total_price) {
          setTotalPrice(res.data.data.total_price);
        }
        if (res.data.data.shipping_fee) {
          setShippingFee(res.data.data.shipping_fee);
        }
        setDataLoaded(true);
        setSpinner(false);
      })
      .catch((err) => {
        setSpinner(false);
        if (err.response.status == "400") {
          if (err.response.data.message == "jwt expired") {
            clearAllDetails();
          } else if (err.response.data.message == "No item found in your cart.") {
            setCartData([])
          }
        }
      })
  };


  sortBySerialNo = (prop) => {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    }
  }

  const handleRemove = () => {
    setOpenModal(true);
    setSpinner(true);
    const cred = {
      id: itemToDelete,
    };
    axios
      .put(env.BASE_URL + "/preorder/api/removeCartItem", encryptData(cred), {
        headers: { Authorization: `Bearer ${store.token}` },
      })
      .then(async (res) => {
        res.data = await decryptData(res.data);
        setCartCount(res.data.data.user_cart_count);
        // setCartCount(cartCount - 1);
        setCartTotal(0);
        setTotalPrice(0);
        setShippingFee(0);
        handleCartData();
        setItemToDelete(0);
        setOpenModal(false);
      })
      .catch((err) => {
      })
      .finally(() => {
        setSpinner(false);
      });
  };

  const handleSubmit = () => {

    setSpinner(true);
    var orderDetails = [];
    for (let i = 0; i < cartData.length; i++) {
      if (cartData[i].type == "package") {
        if (cartData[i].files.length > 0) {
          for (var j = 0; j < cartData[i].files.length; j++) {
            orderDetails.push({
              package_quantity: cartData[i].package_quantity,
              price: cartData[i].price,
              is_studio_order: cartData[i].is_studio_order,
              event_id: cartData[i].event_id,
              event_file_id: cartData[i].files[j].event_file_id,
              event_package_id: cartData[i].event_package_id,
              user_studio_id: cartData[i].user_studio_id,
              is_action_images_videos: cartData[i].is_action_images_videos ? cartData[i].is_action_images_videos : 0
            })
          }
        }
      }
      else {
        orderDetails.push({

          package_quantity: cartData[i].package_quantity,
          price: cartData[i].price,
          is_studio_order: cartData[i].is_studio_order,
          event_id: cartData[i].event_id,
          event_file_id: cartData[i].event_file_id,
          event_package_id: cartData[i].event_package_id,
          user_studio_id: cartData[i].user_studio_id,
          is_action_images_videos: cartData[i].is_action_images_videos ? cartData[i].is_action_images_videos : 0
        })
      }
    }
    if (shippingFee == '$ 0' || shippingFee == 0) {
      const cred = {
        payment_mode: 1,
        order_details: orderDetails,
        shipping_fee: 0,
        cart_shipping_fee: shippingFee
      };
      axios
        .post(env.BASE_URL + "/preorder/api/placeOrder", encryptData(cred), {
          headers: { Authorization: `Bearer ${store.token}` },
        })
        .then(async (res) => {
          setSpinner(false);
          res.data = await decryptData(res.data);
          setTimeout(() => {

            if (res.data.data.order_number === undefined) {
              if (Platform.OS == "android") {
                setModalVisible4(true);
              }
              else {
                Alert.alert(

                  "There is no need to order digital files, the media is FREE!  All digital files will be delivered to your studio shortly after the competition!",
                  "",
                  [
                    { text: store.textData.okay_text, onPress: handleEvent1 }
                  ]
                );
              }

            }
            else {

              navigation.navigate("DisclaimerScreen", {
                cartTotal: cartTotal,
                order_number: res.data.data.order_number,
                digitalData: digitalData,
              });
            }
          }, 500);
        })
        .catch((err) => {
          setSpinner(false);
          setTimeout(() => {
            toastr.warning(err.response.data.message);
          }, 500);
        });
    } else if (onSiteSale === 0) {
      const cred = {
        payment_mode: 1,
        order_details: orderDetails,
        shipping_fee: 4,
        cart_shipping_fee: shippingFee
      };
      axios
        .post(env.BASE_URL + "/preorder/api/placeOrder", encryptData(cred), {
          headers: { Authorization: `Bearer ${store.token}` },
        })
        .then(async (res) => {
          setSpinner(false);
          res.data = await decryptData(res.data);
          setTimeout(() => {
            if (res.data.data.order_number === undefined) {
              if (Platform.OS == "android") {
                setModalVisible4(true);
              }
              else {
                Alert.alert(

                  "There is no need to order digital files, the media is FREE!  All digital files will be delivered to your studio shortly after the competition!",
                  "",
                  [
                    { text: store.textData.okay_text, onPress: handleEvent1 }
                  ]
                );
              }

            }
            else {
              navigation.navigate("DisclaimerScreen", {
                cartTotal: cartTotal,
                order_number: res.data.data.order_number,
                digitalData: digitalData,
              });
            }
          }, 500);
        })
        .catch((err) => {
          setSpinner(false);
          setTimeout(() => {
            toastr.warning(err.response.data.message);
          }, 500);
        });
    } else {
      setSpinner(false);
      setTimeout(() => {
        navigation.navigate("GoodNewsScreen", {
          orderDetails: orderDetails,
          cartTotal: cartTotal,
          cart_shipping_fee: shippingFee,
          digitalData: digitalData,
        });
      }, 500);
    }

  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#222222' }}>
      <Spinner visible={spinner} />
      <LinearGradient colors={["#393838", "#222222"]}>
        <Header />
      </LinearGradient>
      <View style={styles.screen}>
        <View style={{ marginVertical: 5 }}>
          <ScreenHeader text={store.textData.my_cart_text} />
        </View>
        <View style={styles.line}></View>
        {dataLoaded && (
          <>
            {cartData.length > 0 && (
              <FlatList
                keyExtractor={(item, index) => {
                  item.id;
                }}
                bounces={false}
                // contentContainerStyle={{ marginBottom: 200, backgroundColor: 'pink' }}
                // style={{
                //   height: 430,
                //   flexGrow: 0,
                //   paddingBottom: 20
                // }}
                data={cartData}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      borderBottomColor: "rgb(51,51,51)",
                      borderBottomWidth: 3,
                      justifyContent: "center",
                      paddingVertical: "4%",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        marginVertical: "1%",
                      }}
                    >
                      {/* File ID View */}
                      <View
                        style={{
                          width: "10%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontFamily: fonts.AvenirNextCondensedDemiBold,
                            fontSize: 17,
                          }}
                        >
                          {index + 1} .
                        </Text>
                      </View>

                      {/* Image View  */}
                      {item.type == "studio" && (
                        <View
                          style={{
                            width: "30%",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {/* <Image
                          source={{ uri: item.file_url }}
                          style={{
                            width: 100,
                            height: 140,
                            //backgroundColor: "gray",
                            transform: [{ rotate: `270deg` }, { scale: 1.5 }]
                          }}
                          resizeMode="contain"
                        /> */}
                          <ImageBackground
                            source={{ uri: item.file_url }}
                            resizeMode="contain" style={{
                              width: 100,
                              height: 140,
                              transform: [{ rotate: `270deg` }, { scale: 1.5 }]
                            }}>
                            {/* <Image source={{ uri: 'https://storage.googleapis.com/sa-uep-viewer-176-stg/users/watermark(1).png' }} style={{
                            width: 100,
                            height: 140,
                            resizeMode: 'contain',
                          }} /> */}
                          </ImageBackground>
                        </View>
                      )}

                      {item.type == "package" && (
                        <View
                          style={{
                            width: "30%",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <View
                            style={{
                              width: 100, height: 140,
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            {item.collagefiles.length > 0 && (
                              <>
                                {item.collagefiles.length == 1 && (
                                  <View
                                    style={{
                                      width: "30%",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    {item.collagefiles[0].type == "video" && (
                                      <View style={{
                                        width: 100, height: 140,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: colors.uep_pink
                                      }}>
                                        <Image
                                          source={video_img}
                                          style={{
                                            width: 50,
                                            height: 50,
                                            tintColor: "white",
                                          }}
                                          resizeMode="cover"
                                        />
                                      </View>
                                    )}
                                    {item.collagefiles[0].type == "image" && (
                                      // <Image
                                      //   source={{ uri: item.collagefiles[0].path }}
                                      //   style={{
                                      //     width: 100,
                                      //     height: 140,
                                      //     //backgroundColor: "gray",
                                      //     transform: [{ rotate: `270deg` }, { scale: 1.5 }]
                                      //   }}
                                      //   resizeMode="contain"
                                      // />
                                      <ImageBackground
                                        source={{ uri: item.collagefiles[0].path }}
                                        resizeMode="contain" style={{
                                          width: 100,
                                          height: 140,
                                          transform: [{ rotate: `270deg` }, { scale: 1.5 }]
                                        }}>
                                        {/* <Image source={{ uri: 'https://storage.googleapis.com/sa-uep-viewer-176-stg/users/watermark(1).png' }} style={{
                                        width: 100,
                                        height: 140,
                                        resizeMode: 'contain',
                                      }} /> */}
                                      </ImageBackground>
                                    )}
                                  </View>
                                )}
                                {item.collagefiles.length != 1 && (
                                  <>
                                    <View style={{
                                      flexDirection: 'row',
                                      // paddingBottom: 5,
                                      marginBottom: 2
                                    }}>
                                      <View style={{
                                        width: '50%',
                                        paddingRight: 2,
                                      }}>
                                        {item.collagefiles[0] && (
                                          <>
                                            {item.collagefiles[0].type == "image" && (
                                              // <Image
                                              //   source={{ uri: item.collagefiles[0].path }}
                                              //   style={{
                                              //     width: 48,
                                              //     height: 144 / 2,
                                              //     transform: [{ rotate: `270deg` }, { scale: 1.5 }]
                                              //   }}
                                              //   resizeMode="contain"
                                              // />
                                              <ImageBackground
                                                source={{ uri: item.collagefiles[0].path }}
                                                resizeMode="contain" style={{
                                                  width: 48,
                                                  height: 144 / 2,
                                                  transform: [{ rotate: `270deg` }, { scale: 1.5 }]
                                                }}>
                                                {/* <Image source={{ uri: 'https://storage.googleapis.com/sa-uep-viewer-176-stg/users/watermark(1).png' }} style={{
                                                width: 48,
                                                height: 144 / 2,
                                                resizeMode: 'contain',
                                              }} /> */}
                                              </ImageBackground>
                                            )}
                                            {item.collagefiles[0].type == "video" && (
                                              <View style={{
                                                width: 48,
                                                height: 144 / 2,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor: colors.uep_pink,
                                                // position: 'absolute',
                                                // top: -2,
                                              }}>
                                                <Image
                                                  source={video_img}
                                                  style={{
                                                    tintColor: "white",
                                                    width: 35,
                                                    height: 25
                                                  }}
                                                  resizeMode="cover"
                                                />
                                              </View>
                                            )}
                                          </>
                                        )}
                                        {!item.collagefiles[0] && (
                                          <PlaceHolder />
                                        )}
                                      </View>
                                      <View style={{ width: '50%', paddingLeft: 2 }}>
                                        {item.collagefiles[1] && (
                                          <>
                                            {item.collagefiles[1].type == "image" && (
                                              // <Image
                                              //   source={{ uri: item.collagefiles[1].path }}
                                              //   style={{
                                              //     width: 48,
                                              //     height: 144 / 2,
                                              //     transform: [{ rotate: `270deg` }, { scale: 1.5 }]
                                              //   }}
                                              //   resizeMode="contain"
                                              // />
                                              <ImageBackground
                                                source={{ uri: item.collagefiles[1].path }}
                                                resizeMode="contain" style={{
                                                  width: 48,
                                                  height: 144 / 2,
                                                  transform: [{ rotate: `270deg` }, { scale: 1.5 }]
                                                }}>
                                                {/* <Image source={{ uri: 'https://storage.googleapis.com/sa-uep-viewer-176-stg/users/watermark(1).png' }} style={{
                                                width: 48,
                                                height: 144 / 2,
                                                resizeMode: 'contain',
                                              }} /> */}
                                              </ImageBackground>
                                            )}
                                            {item.collagefiles[1].type == "video" && (
                                              <View style={{
                                                width: 48,
                                                height: 144 / 2,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor: colors.uep_pink,
                                                // position: 'absolute',
                                                // top: -1, left: 2
                                              }}>
                                                <Image
                                                  source={video_img}
                                                  style={{
                                                    tintColor: "white",
                                                    width: 35,
                                                    height: 25
                                                  }}
                                                  resizeMode="cover"
                                                />
                                              </View>
                                            )}
                                          </>
                                        )}
                                        {!item.collagefiles[1] && (
                                          <PlaceHolder />
                                        )}
                                      </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 2 }}>
                                      <View style={{ width: '50%', paddingRight: 2 }}>
                                        {item.collagefiles[2] && (
                                          <>
                                            {item.collagefiles[2].type == "image" && (
                                              // <Image
                                              //   source={{ uri: item.collagefiles[2].path }}
                                              //   style={{
                                              //     width: 48,
                                              //     height: 144 / 2,
                                              //     transform: [{ rotate: `270deg` }, { scale: 1.5 }]
                                              //   }}
                                              //   resizeMode="contain"
                                              // />
                                              <ImageBackground
                                                source={{ uri: item.collagefiles[2].path }}
                                                resizeMode="contain" style={{
                                                  width: 48,
                                                  height: 144 / 2,
                                                  transform: [{ rotate: `270deg` }, { scale: 1.5 }]
                                                }}>
                                                {/* <Image source={{ uri: 'https://storage.googleapis.com/sa-uep-viewer-176-stg/users/watermark(1).png' }} style={{
                                                width: 48,
                                                height: 144 / 2,
                                                resizeMode: 'contain',
                                              }} /> */}
                                              </ImageBackground>
                                            )}
                                            {item.collagefiles[2].type == "video" && (
                                              <View style={{
                                                width: 48,
                                                height: 144 / 2,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor: colors.uep_pink,
                                                // position: 'absolute',
                                                // top: -2,
                                              }}>
                                                <Image
                                                  source={video_img}
                                                  style={{
                                                    tintColor: "white",
                                                    width: 35,
                                                    height: 25
                                                  }}
                                                  resizeMode="cover"
                                                />
                                              </View>
                                            )}
                                          </>
                                        )}
                                        {!item.collagefiles[2] && (
                                          <PlaceHolder />
                                        )}
                                      </View>
                                      <View style={{ width: '50%', paddingLeft: 2 }}>
                                        {item.collagefiles[3] && (
                                          <>
                                            {item.collagefiles[3].type == "image" && (
                                              // <Image
                                              //   source={{ uri: item.collagefiles[3].path }}
                                              //   style={{
                                              //     width: 48,
                                              //     height: 144 / 2,
                                              //     transform: [{ rotate: `270deg` }, { scale: 1.5 }]
                                              //   }}
                                              //   resizeMode="contain"
                                              // />
                                              <ImageBackground
                                                source={{ uri: item.collagefiles[3].path }}
                                                resizeMode="contain" style={{
                                                  width: 48,
                                                  height: 144 / 2,
                                                  transform: [{ rotate: `270deg` }, { scale: 1.5 }]
                                                }}>
                                                {/* <Image source={{ uri: 'https://storage.googleapis.com/sa-uep-viewer-176-stg/users/watermark(1).png' }} style={{
                                                width: 48,
                                                height: 144 / 2,
                                                resizeMode: 'contain',
                                              }} /> */}
                                              </ImageBackground>
                                            )}
                                            {item.collagefiles[3].type == "video" && (
                                              <View style={{
                                                width: 48,
                                                height: 144 / 2,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor: colors.uep_pink,
                                                // position: 'absolute',
                                                // top: -1, left: 2
                                              }}>
                                                <Image
                                                  source={video_img}
                                                  style={{
                                                    tintColor: "white",
                                                    width: 35,
                                                    height: 25
                                                  }}
                                                  resizeMode="cover"
                                                />
                                              </View>
                                            )}
                                          </>
                                        )}
                                        {!item.collagefiles[3] && (
                                          <PlaceHolder />
                                        )}
                                      </View>
                                    </View>
                                  </>
                                )}
                              </>
                            )}
                          </View>
                        </View>
                      )}
                      {item.type == "video" && (
                        <View
                          style={{
                            width: "30%",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <View style={{
                            width: 100, height: 140,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: colors.uep_pink
                          }}>
                            <Image
                              source={video_img}
                              style={{
                                width: 50,
                                height: 50,
                                tintColor: "white",
                              }}
                              resizeMode="cover"
                            />
                          </View>
                        </View>
                      )}

                      {/* Details View */}
                      <View
                        style={{
                          width: "60%",
                          justifyContent: "center",
                          marginHorizontal: "2%",
                        }}
                      >
                        {item.type == "studio" && (
                          <>
                            <Text
                              style={{
                                color: "white",
                                fontFamily: fonts.AvenirNextCondensedDemiBold,
                                fontSize: 17,
                              }}
                            >
                              {store.textData.no_of_acts}{item.act_no_count}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                              <View style={{ width: '70%' }}>
                                <Text
                                  style={{
                                    color: "white",
                                    fontFamily: fonts.AvenirNextCondensedDemiBold,
                                    fontSize: 17,
                                  }}
                                >
                                  STUDIO ORDER
                                </Text>
                              </View>
                              <View style={{ width: "30%", justifyContent: 'center', justifyContent: 'flex-end' }}>
                                <Text
                                  style={{
                                    color: "white",
                                    fontFamily: fonts.AvenirNextCondensedDemiBold,
                                    fontSize: 17,
                                  }}
                                >
                                  {item.price}
                                </Text>
                              </View>
                            </View>

                            <View style={{ width: '70%' }}>
                              {item.is_personalised == 1 && (
                                <>
                                  {item.performer_name != null && (
                                    <Text
                                      style={{
                                        color: "white",
                                        fontFamily: fonts.AvenirNextCondensedDemiBold,
                                        fontSize: 17,
                                      }}
                                    >
                                      {item.performer_name}
                                    </Text>
                                  )}
                                </>
                              )}
                            </View>
                          </>
                        )}
                        {item.type != "studio" && (
                          <>
                            {item.event_mode_id == 1 && (
                              <Text
                                style={{
                                  color: "white",
                                  fontFamily: fonts.AvenirNextCondensedDemiBold,
                                  fontSize: 17,
                                }}
                              >
                                ACT # {item.act_number}
                              </Text>
                            )}
                            {item.event_mode_id != 1 && (
                              <Text
                                style={{
                                  color: "white",
                                  fontFamily: fonts.AvenirNextCondensedDemiBold,
                                  fontSize: 17,
                                }}
                              >
                                {item.act_number}
                              </Text>
                            )}


                            <View style={{ flexDirection: 'row' }}>
                              <View style={{ width: '70%' }}>
                                <Text
                                  style={{
                                    color: "white",
                                    fontFamily: fonts.AvenirNextCondensedDemiBold,
                                    fontSize: 17,
                                  }}
                                >{item.routine_name}</Text>
                              </View>
                              <View style={{ width: "30%", justifyContent: 'center', justifyContent: 'flex-end' }}>
                                <Text
                                  style={{
                                    color: "white",
                                    fontFamily: fonts.AvenirNextCondensedDemiBold,
                                    fontSize: 17,
                                  }}
                                >
                                  {item.price}
                                </Text>
                              </View>
                            </View>

                            <View style={{ width: '70%' }}>
                              {item.is_personalised == 1 && (
                                <>
                                  {item.performer_name != null && (
                                    <Text
                                      style={{
                                        color: "white",
                                        fontFamily: fonts.AvenirNextCondensedDemiBold,
                                        fontSize: 17,
                                      }}
                                    >
                                      {item.performer_name}
                                    </Text>
                                  )}
                                </>
                              )}
                            </View>
                          </>
                        )}

                        <TouchableOpacity onPress={() => {
                          setOpenModal(true);
                          setItemToDelete(item.user_studio_id);
                        }}>
                          <Text
                            style={{
                              color: "#73CBF9",
                              fontFamily: fonts.AvenirNextCondensedDemiBold,
                              fontSize: 17,
                            }}
                          >
                            {store.textData.remove_text}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )
                }
              />
            )}
            {cartData.length == 0 && (
              <View style={{
                justifyContent: 'center',
                marginHorizontal: '10%',
                alignItems: 'center',
                flex: 1
                // height: Dimensions.get("window").height - 300,
              }}>
                {/* <Image /> */}
                <Text style={{
                  color: 'white',
                  fontFamily: fonts.AvenirNextCondensedBold,
                  fontSize: RFValue(30),
                  textAlign: 'center'
                }}>{store.textData.cart_empty_text}</Text>
                <Text style={{
                  color: 'white',
                  fontFamily: fonts.AvenirNextCondensedMediumItalic,
                  fontSize: RFValue(16),
                  textAlign: 'center'
                }}>{store.textData.proceeding_checkout_text}</Text>
              </View>
            )}
            <LinearGradient colors={["#393838", "#222222"]}>
              <View style={styles.cartTextView}>

                <View>
                  <Text style={styles.text}>SUB TOTAL:</Text>
                  {/* {!(shippingFee == 0 || shippingFee == '$ 0') && (
                    <Text style={styles.text}>SHIPPING FEE:</Text>
                  )} */}
                  <Text style={styles.text}>SHIPPING FEE:</Text>
                  <Text style={styles.text}>CART TOTAL:</Text>
                </View>

                <View>
                  <Text style={styles.priceText}>{"  "}{totalPrice + ".00"}</Text>
                  {/* {!(shippingFee == 0 || shippingFee == '$ 0') && (
                    <Text style={styles.priceText}>{"  "}{shippingFee + ".00"}</Text>
                  )} */}
                  <Text style={styles.priceText}>{"  "}{shippingFee + ".00"}</Text>
                  <Text style={styles.priceText}>{"  "}{cartTotal + ".00"}</Text>
                </View>
              </View>

              <View style={styles.bottomContainer}>
                <View style={{ marginVertical: -10 }}>
                  {cartData.length === 0 ? (
                    <UEPButtonDisable
                      title={store.textData.checkout_text}

                    />
                  ) : (
                    <UEPButton
                      title={store.textData.checkout_text}
                      onPressButton={() => {
                        handleSubmit();
                      }}
                    />
                  )}
                </View>
                <View style={{ marginVertical: -5 }}>
                  <UEPButton
                    title={store.textData.continue_viewing_media_text}
                    onPressButton={() => {
                      // navigation.navigate("EventSearch");
                      // navigation.goBack();
                      if (event_id == 0) {
                        navigation.navigate("EventSearch");
                      }
                      else {
                        if (event_mode_id === 1) {
                          if (screenValue === '1') {
                            navigation.navigate('PurchasedMediaHome', {
                              cred: {
                                act_number: act_number,
                                event_id: String(event_id)
                              },
                              event_id: event_id,
                              search_by: act_number,
                              event_name: event_name,
                            });
                            // setScreen();
                          } else {
                            navigation.navigate("ViewMediaScreen", {
                              cred: {
                                act_number: act_number,
                                event_id: String(event_id)
                              },
                              eventID: event_id,
                              event_name: event_name,
                            });
                          }
                        }
                        else {
                          if (screenValue === '1') {
                            navigation.navigate('PurchasedMediaHome', {
                              cred: {
                                team_name: act_number,
                                event_id: String(event_id)
                              },
                              event_id: event_id,
                              search_by: act_number,
                              event_name: event_name,
                            });
                            // setScreen();
                          } else {
                            navigation.navigate("ViewMediaScreen", {
                              cred: {
                                team_name: act_number,
                                event_id: String(event_id)
                              },
                              eventID: event_id,
                              event_name: event_name,
                            });
                          }
                        }
                      }
                    }}
                  />
                </View>
              </View>
            </LinearGradient>
          </>
        )}


      </View>
      {/* Remove cart item modal  */}
      <Modal
        style={styles.modalStyle}
        isOpen={openModal}
        position="center"
        backdropPressToClose={false}
      >
        <View style={{
          flex: 1,
          alignItems: 'center',

        }}>
          <View style={{ marginVertical: '2%' }}>
            <Image source={info_img} style={{ width: 40, height: 35 }} />
          </View>

          <Text style={{
            fontFamily: fonts.AvenirNextCondensedDemiBold,
            fontSize: RFValue(16),
            textAlign: 'center',
            marginHorizontal: '5%', marginVertical: '5%'

          }}>{store.textData.remove_item_from_cart_text}</Text>
          <View style={{
            flexDirection: 'row',
            width: '100%',
            marginVertical: '5%',
            justifyContent: 'space-around',
          }}>
            <TouchableOpacity style={{
              backgroundColor: colors.uep_pink,
              width: '30%',
              alignItems: 'center',
              height: 30,
              justifyContent: 'center',
              borderRadius: 5
            }} onPress={() => { setOpenModal(false) }}>
              <Text
                style={{
                  color: 'white',
                }}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{
              backgroundColor: colors.uep_pink,
              width: '30%',
              alignItems: 'center',
              height: 30,
              justifyContent: 'center',
              borderRadius: 5,

            }} onPress={handleRemove}>
              <Text style={{
                color: 'white',
              }}>Yes</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
      {/* <Modal
        animationType="slide"
        transparent={true}
        isOpen={modalVisible4}
        onRequestClose={() => {
          setModalVisible4(!modalVisible4);
        }}
        style={styles.modalStyle}
        isOpen={modalVisible4}
        position="center"
        backdropPressToClose={false}
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
        <View style={{
          flex: 1,
          alignItems: 'center',

        }}>
          <View style={{ marginVertical: '2%' }}>
            <Image source={info_img} style={{ width: 40, height: 35 }} />
          </View>

          <Text style={{
            fontFamily: fonts.AvenirNextCondensedDemiBold,
            fontSize: RFValue(16),
            textAlign: 'center',
            marginHorizontal: '5%', marginVertical: '5%'

          }}>There is no need to order digital files, the media is FREE!  All digital files will be delivered to your studio shortly after the competition!</Text>
          <View style={{
            flexDirection: 'row',
            width: '100%',
            marginVertical: '5%',
            justifyContent: 'space-around',
          }}>
            <TouchableOpacity style={{
              backgroundColor: colors.uep_pink,
              width: '30%',
              alignItems: 'center',
              height: 30,
              justifyContent: 'center',
              borderRadius: 5
            }} onPress={() => { setOpenModal(false) }}>
              <Text
                style={{
                  color: 'white',
                }}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{
              backgroundColor: colors.uep_pink,
              width: '30%',
              alignItems: 'center',
              height: 30,
              justifyContent: 'center',
              borderRadius: 5,

            }} onPress={() => {
              setModalVisible4(!modalVisible4);
            }}>
              <Text style={{
                color: 'white',
              }}>Yes</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal> */}
      <Modal
        style={styles.modalStyle}
        isOpen={modalVisible4}
        position="center"
        backdropPressToClose={false}
      >
        <View style={{
          flex: 1,
          alignItems: 'center',

        }}>
          <View style={{ marginTop: '5%' }}>
            <Image source={caution_img} style={{
              width: 40,
              height: 40,
              tintColor: colors.uep_pink,
              marginVertical: 10,
            }} />
          </View>

          <Text style={{
            fontFamily: fonts.AvenirNextCondensedBoldItalic,
            fontSize: 18,
            textAlign: 'center',
            marginHorizontal: '5%', marginVertical: '2%'

          }}>There is no need to order digital files, the media is FREE!  All digital files will be delivered to your studio shortly after the competition!</Text>
          <View style={{
            flexDirection: 'row',
            width: '100%',
            marginVertical: '5%',
            justifyContent: 'space-around',
          }}>
            {/* <TouchableOpacity style={{
              backgroundColor: colors.uep_pink,
              width: '30%',
              alignItems: 'center',
              height: 30,
              justifyContent: 'center',
              borderRadius: 5
            }} onPress={() => { setOpenModal(false) }}>
              <Text
                style={{
                  color: 'white',
                }}>No</Text>
            </TouchableOpacity> */}

            <TouchableOpacity style={{
              backgroundColor: colors.uep_pink,
              width: '20%',
              alignItems: 'center',
              height: 40,
              justifyContent: 'center',
              borderRadius: 10,

            }} onPress={handleEvent}>
              <Text style={{
                color: 'white',
                fontSize: 15,
                fontFamily: fonts.AvenirBlack,
              }}>OK</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
      {/* End remove cart item modal  */}
    </SafeAreaView>
  );
};

export default MyCartScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.screen_bg,
    // justifyContent: "center",
  },
  contentView: {
    marginVertical: "5%",
    color: "transparent",
    // flex: 1
  },
  line: {
    height: 2,
    backgroundColor: "rgb(51,51,51)",
  },
  bottomContainer: {
    // width: "100%",
    // justifyContent: 'center',
    // flex: 1,
    marginHorizontal: "5%"
  },
  modalStyle: {
    width: Dimensions.get("window").width - 60,
    height: Dimensions.get("window").height / 3.8,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    borderBottomLeftRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
  },
  cartTextView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    alignItems: 'center',
    // marginHorizontal: '5%',
    marginVertical: '1%'
  },
  cartText: {
    // width: '75%',
    justifyContent: 'center',
  },
  cartPriceText: {
    // width: '25%',
    justifyContent: 'center',
  },
  text: {
    fontFamily: fonts.AvenirNextCondensedDemiBold,
    fontSize: RFValue(16),
    color: "white",
    alignSelf: 'flex-end'
  },
  priceText: {
    fontFamily: fonts.AvenirNextCondensedDemiBold,
    fontSize: RFValue(16),
    color: "white",
    alignSelf: 'flex-end',
    paddingRight: 22
  },
  modal: {
    flex: 1,
    // backgroundColor: '#212121',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
});


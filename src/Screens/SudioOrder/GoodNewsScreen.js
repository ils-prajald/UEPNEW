import axios from "axios";
import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert, Dimensions, Image, Modal, TouchableWithoutFeedback } from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
//Components
import Header from "../../components/Header";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import { store } from "../../store/Store";
import env from "../../constants/env";
import Spinner from "react-native-loading-spinner-overlay";
import { toastr } from "../utilities/index";
import { encryptData, decryptData } from "../../utilities/Crypto";
// import Modal from "react-native-modalbox";
import NoDataCard from '../../components/NoDataCard';

const video_img = require("../../assets/cart-video.png");
const borderRadius = 10;
const info_img = require("../../assets/Warning.png");

const GoodNewsScreen = ({ navigation, route }) => {
  // const { cartTotal, cartData, studioID } = route.params;
  const { digitalData } = route.params;

  const [spinner, setSpinner] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
  const handleSubmit = (flag) => {
    setSpinner(true);
    const cred = {
      payment_mode: 1,
      order_details: route.params.orderDetails,
      shipping_fee: flag == 0 ? 4 : 0,
      cart_shipping_fee: route.params.cart_shipping_fee
    };
    axios
      .post(env.BASE_URL + "/preorder/api/placeOrder", encryptData(cred), {
        headers: { Authorization: `Bearer ${store.token}` },
      })
      .then(async (res) => {
        setSpinner(false);
        res.data = await decryptData(res.data);
        var cart_total = route.params.cartTotal;
        if (flag == 1) {
          cart_total = cart_total.split('$')[1] - 4;
          cart_total = '$ ' + cart_total;
        }
        setTimeout(() => {
          console.log("order_number", res.data.data.order_number);
          if (res.data.data.order_number === undefined) {
            if (Platform.OS == "android") {
              console.log("if order no");
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
              cartTotal: cart_total,
              order_number: res.data.data.order_number,
            });
          };
        }, 500);
      })
      .catch((err) => {
        setSpinner(false);
        setTimeout(() => {
          toastr.warning(err.response.data.message);
        }, 500);
      });
  };

  const handleEvent = () => {
    const flag = "true";
    setModalVisible4(!modalVisible4);
    navigation.navigate("MyCartScreen", { flag });
  };
  const handleEvent1 = () => {
    const flag = "true";
    navigation.navigate("MyCartScreen", { flag });
  };
  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <Spinner visible={spinner} />
        <LinearGradient colors={["#393838", "#222222"]}>
          <Header />
        </LinearGradient>
        <View style={styles.contentView}>
          <Text style={styles.goodNewsText}>GOOD NEWS!</Text>
          <Text style={styles.eventInfoText}>
            {store.textData.onsite_delivery_text}
          </Text>
          <Text style={styles.pleaseNoteText}>
            {store.textData.phot_blankets_and_digital_pick_up_text}
          </Text>

          <TouchableOpacity style={styles.onSiteButton} onPress={() => {
            handleSubmit(1);
          }}>
            <Text style={styles.onSiteButtonText}>
              {store.textData.pick_my_prints_onsite_text}
            </Text>
            <Text style={styles.onSiteButtonText}>
              {store.textData.save_text}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.onSiteButton}
            onPress={() => {
              handleSubmit(0);
            }}
          >
            <Text style={styles.onSiteButtonText}>{store.textData.ship_my_order_text}</Text>
          </TouchableOpacity>
        </View>
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
                onPress={
                  //   () => {
                  //   setModalVisible4(!modalVisible4);
                  //   navigation.navigate('MyCartScreen', { src: cartCount });
                  // }
                  handleEvent
                }
                showButton={true}
              />
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

export default GoodNewsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#3F3F3F",
    alignItems: "center",
  },
  contentView: {
    marginHorizontal: "5%",
  },
  goodNewsText: {
    textAlign: "center",
    fontFamily: fonts.FuturaCondensedMedium,
    color: "white",
    fontSize: 30,
    marginTop: "10%",
  },
  eventInfoText: {
    color: "white",
    textAlign: "center",
    fontFamily: fonts.AvenirNextCondensedRegular,
    fontSize: 25,
    marginHorizontal: "2%",
    marginTop: "10%",
  },
  pleaseNoteText: {
    color: "white",
    textAlign: "center",
    fontFamily: fonts.AvenirNextCondensedRegular,
    fontSize: 18,
    marginHorizontal: "5%",
    marginTop: "10%",
  },
  onSiteButton: {
    backgroundColor: colors.uep_pink,
    marginTop: "10%",
    height: 80,
    justifyContent: "center",
    borderRadius: 5,
    marginHorizontal: "5%",
  },
  onSiteButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: RFValue(15),
    fontFamily: fonts.AvenirNextCondensedDemiBold,
  },
  modalStyle: {
    width: Dimensions.get("window").width - 60,
    height: Dimensions.get("window").height / 3.8,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    borderBottomLeftRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
    backgroundColor: 'red'
  },
  modal: {
    flex: 1,
    // backgroundColor: '#212121',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
});

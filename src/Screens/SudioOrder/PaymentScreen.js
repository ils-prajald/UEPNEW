import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ToastAndroid
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import env from "../../constants/env";
import axios from "axios";
import colors from "../../constants/colors";
import Spinner from "react-native-loading-spinner-overlay";

//Components
import Header from "../../components/Header";
import UEPButton from "../../components/UEPButton";
import { toastr, yupSchema } from "../utilities/index";
import UEPTextInput from "../../components/UEPTextInput";
import ContentHeader from "../../components/ContentHeader";

import { RFValue } from "react-native-responsive-fontsize";
import { LoginContext } from "../../Context/LoginProvider";
import fonts from "../../constants/fonts";
import { store } from "../../store/Store";
import { encryptData, decryptData } from "../../utilities/Crypto";

const PaymentScreen = ({ navigation, route }) => {
  const { clearAllDetails, setSelectedPackage, setPackageListArray, setCartCount } = React.useContext(LoginContext);
  const [nameOnCard, setNameOnCard] = useState("");
  let [cardNumber, setCardNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [spinner, setSpinner] = useState(false);

  const { cartTotal, order_number, digitalData } = route.params;

  // const handleCardNumber = (text) => {
  //   let formattedText = text.split(" ").join("");
  //   if (formattedText.length > 0) {
  //     formattedText = formattedText.match(new RegExp(".{1,4}", "g")).join(" ");
  //   }
  //   setCardNumber(formattedText);
  //   return formattedText;
  // };

  const completePayment = () => {
    if (nameOnCard.length == 0) {
      toastr.warning("Please enter your name on the card")
    } else if (cardNumber.length == 0) {
      toastr.warning("Please enter card number")
    } else if (cardNumber.length > 16) {
      toastr.warning("Invalid card number")
    } else if (exp.length == 0) {
      toastr.warning("Please enter expiration date");
    } else if (exp.length < 5) {
      toastr.warning("Invalid expiration date");
    } else if (cvv.length == 0) {
      toastr.warning("Please enter CVV")
    } else if (cvv.length < 3) {
      toastr.warning("Invalid CVV number")
    } else {
      handleSubmit();
    }
  }

  const handleSubmit = () => {
    setSpinner(true);
    const cred = {
      card_holder_name: nameOnCard,
      card_number: cardNumber,
      expiration_date: exp,
      security_code: cvv,
      order_number: order_number,
      price: String(cartTotal)
    };

    axios
      .post(env.BASE_URL + "/preorder/api/paymentTransaction", encryptData(cred), {
        headers: { Authorization: `Bearer ${store.token}` },
      })
      .then(async (res) => {
        setSpinner(false);
        res.data = await decryptData(res.data);
        setSelectedPackage({});
        setPackageListArray([]);
        setCartCount(0);
        setTimeout(() => {
          navigation.navigate("PaymentSuccess", {
            order_number: order_number,
          });
        }, 500)
      })
      .catch((err) => {
        setSpinner(false);
        setTimeout(() => {
          toastr.warning(err.response.data.message)
          setTimeout(() => {
            navigation.navigate('MyCartScreen')
          }, 3500)
        }, 100)

      })
      .finally(() => {
        setSpinner(false);
      });

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
            <ScrollView>
              <ContentHeader
                text={digitalData ? "2. " + store.textData.payment_information_header_text : "3. " + store.textData.payment_information_header_text}
              />

              <Text
                style={{
                  fontFamily: fonts.AvenirNextCondensedRegular,
                  fontSize: RFValue(16),
                  color: "white",
                  marginHorizontal: "5%",
                  textAlign: "center",
                }}
              >
                {store.textData.payment_info_text}
              </Text>

              <View style={styles.formView}>
                {/* Name on the card */}
                <UEPTextInput
                  onChangeText={(e) => {
                    setNameOnCard(e);
                  }}
                  value={nameOnCard}
                  placeholder="Full Name On Card"
                  returnKeyType={"next"}
                  fontFamily={fonts.AvenirNextCondensedRegular}
                />

                {/* Card number  */}
                <UEPTextInput
                  onChangeText={(e) => setCardNumber(e)}
                  value={cardNumber}
                  placeholder="Card Number"
                  keyboardType="number-pad"
                  returnKeyType={"next"}
                  maxLength={16}
                  fontFamily={fonts.AvenirNextCondensedRegular}
                />
                {/* Exp date  */}
                <View style={{ width: "60%" }}>
                  <UEPTextInput
                    onChangeText={(text) => {
                      setExp(
                        text.length === 3 && !text.includes("/")
                          ? `${text.substring(0, 2)}/${text.substring(2)}`
                          : text
                      );
                    }}
                    value={exp}
                    placeholder="Expiration Date (MM/YY)"
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    returnKeyType={"next"}
                    maxLength={5}
                    fontFamily={fonts.AvenirNextCondensedRegular}
                  />
                </View>

                {/* Security code  */}
                <View style={{ width: "60%" }}>
                  <UEPTextInput
                    onChangeText={(e) => {
                      setCvv(e);
                    }}
                    value={cvv}
                    placeholder="Security Code"
                    keyboardType="number-pad"
                    returnKeyType={"next"}
                    secureTextEntry={true}
                    maxLength={3}
                    fontFamily={fonts.AvenirNextCondensedRegular}
                  />
                </View>

                <View
                  style={{
                    marginTop: "5%",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      alignSelf: "flex-end",
                      fontFamily: fonts.AvenirNextCondensedBold,
                      fontSize: RFValue(18),
                    }}
                  >
                    SUB TOTAL : {cartTotal}.00
                  </Text>
                  <Text
                    style={{
                      color: "white",
                      alignSelf: "flex-end",
                      fontFamily: fonts.AvenirNextCondensedBold,
                      fontSize: RFValue(18),
                    }}
                  >
                    AMOUNT TO BE CHARGED: {cartTotal}.00
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>

          <View style={{ marginHorizontal: "5%" }}>
            <UEPButton
              title={store.textData.complete_my_order_text}
              onPressButton={() => {
                completePayment();
                Keyboard.dismiss();
                // navigation.navigate("PaymentSuccess", {
                //   order_number: order_number
                // });
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.screen_bg,
    alignItems: "center",
    opacity: 1,
  },

  stateView: {
    width: "100%",
  },
  zipCodeView: {
    width: "100%",
  },
  formView: {
    marginHorizontal: 10,
  },
  contentView: {
    marginTop: "2%",
    marginHorizontal: "3%",
    flex: 1,
  },
  countryView: {
    borderBottomColor: colors.header,
    borderWidth: 2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    height: 50,
  },
});


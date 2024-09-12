import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
//Components
import Header from "../../components/Header";
import { store } from "../../store/Store";
import colors from "../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import fonts from "../../constants/fonts";
import UEPButton from "../../components/UEPButton";
import axios from "axios";
import env from '../../constants/env'
import { toastr } from "../utilities/index";
import { Checkbox } from "native-base";
import { encryptData, decryptData } from "../../utilities/Crypto";

const DisclaimerScreen = ({ navigation, route }) => {
  const [disc1, setdisc1] = useState(false);
  const [disc2, setdisc2] = useState(false);
  const [disc3, setdisc3] = useState(false);
  const { cartTotal, order_number, digitalData } = route.params;


  const discArray = [
    {
      is_agree: 1,
      terms_and_condition: "I UNDERSTAND TEAM PORTRAITS ARE NOT INCLUDED IN DIGITAL PHOTO FILES PACKAGES."
    },
    {
      is_agree: 1,
      terms_and_condition: "I UNDERSTAND THERE ARE NO REFUNDS FOR DIGITAL FILES PACKAGES ONCE THE ORDER IS AVAILABLE IN MY ACCOUNT WITH NO EXCEPTIONS."
    },
    {
      is_agree: 1,
      terms_and_condition: "I UNDERSTAND THAT MY ORDER WIL BECOME AVAILABLE IN MY ACCOUNT WITHIN 1-3 BUSINESS DAYS AFTER MY EVENT."
    }
  ]

  const handleSubmit = () => {
    const cred = {
      order_number: order_number,
      agreement_details: discArray,

    }
    axios.post(env.BASE_URL + "/media/api/insertPerformersNameAndOrderAgreement", encryptData(cred), {
      headers: { Authorization: `Bearer ${store.token}` },
    })
      .then(async (res) => {
        navigation.navigate("BillingInfoScreen", {
          cartTotal: cartTotal,
          order_number: order_number,
          digitalData: digitalData,
        });
      })
      .catch((err) => {
        setTimeout(() => {
          toastr.warning(err.response.data.message)
        }, 500)
      })
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <LinearGradient colors={["#393838", "#222222"]}>
          <Header />
        </LinearGradient>
        <ScrollView>
          <View style={styles.contentView}>
            <Text
              style={{
                marginTop: "5%",
                color: colors.header,
                fontSize: RFValue(25),
                fontFamily: fonts.AvenirNextCondensedBold,
                textAlign: "center",
                // lineHeight: 31
              }}
            >
              {store.textData.disclaimers_agree_header_text}
            </Text>
            <View style={styles.discalimerTextView}>
              <Text style={styles.dText}>
                {store.textData.disclaimers_agree_text_1}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "5%"
                }}
              >
                <TouchableOpacity onPress={() => {
                  setdisc1((prevState) => !prevState);
                }} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: "1%", padding: 5 }}>
                  {/* <View style={
                    disc1 ? styles.disc1RadioSelected : styles.disc1Radio
                  }></View> */}
                  <Checkbox
                    onPress={() => {
                      setdisc1((prevState) => !prevState)
                    }}
                    colorScheme="pink"
                    isChecked={disc1}
                    accessibilityLabel="This is a dummy checkbox"
                    style={{ borderRadius: 0, marginRight: 10 }}
                  />
                  <Text style={{ color: "white", fontSize: RFValue(15) }}>
                    {store.textData.agree_text}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.discalimerTextView}>
              <Text style={styles.dText}>
                {store.textData.disclaimers_agree_text_2}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "5%"
                }}
              >
                <TouchableOpacity onPress={() => {
                  setdisc2((prevState) => !prevState);
                }} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: "1%", padding: 5 }}>
                  {/* <View style={
                    disc2 ? styles.disc1RadioSelected : styles.disc1Radio
                  }></View> */}
                  <Checkbox
                    onPress={() => {
                      setdisc2((prevState) => !prevState)
                    }}
                    colorScheme="pink"
                    isChecked={disc2}
                    accessibilityLabel="This is a dummy checkbox"
                    style={{ borderRadius: 0, marginRight: 10 }}
                  />
                  <Text style={{ color: "white", fontSize: RFValue(15) }}>
                    {store.textData.agree_text}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.discalimerTextView}>
              <Text style={styles.dText}>
                {store.textData.disclaimers_agree_text_3}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "5%"
                }}
              >
                <TouchableOpacity onPress={() => {
                  setdisc3((prevState) => !prevState);
                }} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: "1%", padding: 5 }}>
                  {/* <View style={
                    disc3 ? styles.disc1RadioSelected : styles.disc1Radio
                  }></View> */}
                  <Checkbox
                    onPress={() => {
                      setdisc3((prevState) => !prevState)
                    }}
                    colorScheme="pink"
                    isChecked={disc3}
                    accessibilityLabel="This is a dummy checkbox"
                    style={{ borderRadius: 0, marginRight: 10 }}
                  />
                  <Text style={{ color: "white", fontSize: RFValue(15) }}>
                    {store.textData.agree_text}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
        {/* Button View  */}
        <View style={{ marginHorizontal: '5%' }}>
          {disc1 && disc2 && disc3 ? (
            <UEPButton
              title={store.textData.continue_text}
              onPressButton={() => {
                handleSubmit();
              }}
            />
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default DisclaimerScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#3F3F3F",
    alignItems: "center",
  },
  contentView: {
    marginHorizontal: "5%",
  },
  discalimerTextView: {
    marginTop: "6%",
    marginHorizontal: "2%",
    marginBottom: 30
  },
  dText: {
    color: "white",
    fontFamily: fonts.AvenirNextCondensedDemiBold,
    fontSize: RFValue(15),
  },
  disc1Radio: {
    height: 20,
    width: 20,
    backgroundColor: "white",
    borderRadius: 50,
    marginRight: 10
  },
  disc1RadioSelected: {
    height: 20,
    width: 20,
    backgroundColor: colors.uep_pink,
    borderRadius: 50,
    marginRight: 10
  },
});

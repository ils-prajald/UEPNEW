import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  SafeAreaView
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import env from "../../constants/env";
import axios from "axios";
import { encryptData , decryptData } from "../../utilities/Crypto";
// import Spinner from "react-native-loading-spinner-overlay";

//Components
import Header from "../../Components/Header";
import UEPButton from "../../Components/UEPButton";
import ContentHeader from "../../Components/ContentHeader";
import InfoHeader from "../../Components/InfoHeader";
import { store } from "../../store/Store";
import { toastr, yupSchema } from "../utilities/index";
import UEPTextInput from "../../Components/UEPTextInput";
// import { useFocusEffect } from "@react-navigation/native";

const ForgotPassword = ({ navigation}) => {
  const [email, setEmail] = useState("");
  const [spinner, setSpinner] = useState(false);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     global.guestIndex = 2;
  //   }, [])
  // );

  const submitData = () => {
    const cred = {
      email_id: email,
    };
    yupSchema
      .validateForgotPassword()
      .validate(cred)
      .then(() => {
        setSpinner(true);
        axios
          .post(env.BASE_URL + "/user/api/sendResetPasswordToken", encryptData(cred))
          .then(async (res) => {
            setSpinner(false);
            res.data = await decryptData(res.data);
            console.log("res",res.data);
            setTimeout(() => {
              toastr.success(res.data.message);
            }, 1000);
            navigation.navigate("VerifyForgotPassword", {
              email: email,
            });
          })
          .catch((err) => {
            setSpinner(false);
            setTimeout(() => {
              toastr.warning(err.response.data.message);
            }, 1000);
          })
          .finally(() => {
            setSpinner(false);
          });
      })
      .catch((err) => {
        toastr.warning(err.errors[0]);
      });
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        {/* <Spinner visible={spinner} /> */}
        <LinearGradient colors={["#393838", "#222222"]}>
          <Header />
        </LinearGradient>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{ flex: 1 }}
        >
          <View style={styles.contentView}>
            <ScrollView>
              <View style={{ marginTop: "10%" }}>
                <ContentHeader text={store.textData.forgot_password} />
              </View>

              <InfoHeader
                text={store.textData.reset_your_password_text}
              />
              <View style={styles.formView}>
                {/* Verify Account */}
                <UEPTextInput
                  onChangeText={(e) => {
                    setEmail(e);
                  }}
                  value={email}
                  placeholder="Email Address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textAlign="center"
                />
              </View>
            </ScrollView>
            <UEPButton
              title="continue"
              onPressButton={() => {
                Keyboard.dismiss();
                submitData();
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#3F3F3F",
    alignItems: "center",
  },
  contentView: {
    flex: 1,
    marginHorizontal: 20,
  },

  stateAndZipCodeView: {
    flexDirection: "row",
  },
  stateView: {
    width: "50%",
  },
  zipCodeView: {
    width: "50%",
  },
  formView: {
    marginHorizontal: 10,
    marginVertical: "5%",
  },
});

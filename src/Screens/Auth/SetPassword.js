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
import { store } from "../../store/Store";
import LinearGradient from "react-native-linear-gradient";
import env from "../../constants/env";
import axios from "axios";
import {
  encryptData,
  decryptData
} from '../../utilities/Crypto';
// import Spinner from "react-native-loading-spinner-overlay";

//Components
import Header from "../../Components/Header";
import UEPButton from "../../Components/UEPButton";
import ScreenHeader from "../../Components/ScreenHeader";
import { toastr, yupSchema } from "../utilities/index";

import DeviceInfo from "react-native-device-info";
import UEPTextInput from "../../Components/UEPTextInput";
import fonts from "../../constants/fonts";
import ContentHeader from "../../Components/ContentHeader";
// import { useFocusEffect } from "@react-navigation/native";

const SetPassword = ({ props, route, navigation }) => {
  const [spinner, setSpinner] = useState(false);
  const [userData, setUserData] = useState();

  const { email } = route.params;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  let deviceId = DeviceInfo.getUniqueId();
  console.log("deviceId",deviceId);
  let deviceType = Platform.OS === "android" ? "1" : "2";
  let deviceModel = DeviceInfo.getModel();
  let osVersion = DeviceInfo.getSystemVersion();

  // useFocusEffect(
  //   React.useCallback(() => {
  //     global.guestIndex = 2;
  //   }, [])
  // );

  const submitData = () => {
    const cred = {
      email_id: email,
      password: password,
      confirm_password: confirmPassword,
      device_token: deviceId,
      device_type: deviceType,
      device_model: deviceModel,
      os_version: osVersion,
    };
    yupSchema
      .validateSetPassword()
      .validate(cred)
      .then(() => {
        setSpinner(true);
        axios
          .post(env.BASE_URL + "/user/api/setUpUserPassword", encryptData(cred))
          .then(async (res) => {
            setSpinner(false);
            res.data = await decryptData(res.data);
            setUserData(res.data);
            setTimeout(() => {
              navigation.navigate("RegisterConfirm");
            }, 500)
            // toastr.success("You are registered sucessfully with UEPViewer");
          })
          .catch((err) => {
            setSpinner(false);
            setTimeout(() => {
              toastr.warning(err.response.data.message);
            }, 1000)
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
              <ScreenHeader text={store.textData.set_password_text} />
              <ContentHeader text={store.textData.username_text}/>
              <Text style={styles.emailText}>{email}</Text>
              <View style={styles.formView}>
                {/* Verify Account */}
                <UEPTextInput
                  onChangeText={(e) => {
                    setPassword(e);
                  }}
                  value={password}
                  placeholder="Enter Your Password"
                  autoFocus={true}
                  returnKeyType={"next"}
                  textAlign="center"
                />

                <View style={styles.hintTextView}>
                  <Text style={styles.hintText}>{store.textData.password_must_contain_1_number_text}</Text>
                  <Text style={styles.hintText}>{store.textData.one_uppercase_letter_1_lowercase_letter_text}</Text>
                  <Text style={styles.hintText}>{store.textData.one_special_character_and_at_least_8_characters_text}</Text>
                </View>

                <UEPTextInput
                  onChangeText={(e) => {
                    setConfirmPassword(e);
                  }}
                  value={confirmPassword}
                  placeholder="Re-enter Your Password"
                  textAlign="center"
                />
              </View>
            </ScrollView>
          </View>
          <View style={{ marginHorizontal: "5%" }}>
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

export default SetPassword;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#3F3F3F",
    alignItems: "center",
  },

  formView: {
    marginHorizontal: 10,
  },
  hintTextView: {
    marginHorizontal: "10%",
    marginVertical: "4%",
  },
  hintText: {
    fontFamily: fonts.AvenirNextCondensedMediumItalic,
    fontSize: 15,
    color: "rgb(222,222,222)",
  },
  emailText: {
    justifyContent: "center",
    textAlign: "center",
    color: "white",
    fontFamily: fonts.AvenirNextCondensedBold,
    fontSize: 20,
    marginVertical: "1%",
  },
  contentView: {
    flex: 1,
    marginTop: "2%",
    marginHorizontal: "10%",
  },
});
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import env from "../../constants/env";
import axios from "axios";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
// import Spinner from "react-native-loading-spinner-overlay";
import { RFValue } from "react-native-responsive-fontsize";
//Components
import Header from "../../Components/Header";
import UEPButton from "../../Components/UEPButton";
import ScreenHeader from "../../Components/ScreenHeader";
import InfoHeader from "../../Components/InfoHeader";
import UEPTextInput from "../../Components/UEPTextInput";
import { store } from "../../store/Store";
import { toastr, yupSchema } from "../utilities/index";
import ContentHeader from "../../Components/ContentHeader";
// import { useFocusEffect } from "@react-navigation/native";
import { encryptData, decryptData } from "../../utilities/Crypto";
const RESEND_OTP_TIME_LIMIT = 600;
let resendOtpTimerInterval;

const VerifyForgotPassword = ({route, navigation}) => {
  const [vericationCode, setVerificationCode] = useState("");
  const { email } = route.params;
  const [spinner, setSpinner] = useState(false);
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT,
  );

  // useFocusEffect(
  //   React.useCallback(() => {
  //     global.guestIndex = 2;
  //   }, [])
  // );

  useEffect(() => {
    startResendOtpTimer();

    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
    };
  }, [resendButtonDisabledTime]);

  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
      if (resendButtonDisabledTime <= 0) {
        clearInterval(resendOtpTimerInterval);
      } else {
        setResendButtonDisabledTime(resendButtonDisabledTime - 1);
      }
    }, 1000);
  };

  const submitData = () => {
    const cred = {
      email_id: email,
      reset_password_otp: vericationCode,
    };
    yupSchema
      .validateVerifyForgotPassword()
      .validate(cred)
      .then(() => {
        setSpinner(true);
        axios
          .post(env.BASE_URL + "/user/api/verifyResetPasswordToken", encryptData(cred))
          .then(async (res) => {
            setSpinner(false);
            setTimeout(() => {
              navigation.navigate("ResetPassword", {
                email: email,
              });
            }, 500);
          })
          .catch((err) => {
            setSpinner(false);
            setTimeout(() => {
              toastr.warning(err.response.data.message);
            }, 300);
          })
          .finally(() => {
            setSpinner(false);
          });
      })
      .catch((err) => {
        toastr.warning(err.errors[0]);
      });
  };

  const onResendOtpButtonPress = () => {

    setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);
    startResendOtpTimer();

    // resend OTP Api call
    // todo
    const cred = {
      email_id: email,
    };
    setSpinner(true);
    axios
      .post(env.BASE_URL + "/user/api/sendResetPasswordToken", encryptData(cred))
      .then(async (res) => {
        res.data = await decryptData(res.data);
        setTimeout(() => {
          toastr.success(res.data.message);
        }, 1000)
      })
      .catch((err) => {
        setTimeout(() => {
          toastr.warning(err.response.data.message);
        }, 1000);
      })
      .finally(() => {
        setSpinner(false);
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
              <ContentHeader text={store.textData.enter_verification_code_text}/>
              <View style={{ marginVertical: 20 }}>
                <InfoHeader
                  text={store.textData.forgot_password_verification_text}/>
                <InfoHeader
                  text={store.textData.enter_below_code_text}/>
              </View>

              <View style={styles.formView}>
                {/* Verify Account */}
                <UEPTextInput
                  style={styles.textInput}
                  onChangeText={(e) => {
                    setVerificationCode(e);
                  }}
                  value={vericationCode}
                  placeholder="Verification Code"
                  placeholderTextColor={colors.place_holder_color}
                  keyboardType="number-pad"
                  // fontSize={15}
                  underlineColorAndroid="transparent"
                  autoCorrect={false}
                  maxLength={5}
                  textAlign="center"
                />
              </View>

              {resendButtonDisabledTime > 0 ? (
                <Text style={{
                  alignSelf: 'center', 
                  fontFamily: fonts.AvenirNextCondensedDemiBold,
                  fontSize: RFValue(18),
                  color: colors.header, marginVertical: 25
                }}>{store.textData.resent_otp_text_in} {resendButtonDisabledTime}S</Text>
              ) : (
                <TouchableOpacity onPress={onResendOtpButtonPress} style={{
                  paddingTop: 8,
                  paddingBottom: 8,
                  paddingLeft: 16,
                  paddingRight: 16,
                  borderWidth: 1,
                  borderRadius: 3,
                  alignSelf: 'center',
                  marginVertical: 25,
                  borderColor: colors.header
                }}>
                  <Text style={{
                    alignSelf: 'center', 
                    fontFamily: fonts.AvenirNextCondensedDemiBold,
                    fontSize: RFValue(18),
                    color: colors.header
                  }}>{store.textData.resend_otp_text}</Text>
                </TouchableOpacity>
              )}

            </ScrollView>
            <UEPButton
              title={store.textData.continue_text}
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

export default VerifyForgotPassword;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#3F3F3F",
    alignItems: "center",
  },
  contentView: {
    flex: 1,
    paddingTop: 20,
    marginHorizontal: 20,
  },
  informationTextView: {
    justifyContent: "center",
    alignItems: "center",
  },

  formView: {
    marginHorizontal: 10,
  },
});

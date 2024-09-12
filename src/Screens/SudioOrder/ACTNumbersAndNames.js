import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Dimensions,
  Keyboard,
  Platform,
  Modal,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import NoDataCard from '../../components/NoDataCard';
import LinearGradient from "react-native-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
//Components
import Header from "../../components/Header";
import fonts from "../../constants/fonts";
import { store } from "../../store/Store";
import colors from "../../constants/colors";
import UEPButton from "../../components/UEPButton";
import { toastr } from "../utilities/index";
import axios from "axios";
import env from "../../constants/env";
import { LoginContext } from "../../Context/LoginProvider";
import { encryptData, decryptData } from "../../utilities/Crypto";

const ACTNumbersAndNames = ({ navigation, route }) => {
  const { clearAllDetails, cartCount, setCartCount } = React.useContext(LoginContext);
  const { studioID, eventID, quantity, file_id, event_package_id } = route.params;
  const [verifyACT, setVerifyACT] = useState("");
  let [modalVisible, setModalVisible] = useState(false);
  let [modalVisible1, setModalVisible1] = useState(false);
  let [message, SetMessage] = useState("");
  const handleSubmit = () => {
    if (verifyACT === "") {
      setTimeout(() => {
        toastr.warning(store.textData.act_no_and_name_verify_text);
      }, 500)

    } else {
      submitData();
    }
  };
  const submitData = () => {
    cred = {
      event_id: eventID,
      user_studio_id: studioID,
      act_details: verifyACT,
      file_id: 0,
      event_package_id: event_package_id
    };
    console.log('CRED', cred)
    axios
      .post(env.BASE_URL + "/preorder/api/verifyActNumberAndActName", encryptData(cred), {
        headers: { Authorization: `Bearer ${store.token}` },
      })
      .then(async (res) => {
        res.data = await decryptData(res.data);
        // console.log("dataRes", res.data.data.act_details.message);
        SetMessage(res.data.data.act_details.message);
        setCartCount(cartCount + 1);

        //   if (Platform.OS == "android") {
        //     setModalVisible(!modalVisible);
        //   }
        //   else {
        //     Alert.alert(
        //       store.textData.files_added_cart_text,
        //       "",
        //       [
        //         { text: store.textData.okay_text, onPress: () => navigation.navigate("MyCartScreen") }
        //       ]
        //     );
        //   }

        // })

        if (res.data.data.act_details.message != "") {
          // Show alert with the specific error message
          if (Platform.OS == "android") {
            setModalVisible1(!modalVisible1);
          } else {
            Alert.alert(res.data.data.act_details.message, "", [
              { text: store.textData.okay_text, onPress: () => navigation.navigate("MyCartScreen") }
            ]);
          }
        } else {
          // Show the default success message
          if (Platform.OS == "android") {
            setModalVisible(!modalVisible);
          } else {
            Alert.alert(
              store.textData.files_added_cart_text,
              "",
              [{ text: store.textData.okay_text, onPress: () => navigation.navigate("MyCartScreen") }]
            );
          }
        }
      })

      .catch((err) => {
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
      }).finally(() => {
        // navigation.navigate("MyCartScreen", {
        //   quantity: quantity,
        //   studioID: studioID
        // });
      });
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <LinearGradient colors={["#393838", "#222222"]}>
          <Header />
        </LinearGradient>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{ flex: 1 }}
        >
          <ScrollView>
            <View style={styles.contentView}>
              <Text style={styles.headerText}>
                {store.textData.select_act_text}
              </Text>
              <Text style={styles.infoText}>
                {store.textData.enter_studio_contact}
              </Text>
            </View>
            <View style={styles.textAreaView}>
              <TextInput
                multiline={true}
                numberOfLines={20}
                style={styles.textAreaInput}
                placeholder={store.textData.enter_act_no_and_name_text}
                placeholderTextColor={'#A9A9A9'}
                value={verifyACT}
                onChangeText={(e) => {
                  setVerifyACT(e);
                }}
              />
            </View>
          </ScrollView>
          <View style={{ marginHorizontal: "5%" }}>
            <UEPButton
              title={store.textData.continue_text}
              onPressButton={() => {
                handleSubmit();
                Keyboard.dismiss();
              }}
            />
          </View>
        </KeyboardAvoidingView>

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
                    navigation.navigate("MyCartScreen");
                  }, 500)
                }}
                showButton={true}
              />
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>



        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible1}
          onRequestClose={() => {
            setModalVisible1(!modalVisible1);
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
                title={message}
                activeOpacity={1}
                onPress={() => {
                  setModalVisible1(!modalVisible1);
                  setTimeout(() => {
                    navigation.navigate("MyCartScreen");
                  }, 500)
                }}
                showButton={true}
              />
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>


      </SafeAreaView>
    </View>
  );
};

export default ACTNumbersAndNames;

const styles = StyleSheet.create({

  modal: {
    flex: 1,
    // backgroundColor: '#212121',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalStyle: {
    flex: 1,
    backgroundColor: 'transparent',
    // backgroundColor: 'red',
    position: "absolute",
    bottom: 65,
  },
  modalContainer: {
    backgroundColor: "red",
    backgroundColor: "rgb(61,61,61)",
    width: Dimensions.get("window").width - 30,
    alignSelf: 'center',
    // maxHeight: Dimensions.get("window").height,
    // maxHeight: Platform.OS === 'android' ?
    //   Dimensions.get("window").height / 2 :
    //   Dimensions.get("window").height / 2,
    position: "absolute",
    bottom: 0,
    // bottom: Platform.OS === "android" ? -35 : 0,
    borderRadius: 10,
  },
  screen: {
    flex: 1,
    backgroundColor: "#3F3F3F",
    alignItems: "center",
  },
  contentView: {
    marginHorizontal: "5%",
    marginVertical: "5%",
  },
  headerText: {
    color: "white",
    fontFamily: fonts.AvenirNextCondensedBold,
    fontSize: RFValue(20),
    marginHorizontal: "5%",
    textAlign: "center",
  },
  infoText: {
    color: "white",
    marginTop: "5%",
    marginHorizontal: "5%",
    textAlign: "center",
    color: colors.header,
    fontFamily: fonts.AvenirNextCondensedRegular,
    fontSize: RFValue(17),
  },
  textAreaView: {
    marginHorizontal: "10%",
    height: Dimensions.get("window").height / 2.2,
  },
  textAreaInput: {
    backgroundColor: "white",
    height: Dimensions.get("window").height / 2.2,
    fontFamily: fonts.AvenirNextCondensedRegular,
    fontSize: RFValue(16),
    marginHorizontal: "2%",
    padding: "2%",
    textAlignVertical: Platform.OS === "android" ? "top" : null,
    color: "black",
  },
});

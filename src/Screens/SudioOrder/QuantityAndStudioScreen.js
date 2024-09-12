import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginContext } from "../../Context/LoginProvider";
//Components
import Header from "../../components/Header";
import UEPButton from "../../components/UEPButton";
import UEPTextInput from "../../components/UEPTextInput";
import fonts from "../../constants/fonts";
import { store } from "../../store/Store";
import { toastr } from "../utilities/index";
import env from "../../constants/env";
import Spinner from "react-native-loading-spinner-overlay";
import axios from "axios";
import { encryptData, decryptData } from "../../utilities/Crypto";

const QuantityAndStudioScreen = ({ navigation, route }) => {
  const { clearAllDetails } = React.useContext(LoginContext);
  const { eventID, file_id, flag } = route.params;
  const [quantity, setQuantity] = useState("");
  const [studioName, setStudioName] = useState("");
  const [spinner, setSpinner] = useState(false);

  const handleSubmit = () => {
    if (quantity === "0") {
      toastr.warning("Invalid quantity");
    } else if (quantity === null || quantity === "") {
      toastr.warning("Required quantity");
    } else if (studioName === "") {
      toastr.warning("Required studio name");
    } else {
      submitData();
    }
  };

  const submitData = () => {
    console.log('route.params.flag----', route.params);
    setSpinner(true);
    const cred = {
      package_quantity: quantity,
      studio_name: studioName,
      event_id: eventID,
      file_id: file_id,
      search_by: route.params.search_by,
      source_screen: route.params.flag == "purchased" ? 'purchased_media' : 'view_media'
    };
    console.log('CRED0', cred)
    axios
      .post(env.BASE_URL + "/preorder/api/insertQuantityAndStudioName", encryptData(cred), {
        headers: { Authorization: `Bearer ${store.token}` },
      })
      .then(async (res) => {
        setSpinner(false);
        res.data = await decryptData(res.data);
        console.log("RESPONSE----", res.data)
        setTimeout(() => {
          console.log("RES---", res.data.data);
          navigation.navigate("ACTNumbersAndNames", {
            studioID: res.data.data.user_studio_id,
            eventID: eventID,
            quantity: quantity,
            file_id: res.data.data.file_id,
            event_package_id: res.data.data.event_package_id
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
            }, 5000);
          }
        } else {
          setTimeout(() => {
            toastr.warning(err.response.data.message);
          }, 5000);
        }
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
          <ScrollView>
            <View style={styles.contentView}>
              {/* Quantity View  */}
              <View style={styles.quantityView}>
                <Text style={styles.headerText}>
                  {store.textData.routine_quantity_text}
                </Text>
                <UEPTextInput
                  placeholder="Quantity"
                  textAlign="center"
                  keyboardType="number-pad"
                  onChangeText={(e) => {
                    setQuantity(e);
                  }}
                />
              </View>
              {/* Studio name view  */}
              <View style={styles.studioView}>
                <Text style={styles.headerText}>
                  {store.textData.studio_name}
                </Text>
                <UEPTextInput
                  placeholder="Studio Name"
                  textAlign="center"
                  onChangeText={(e) => {
                    setStudioName(e);
                  }}
                />
              </View>
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
      </SafeAreaView>
    </View>
  );
};

export default QuantityAndStudioScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#3F3F3F",
    alignItems: "center",
  },
  contentView: {
    marginHorizontal: "10%",
    marginVertical: "4%",
  },
  quantityView: {
    marginVertical: "5%",
  },

  studioView: {
    marginVertical: "5%",
    marginTop: "10%",
  },
  headerText: {
    color: "white",
    textAlign: "center",
    fontSize: RFValue(20),
    fontFamily: fonts.AvenirNextCondensedBold,
    marginVertical: "1%",
  },
});

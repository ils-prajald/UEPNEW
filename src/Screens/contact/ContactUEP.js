import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Linking,
  BackHandler,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import env from "../../constants/env";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay";
import { store } from "../../store/Store";
//Components
import Header from "../../components/Header";
import UEPButton from "../../components/UEPButton";
import {
  encryptData,
  decryptData
} from '../../utilities/Crypto';
import ContentHeader from "../../components/ContentHeader";
import InfoHeader from "../../components/InfoHeader";
import { useFocusEffect } from "@react-navigation/native";
import fonts from "../../constants/fonts";
import { TouchableOpacity } from "react-native-gesture-handler";
const ContactUEP = ({ props, navigation, route }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [address1, setAddress1] = useState("");
  const [spinner, setSpinner] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      global.guestIndex = 1;
      global.userIndex = 6;
    }, [])
  );

  useEffect(() => {
    navigation.addListener("focus", () => {
      {
        handleFetch();
      }
    });
  }, []);

  const handleFetch = () => {
    setSpinner(true);
    axios
      .get(env.BASE_URL + "/user/api/contactUs")
      .then(async (res) => {
        res.data = await decryptData(res.data);
        if (res.data.data.contactUsDetail[0].address) {
          const myArray = res.data.data.contactUsDetail[0].address.split(",");
          setAddress(myArray[0] + ',' + myArray[1]);
          setAddress1(myArray[2] + ',' + myArray[3]);
        }
        setTitle(res.data.data.contactUsDetail[0].title);
        setPhone(res.data.data.contactUsDetail[0].phone_number);
        setEmail(res.data.data.contactUsDetail[0].email_id);
        setDescription(res.data.data.contactUsDetail[0].description);
      })
      .catch((err) => {
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

        <View style={styles.contentView}>
          <ScrollView style={{ width: "100%" }}>
            <View style={styles.titleView}>
              <Text style={styles.titleText}>{title}</Text>
              <Text style={styles.titleText}>{description}</Text>
            </View>

            <View style={styles.informationTextView}>
              <ContentHeader text={store.textData.address_text} />
              <InfoHeader text={address} />
              <InfoHeader text={address1} />
            </View>

            <View style={styles.informationTextView}>
              <ContentHeader text={store.textData.telephone_text} />
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`tel:${phone}`);
                }}
              >
                <InfoHeader text={phone} />
              </TouchableOpacity>
            </View>

            <View style={styles.informationTextView}>
              <ContentHeader text={store.textData.email_text} />
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`mailto: ${email}`);
                }}
              >
                <InfoHeader text={email} />
              </TouchableOpacity>
            </View>
            <View style={styles.bottomButtonView}>
              <UEPButton title={store.textData.chat_with_us_text} onPressButton={() => { navigation.navigate("Chat") }} />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ContactUEP;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#3F3F3F",
  },
  contentView: {
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  titleView: {
    alignItems: "center",
  },
  titleText: {
    color: "white",
    fontSize: 25,
    fontWeight: "700",
    fontFamily: fonts.AvenirNextCondensedBold,
  },
  informationTextView: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  infoHeader: {
    color: "#FACFAA",
    marginVertical: 10,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  infoText: {
    color: "white",
    fontSize: 17,
  },
  addressText: {
    paddingHorizontal: "30%",
    textAlign: "center",
    lineHeight: 20,
    color: "white",
    fontSize: 17,
  },
  bottomButtonView: {
    marginHorizontal: "15%",
    marginTop: "20%",
  },
  noDataView: {
    flex: 1,
  },
});

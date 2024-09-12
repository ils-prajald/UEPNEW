import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { store } from "../../store/Store";
import fonts from "../../constants/fonts";
import colors from "../../constants/colors";
import axios from "axios";
import env from "../../constants/env";
import Spinner from "react-native-loading-spinner-overlay";
import PriceListItem from "../../components/PriceListItem";
import UEPButton from "../../components/UEPButton";
import { LoginContext } from "../../Context/LoginProvider";
import {
  encryptData,
  decryptData
} from '../../utilities/Crypto';

const PricesListScreen = ({ navigation, route }) => {
  const { clearAllDetails } = React.useContext(LoginContext);
  const [priceList, setPriceList] = useState([]);
  const [spinner, setSpinner] = useState(false);

  const { eventID, file_id, flag } = route.params;

  let path = "/media/api/getEventRoutinesList?event_id=";
  useEffect(() => {
    // setSpinner(true);
    axios
      .get(env.BASE_URL + path + eventID, {
        headers: { Authorization: `Bearer ${store.token}` },
      })
      .then(async (res) => {
        res.data = await decryptData(res.data);
        setPriceList(res.data.data.eventRoutinesList);
        setSpinner(false);
      })
      .catch((err) => {
        setSpinner(false);
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
      })
      .finally(() => {
        setSpinner(false);
      });
  }, []);
  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <Spinner visible={spinner} />
        <LinearGradient colors={["#393838", "#222222"]}>
          <Header />
        </LinearGradient>
        <ScrollView>
          <View style={styles.contentView}>
            {/* Get All Text  */}
            <Text style={styles.getAllText}>
              {store.textData.photos_and_video_text}
            </Text>
            {/* Get All Text  */}
            <Text style={styles.photosWillBeText}>
              {store.textData.routine_description}
            </Text>

            <Text style={styles.pricingText}>Pricing:</Text>

            <View style={styles.pricingView}>
              {priceList.map((item) => (
                <PriceListItem
                  routine={item.routine}
                  price={item.price}
                  key={item.routine}
                />
              ))}
            </View>
            <Text style={styles.pricesIncludeAllText}>
              {store.textData.photos_and_video_note}
            </Text>
          </View>

        </ScrollView>
        <View style={{ marginHorizontal: "5%" }}>
          <UEPButton
            title={store.textData.continue_text}
            onPressButton={() => {
              navigation.navigate("QuantityAndStudioScreen", {
                eventID: eventID,
                file_id: file_id,
                search_by: route.params.search_by,
                flag: route.params.flag
              });
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default PricesListScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#3F3F3F",
    alignItems: "center",
  },
  contentView: {
    marginHorizontal: "5%",
    marginVertical: "4%",
  },
  getAllText: {
    color: "rgba(254,254,254,1)",
    fontSize: RFValue(22),
    textAlign: "center",
    fontFamily: fonts.AvenirNextCondensedBold,
  },
  photosWillBeText: {
    color: "white",
    marginTop: "5%",
    textAlign: "center",
    fontFamily: fonts.AvenirNextCondensedRegular,
    fontSize: RFValue(17),
  },
  pricingText: {
    color: colors.header,
    marginTop: "5%",
    textAlign: "center",
    fontFamily: fonts.AvenirNextCondensedMediumItalic,
    fontSize: RFValue(21),
  },
  pricingView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "5%",
  },
  pricesIncludeAllText: {
    marginTop: "5%",
    fontFamily: fonts.AvenirNextCondensedMediumItalic,
    color: colors.header,
    textAlign: "center",
    fontSize: RFValue(26),
  },
});

import React, { useState, useRef } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Keyboard,
  Text,
  TouchableOpacity
} from "react-native";

import fonts from "../../constants/fonts";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import env from "../../constants/env";
import axios from "axios";
import colors from "../../constants/colors";
import Spinner from "react-native-loading-spinner-overlay";

//Components
import Header from "../../components/Header";
import UEPButton from "../../components/UEPButton";
import {
  encryptData,
  decryptData
} from '../../utilities/Crypto';
import { toastr, yupSchema, storage } from "../utilities/index";
import ContentHeader from "../../components/ContentHeader";
import UEPTextInput from "../../components/UEPTextInput";
import { Dropdown } from 'react-native-element-dropdown';
import { store } from "../../store/Store";
import { LoginContext } from "../../Context/LoginProvider";
import { useFocusEffect } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import Autocomplete from 'react-native-autocomplete-input';

const BillingInfoScreen = ({ navigation, route }) => {
  const { cartTotal, order_number, digitalData } = route.params;
  const { clearAllDetails, setProfile } = React.useContext(LoginContext);
  const [countriesList, setCountriesList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState({});
  const [countryID, setCountryID] = useState("");
  const [stateID, setStateID] = useState("");
  const [cityID, setCityID] = useState("");
  const [searchquery, setSearchQuery] = useState("");
  const [filteredCitiesList, setFilteredCitiesList] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const scrollViewRef = useRef();
  useFocusEffect(
    React.useCallback(() => {
      setSpinner(true);
      axios
        .get(env.BASE_URL + "/user/api/getCountries")
        .then(async (res) => {
          res.data = await decryptData(res.data);
          setCountriesList(res.data.data.countries);
          handleFetch();
        })
        .catch((err) => {
          setSpinner(false);
        });
    }, [])
  );

  const handleFetch = () => {
    axios
      .get(env.BASE_URL + "/preorder/api/getBillingInfo", {
        headers: { Authorization: `Bearer ${store.token}` },
      })
      .then(async ({ data }) => {
        data = await decryptData(data);
        axios
          .get(env.BASE_URL + "/user/api/getStates?country_id=" + data.data.country_id)
          .then(async (res1) => {
            res1.data = await decryptData(res1.data);
            setStatesList(res1.data.data.states);
            axios
              .get(env.BASE_URL + "/user/api/getCities?state_id=" + data.data.state_id)
              .then(async (res2) => {
                res2.data = await decryptData(res2.data);
                setCitiesList(res2.data.data.cities);
                setFirstName(data.data.first_name);
                setLastName(data.data.last_name);
                setEmail(data.data.email_id);
                setStreet(data.data.street_address);
                setApartment(data.data.apartment);
                setZipcode(data.data.zip_code);
                setPhone(data.data.phone_number);
                setCountryID(data.data.country_id);
                setCountry(data.data.country);
                setStateID(data.data.state_id);
                setState(data.data.state);
                setCityID(data.data.city_id);
                setCity({ "id": data.data.city_id, "name": data.data.city });
                setSearchQuery(data.data.city);
                setSpinner(false);
              })
              .catch((err2) => {
                setSpinner(false);
              });
          })
          .catch((err1) => {
            setSpinner(false);
          })
      })
      .catch(async (err) => {
        setSpinner(false);
        if (err.response.status == "400") {
          if (err.response.data.message == "jwt expired") {
            clearAllDetails();
          } else {
            setTimeout(() => {
              toastr.warning(err.response.data.message);
            }, 300);
          }
        } else {
          setTimeout(() => {
            toastr.warning(err.response.data.message);
          }, 300);
        }
      });
  };

  //Fetch States
  const handleState = (value) => {
    setSpinner(true);
    axios
      .get(env.BASE_URL + "/user/api/getStates?country_id=" + value)
      .then(async (res) => {
        res.data = await decryptData(res.data);
        setStatesList(res.data.data.states);
      })
      .catch((err) => {
      })
      .finally(() => {
        setSpinner(false);
      });
  };

  const handleCity = (value) => {
    setSpinner(true);
    axios
      .get(env.BASE_URL + "/user/api/getCities?state_id=" + value)
      .then(async (res) => {
        res.data = await decryptData(res.data);
        setCitiesList(res.data.data.cities);
      })
      .catch((err) => {
      })
      .finally(() => {
        setSpinner(false);
      });
  };

  const onTextChange = (text) => {
    var cleaned = ("" + text).replace(/\D/g, "");
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = match[1] ? "+1 " : "",
        number = [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join(
          ""
        );

      setPhone(number);

      return;
    }
    setPhone(text);
  };

  const submitData = () => {
    const cred = {
      first_name: firstName,
      last_name: lastName,
      email_id: email,
      street_address: street,
      apartment: (apartment == null || apartment == '') ? '' : apartment,
      city: String(searchquery),
      state: String(stateID),
      zip_code: zipcode,
      country: String(countryID),
      phone_number: phone,
    };
    yupSchema
      .ValidateBillingAddress()
      .validate(cred)
      .then(() => {

        if (cred.country == "") {
          setTimeout(() => {
            toastr.warning('Please select country')
          }, 300);
          return false;
        }
        if (cred.state == "") {
          setTimeout(() => {
            toastr.warning('Please select state')
          }, 300);
          return false;
        }

        if (cred.city == "") {
          setTimeout(() => {
            toastr.warning('Please enter city name')
          }, 300);
          return false;
        }
        setSpinner(true);
        axios
          .post(env.BASE_URL + "/preorder/api/insertBillingInfo", encryptData(cred), {
            headers: { Authorization: `Bearer ${store.token}` },
          })
          .then(async (res) => {
            setSpinner(false);
            res.data = await decryptData(res.data);
            {
              digitalData ?
                setTimeout(() => {
                  navigation.navigate("PaymentScreen", {
                    cartTotal: cartTotal,
                    order_number: order_number,
                    digitalData: digitalData,
                  });
                }, 500) :
                setTimeout(() => {
                  navigation.navigate("ShippingInfoScreen", {
                    cartTotal: cartTotal,
                    order_number: order_number,
                  });
                }, 500);
            }
            // if (digitalData === true) {
            //   setTimeout(() => {
            //     console.log("payment");
            //     navigation.navigate("PaymentScreen", {
            //       cartTotal: cartTotal,
            //       order_number: order_number,
            //     });
            //   }, 500);
            // } else {
            //   setTimeout(() => {
            //     console.log("ship");
            //     navigation.navigate("ShippingInfoScreen", {
            //       cartTotal: cartTotal,
            //       order_number: order_number,
            //     });
            //   }, 500);
            // }
          })
          .catch((err) => {
            setSpinner(false);
            if (err.response.status == "400") {
              if (err.response.data.message == "jwt expired") {
                clearAllDetails();
              } else {
                setTimeout(() => {
                  toastr.warning(err.response.data.message);
                }, 1000);
              }
            } else {
              setTimeout(() => {
                toastr.warning(err.response.data.message);
              }, 1000);
            }
          })
          .finally(() => {
            setSpinner(false);
          });
      })
      .catch((err) => {
        setSpinner(false);
        toastr.warning(err.errors[0]);
      });
  };

  const findCity = (query) => {
    // Method called every time when we change the value of the input
    if (query) {
      // Making a case insensitive regular expression
      const regex = new RegExp(`${query.trim()}`, 'i');
      // Setting the filtered film array according the query
      setFilteredCitiesList(
        citiesList.filter((city) => city.name.search(regex) >= 0)
      );
    } else {
      // If the query is null then return blank
      setFilteredCitiesList([]);
    }
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
            <ScrollView keyboardShouldPersistTaps="handled" ref={scrollViewRef}>
              <ContentHeader text={store.textData.enter_billing_info_text} />

              <View style={styles.formView}>
                {/* First Name */}
                <UEPTextInput
                  onChangeText={(e) => {
                    setFirstName(e);
                  }}
                  value={firstName}
                  placeholder="Name"
                  returnKeyType={"next"}
                  fontFamily={fonts.AvenirNextCondensedRegular}
                  fontSize={RFValue(16)}
                />
                {/* Last Name  */}
                <UEPTextInput
                  onChangeText={(e) => setLastName(e)}
                  value={lastName}
                  placeholder="Last Name"
                  returnKeyType={"next"}
                  fontFamily={fonts.AvenirNextCondensedRegular}
                  fontSize={RFValue(16)}
                />
                {/* Email  */}
                <UEPTextInput
                  style={styles.textInput}
                  onChangeText={(e) => {
                    setEmail(e);
                  }}
                  value={email}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType={"next"}
                  fontFamily={fonts.AvenirNextCondensedRegular}
                  fontSize={RFValue(16)}
                />
                {/* Street  */}
                <UEPTextInput
                  onChangeText={(e) => {
                    setStreet(e);
                  }}
                  value={street}
                  placeholder="Street Address"
                  returnKeyType={"next"}
                  fontFamily={fonts.AvenirNextCondensedRegular}
                  fontSize={RFValue(16)}
                />

                {/* Apartment  */}
                <UEPTextInput
                  onChangeText={(e) => {
                    setApartment(e);
                  }}
                  // value={apartment === "String" ? "" : apartment}
                  value={(apartment == null || apartment == '') ? "" : apartment}
                  placeholder="Apt # / Suite #"
                  returnKeyType={"next"}
                  fontFamily={fonts.AvenirNextCondensedRegular}
                  fontSize={RFValue(16)}
                />

                {/* Fetch Countries  */}
                <Dropdown
                  flatListProps={{
                    bounces: false
                  }}
                  value={countryID}
                  style={styles.countryView}
                  fontFamily={fonts.AvenirNextCondensedRegular}
                  data={countriesList}
                  labelField="name"
                  valueField="id"
                  label="Dropdown"
                  placeholder="Select Country"
                  dropdownPosition="bottom"
                  placeholderStyle={{
                    color: colors.place_holder_color,
                    fontSize: RFValue(16),
                    fontFamily: fonts.AvenirNextCondensedRegular
                  }}
                  onFocus={() => Keyboard.dismiss()}
                  onChange={item => {
                    setCountryID(item.id);
                    setCountry(item.id);
                    setStateID("");
                    setState("");
                    setStatesList([]);
                    setCityID("");
                    setCity({});
                    setSearchQuery("");
                    setCitiesList([]);
                    setFilteredCitiesList([]);
                    handleState(item.id);
                  }}
                  maxHeight={countriesList.length <= 7 ? 50 * countriesList.length : 350}
                  selectedTextStyle={{
                    color: '#FFF', fontSize: RFValue(16),
                    fontFamily: fonts.AvenirNextCondensedRegular
                  }}
                  renderItem={(item) => {
                    return (
                      <View style={{
                        height: 50,
                        paddingVertical: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                        <Text style={{
                          flex: 1,
                          fontSize: RFValue(14),
                          fontFamily: fonts.AvenirNextCondensedRegular,
                          marginLeft: 10
                        }}>{item.name}</Text>
                      </View>
                    );
                  }}
                />

                {/* End fetch countries  */}

                {/* Start states  */}
                <Dropdown
                  flatListProps={{
                    bounces: false
                  }}
                  value={stateID}
                  style={styles.countryView}
                  fontFamily={fonts.AvenirNextCondensedRegular}
                  data={statesList}
                  labelField="name"
                  valueField="id"
                  label="Dropdown"
                  placeholder="Select State"
                  dropdownPosition="bottom"
                  placeholderStyle={{
                    color: colors.place_holder_color,
                    fontSize: RFValue(16),
                    fontFamily: fonts.AvenirNextCondensedRegular
                  }}
                  onFocus={() => Keyboard.dismiss()}
                  onChange={item => {
                    setStateID(item.id);
                    setState(item.id);
                    setCityID("");
                    setCity({});
                    setSearchQuery("");
                    setCitiesList([]);
                    setFilteredCitiesList([]);
                    handleCity(item.id);
                  }}
                  maxHeight={statesList.length <= 6 ? 50 * statesList.length : 300}
                  selectedTextStyle={{
                    color: '#FFF', fontSize: RFValue(16),
                    fontFamily: fonts.AvenirNextCondensedRegular
                  }}
                  renderItem={(item) => {
                    return (
                      <View style={{
                        height: 50,
                        paddingVertical: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                        <Text style={{
                          flex: 1,
                          fontSize: RFValue(14),
                          fontFamily: fonts.AvenirNextCondensedRegular,
                          marginLeft: 10
                        }}>{item.name}</Text>
                      </View>
                    );
                  }}
                />

                {/* End states  */}

                {/* Start Cities  */}
                {/* <Dropdown
                  flatListProps={{
                    bounces: false
                  }}
                  value={cityID}
                  style={styles.countryView}
                  fontFamily={fonts.AvenirNextCondensedRegular}
                  data={citiesList}
                  labelField="name"
                  valueField="id"
                  label="Dropdown"
                  placeholder="Select City"
                  dropdownPosition="bottom"
                  placeholderStyle={{
                    color: colors.place_holder_color,
                    fontSize: RFValue(16),
                    fontFamily: fonts.AvenirNextCondensedRegular
                  }}
                  onFocus={() => Keyboard.dismiss()}
                  onChange={item => {
                    setCity(item.id);
                    setCityID(item.id);
                  }}
                  maxHeight={citiesList.length <= 5 ? 50 * citiesList.length : 250}
                  selectedTextStyle={{
                    color: '#FFF', fontSize: RFValue(16),
                    fontFamily: fonts.AvenirNextCondensedRegular
                  }}
                  selectedStyle={{ backgroundColor: colors.header }}
                  renderItem={(item) => {
                    return (
                      <View style={{
                        height: 50,
                        paddingVertical: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                        <Text style={{
                          flex: 1,
                          fontSize: RFValue(14),
                          fontFamily: fonts.AvenirNextCondensedRegular,
                          marginLeft: 10
                        }}>{item.name}</Text>
                      </View>
                    );
                  }}
                /> */}
                <Autocomplete
                  autoCapitalize="none"
                  autoCorrect={false}
                  data={filteredCitiesList}
                  defaultValue={JSON.stringify(city) === '{}' ?
                    '' :
                    city.name}
                  onChangeText={(text) => {
                    setSearchQuery(text);
                    findCity(text);
                  }}
                  placeholder="City"
                  onFocus={() => {
                    setTimeout(() => scrollViewRef.current.scrollToEnd({ duration: 500, animated: true }), 1000);
                  }}
                  renderTextInput={(props) => <TextInput {...props} placeholderTextColor={colors.place_holder_color}
                    style={{
                      borderBottomColor: colors.header,
                      borderBottomWidth: 2,
                      color: "white",
                      fontFamily: fonts.AvenirNextCondensedRegular,
                      height: Platform.OS === "ios" ? 50 : 50,
                      backgroundColor: '#3f3f3f',
                      fontSize: RFValue(16)
                    }}
                  />}
                  inputContainerStyle={{
                    borderWidth: 0,
                  }}
                  listContainerStyle={{ backgroundColor: '#FFF', maxHeight: 200 }}
                  flatListProps={{
                    bounces: false,
                    nestedScrollEnabled: true,
                    keyboardShouldPersistTaps: 'always',
                    keyExtractor: (_, idx) => idx,
                    renderItem: ({ item }) => (
                      <TouchableOpacity style={{
                        height: 50,
                        paddingVertical: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                        onPress={() => {
                          setSearchQuery(item.name);
                          setCity(item);
                          setFilteredCitiesList([]);
                        }}
                      >
                        <Text style={{
                          flex: 1,
                          fontSize: RFValue(14),
                          fontFamily: fonts.AvenirNextCondensedRegular,
                          marginLeft: 10
                        }}>{item.name}</Text>
                      </TouchableOpacity>
                    ),
                  }}
                />
                {/* End Cities  */}
                {/* Zip Code  */}
                <View>
                  <UEPTextInput
                    onChangeText={(e) => {
                      setZipcode(e);
                    }}
                    value={zipcode}
                    placeholder="Zip Code"
                    keyboardType="number-pad"
                    returnKeyType={"next"}
                    maxLength={6}
                    fontFamily={fonts.AvenirNextCondensedRegular}
                    fontSize={RFValue(16)}
                  />
                </View>

                {/* Phone  */}
                <UEPTextInput
                  onChangeText={(text) => onTextChange(text)}
                  value={phone}
                  placeholder="Telephone"
                  keyboardType="phone-pad"
                  maxLength={14}
                  fontFamily={fonts.AvenirNextCondensedRegular}
                  fontSize={RFValue(16)}
                />
                <View style={{ marginTop: "5%" }}>
                  <Text
                    style={{
                      alignSelf: "flex-end",
                      color: "white",
                      fontFamily: fonts.AvenirNextCondensedBold,
                      fontSize: RFValue(18),
                    }}
                  >
                    CART TOTAL: {cartTotal}.00
                  </Text>
                </View>

              </View>
            </ScrollView>

          </View>
          <View style={{ marginHorizontal: "5%" }}>
            <UEPButton
              title={store.textData.continue_text}
              onPressButton={() => {
                Keyboard.dismiss();
                submitData();
                // navigation.navigate("ShippingInfoScreen", {
                //   cartTotal: cartTotal,
                //   order_number: order_number,
                // });
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default BillingInfoScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#3F3F3F",
    alignItems: "center",
  },

  formView: {
    marginHorizontal: 10,
  },
  contentView: {
    marginTop: "2%",
    marginHorizontal: "3%",
    flex: 1
  },
  countryView: {
    borderBottomColor: colors.header,
    borderWidth: 2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    height: 50,
    fontSize: 25,
    paddingHorizontal: 2
  },
  stateView: {
    borderBottomColor: colors.header,
    borderWidth: 2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    height: 50,
    fontSize: 25,
    paddingHorizontal: 2
  },
});

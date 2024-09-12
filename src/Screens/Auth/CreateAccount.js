import React, { useEffect, useState, useRef } from "react";
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
import colors from "../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import { Dropdown } from 'react-native-element-dropdown';
import fonts from "../../constants/fonts";
import axios from "axios";
import env from "../../constants/env";
import Autocomplete  from "react-native-autocomplete-input";
//Components
import Header from "../../Components/Header";
import UEPButton from "../../Components/UEPButton";
import ScreenHeader from "../../Components/ScreenHeader";
import UEPTextInput from "../../Components/UEPTextInput";
import ContentHeader from "../../Components/ContentHeader";
import InfoHeader from "../../Components/InfoHeader";
//Utility
import { encryptData , decryptData } from "../../utilities/Crypto";
import { yupSchema , toastr } from "../utilities";

const CreateAccount = ({navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [phone, setPhone] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [country, setCountry] = useState(231);
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [phoneFormat, setPhoneFormat] = useState();
  const [countriesList, setCountriesList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [searchquery, setSearchQuery] = useState("");
  const [filteredCitiesList, setFilteredCitiesList] = useState([]);
  const scrollViewRef = useRef();

  // useFocusEffect(
  //   React.useCallback(() => {
  //     global.guestIndex = 2;
  //   }, [])
  // );

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

  //Default Country
  useEffect(() => {
    axios
      .get(env.BASE_URL + "/user/api/getStates?country_id=" + country)
      .then(async (res) => {
        res.data = await decryptData(res.data);
        setStatesList(res.data.data.states);
      })
      .catch((err) => {
      });
  }, []);

  //Fetch Countries
  useEffect(() => {
    setSpinner(true);
    axios
      .get(env.BASE_URL + "/user/api/getCountries")
      .then(async (res) => {
        res.data = await decryptData(res.data);
        setCountriesList(res.data.data.countries);
      })
      .catch((err) => {
      })
      .finally(() => {
        setSpinner(false);
      });
  }, []);

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

  const handleRegister = () => {
    const cred = {
      first_name: firstName,
      last_name: lastName,
      email_id: email,
      street_address: street,
      apartment: (apartment == null || apartment == '') ? "" : apartment,
      city: searchquery.toString(),
      state: stateName.toString(),
      zip_code: zipcode,
      country: country.toString(),
      phone_number: phone,
    };
    yupSchema
      .validateUser()
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
          .post(env.BASE_URL + "/user/api/userRegister", encryptData(cred))
          .then(async (res) => {
            setSpinner(false);
            res.data = await decryptData(res.data);
            console.log("otp", res.data);
            setTimeout(() => {
              toastr.success("SuccessFully Sent OTP to your registered email");
            }, 1000);
            navigation.navigate("VerifyAccount", {
              email: email,
            });
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
      .catch(function (err) {
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
        {/* <Spinner visible={spinner} /> */}
        <LinearGradient colors={["#393838", "#222222"]}>
          <Header />
        </LinearGradient>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{ flex: 1 }}
        >
          <View style={styles.contentView}>
            <ScrollView keyboardShouldPersistTaps='handled' ref={scrollViewRef}>
              <ScreenHeader text="CREATE AN ACCOUNT" />
              <ContentHeader text="please update your profile below" />
              <InfoHeader text="This information is for account use only and is not shared with any other third party." />

              <View style={styles.formView}>
                {/* First Name */}
                <UEPTextInput
                  onChangeText={(e) => {
                    setFirstName(e);
                  }}
                  value={firstName}
                  placeholder="First Name"
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
                  onChangeText={(e) => {
                    setEmail(e);
                  }}
                  value={email}
                  placeholder="Email Address"
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
                  value={apartment}
                  placeholder="Apt # / Suite #"
                  returnKeyType={"next"}
                  fontFamily={fonts.AvenirNextCondensedRegular}
                  fontSize={RFValue(16)}
                />

                <Dropdown
                  flatListProps={{
                    bounces: false
                  }}
                  value={country}
                  style={styles.countryView}
                  fontFamily={fonts.AvenirNextCondensedRegular}
                  data={countriesList}
                  labelField="name"
                  valueField="id"
                  label="Dropdown"
                  placeholder="Country"
                  dropdownPosition="bottom"
                  placeholderStyle={{
                    color: colors.place_holder_color,
                    fontSize: RFValue(16),
                    fontFamily: fonts.AvenirNextCondensedRegular
                  }}
                  onFocus={() => Keyboard.dismiss()}
                  onChange={item => {
                    setCountry(item.id);
                    setCity({});
                    setSearchQuery("");
                    setStateName("");
                    setStatesList([]);
                    setCitiesList([]);
                    setFilteredCitiesList([]);
                    handleState(item.id);
                  }}
                  maxHeight={countriesList.length <= 6 ? 50 * countriesList.length : 300}
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
                  value={stateName}
                  style={styles.countryView}
                  fontFamily={fonts.AvenirNextCondensedRegular}
                  data={statesList}
                  labelField="name"
                  valueField="id"
                  label="Dropdown"
                  placeholder="State"
                  dropdownPosition="bottom"
                  placeholderStyle={{
                    color: colors.place_holder_color,
                    fontSize: RFValue(16), 
                    fontFamily: fonts.AvenirNextCondensedRegular
                  }}
                  onChange={item => {
                    setStateName(item.id);
                    setCity({});
                    setSearchQuery("");
                    setCitiesList([]);
                    setFilteredCitiesList([]);
                    handleCity(item.id);
                  }}
                  onFocus={() => Keyboard.dismiss()}
                  maxHeight={statesList.length <= 5 ? 50 * statesList.length : 250}
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

                <View style={styles.zipCodeView}>
                  {/* Zip Code  */}
                  <UEPTextInput
                    onChangeText={(e) => {
                      setZipcode(e);
                    }}
                    value={zipcode}
                    placeholder="Zip Code"
                    keyboardType="number-pad"
                    maxLength={6}
                    returnKeyType={"next"}
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
                  returnKeyType={"next"}
                  dataDetectorTypes="phoneNumber"
                  textContentType="telephoneNumber"
                  maxLength={14}
                  fontFamily={fonts.AvenirNextCondensedRegular}
                  fontSize={RFValue(16)}
                />

                <UEPButton
                  title="Countinue"
                  onPressButton={() => {
                    handleRegister();
                    Keyboard.dismiss();
                  }}
                />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default CreateAccount;

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
});
import React, {useState , useEffect} from 'react';
import {  
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Text,
  Keyboard,
  TouchableOpacity,
  Image,
  Modal,
  PermissionsAndroid,
  SafeAreaView,
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import Header from "../../Components/Header";
import UEPTextInput from '../../Components/UEPTextInput';
import UEPButton from '../../Components/UEPButton';
import { RFValue } from "react-native-responsive-fontsize";
import fonts from '../../constants/fonts';
import { LoginContext } from '../../Context/LoginProvider';
import { store } from '../../store/Store';
import env from "../../constants/env";
import axios from "axios";
import globals from '../../constants/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData , decryptData } from '../../utilities/Crypto';

const UserLogin = ({navigation}) => {
  const { setIsLoggedIn, setProfile, setIsChecking, setCartCount, setNotificationCount, deviceToken, isLoggedIn, setUserId } = React.useContext(LoginContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Platform.OS === 'android' && loadWifiList();
    Platform.OS === "ios" && handleFaceID();
  }, [])

  const storeUser = async (user) => {
    try {
      await AsyncStorage.setItem("USER", user);
    } catch (e) {
    }
  };
  const storeName = async (name) => {
    try {
      await AsyncStorage.setItem("USER_NAME", name);
    } catch (e) {
    }
  };

  const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem("USER_TOKEN", token);
    } catch (e) {
    }
  };

  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };


  const handleData = () => {
    if (email === "") {
      toastr.warning("Required email");
    }
    else if (!validateEmail(email)) {
      toastr.warning("Please enter valid email");
    }
    else if (password === "") {
      toastr.warning("Required password");
    } else {
      submitData(email, password);
    }
  };
  const handleFaceID = async () => {
    try {
      // Retrieve the credentials
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        // setEmail(credentials.username);
        // setPassword(credentials.password);

        FaceID.isSupported()
          .then((biometryType) => {
            if (biometryType === "FaceID") {
              FaceID.authenticate("Authenticate with Face ID")
                .then((success) => {
                  submitData(credentials.username, credentials.password);
                })
                .catch((error) => {
                })
            }
          })
          .catch((error) => {
          })

      }
    } catch (error) {
    }
    //await Keychain.resetGenericPassword();
  }

  const submitData = async (email, password) => {
    setSpinner(true);
    axios
      .post(env.BASE_URL + "/user/api/userLogin", encryptData({
        email_id: email,
        password: password,
        device_token: deviceToken,
        device_type: Platform.OS == "android" ? '1' : '2'
      }))
      .then(async (res) => {
        res.data = await decryptData(res.data);

        const tranformedData = Object.entries(res.data).map(([key, value]) => ({
          [key]: value,
        }));
        store.setToken(tranformedData[2].data.access_token);
        setProfile(
          tranformedData[2].data.first_name +
          " " +
          tranformedData[2].data.last_name
        );

        await storeUser(tranformedData[2].data.email_id);
        await storeName(
          tranformedData[2].data.first_name +
          " " +
          tranformedData[2].data.last_name
        );
        await storeToken(tranformedData[2].data.access_token);
        setCartCount(tranformedData[2].data.user_cart_count);
        setNotificationCount(tranformedData[2].data.user_notification_count);
        setSpinner(false);
        setIsChecking(true);
        setIsLoggedIn(true);
        setIsChecking(false);
        // Store the credentials
        await Keychain.setGenericPassword(email, password);
      })
      .catch(async (err) => {
        setSpinner(false);
        setTimeout(() => {
          toastr.warning(err.response.data.message);
        }, 1000);
      })
      .finally(() => { });
  };


  return (
    <View style={styles.screen}>
      <ImageBackground source={require("../../assets/auth/login_bg.png")} style={styles.bgImage}>
      <SafeAreaView>
          {/* <Spinner visible={spinner} /> */}
          <LinearGradient colors={["#393838", "#222222"]}>
            <Header />
          </LinearGradient>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={{ flex: 1 }}
          >
            <View style={styles.loginContainer}>
              <View style={styles.loginFormContainer}>
                <View style={styles.loginHeadingText}>
                  <Text style={styles.loginText}>
                    LOGIN INTO YOUR ACCOUNT
                    </Text>
                </View>

                <View style={styles.loginForm}>

                  <View style={styles.formView}>
                    {Platform.OS === "ios" &&
                      <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => {
                          // handleFaceID();
                        }}>
                          <Image source={face_id_img} style={{
                            width: 30,
                            height: 30,
                            tintColor: 'white'
                          }} />
                        </TouchableOpacity>

                      </View>}

                    {/* Email  */}
                    <UEPTextInput
                      onChangeText={(e) => {
                        if (e.includes(" ")) {
                          setEmail(e.trim());
                        } else {
                          setEmail(e);
                        }
                      }}
                      value={email}
                      placeholder="Email Address"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType={"next"}
                    />
                    {/* Password  */}
                    {showPassword === false ? (
                      <View style={styles.showPasswordView}>
                        <UEPTextInput
                          onChangeText={(e) => {
                            if (e.includes(" ")) {
                              setPassword(e.trim());
                            } else {
                              setPassword(e);
                            }
                          }}
                          value={password}
                          placeholder="Password"
                          secureTextEntry={true}
                        />
                        <View style={styles.iconView}>
                          <TouchableOpacity
                            onPress={() => {
                              setShowPassword(true);
                            }}
                          >
                            <Image
                              source={require("../../assets/auth/eye-close.png")}
                              style={styles.iconImage}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.showPasswordView}>
                        <UEPTextInput
                          onChangeText={(e) => {
                            if (e.includes(" ")) {
                              setPassword(e.trim());
                            } else {
                              setPassword(e);
                            }
                          }}
                          value={password}
                          placeholder="Password"
                          secureTextEntry={false}
                        />
                        <View style={styles.iconView}>
                          <TouchableOpacity
                            onPress={() => {
                              setShowPassword(false);
                            }}
                          >
                            <Image
                              source={require("../../assets/auth/eye-open.png")}
                              style={styles.iconImage}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                    <View style={styles.buttonsContainer}>
                      <View style={{ marginTop: "1%" }}>
                        <UEPButton
                          title="Login"
                          onPressButton={() => {
                            handleData();
                            Keyboard.dismiss();
                          }}
                        />
                      </View>

                      <View style={{ marginTop: "-3%" }}>
                        <UEPButton
                          title="continue as guest"
                          onPressButton={() => {
                            // navigation.navigate("HomeScreen");
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.bottomView}>
                      <View style={styles.createAccountView}>
                        <Text
                          onPress={() => {
                            navigation.navigate("CreateAccount");
                          }}
                          style={styles.createAccountText}
                        >
                          create account
                        </Text>
                      </View>
                      <View style={styles.forgotPassView}>
                        <Text
                          onPress={() => {
                            navigation.navigate("ForgotPassword");
                          }}
                          style={styles.forgotPassText}
                        >
                          forgot password
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
          </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default UserLogin;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#393838",
    alignItems: "center",
  },
  showPasswordView: {},
  modal: {
    flex: 1,
    backgroundColor: '#212121',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomView: {
    flexDirection: "row",
    marginVertical: 3,
    justifyContent: "center",
    paddingBottom: 10,
  },
  createAccountView: {
    width: "48%",
    marginHorizontal: "2%",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "black",
  },

  forgotPassView: {
    width: "48%",
    marginHorizontal: "2%",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "black",
  },
  forgotPassText: {
    textAlign: "center",
    color: "white",
    fontSize: 15,
    padding: 2,
    fontFamily: fonts.AvenirMedium,
  },
  createAccountText: {
    textAlign: "center",
    color: "white",
    fontSize: 15,
    padding: 2,
    fontFamily: fonts.AvenirMedium,
  },

  formView: {
    marginHorizontal: 10,
  },
  loginContainer: {
    marginHorizontal: "5%",
    borderRadius: 10,
    flex: 1,
  },
  loginFormContainer: {
    position: "absolute",
    bottom: "1%",
  },
  loginForm: {
    backgroundColor: "black",
    justifyContent: "space-between",
    left: 0,
    right: 0,
    opacity: 0.99,
    marginHorizontal: "1%",
    borderRadius: 10,
    paddingBottom: "2%",
    paddingTop: 10,
    paddingHorizontal: "3%",
  },
  bgImage: {
    flex: 1,
    justifyContent: "center",
  },
  iconView: {
    // backgroundColor: "green",
    height: 20,
    width: 40,
    right: "2%",
    marginTop: "3%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  iconImage: {
    width: 25,
    height: 20,
    tintColor: "white",
  },
  loginHeadingText: {
    justifyContent: "center",
    alignItems: "center",
    padding: "2%",
  },
  loginText: {
    fontSize: RFValue(25),
    fontFamily: fonts.BebasNeueRegular,
    color: "white",
  },
  buttonsContainer: {
    marginHorizontal: "-1%",
    marginTop: "2%",
  },
});

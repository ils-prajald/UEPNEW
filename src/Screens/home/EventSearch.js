import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Text,
  Dimensions
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Header from "../../components/Header";
import colors from "../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import { Select } from "native-base";
import UEPButton from "../../components/UEPButton";
import ContentHeader from "../../components/ContentHeader";
import Spinner from "react-native-loading-spinner-overlay";
import env from "../../constants/env";
import { store } from "../../store/Store";
import axios from "axios";
import moment from "moment";
import { toastr, yupSchema } from "../utilities/index";
import { LoginContext } from "../../Context/LoginProvider";
import { useFocusEffect } from "@react-navigation/native";
import { Dropdown } from 'react-native-element-dropdown';
import {
  encryptData,
  decryptData
} from '../../utilities/Crypto';
const EventSearch = ({ navigation }) => {
  const { clearAllDetails, setInitialParams } = React.useContext(LoginContext);
  const [spinner, setSpinner] = useState(false);

  const [producersList, setProducersList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [datesList, setDatesList] = useState([]);

  const [producer, setProducer] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [viewHeight, setViewHeight] = useState(0);
  const [dropTopHeight, setDropTopHeight] = useState(0);
  // let timeZone = "America/Los_Angeles";
  // const dateObject = new Date(stringInput).toLocaleString("en-US", {
  //   timeZone,
  // });

  let getProducers = "";
  let getEvents = "";
  let getEventDates = "";
  let selectCompetitionDetails = "";

  if (store.token) {
    getProducers = "/media/api/getCompetitionDetails?request_type=1";
    getEvents = "/media/api/getCompetitionDetails?request_type=2&producer_id=";
    getEventDates = "/media/api/getCompetitionDetails?request_type=3&event_id=";
    selectCompetitionDetails = "/media/api/selectCompetitionDetails";
  } else {
    getProducers = "/guest/api/getCompetitionDetails?request_type=1";
    getEvents = "/guest/api/getCompetitionDetails?request_type=2&producer_id=";
    getEventDates = "/guest/api/getCompetitionDetails?request_type=3&event_id=";
    selectCompetitionDetails = "/guest/api/selectCompetitionDetails";
  }

  useFocusEffect(
    React.useCallback(() => {
      global.guestIndex = 0;
      global.userIndex = 3;
    }, [])
  );

  useEffect(() => {
    setSpinner(true);
    axios
      .get(env.BASE_URL + getProducers, {
        headers: { Authorization: `Bearer ${store.token}` },
      })
      .then(async ({ data }) => {
        data = await decryptData(data);
        setProducersList(data.data.producer_list);
        // navigation.navigate("VideoPlayerScreen");
      })
      .catch((err) => {
      })
      .finally(() => {
        setSpinner(false);
      });
  }, []);

  const handleEvents = (value) => {
    setSpinner(true);
    axios
      .get(env.BASE_URL + getEvents + value, {
        headers: { Authorization: `Bearer ${store.token}` },
      })
      .then(async (res) => {
        res.data = await decryptData(res.data);
        setEventsList(res.data.data.event_list);
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
      })
      .finally(() => {
        setSpinner(false);
      });
  };

  const handleEventDates = (value) => {
    setSpinner(true);
    axios
      .get(env.BASE_URL + getEventDates + value, {
        headers: { Authorization: `Bearer ${store.token}` },
      })
      .then(async (res) => {
        res.data = await decryptData(res.data);
        if (res.data.data.event_dates_list.length > 0) {
          for (var i = 0; i < res.data.data.event_dates_list.length; i++) {
            res.data.data.event_dates_list[i].custom_date = moment(res.data.data.event_dates_list[i].start_date).format("MM/DD/YY").toString() + " to " + moment(res.data.data.event_dates_list[i].end_date).format("MM/DD/YY").toString();
          }
        }
        setDatesList(res.data.data.event_dates_list);
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
      })
      .finally(() => {
        setSpinner(false);
      });
  };

  const submitData = () => {
    const cred = {
      producer_id: producer,
      event_id: eventName,
      start_date: moment(eventDate).format("YYYY-MM-DD").toString(),
    };
    yupSchema
      .validateEventSearch()
      .validate(cred)
      .then(() => {
        setSpinner(true);
        axios
          .post(env.BASE_URL + selectCompetitionDetails, encryptData(cred), {
            headers: { Authorization: `Bearer ${store.token}` },
          })
          .then(async (res) => {
            setSpinner(false);
            res.data = await decryptData(res.data);
            console.log("res.data", res.data);
            if (res.data.data.is_cheer_mode === 1) {
              setInitialParams({
                eventID: res.data.data.event_id,
                event_name: res.data.data.event_name,
                event_url: res.data.data.event_ad_url,
                cred,
                screen: "CheerModeScreen",
              });
              setTimeout(() => {
                navigation.navigate("CheerModeScreen", {
                  eventID: res.data.data.event_id,
                  event_name: res.data.data.event_name,
                  event_url: res.data.data.event_ad_url,
                  cred,
                });
              }
                , 500);
            }
            else if (res.data.data.is_dance_mode === 1) {
              console.log("ACT", res.data.data)
              setInitialParams({
                eventID: res.data.data.event_id,
                event_name: res.data.data.event_name,
                event_url: res.data.data.event_ad_url,
                is_free: res.data.data.is_free,
                cred,
                screen: "ActNumberScreen",
              });
              setTimeout(() => {
                navigation.navigate("ActNumberScreen", {
                  eventID: res.data.data.event_id,
                  event_name: res.data.data.event_name,
                  event_url: res.data.data.event_ad_url,
                  is_free: res.data.data.is_free,
                  cred,
                });
              }, 500);
            }
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
      })
      .catch(function (err) {
        setSpinner(false);
        toastr.warning(err.errors[0]);
      });
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <Spinner visible={spinner} />
        <LinearGradient colors={["#393838", "#222222"]}>
          <Header />
        </LinearGradient>
        {/* <ScrollView> */}
        <View style={styles.contentView} onLayout={(event) => {
          var { x, y, width, height } = event.nativeEvent.layout;
          setViewHeight(height);
        }}>
          {/* Producers  */}
          <View style={styles.containerView}>
            <ContentHeader text={store.textData.select_event_producer} />
            <View onLayout={(event) => {
              var { x, y, width, height } = event.nativeEvent.layout;
              setDropTopHeight(y);
            }}>
              <Dropdown
                flatListProps={{
                  bounces: false
                }}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 5,
                  paddingHorizontal: 10,
                  height: 45
                }}
                fontFamily="Avenir Next"
                data={producersList}
                labelField="event_producer"
                valueField="producer_id"
                label="Dropdown"
                placeholder="Please select an option"
                placeholderStyle={{
                  color: colors.place_holder_color1,
                  fontSize: RFValue(14),
                }}
                onChange={item => {
                  setProducer(item.producer_id);
                  handleEvents(item.producer_id);
                }}
                // maxHeight={producersList.length <= 5 ? 50 * producersList.length : 250}
                maxHeight={producersList.length * 50 >= viewHeight - dropTopHeight - 45 - 15 ? viewHeight - dropTopHeight - 45 - 15 : producersList.length * 50}
                selectedTextStyle={{ color: '#000' }}
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
                        // fontFamily: fonts.AvenirNextCondensedRegular,
                        color: '#000', textAlign: 'center'
                      }}>{item.event_producer}</Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>

          {/* Events  */}
          <View style={styles.containerView}>
            <ContentHeader text={store.textData.select_competition} />

            <Dropdown
              flatListProps={{
                bounces: false
              }}
              style={{
                backgroundColor: 'white',
                borderBottomColor: 'gray',
                borderBottomWidth: 0.5,
                borderRadius: 5,
                paddingHorizontal: 10,
                height: 45
              }}
              fontFamily="Avenir Next"
              data={eventsList}
              labelField="event_name"
              valueField="id"
              label="Dropdown"
              placeholder="Please select an option"
              placeholderStyle={{
                color: colors.place_holder_color1,
                fontSize: RFValue(14),
              }}
              onChange={item => {
                setEventName(item.id);
                handleEventDates(item.id);
              }}
              maxHeight={eventsList.length <= 5 ? 50 * eventsList.length : 250}
              selectedTextStyle={{ color: '#000' }}
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
                      // fontFamily: fonts.AvenirNextCondensedRegular,
                      color: '#000', textAlign: 'center'
                    }}>{item.event_name}</Text>
                  </View>
                );
              }}
            />
          </View>
          {/* Dates  */}
          <View style={styles.containerView}>
            <ContentHeader text={store.textData.competition_date} />

            <Dropdown
              flatListProps={{
                bounces: false
              }}
              style={{
                backgroundColor: 'white',
                borderBottomColor: 'gray',
                borderBottomWidth: 0.5,
                borderRadius: 5,
                paddingHorizontal: 10,
                height: 45
              }}
              fontFamily="Avenir Next"
              data={datesList}
              labelField="custom_date"
              valueField="start_date"
              label="Dropdown"
              placeholder="Please select an option"
              placeholderStyle={{
                color: colors.place_holder_color1,
                fontSize: RFValue(14),
              }}
              onChange={item => {
                setEventDate(item.start_date);
              }}
              maxHeight={datesList.length <= 5 ? 50 * datesList.length : 250}
              selectedTextStyle={{ color: '#000' }}
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
                      // fontFamily: fonts.AvenirNextCondensedRegular,
                      color: '#000', textAlign: 'center'
                    }}>{item.custom_date}</Text>
                  </View>
                );
              }}
            />
          </View>
        </View>
        {/* </ScrollView> */}
        <View style={{ paddingHorizontal: "5%" }}>
          <UEPButton
            title={store.textData.continue_text}
            onPressButton={() => {
              submitData();
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default React.memo(EventSearch);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.screen_bg,
    opacity: 1,
    alignItems: 'center'
  },
  contentView: {
    flex: 1,
    marginHorizontal: "5%",
  },
  selectBGView: {
    backgroundColor: "white",
    borderRadius: 5,
  },

  containerView: {
    marginVertical: 20,
  },
});

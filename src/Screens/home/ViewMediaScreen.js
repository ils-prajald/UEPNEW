import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Dimensions,
  ScrollView,
  Switch,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
  TouchableWithoutFeedback,
  Animated,
  Modal, Alert, ActivityIndicator,
} from "react-native";
import { Checkbox, SimpleGrid, Box } from "native-base";
import colors from "../../constants/colors";
import Header from "../../components/Header";
import LinearGradient from "react-native-linear-gradient";
import { store } from "../../store/Store";
import fonts from "../../constants/fonts";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { useFocusEffect } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import Spinner from "react-native-loading-spinner-overlay";
const video_thumb = require("../../assets/home/video_thumbnail.png");
import axios from "axios";
import { LoginContext } from "../../Context/LoginProvider";
import { toastr } from "../utilities/index";
import env from "../../constants/env";
import NoDataCard from '../../components/NoDataCard';
import LazyImage from "../../components/LazyImage";
import { createThumbnail } from "react-native-create-thumbnail";
import {
  encryptData,
  decryptData
} from '../../utilities/Crypto';
import Icon from 'react-native-vector-icons/AntDesign';
import Popup from "../../components/Popup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "@react-native-community/blur";
import { VibrancyView } from "@react-native-community/blur";
import FastImage from 'react-native-fast-image'
import { background } from "native-base/lib/typescript/theme/styled-system";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { SafeAreaView } from "react-native-safe-area-context";
const ViewMediaScreen = ({ props, route, navigation }) => {
  const { clearAllDetails, setCartCount, imagesData, setImagesData, isFavourite, setIsFavourite, images1, setImages1 } = React.useContext(LoginContext);
  const [isOverlay, setIsoverlay] = useState(false)
  const event_id = route.params.eventID;
  const event_name = route.params.event_name;
  // const is_free = route.params.is_free;
  // console.log('is_free', is_free);
  const is_digital = 1;
  const onGetBack = (params) => {
    // here is your callback function
  }
  const scrollRef = React.useRef(null);
  console.log('View Media isFavourite', isFavourite);
  console.log('overlay', isOverlay);


  // alert(JSON.stringify(isFavourite))
  let [pHeight, setpHeight] = useState(0);
  let [spinner, setSpinner] = useState(false);
  let [modalVisible, setModalVisible] = useState(false);
  let [modalVisible1, setModalVisible1] = useState(false);
  let [modalVisible2, setModalVisible2] = useState(false);
  let [modalVisible4, setModalVisible4] = useState(false); // for digital file
  const [visible, setVisible] = useState(false);
  let [videos, setVideos] = useState([]);
  let [images, setImages] = useState([]);
  let [newImages, setNewImages] = useState([]);
  let [imageCount, setImageCount] = useState(0);
  let [subHeader, setSubHeader] = useState("");
  let [event_mode_id, setEvent_mode_id] = useState(1);
  let [page, setPage] = useState(1);
  let [dataLoaded, setDataLoaded] = useState(false);
  let [imageURI, setImageURI] = useState('');
  const [is_free, setIs_free] = useState(0);
  const INSEST = useSafeAreaInsets();
  console.log("INSEST", INSEST);
  let [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(false);
  let viewMediaDetails = "";
  if (store.token) {
    viewMediaDetails = "/media/api/viewMediaDetails";
  } else {
    viewMediaDetails = "/guest/api/viewMediaDetails";
  }

  useFocusEffect(
    React.useCallback(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollToIndex({ index: scrollRef.current.getCurrentIndex() });
      }
    }, [])
  );

  // console.log("test------", store.textData);
  // const getIsOverlayFromStorage = async () => {
  //   console.log("svdsvdsv")
  //   try {
  //     console.log("data===", dataLoaded);
  //     const value = await AsyncStorage.getItem('isOverlay');
  //     if (value === null) {
  //       setVisible(true);
  //     }
  //   } catch (error) {
  //     console.error('Error getting isOverlay from AsyncStorage:', error);
  //     console.error('Error getting isOverlay from AsyncStorage:', error);
  //   }
  // };

  overlayFunction = async () => {
    setIsoverlay(prev => !prev);
  }

  useEffect(() => {
    setImages1([]);
    setImagesData([]);
    setIsFavourite(false);
    getMediaDetails();
    getIsOverlayFromStorage();
  }, []);
  console.log("count", imageCount);

  isContinue = async () => {
    if (isOverlay === true) {
      try {
        await AsyncStorage.setItem('isOverlay', JSON.stringify(isOverlay));
      } catch (error) {
        console.error('Error saving isOverlay to AsyncStorage:', error);
      }
    }
    setVisible(false);
  }

  getThumbail = (id, url) => {
    return new Promise((resolve, reject) => {
      createThumbnail({
        url: url,
        cacheName: id.toString(),
      })
        .then(response => {
          resolve({ uri: response.path })
        })
        .catch(err => reject(require('../../assets/loading.png')));
    });
  }

  getMediaDetails = () => {
    // console.log('getMediaDetails', route.params.cred);
    setSpinner(true);
    let postData = route.params.cred;
    postData.limit = 100;
    postData.page = 1;
    postData.fav_flag = Number(0);
    axios
      .post(env.BASE_URL + viewMediaDetails, encryptData(postData), {
        headers: { Authorization: `Bearer ${store.token}` },
      })
      .then(async (res) => {
        res.data = await decryptData(res.data);
        console.log("is_free_data", res.data.data)
        setSubHeader(res.data.data.search_by);
        setEvent_mode_id(res.data.data.event_mode_id);
        setImagesData(res.data.data.images);
        setImages1(res.data.data.images);
        setNewImages(res.data.data.images);
        setImageCount(res.data.data.media_count);
        setIs_free(res.data.data.is_free);
        setPage(2);
        // console.log('Imagessss---', res.data.data);
        // console.log('test--',)
        console.log('is_free', res.data.data.search_by);
        var tmpvid = res.data.data.videos
        if (tmpvid.length > 0) {
          for (var i = 0; i < tmpvid.length; i++) {
            try {
              tmpvid[i].thumb = await getThumbail(tmpvid[i].id, tmpvid[i].file_url);
              // tmpvid[i].thumb = require('../../assets/loading.png');
            }
            catch (err) {
              tmpvid[i].thumb = require('../../assets/loading.png');
            }
          }
        }
        setVideos(tmpvid);
        setSpinner(false);
        setDataLoaded(true);
        // if (res.data.data.images.length >= 100) {
        //   this.loadMore();
        // }
        // else {
        //   setSpinner(false);
        //   setDataLoaded(true);
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
            }, 500);
          }
        } else {
          setTimeout(() => {
            toastr.warning(err.response.data.message);
          }, 500);
        }
      })
    // .finally(() => {
    //   setSpinner(false);
    // });
  }

  getMediaDetails2 = (fav) => {
    // console.log('getMediaDetails', route.params.cred);
    setSpinner(true);
    let postData = route.params.cred;
    postData.limit = 100;
    postData.page = 1;
    postData.fav_flag = Number(fav);
    axios
      .post(env.BASE_URL + viewMediaDetails, encryptData(postData), {
        headers: { Authorization: `Bearer ${store.token}` },
      })
      .then(async (res) => {
        res.data = await decryptData(res.data);
        setSubHeader(res.data.data.search_by);
        setEvent_mode_id(res.data.data.event_mode_id);
        setImagesData(res.data.data.images);
        setImages1(res.data.data.images);
        setNewImages(res.data.data.images);
        setImageCount(res.data.data.media_count);
        setPage(2);
        // console.log('Imagessss---2', res.data.data);
        // console.log("test--==", res.data.data.images);
        var tmpvid = res.data.data.videos
        if (tmpvid.length > 0) {
          for (var i = 0; i < tmpvid.length; i++) {
            try {
              tmpvid[i].thumb = await getThumbail(tmpvid[i].id, tmpvid[i].file_url);
              // tmpvid[i].thumb = require('../../assets/loading.png');
            }
            catch (err) {
              tmpvid[i].thumb = require('../../assets/loading.png');
            }
          }
        }
        setVideos(tmpvid);
        setSpinner(false);
        setDataLoaded(true);
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
    // .finally(() => {
    //   setSpinner(false);
    // });
  }

  loadMore = async () => {
    const value = await AsyncStorage.getItem("isFavouriteCheck");
    // console.log("load More IsFav", isFavourite)
    // console.log("Value", value)
    if (value === "false" && isFavourite === false) {
      // console.log("LoadMore")
      // setSpinner(true);
      let postData = route.params.cred;
      postData.limit = 100;
      postData.page = page;
      postData.fav_flag = Number(0);
      axios
        .post(env.BASE_URL + viewMediaDetails, encryptData(postData), {
          headers: { Authorization: `Bearer ${store.token}` },
        })
        .then(async (res) => {
          res.data = await decryptData(res.data);
          setImagesData(imagesData.concat(res.data.data.images));
          setImages1(images1.concat(res.data.data.images));
          setNewImages(res.data.data.images);
          setPage(page + 1);
          setSpinner(false);
          setDataLoaded(true);
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
    } else if (isFavourite === false) {
      // console.log("LoadMore")
      // setSpinner(true);
      let postData = route.params.cred;
      postData.limit = 100;
      postData.page = page;
      postData.fav_flag = Number(0);
      axios
        .post(env.BASE_URL + viewMediaDetails, encryptData(postData), {
          headers: { Authorization: `Bearer ${store.token}` },
        })
        .then(async (res) => {
          res.data = await decryptData(res.data);
          setImagesData(imagesData.concat(res.data.data.images));
          setImages1(images1.concat(res.data.data.images));
          setNewImages(res.data.data.images);
          setPage(page + 1);
          setSpinner(false);
          setDataLoaded(true);
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
    }

  }

  addFavourite = (file_id, file_name) => {
    setSpinner(true);
    axios
      .post(env.BASE_URL + '/media/api/addFilesToMyFavourites', encryptData({
        "file_id": file_id, "event_id": event_id, "file_name": file_name
      }), {
        headers: { Authorization: `Bearer ${store.token}` },
      })
      .then(async ({ data }) => {
        data = await decryptData(data);
        if (data.statusCode == 200) {
          var tmpi = images1;
          for (var i = 0; i < tmpi.length; i++) {
            if (tmpi[i].id == file_id) {
              tmpi[i].is_favourite = 1;
            }
          }
          setImages1(tmpi);
          if (isFavourite) {
            const newData = tmpi.filter(item => {
              return item.is_favourite == 1;
            });
            // setImages(newData);
            setImagesData(newData);
            if (newData.length <= 0) {
              setTimeout(() => {
                toastr.warning(store.textData.no_image_select_fvrt_text);
              }, 1000);
            }
          }
          else {
            // setImages(tmpi);
            setImagesData(tmpi);
            if (tmpi.length <= 0) {
              setTimeout(() => {
                toastr.warning(store.textData.no_image_select_fvrt_text);
              }, 1000);
            }
          }
          // setIsRender(!isRender);
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
  }

  removeFavourite = (file_id) => {
    setSpinner(true);
    axios
      .delete(env.BASE_URL + '/media/api/removeFileFromFavourites/' + file_id, {
        headers: { Authorization: `Bearer ${store.token}` },
      })
      .then(async ({ data }) => {
        data = await decryptData(data);
        if (data.statusCode == 200) {
          var tmpi = images1;
          for (var i = 0; i < tmpi.length; i++) {
            if (tmpi[i].file_id == file_id) {
              tmpi[i].is_favourite = 0;
            }
          }
          setImages1(tmpi);
          if (isFavourite) {
            const newData = tmpi.filter(item => {
              return item.is_favourite == 1;
            });
            // setImages(newData);
            setImagesData(newData);
            if (newData.length <= 0) {
              setTimeout(() => {
                toastr.warning(store.textData.no_image_select_fvrt_text);
              }, 1000);
            }
          }
          else {
            // setImages(tmpi);
            setImagesData(tmpi);
            if (tmpi.length <= 0) {
              setTimeout(() => {
                toastr.warning(store.textData.no_image_select_fvrt_text);
              }, 1000);
            }
          }
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
  }

  const getIsOverlayFromStorage = async () => {
    console.log("svdsvdsv")
    try {
      console.log("data===", dataLoaded);
      const value = await AsyncStorage.getItem('isOverlay');
      if (value === null) {
        setVisible(true);
      }
    } catch (error) {
      console.error('Error getting isOverlay from AsyncStorage:', error);
      console.error('Error getting isOverlay from AsyncStorage:', error);
    }
  };



  showFavouriteFun = () => {
    // console.log('SHOW', isFavourite)
    // setIsFavourite(!isFavourite);
    setSpinner(true);
    getMediaDetails2(!isFavourite);
    setIsFavourite(!isFavourite);
    setSpinner(false);
    console.log("image", images1);
    const newData = images1.filter(item => {
      return item.is_favourite == 1;
    });
    console.log("newdata", newData);
    console.log("isFavourite", isFavourite);
    {
      newData.length <= 0 && !isFavourite &&
        setTimeout(() => {
          toastr.warning("No Images selected as favourite");
        }, 1000);
    }
  }

  shift = (arr, direction, n) => {
    var times = n > arr.length ? n % arr.length : n;
    return arr.concat(arr.splice(0, (direction > 0 ? arr.length - times : times)));
  }

  quickbuy = () => {
    if (store.token == "") {
      if (Platform.OS == "android") {
        setModalVisible2(!modalVisible2);
      }
      else {
        Alert.alert(
          store.textData.signed_into_free_account_text,
          "",
          [
            {
              text: store.textData.cancel_text,
              onPress: async () => {
                // alert('no')
              },
              style: "cancel"
            },
            {
              text: store.textData.create_account_text, onPress: async () => {
                navigation.navigate('CreateAccount');
              }
            }
          ]
        );
      }
    }
    else {
      if (is_free == 1 && is_digital == 1) {
        // setmodal(false);
        if (Platform.OS == "android") {
          // console.log("if");
          setModalVisible4(!modalVisible4);
        }
        else {
          Alert.alert(

            "There is no need to order digital files, the media is FREE!  All digital files will be delivered to your studio shortly after the competition!",
            "",
            [
              { text: store.textData.okay_text, onPress: () => console.log("") }
            ]
          );
        }

      }
      else {
        setSpinner(true);
        let cred = {
          "file_ids": [],
          "event_id": event_id,
          "is_quick_buy": event_mode_id == 1 ? 3 : 1,
          "search_by": subHeader
        };

        axios.post(env.BASE_URL + "/media/api/buyAllActionMedias", encryptData(cred), {
          headers: { Authorization: `Bearer ${store.token}` },
        })
          .then(async (res) => {
            res.data = await decryptData(res.data);
            setCartCount(res.data.data.user_cart_count);
            setSpinner(false);
            if (Platform.OS == "android") {
              setModalVisible(!modalVisible);
            }
            else {
              Alert.alert(
                store.textData.files_added_cart_text,
                "",
                [
                  { text: store.textData.okay_text, onPress: () => navigation.navigate("MyCartScreen") }
                ]
              );
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
      }
    }
  }

  buyVideo = () => {
    if (store.token == "") {
      if (Platform.OS == "android") {
        setModalVisible2(!modalVisible2);
      }
      else {
        Alert.alert(
          store.textData.signed_into_free_account_text,
          "",
          [
            {
              text: store.textData.cancel_text,
              onPress: async () => {
                // alert('no')
              },
              style: "cancel"
            },
            {
              text: store.textData.create_account_text, onPress: async () => {
                navigation.navigate('CreateAccount');
              }
            }
          ]
        );
      }
    }
    else {
      if (is_free == 1 && is_digital == 1) {
        // setmodal(false);
        if (Platform.OS == "android") {
          // console.log("if");
          setModalVisible4(!modalVisible4);
        }
        else {
          Alert.alert(

            "There is no need to order digital files, the media is FREE!  All digital files will be delivered to your studio shortly after the competition!",
            "",
            [
              { text: store.textData.okay_text, onPress: () => console.log("") }
            ]
          );
        }

      }
      else {
        setSpinner(true);
        let cred = {
          "event_id": event_id,
          "file_id": videos[scrollRef.current.getCurrentIndex()].id,
          "is_quick_buy": '2',
          "search_by": subHeader
        };
        axios.post(env.BASE_URL + "/media/api/addVideoToMyCart", encryptData(cred), {
          headers: { Authorization: `Bearer ${store.token}` },
        })
          .then(async (res) => {
            res.data = await decryptData(res.data);
            setCartCount(res.data.data.user_cart_count);
            setSpinner(false);
            if (Platform.OS == "android") {
              setModalVisible1(!modalVisible1);
            }
            else {
              Alert.alert(
                store.textData.video_added_to_cart_text,
                "",
                [
                  { text: store.textData.okay_text, onPress: () => navigation.navigate("MyCartScreen") }
                ]
              );
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
      }
    }
  }

  console.log("test1234", imagesData[0])
  // console.log("size", imagesData[0].file_url.getsize)
  const overlayImage = imagesData[0];

  const handleImageLoad = () => {
    if (overlayImage?.file_url) {
      setImageLoaded(false);
    }
    // console.log("imageLoaded", imageLoaded)
  };


  return (
    <SafeAreaView style={styles.screen}>
      <Spinner visible={spinner} />
      <LinearGradient colors={["#393838", "#222222"]}>
        <Header />
      </LinearGradient>
      <View style={styles.mainView}>
        {dataLoaded && (
          <>
            <View style={styles.gridView}>
              <View style={styles.bannerView}>
                <View style={styles.headingView}>
                  <Text style={styles.headingText} numberOfLines={1}>
                    {event_name}
                  </Text>
                  <Text style={styles.headingText} numberOfLines={2}>
                    {subHeader}
                  </Text>
                </View>
                <View style={styles.countView}>
                  <Text style={styles.text}>{imageCount} PHOTOS</Text>
                  <Text style={styles.text}>{videos?.length} VIDEOS</Text>
                </View>
              </View>

              <FlatList
                // data={images}
                bounces={false}
                data={imagesData}
                // extraData={isRender}
                ListHeaderComponent={(
                  <>
                    {videos.length > 0 && (
                      <SwiperFlatList
                        ref={scrollRef}
                        data={videos}
                        disableGesture={true}
                        renderItem={({ item, index }) => (
                          <TouchableOpacity
                            style={{
                              height: Dimensions.get("window").height / 4,
                              width: Dimensions.get("window").width,
                              // alignItems: 'center',
                              justifyContent: 'center',
                              marginVertical: 5,
                              // backgroundColor: 'red'
                            }}
                            activeOpacity={1}
                            onPressOut={() => {
                              navigation.navigate("VideoPlayerScreen", {
                                videoUrl: item.file_url,
                              });
                            }}
                          >
                            <ImageBackground
                              source={item.thumb}
                              resizeMode={item.thumb == require('../../assets/loading.png') ? 'contain' : 'cover'}
                              style={{
                                height: Dimensions.get("window").height / 4,
                                width: Dimensions.get("window").width - 20,
                                marginTop: "2%",
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              {item.thumb != require('../../assets/loading.png') && (
                                <Text style={{
                                  color: '#FFF', fontFamily: fonts.AvenirNextCondensedBold, fontSize: RFValue(22.4),
                                  textShadowColor: 'rgba(0, 0, 0, 0.75)',
                                  textShadowOffset: { width: -1, height: 1 },
                                  textShadowRadius: 10
                                }}>{store.textData.thirty_second_video_preview_text}</Text>
                              )}
                              {videos.length > 1 && index != 0 && (
                                <TouchableWithoutFeedback onPress={() => {
                                  scrollRef.current.scrollToIndex({ index: scrollRef.current.getCurrentIndex() - 1 });
                                }}>
                                  <Image
                                    source={require("../../assets/home/left-arrow.png")}
                                    style={styles.leftArrowImage}
                                  />
                                </TouchableWithoutFeedback>
                              )}
                              {videos.length > 1 && index != videos.length - 1 && (
                                <TouchableWithoutFeedback onPress={() => {
                                  scrollRef.current.scrollToIndex({ index: scrollRef.current.getCurrentIndex() + 1 });
                                }}>
                                  <Image
                                    source={require("../../assets/home/right-arrow.png")}
                                    style={styles.rightArrowImage}
                                  />
                                </TouchableWithoutFeedback>
                              )}
                            </ImageBackground>
                          </TouchableOpacity>
                        )}
                      />
                    )}


                    <View style={styles.favAndAddVideoToCartView}>
                      {store?.token != "" && (
                        <>
                          {(imagesData?.length > 0 || images1.length > 0) ? (
                            <View style={videos?.length > 0 ? styles.favView : styles.favView1}>
                              <View>
                                <Checkbox
                                  onPress={() => showFavouriteFun()}
                                  colorScheme="pink"
                                  isChecked={isFavourite}
                                  accessibilityLabel="This is a dummy checkbox"
                                  style={{ borderRadius: 0 }}
                                />
                              </View>
                              <TouchableOpacity
                                style={{ justifyContent: "center" }}
                                onPress={() => showFavouriteFun()}
                              >
                                <Text
                                  style={{
                                    color: "white",
                                    marginLeft: 10,
                                    fontFamily: fonts.AvenirNextCondensedDemiBold,
                                  }}
                                >
                                  {store.textData.my_favorites_text}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )
                            :
                            <View style={[styles.favView]}>
                              {/* <View style={videos?.length > 0 ? styles.favView : styles.favView1}> */}
                              <View>
                                <Checkbox
                                  onPress={() => showFavouriteFun()}
                                  colorScheme="pink"
                                  isChecked={isFavourite}
                                  accessibilityLabel="This is a dummy checkbox"
                                  style={{ borderRadius: 0 }}
                                />
                              </View>
                              <TouchableOpacity
                                style={{ justifyContent: "center" }}
                                onPress={() => showFavouriteFun()}
                              >
                                <Text
                                  style={{
                                    color: "white",
                                    marginLeft: 10,
                                    fontFamily: fonts.AvenirNextCondensedDemiBold,
                                  }}
                                >
                                  {store.textData.my_favorites_text}
                                </Text>
                              </TouchableOpacity>
                              {/* </View> */}
                            </View>}
                        </>
                      )}

                      {store?.token == "" && (
                        <View style={{ width: '55%' }}>
                        </View>
                      )}
                      {videos?.length > 0 ? (
                        <TouchableOpacity style={styles.cartView} onPress={() => buyVideo()}>
                          <View>
                            <Text
                              style={{
                                color: "white",
                                fontFamily: fonts.BebasNeueRegular,
                                color: "black",
                                fontSize: RFValue(15),
                              }}
                            >
                              {store.textData.add_video_to_cart_text}
                            </Text>
                          </View>
                          <View>
                            <Image
                              resizeMode="contain"
                              source={require("../../assets/home/cart.png")}
                              style={{ width: 35, height: 30 }}
                            />
                          </View>
                        </TouchableOpacity>
                      ) : null}
                    </View>

                  </>
                )}
                renderItem={({ item, index }) => (
                  <TouchableOpacity onPress={() => {
                    var iIndex = index;
                    // console.log("CRED---ViewMedia", route.params.cred);
                    const cred = event_mode_id === 1 ? {
                      act_number: route.params.search_by,
                      event_id: String(route.params.event_id || route.params.cred.event_id)
                    } :
                      {
                        team_name: route.params.search_by,
                        event_id: String(route.params.event_id || route.params.cred.event_id)
                      }
                    navigation.navigate("ViewImage", {
                      imageUrl: item.file_url,
                      fileName: item.file_name,
                      eventID: route.params.event_id || route.params.cred.event_id,
                      eventName: route.params.event_name,
                      flag: 'not_purchased',
                      imageIndex: iIndex,
                      event_mode_id: event_mode_id,
                      videos: videos,
                      search_by: subHeader,
                      imagesDataList: imagesData,
                      cred: route.params.cred,
                      pageNo: page,
                      is_free,
                    });


                  }}
                    style={{
                      flex: 0.5, aspectRatio: 2 / 3, justifyContent: 'center', marginVertical: 2,
                      paddingLeft: index % 2 == 0 ? 0 : 4, paddingRight: index % 2 == 0 ? 4 : 0
                    }}
                  >
                    <LazyImage imgUrl={item.file_url} showWatermark={true} image_orientation={'horizontal'} />
                    <View style={{
                      position: 'absolute',
                      top: 4,
                      width: '100%',
                      flexDirection: 'row',
                      left: index % 2 == 0 ? 0 : 4, right: index % 2 == 0 ? 4 : 0,
                    }}>
                      <View style={{
                        width: store.token == "" ? "100%" : "80%",
                        alignItems: 'center',
                        paddingTop: 2
                      }}>
                        <Text
                          style={{
                            fontSize: RFValue(12),
                            color: "white",
                            fontFamily: fonts.BebasNeueRegular,
                            marginLeft: 15
                          }}
                        >
                          {item.file_name}
                          {/* {item.is_team_potrait} */}
                        </Text>
                      </View>
                      {store?.token != "" && (
                        <View style={{ width: '20%', alignItems: 'center', paddingTop: 5 }}>
                          {item.is_favourite == 0 && (
                            <TouchableOpacity onPress={() => addFavourite(item.id, item.file_name)}>
                              <Image
                                style={{
                                  width: 25,
                                  height: 22,
                                  // paddingVertical: '1%',
                                  tintColor: "#FFF"
                                }}
                                source={require("../../assets/home/fav.png")}
                              />
                            </TouchableOpacity>
                          )}
                          {item.is_favourite == 1 && (
                            <TouchableOpacity onPress={() => {
                              removeFavourite(item.file_id)
                            }}>
                              <Image
                                style={{
                                  width: 25,
                                  height: 22,
                                  // paddingVertical: '1%',
                                  tintColor: colors.uep_pink,
                                }}
                                source={require("../../assets/home/fav.png")}
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
                onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
                onEndReached={() => {
                  loadMore();
                }
                }
                initialNumToRenders={10}
                onEndReachedThreshold={0.5}
                contentContainerStyle={{ paddingBottom: 10, marginHorizontal: 10 }}
              // contentContainerStyle={{ paddingBottom: pHeight, marginHorizontal: 10 }}
              />
            </View>
            {/* Bottom View  */}
            <TouchableWithoutFeedback onPress={() => quickbuy()}>
              <View style={styles.bottomView} onLayout={(event) => {
                var { x, y, width, height } = event.nativeEvent.layout;
                setpHeight(height);
              }}>
                <Text style={styles.quickBuyText}>
                  {event_mode_id == 1 ? store.textData.quick_buy_all_media_from_this_routine_text : store.textData.quick_buy_all_action_photos_text}
                </Text>
                <Image
                  resizeMode="contain"
                  source={require("../../assets/home/cart.png")}
                  style={styles.quickBuyCartImage}
                />
              </View>
            </TouchableWithoutFeedback>
          </>
        )}

      </View>
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
                }, 500);
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
              title={store.textData.video_added_to_cart_text}
              activeOpacity={1}
              onPress={() => {
                setModalVisible1(!modalVisible1);
                // navigation.navigate("MyCartScreen");
              }}
              showButton={true}
            />
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          setModalVisible2(!modalVisible2);
        }}
      >
        <TouchableOpacity
          style={styles.modal}
          activeOpacity={1}
        // onPressOut={() => setModalVisible(!modalVisible)}
        >
          <TouchableWithoutFeedback>
            <Popup
              noClick={() => {
                setModalVisible2(!modalVisible2);
              }}
              yesClick={() => {
                setModalVisible2(!modalVisible2);
                setTimeout(() => {
                  navigation.navigate('CreateAccount');
                }, 500);
              }}
              msg={store.textData.signed_into_free_account_text}
              yestxt={store.textData.create_account_text_2}
              notxt={store.textData.cancel_text}
            />
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
      <View>
        {imageCount != 0 && dataLoaded && store.token == "" && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
              setVisible(false);
            }}
          >
            <>
              <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.85)', top: Platform.OS == "ios" ? 80 + INSEST.top : 80, }}>
                {videos.length > 0 &&
                  <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginTop: 5, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                      <Checkbox
                        colorScheme="pink"
                        onPress={() => overlayFunction()}
                        isChecked={isOverlay}
                        style={{ borderRadius: 0, marginTop: 10 }}
                        size='sm'
                      >
                      </Checkbox>
                      <TouchableOpacity onPress={() => overlayFunction()} style={{ bottom: 1 }}>
                        <Text style={{ color: "white", marginLeft: 10, fontFamily: fonts.BarlowCondensedSemiBoldItalic, fontSize: 18, marginTop: 10 }}>DO NOT SHOW THIS AGAIN</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '3%' }} onPress={() => isContinue()}>
                      <View style={styles.buttonContainer}>
                        <Text style={styles.buttonText1}>CONTINUE</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                }

                <View style={styles.headingView1}>
                  <Text style={styles.headingText1} numberOfLines={1}>
                    {event_name}
                  </Text>
                  <Text style={styles.headingText1} numberOfLines={2}>
                    {subHeader}
                  </Text>
                </View>
                {videos.length > 0 ?
                  <View style={{
                    height: Dimensions.get("window").height / 4,
                    width: Dimensions.get("window").width - 20,
                    // marginTop: "2%",
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}>
                    <Text style={{ color: "white", fontSize: 34, letterSpacing: 2, marginHorizontal: 20, textAlign: 'center', fontFamily: fonts.Farmhouse, bottom: "5%" }}>{"TAP ON ANY THUMBNAIL\n TO ENLARGE & VIEW\n AVAILABLE PACKAGES"}</Text>
                    {/* <Icon name="arrowdown" size={100} color={"white"}></Icon> */}
                  </View> : null}


                <View style={{ flex: 1, flexDirection: 'row', }}>
                  <View
                    style={{
                      flex: 0.5, justifyContent: 'flex-start', marginVertical: 0, marginHorizontal: 10,
                      paddingLeft: 0 % 2 == 0 ? 0 : 4, paddingRight: 0 % 2 == 0 ? 4 : 0, resizeMode: 'contain',
                      marginTop: Platform.OS == "ios" ? videos.length > 0 ? "12.5%" : "25.2%" : videos.length > 0 ? "12.3%" : "25.1%",
                    }}
                  >
                    <LazyImage imgUrl={imagesData[0]?.file_url} showWatermark={true} image_orientation={'horizontal'} />
                  </View>
                  {videos.length > 0 ?
                    <View style={{ flex: 0.5, justifyContent: 'flex-start' }}>
                      <Image source={require("../../assets/overlay/OverlayWithVideo.png")} style={{ width: '50%', height: '50%', resizeMode: 'contain', bottom: '18%' }} />
                    </View> :
                    <View style={{ flex: 0.5, justifyContent: 'flex-end' }}>
                      <Image source={require("../../assets/overlay/OverlayNoVideo.png")} style={{ width: '50%', height: '50%', resizeMode: 'contain', bottom: Platform.OS == "ios" ? '22%' : "15%" }} />
                    </View>
                  }
                </View>

                {videos.length <= 0 ?

                  <View style={{ flex: 0.5, marginVertical: 0, alignItems: 'center', bottom: Platform.OS == "ios" ? '15%' : "9%", marginLeft: '2%' }}>
                    <Text style={{ color: "white", fontFamily: 'BebasNeue-Regular', fontSize: 34, letterSpacing: 2, marginHorizontal: 20, textAlign: 'center', fontFamily: fonts.Farmhouse }}>{"TAP ON ANY THUMBNAIL\n TO ENLARGE & VIEW\n AVAILABLE PACKAGES"}</Text></View> : null}
                {videos.length <= 0 &&
                  <View style={{ flexDirection: 'column', justifyContent: 'space-between', paddingBottom: Platform.OS == "android" ? INSEST.bottom + "22%" : INSEST.bottom, bottom: Platform.OS == "ios" ? "16%" : 0, alignItems: 'center', }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                      <Checkbox
                        colorScheme="pink"
                        onPress={() => overlayFunction()}
                        isChecked={isOverlay}
                        style={{ borderRadius: 0, marginTop: 2 }}
                      >
                      </Checkbox>
                      <TouchableOpacity onPress={() => overlayFunction()} style={{ bottom: 1 }}>
                        <Text style={{ color: "white", marginLeft: 10, fontFamily: fonts.BarlowCondensedSemiBoldItalic, fontSize: 18, marginTop: 10 }}>DO NOT SHOW THIS AGAIN</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '1%' }} onPress={() => isContinue()}>
                      <View style={styles.buttonContainer}>
                        <Text style={styles.buttonText1}>CONTINUE</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                }
              </View>
              {/* </BlurView> */}
            </>
          </Modal>
        )}
        {imageCount != 0 && dataLoaded && store.token != "" && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
              setVisible(false);
            }}
          >
            <>
              <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.85)', top: Platform.OS == "ios" ? 80 + INSEST.top : 80, }}>
                {videos.length > 0 &&
                  <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginTop: 5, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                      <Checkbox
                        colorScheme="pink"
                        onPress={() => overlayFunction()}
                        isChecked={isOverlay}
                        style={{ borderRadius: 0, }}
                        size="sm"
                      >
                      </Checkbox>
                      <TouchableOpacity onPress={() => overlayFunction()} style={{ bottom: 2 }}>
                        <Text style={{ color: "white", marginLeft: 10, fontFamily: fonts.BarlowCondensedSemiBoldItalic, fontSize: 18, marginTop: 2 }}>DO NOT SHOW THIS AGAIN</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '2%' }} onPress={() => isContinue()}>
                      <View style={styles.buttonContainer}>
                        <Text style={styles.buttonText1}>CONTINUE</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                }
                {videos.length <= 0 &&
                  <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                      {/* <Checkbox
                                                colorScheme="pink"
                                                onPress={() => overlayFunction()}
                                                isChecked={isPurchaseImage}
                                                style={{ borderRadius: 0, marginBottom: 2 }}
                                                size='sm'
                                            >
                                            </Checkbox> */}
                      <TouchableOpacity onPress={() => overlayFunction()} style={{ bottom: 2 }}>
                        <Text style={{ color: "white", marginLeft: 10, fontFamily: fonts.BarlowCondensedSemiBoldItalic, fontSize: 18, }}> </Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '2.5%' }} onPress={() => isContinue()}>
                      <View style={{
                        backgroundColor: 'transparent',
                        borderWidth: 1,
                        borderColor: 'transparent',
                        height: 45,
                        width: 250,
                        borderRadius: 5,
                        alignItems: 'center',
                        marginVertical: "1%",
                        justifyContent: 'center'
                      }}>
                        <Text style={styles.buttonText1}> </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                }
                <View style={styles.headingView1}>
                  <Text style={styles.headingText1} numberOfLines={1}>
                    {event_name}
                  </Text>
                  <Text style={styles.headingText1} numberOfLines={2}>
                    {subHeader}
                  </Text>
                </View>

                {videos.length > 0 ?
                  <View style={{
                    height: Dimensions.get("window").height / 4,
                    width: Dimensions.get("window").width - 20,
                    // marginTop: "2%",
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}>
                    <Text style={{ color: "white", fontSize: 34, letterSpacing: 2, marginHorizontal: 20, textAlign: 'center', fontFamily: fonts.Farmhouse, bottom: "5%" }}>{"TAP ON ANY THUMBNAIL\n TO ENLARGE & VIEW\n AVAILABLE PACKAGES"}</Text>
                    {/* <Icon name="arrowdown" size={100} color={"white"}></Icon> */}
                  </View> : null}

                <View style={{ flex: 1, flexDirection: 'row', }}>
                  <View
                    style={{
                      flex: 0.5, justifyContent: 'flex-start', marginVertical: 0, marginHorizontal: 10,
                      paddingLeft: 0 % 2 == 0 ? 0 : 4, paddingRight: 0 % 2 == 0 ? 4 : 0, resizeMode: 'contain',
                      marginTop: Platform.OS == "ios" ? videos.length > 0 ? "13.2%" : "10.5%" : videos.length > 0 ? "12.5%" : "10.8%",
                    }}
                  >
                    <LazyImage imgUrl={imagesData[0]?.file_url} showWatermark={true} image_orientation={'horizontal'} />
                  </View>
                  {videos.length > 0 ?
                    <View style={{ flex: 0.5, justifyContent: 'flex-start' }}>
                      <Image source={require("../../assets/overlay/OverlayWithVideo.png")} style={{ width: '50%', height: '50%', resizeMode: 'contain', bottom: '18%' }} />
                    </View> :
                    <View style={{ flex: 0.5, justifyContent: 'flex-end' }}>
                      <Image source={require("../../assets/overlay/OverlayNoVideo.png")} style={{ width: '50%', height: '50%', resizeMode: 'contain', bottom: Platform.OS == "ios" ? '30%' : "15%" }} />
                    </View>
                  }
                </View>
                {videos.length <= 0 ?

                  <View style={{ flex: 0.5, marginVertical: 0, alignItems: 'center', bottom: Platform.OS == "ios" ? "15%" : "5%", marginLeft: '2%' }}>
                    <Text style={{ color: "white", fontFamily: 'BebasNeue-Regular', fontSize: 34, letterSpacing: 2, marginHorizontal: 20, textAlign: 'center', fontFamily: fonts.Farmhouse }}>{"TAP ON ANY THUMBNAIL\n TO ENLARGE & VIEW\n AVAILABLE PACKAGES"}</Text></View> : null}

                {videos.length <= 0 &&
                  <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', paddingBottom: Platform.OS == "android" ? INSEST.bottom + "22%" : INSEST.bottom, bottom: Platform.OS == "ios" ? "15%" : 0 }}>
                    <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center', }}>
                      <Checkbox
                        colorScheme="pink"
                        onPress={() => overlayFunction()}
                        isChecked={isOverlay}
                        style={{ borderRadius: 0, marginBottom: 2 }}
                        size='sm'
                      >
                      </Checkbox>
                      <TouchableOpacity onPress={() => overlayFunction()} style={{ bottom: 2 }}>
                        <Text style={{ color: "white", marginLeft: 10, fontFamily: fonts.BarlowCondensedSemiBoldItalic, fontSize: 18, }}>DO NOT SHOW THIS AGAIN</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '2.5%' }} onPress={() => isContinue()}>
                      <View style={styles.buttonContainer}>
                        <Text style={styles.buttonText1}>CONTINUE</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                }
              </View>
              {/* </BlurView> */}
            </>
          </Modal>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible4}
        onRequestClose={() => {
          setModalVisible4(!modalVisible4);
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
              title="There is no need to order digital files, the media is FREE!  All digital files will be delivered to your studio shortly after the competition!"
              activeOpacity={1}
              onPress={() => {
                setModalVisible4(!modalVisible4);
              }}
              showButton={true}
            />
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView >
  );
};

export default ViewMediaScreen;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  gridView: {
    height: "92%",
  },
  modal: {
    flex: 1,
    // backgroundColor: '#212121',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  screen: {
    flex: 1,
    backgroundColor: colors.screen_bg,
    alignItems: "center"
  },
  imageGridView: {
    marginHorizontal: "1%",
    marginVertical: "2%",
    alignItems: "center",
    marginBottom: "15%",
  },
  imageItemView: {
    aspectRatio: 2 / 3,
    width: (Dimensions.get("window").width - 26) / 2,
    justifyContent: 'center',
    // alignItems: 'center',
    marginRight: 4,
    marginVertical: 4,
  },
  imageItemView1: {
    aspectRatio: 2 / 3,
    width: (Dimensions.get("window").width - 26) / 2,
    justifyContent: 'center',
    // alignItems: 'center',
    marginLeft: 4,
    marginVertical: 4
  },
  imageStyle: {
    flex: 1,
    width: null,
    height: null,
  },
  favAndAddVideoToCartView: {
    flexDirection: "row",
    // marginHorizontal: "2.5%",
    marginVertical: 5,
    alignItems: 'center',
  },
  favView: {
    width: "55%",
    flexDirection: "row",
    alignItems: "center",
  },
  favView1: {
    width: "55%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10
  },
  cartView: {
    width: "45%",
    flexDirection: "row",
    backgroundColor: "#FFB31A",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderRadius: 10
    // borderWidth: 3,
  },

  videosView: {
    height: Dimensions.get("window").height / 5,
    backgroundColor: "black",
    marginHorizontal: "5%",
    marginVertical: "5%",
    flexDirection: "row",
  },
  autoFullScreenTextView: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  videoText: {
    color: "white",
    fontFamily: fonts.AvenirNextCondensed,
    fontSize: RFValue(15),
    paddingLeft: "10%",
  },
  leftArrowImage: {
    width: 30,
    height: 30,
    tintColor: "white",
    position: 'absolute',
    left: 10
  },
  rightArrowImage: {
    width: 30,
    height: 30,
    tintColor: "white",
    position: 'absolute',
    right: 10
  },

  rightArrowView: {
    marginRight: "20%",
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },

  bannerView: {
    backgroundColor: "black",
    flexDirection: "row",
    padding: 5,
  },
  headingView: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: "15%",
  },
  headingText: {
    color: "white",
    textAlign: "center",
    fontSize: RFValue(14),
    fontFamily: fonts.AvenirNextDemiBold,
    // paddingLeft: "15%",
  },
  headingView1: {
    width: Platform.OS == "android" ? "78%" : "78%",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: "15%",
  },
  headingText1: {
    color: "transparent",
    textAlign: "center",
    fontSize: RFValue(14),
    fontFamily: fonts.AvenirNextDemiBold,
    // paddingLeft: "15%",
  },
  countView: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: RFValue(11),
    fontFamily: fonts.AvenirNextCondensedBold,
  },
  container: {
    flex: 1,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },

  imagesContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  showFavView: {
    flexDirection: "row",
    width: "100%",
    marginHorizontal: 5,
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  showFavTextView: {
    width: "80%",
    justifyContent: "center",
  },
  showFavSwitchView: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  showText: {
    color: "white",
    fontFamily: fonts.AvenirMedium,
    fontSize: 16,
  },
  bottomView: {
    // bottom: 0,
    backgroundColor: "#FFB31A",
    // position: "absolute",
    // width: "100%",
    // height: Platform.OS == 'ios' ? 65 : 50,
    flexDirection: "row",
    paddingHorizontal: 20,
    // justifyContent: "center",
    // alignItems: 'center'
    height: "8%",
    justifyContent: "center",
    alignItems: "center",
    // marginHorizontal: "2%",
  },
  quickBuyView: {
    height: 50,
    justifyContent: "center",
    paddingRight: 10,
    alignItems: "center",
  },
  quickBuyCartView: {
    justifyContent: "center",
    alignItems: "center"
  },
  quickBuyText: {
    fontFamily: fonts.BebasNeueRegular,
    fontSize: RFValue(20),
    textAlign: 'center'
  },
  quickBuyCartImage: {
    width: 38,
    height: 32,
    marginLeft: 5
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    height: 45,
    width: 250,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 8,
    justifyContent: 'center'
  },
  buttonText1: {
    color: 'white',
    fontSize: 24,
    fontFamily: fonts.BarlowCondensedSemiBoldItalic,
    bottom: Platform.OS == "android" ? 2 : 0
  },
});

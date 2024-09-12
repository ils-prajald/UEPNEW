import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
  Share,
  Linking,
  BackHandler,
  Platform, Animated,
  Alert,
  TouchableWithoutFeedback,
  FlatList,
  StatusBar,
} from "react-native";
import { Checkbox } from "native-base";
import Header from "../../components/Header";
import LinearGradient from "react-native-linear-gradient";
import colors from "../../constants/colors";
import UEPButton from "../../components/UEPButton";
import Icon from 'react-native-vector-icons/AntDesign';
import fonts from "../../constants/fonts";
import {
  encryptData,
  decryptData
} from '../../utilities/Crypto';
import { store } from "../../store/Store";
import { RFValue } from "react-native-responsive-fontsize";
import PackageItem from "../../components/PackageItem";
import { LoginContext } from "../../Context/LoginProvider";
import { toastr } from "../utilities/index";
import { useFocusEffect } from "@react-navigation/native";
import Orientation, {
  useOrientationChange,
  useDeviceOrientationChange,
  useLockListener,
} from 'react-native-orientation-locker';
import axios from "axios";
import env from "../../constants/env";
import Spinner from "react-native-loading-spinner-overlay";
import moment from "moment";
import RNFetchBlob from 'rn-fetch-blob';
import NoDataCard from '../../components/NoDataCard';
import * as Animatable from 'react-native-animatable';
const rotateImageIcon = require("../../assets/rotate.png");
const backIcon = require("../../assets/back.png");
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Popup from "../../components/Popup";
//Gesture
import Modal from "react-native-modal";
import GestureRecognizerView, { swipeDirections } from 'rn-swipe-gestures';
import CameraRoll from "@react-native-community/cameraroll";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "@react-native-community/blur";

const ViewImage = ({ navigation, route }) => {
  const { clearAllDetails, packageListArray, setPackageListArray, SelectedPackage, setSelectedPackage, setCartCount, imagesData, setImagesData, isFavourite, setIsFavourite, images1, setImages1, cartCount, notificationCount } = React.useContext(LoginContext);
  let { eventID, event_name, imageUrl, fileName, flag, imageIndex, videos, search_by, imagesDataList, cred, pageNo, is_free } = route.params;
  // alert(JSON.stringify(isFavourite))
  const handleAnimation = useRef(null);
  let [modal, setmodal] = useState(false);
  let [packageList, setPackageList] = useState([]);
  let [spinner, setSpinner] = useState(false);
  let [modalVisible, setModalVisible] = useState(false);
  let [modalVisible1, setModalVisible1] = useState(false);
  let [modalVisible2, setModalVisible2] = useState(false);
  let [modalVisible3, setModalVisible3] = useState(false); //Pop-up fix modal added.
  let [modalVisible4, setModalVisible4] = useState(false); // for digital file
  let [modalVisible5, setModalVisible5] = useState(false);
  let [visible, setVisible] = useState(false);
  let [rotateImage, setRotateImage] = useState(270);
  let [sourceIndex, setSourceIndex] = useState(imageIndex);
  let [rotate, setRotate] = useState(false);
  const [value, setValue] = useState([]);
  //Changing source using gesture
  let [images, setImages] = useState([]);
  let [areaHeight, setAreaHeight] = useState(0);
  let [mheaderHeight, setMheaderHeight] = useState(0);
  let [buttonHeight, setButtonHeight] = useState(0);
  let [loading, setLoading] = useState(false);
  let [page, setPage] = useState(pageNo);
  const [isEnlargeImage, setIsEnlargeImage] = useState(false)
  const INSEST = useSafeAreaInsets();

  const digital = 1;

  overlayFunction = async () => {
    setIsEnlargeImage(prev => !prev);
  }

  isContinue = async () => {
    if (isEnlargeImage === true) {
      try {
        await AsyncStorage.setItem('isEnlargeImage', JSON.stringify(isEnlargeImage));
      } catch (error) {
        console.error('Error saving isEnlargeImage to AsyncStorage:', error);
      }
    }
    setModalVisible5(false);
  }
  console.log("modalVisible5", modalVisible5);
  const getIsOverlayFromStorage = async () => {
    try {
      const value = await AsyncStorage.getItem('isEnlargeImage');
      console.log("no", typeof value);
      if (value === null) {
        console.log("yas");
        setModalVisible5(true);
      }
    } catch (error) {
      console.error('Error getting isEnlargeImage from AsyncStorage:', error);
      console.error('Error getting isEnlargeImage from AsyncStorage:', error);
    }
  };

  const onSwipeLeft = () => {
    if (route.params.flag == "purchased") {
      if (!modal) {
        if (sourceIndex + 1 !== images?.length) {
          if (images[sourceIndex].file_orientation != images[sourceIndex + 1].file_orientation) {
            setLoading(true);
            setSpinner(true);
          }
          setSourceIndex(sourceIndex + 1);
          setRotateImage(270);
          // if (route.params.flag === 'purchased') {
          //   console.log(123)
          //   setRotateImage(0);
          // }
          // if (route.params.flag === 'not_purchased') {
          //   console.log(456)
          //   setRotateImage(270);
          // }
          handleAnimation.current.slideInRight(300);
          setRotate(false);
        }
      }
    } else {
      if (!modal) {
        if (sourceIndex + 1 !== images?.length) {
          if (images[sourceIndex]?.file_orientation != images[sourceIndex + 1]?.file_orientation) {
            setLoading(true);
            setSpinner(true);
          }
          if (sourceIndex === images?.length - 2 && isFavourite === false) {
            let viewMediaDetails = "/media/api/viewMediaDetails";
            console.log('getMediaDetails', route.params.cred);
            setSpinner(true);
            let postData = route.params.cred;
            postData.limit = 100;
            postData.page = page + 1;
            postData.fav_flag = Number(isFavourite);
            axios
              .post(env.BASE_URL + viewMediaDetails, encryptData(postData), {
                headers: { Authorization: `Bearer ${store.token}` },
              })
              .then(async (res) => {
                res.data = await decryptData(res.data);

                setImagesData(imagesData.concat(res.data.data.images));
                setImages(images.concat(res.data.data.images))
                setImages1(images1.concat(res.data.data.images));
                // setSourceIndex(sourceIndex + 1);
                setPage(page + 1);
                setSpinner(false);
              })
              .catch((err) => {
                console.log('error', err)
                setSpinner(false);
              })
          }
          setSourceIndex(sourceIndex + 1);
          setRotateImage(270);
          handleAnimation.current.slideInRight(300);
          setRotate(false);
        }
      }
    }
  }

  const onSwipeRight = () => {
    if (route.params.flag == "purchased") {
      if (!modal) {
        if (sourceIndex !== 0) {
          if (images[sourceIndex].file_orientation != images[sourceIndex - 1].file_orientation) {
            setLoading(true);
            setSpinner(true);
          }
          setSourceIndex(sourceIndex - 1);
          setRotateImage(270);
          // if (route.params.flag === 'purchased') {
          //   console.log(123)
          //   setRotateImage(0);
          // }
          // if (route.params.flag === 'not_purchased') {
          //   console.log(456)
          //   setRotateImage(270);
          // }
          handleAnimation.current.slideInLeft(300);
          setRotate(false);
        }
      }
    } else {
      if (!modal) {
        if (sourceIndex !== 0) {
          if (images[sourceIndex]?.file_orientation != images[sourceIndex - 1]?.file_orientation) {
            setLoading(true);
            setSpinner(true);
          }
          setSourceIndex(sourceIndex - 1);
          setRotateImage(270);
          // if (sourceIndex === 2 && isFavourite === false) {
          //   // setSourceIndex(sourceIndex - 2);
          //   let viewMediaDetails = "/media/api/viewMediaDetails";
          //   console.log('getMediaDetails', route.params.cred);
          //   setSpinner(true);
          //   let postData = route.params.cred;
          //   postData.limit = 100;
          //   postData.page = page - 1;
          //   postData.fav_flag = Number(isFavourite);
          //   axios
          //     .post(env.BASE_URL + viewMediaDetails, encryptData(postData), {
          //       headers: { Authorization: `Bearer ${store.token}` },
          //     })
          //     .then(async (res) => {
          //       res.data = await decryptData(res.data);
          //       // setSubHeader(res.data.data.search_by);
          //       // setEvent_mode_id(res.data.data.event_mode_id);
          //       setImagesData(imagesData => [...imagesData, res.data.data.images]);
          //       setImages(images => [...images, res.data.data.images]);
          //       setImages1(images1 => [...images1, res.data.data.images]);
          //       setSourceIndex(sourceIndex);
          //       // setImagesData(res.data.data.images);
          //       // setImages(res.data.data.images);
          //       // setImages1(res.data.data.images);
          //       // setImagesData(imagesData => [res.data.data.images, ...imagesData]);
          //       // setImages(images => [res.data.data.images, ...images]);
          //       // setImages1(images1 => [res.data.data.images, ...images1]);
          //       setPage(page - 1);
          //       console.log('Clicked!!!')
          //       //   setImages(images1);
          //       // setNewImages(res.data.data.images);
          //       // setImageCount(res.data.data.media_count);
          //       // setPage(2);
          //       console.log('View Imagessss---', res.data.data.images);

          //       // var tmpvid = res.data.data.videos
          //       // if (tmpvid.length > 0) {
          //       //   for (var i = 0; i < tmpvid.length; i++) {
          //       //     try {
          //       //       tmpvid[i].thumb = await getThumbail(tmpvid[i].id, tmpvid[i].file_url);
          //       //       // tmpvid[i].thumb = require('../../assets/loading.png');
          //       //     }
          //       //     catch (err) {
          //       //       tmpvid[i].thumb = require('../../assets/loading.png');
          //       //     }
          //       //   }
          //       // }
          //       setSpinner(false);
          //       // setSourceIndex(0);
          //       console.log('Image1',)
          //       // setDataLoaded(true);
          //       // if (res.data.data.images.length >= 100) {
          //       //   this.loadMore();
          //       // }
          //       // else {
          //       //   setSpinner(false);
          //       //   setDataLoaded(true);
          //       // }
          //     })
          //     .catch((err) => {
          //       console.log('error', err)
          //       setSpinner(false);
          //       // if (err.response.status == "400") {
          //       //   if (err.response.data.message == "jwt expired") {
          //       //     clearAllDetails();
          //       //   } else {
          //       //     setTimeout(() => {
          //       //       toastr.warning(err.response.data.message);
          //       //     }, 500);
          //       //   }
          //       // } else {
          //       //   setTimeout(() => {
          //       //     toastr.warning(err.response.data.message);
          //       //   }, 500);
          //       // }
          //     })
          // }
          // if (route.params.flag === 'purchased') {
          //   console.log(123)
          //   setRotateImage(0);
          // }
          // if (route.params.flag === 'not_purchased') {
          //   console.log(456)
          //   setRotateImage(270);
          // }
          handleAnimation.current.slideInLeft(300);
          setRotate(false);
        }
      }
    }
  }

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
    detectSwipeUp: false,
    detectSwipeDown: false
  };

  let getEventPackagesList = "";
  if (store.token) {
    // getEventPackagesList = "/media/api/v1/getEventPackagesList?event_id=";    //FOR PROD
    getEventPackagesList = "/media/api/getEventPackagesList?event_id=";  //DEV or STAGE
  } else {
    // getEventPackagesList = "/guest/api/v1/getEventPackagesList?event_id=";   //FOR PROD
    getEventPackagesList = "/guest/api/getEventPackagesList?event_id=";  //DEV or STAGE
  }

  const setScreen0 = async () => {
    try {
      await AsyncStorage.setItem("isScreen", '0');
    } catch (e) {
    }
  };
  const setScreen1 = async () => {
    try {
      await AsyncStorage.setItem("isScreen", '1');
    } catch (e) {
    }
  };

  useEffect(() => {
    setRotate(false);
    getIsOverlayFromStorage();

    // if (route.params.flag === 'purchased') {
    //   console.log(123)
    //   setRotateImage(360);
    //   setScreen1();

    // }
    // if (route.params.flag === 'not_purchased') {
    //   console.log(456)
    //   setRotateImage(270);
    //   setScreen0();
    // }

    // setRotateImage(270);
    Orientation.lockToPortrait();
    setSpinner(true);

    console.log("search_by", search_by);
    if (search_by.includes("&") || search_by.includes("#") || search_by.includes("+") || search_by.includes("!") || search_by.includes("(") || search_by.includes(")")) {
      search_by = encodeURIComponent(search_by);
      var postUrl = env.BASE_URL + getEventPackagesList + eventID + '&event_mode_id=' + route.params.event_mode_id + '&search_by=' + search_by;
    } else {
      var postUrl = env.BASE_URL + getEventPackagesList + eventID + '&event_mode_id=' + route.params.event_mode_id + '&search_by=' + search_by;
    }
    console.log("postURL", postUrl);
    if (flag == "purchased") {
      postUrl = postUrl + '&media_type=2';
    }
    else {
      postUrl = postUrl + '&media_type=1';
    }
    console.log('postURL---', postUrl);
    axios
      .get(postUrl, {
        headers: { Authorization: `Bearer ${store.token}` },
      })
      .then(async (res) => {
        res.data = await decryptData(res.data);
        // alert(JSON.stringify(res.data.data.event_packages_list))
        setPackageList(res.data.data.event_packages_list);
        console.log('RESPONSE---123', res.data.data.event_packages_list);
        // setImages1(imagesDataList);
        // setImages(imagesDataList)
        // alert("TRY")
        // alert(imagesDataList.length)
        if (isFavourite) {
          var g = imagesDataList;
          const newData = g.filter(item => {
            return item.is_favourite == 1;
          });
          setImages(newData);
        }
        else {
          setImages(imagesDataList);
        }
      })
      .catch((err) => {
        console.log('error---', err)
        // setImages([]);
        // setImages1([]);
        // alert("Catch")
        // alert(imagesDataList)
        setImages(imagesDataList)
        setImages1(imagesDataList);
        // setIsFavourite(true);
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

  getPackageList = () => {
    var postUrl = env.BASE_URL + getEventPackagesList + eventID + '&event_mode_id=' + route.params.event_mode_id + '&search_by=' + search_by;
    if (flag == "purchased") {
      postUrl = postUrl + '&media_type=2';
    }
    else {
      postUrl = postUrl + '&media_type=1';
    }
    console.log('postURL---', postUrl);
    axios
      .get(postUrl, {
        headers: { Authorization: `Bearer ${store.token}` },
      })
      .then(async (res) => {
        res.data = await decryptData(res.data);
        // alert(JSON.stringify(res.data.data.event_packages_list))
        setPackageList(res?.data?.data?.event_packages_list);
        console.log('RESPONSE---', res.data.data.event_packages_list);
        // setImages1(imagesDataList);
        // setImages(imagesDataList)
        // alert("TRY")
        // alert(imagesDataList.length)
        if (isFavourite) {
          var g = imagesDataList;
          const newData = g.filter(item => {
            return item.is_favourite == 1;
          });
          setImages(newData);
        }
        else {
          setImages(imagesDataList);
        }
      })
      .catch((err) => {
        console.log('error---', err)
        // setImages([]);
        // setImages1([]);
        // alert("Catch")
        // alert(imagesDataList)
        setImages(imagesDataList)
        setImages1(imagesDataList);
        // setIsFavourite(true);
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

  getMediaDetails2 = (fav) => {
    let viewMediaDetails = "/media/api/viewMediaDetails";
    console.log('getMediaDetails', route.params.cred);
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
        // setSubHeader(res.data.data.search_by);
        // setEvent_mode_id(res.data.data.event_mode_id);
        setImagesData(res.data.data.images);
        setImages(res.data.data.images);
        setImages1(res.data.data.images);
        // setPage(page + 1);
        console.log('Clicked!!!')
        //   setImages(images1);
        // setNewImages(res.data.data.images);
        // setImageCount(res.data.data.media_count);
        // setPage(2);
        console.log('View Imagessss---', res.data.data.images);

        // var tmpvid = res.data.data.videos
        // if (tmpvid.length > 0) {
        //   for (var i = 0; i < tmpvid.length; i++) {
        //     try {
        //       tmpvid[i].thumb = await getThumbail(tmpvid[i].id, tmpvid[i].file_url);
        //       // tmpvid[i].thumb = require('../../assets/loading.png');
        //     }
        //     catch (err) {
        //       tmpvid[i].thumb = require('../../assets/loading.png');
        //     }
        //   }
        // }
        setSpinner(false);
        setSourceIndex(0);
        console.log('Image1',)
        // setDataLoaded(true);
        // if (res.data.data.images.length >= 100) {
        //   this.loadMore();
        // }
        // else {
        //   setSpinner(false);
        //   setDataLoaded(true);
        // }
      })
      .catch((err) => {
        console.log('error', err)
        setSpinner(false);
        // if (err.response.status == "400") {
        //   if (err.response.data.message == "jwt expired") {
        //     clearAllDetails();
        //   } else {
        //     setTimeout(() => {
        //       toastr.warning(err.response.data.message);
        //     }, 500);
        //   }
        // } else {
        //   setTimeout(() => {
        //     toastr.warning(err.response.data.message);
        //   }, 500);
        // }
      })
    // .finally(() => {
    //   setSpinner(false);
    // });
  }


  // useFocusEffect(
  //   React.useCallback(() => {
  //     setRotate(false);
  //     setRotateImage(270);
  //     Orientation.lockToPortrait();
  //     setSpinner(true);
  //     var postUrl = env.BASE_URL + getEventPackagesList + eventID + '&event_mode_id=' + route.params.event_mode_id + '&search_by=' + search_by;
  //     if (flag == "purchased") {
  //       postUrl = postUrl + '&media_type=2';
  //     }
  //     else {
  //       postUrl = postUrl + '&media_type=1';
  //     }
  //     axios
  //       .get(postUrl, {
  //         headers: { Authorization: `Bearer ${store.token}` },
  //       })
  //       .then(async (res) => {
  //         res.data = await decryptData(res.data);
  //         setPackageList(res.data.data.event_packages_list);
  //         setImages1(res.data.data.images);
  //         if (isFavourite) {
  //           var g = res.data.data.images;
  //           const newData = g.filter(item => {
  //             return item.is_favourite == 1;
  //           });
  //           setImages(newData);
  //         }
  //         else {
  //           setImages(res.data.data.images);
  //         }
  //       })
  //       .catch((err) => {
  //         setImages([]);
  //         setImages1([]);
  //         setIsFavourite(false);
  //         if (err.response.status == "400") {
  //           if (err.response.data.message == "jwt expired") {
  //             clearAllDetails();
  //           } else {
  //             setTimeout(() => {
  //               toastr.warning(err.response.data.message);
  //             }, 500);
  //           }
  //         } else {
  //           setTimeout(() => {
  //             toastr.warning(err.response.data.message);
  //           }, 500);
  //         }
  //       })
  //       .finally(() => {
  //         setSpinner(false);
  //       });
  //   }, [])
  // );

  addFavourite1 = (file_id, file_name) => {
    setSpinner(true);
    axios
      .post(env.BASE_URL + '/media/api/addFilesToMyFavourites', encryptData({
        "file_id": file_id, "event_id": eventID, "file_name": file_name
      }), {
        headers: { Authorization: `Bearer ${store.token}` },
      })
      .then(async ({ data }) => {

        data = await decryptData(data);
        if (data.statusCode == 200) {
          var tmpi = images1;
          for (var i = 0; i < tmpi.length; i++) {
            if (tmpi[i].file_id == file_id) {
              tmpi[i].is_favourite = 1;
            }
          }
          setImages1(tmpi);
          if (isFavourite) {
            const newData = tmpi.filter(item => {
              return item.is_favourite == 1;
            });
            setImages(newData);
            if (newData.length <= 0) {
              setTimeout(() => {
                toastr.warning(store.textData.no_image_select_fvrt_text);
              }, 1000);
            }
          }
          else {
            setImages(tmpi);
            if (tmpi.length <= 0) {
              setTimeout(() => {
                toastr.warning(store.textData.no_image_select_fvrt_text);
              }, 1000);
            }
          }
          updateGlobal(file_id, 1);
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

  removeFavourite1 = (file_id) => {
    setSpinner(true);
    axios
      .delete(env.BASE_URL + '/media/api/removeFileFromFavourites/' + file_id, {
        headers: { Authorization: `Bearer ${store.token}` },
      })
      .then(async ({ data }) => {
        data = await decryptData(data);
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
          if (newData.length > 0) {
            if (!newData[sourceIndex]) {
              setSourceIndex(sourceIndex - 1);
            }
          }
          else {
            setTimeout(() => {
              toastr.warning(store.textData.no_image_select_fvrt_text);
            }, 1000);
          }
          setImages(newData);
        }
        else {
          setImages(tmpi);
          if (tmpi.length <= 0) {
            setTimeout(() => {
              toastr.warning(store.textData.no_image_select_fvrt_text);
            }, 1000);
          }
        }
        updateGlobal(file_id, 0);
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

  updateGlobal = (file_id, flag) => {
    if (isFavourite) {
      // var tmp1 = [];
      // if (flag == 0) {
      //   tmp1 = imagesData.filter(item => {
      //     return item.id != file_id;
      //   });
      // }
      // if (flag == 1) {
      //   for (var i = 0; i < images1.length; i++) {
      //     if (file_id == images1[i].id) {
      //       tmp1.push(images1[i]);
      //     }
      //     for (var j = 0; j < imagesData.length; j++) {
      //       if (imagesData[j].id == images1[i].id) {
      //         tmp1.push(imagesData[j]);
      //       }
      //     }
      //   }
      // }
      // setImagesData(tmp1);
      const newData = images1.filter(item => {
        return item.is_favourite == 1;
      });
      setImagesData(newData);
    }
    else {
      setImagesData(images1);
      // var tmp = imagesData;
      // for (var i = 0; i < tmp.length; i++) {
      //   if (tmp[i].id == file_id) {
      //     tmp[i].is_favourite = flag;
      //   }
      // }
      // setImagesData(tmp);
    }
  }

  showFavouriteFun1 = async () => {
    // setSpinner(false);
    const newData = images1.filter(item => {
      return item.is_favourite == 1;
    });
    if (route.params.flag === 'purchased') {
      setSpinner(true);
      if (isFavourite) {
        setImagesData(images1);
        setImages(images1);
        setIsFavourite(!isFavourite);
        setSpinner(false);
        setSourceIndex(0);
      }
      else {

        setImagesData(newData);
        setImages(newData);
        setIsFavourite(!isFavourite);

        if (newData.length <= 0) {
          setSpinner(false);
          setTimeout(() => {
            toastr.warning(store.textData.no_image_select_fvrt_text);
          }, 1000);
        }
        else {
          setSourceIndex(0);
          setSpinner(false);
        }
      }
    } else {
      await AsyncStorage.setItem("isClicked", JSON.stringify(isFavourite));
      console.log('View Image isFavourite', isFavourite)
      setSpinner(true);
      getMediaDetails2(!isFavourite);
      setIsFavourite(!isFavourite);
      {
        newData.length <= 0 && !isFavourite &&
          setTimeout(() => {
            toastr.warning("No Images selected as favourite");
          }, 1000);
      }
    }
  }

  getScale = () => {
    if (rotateImage == 270 || rotateImage == 90) {
      return 1.5
    } else {
      return 1
    }
  }

  quickbuy1 = () => {
    // alert(JSON.stringify(search_by))
    if (is_free == 1 && digital == 1) {
      // setmodal(false);
      if (Platform.OS == "android") {
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
      let cred = {
        "file_ids": [],
        "event_id": eventID,
        "is_quick_buy": route.params.event_mode_id == 1 ? 3 : 1,
        "search_by": route.params.flag == "purchased" ? images[sourceIndex]?.folder_name : search_by
      };
      // if (images.length > 0) {
      //   for (var i = 0; i < images.length; i++) {
      //     cred.file_ids.push(images[i].id);
      //   }
      // }
      // if (route.params.event_mode_id == 1) {
      //   if (videos.length > 0) {
      //     for (var i = 0; i < videos.length; i++) {
      //       cred.file_ids.push(videos[i].id);
      //     }
      //   }
      // }
      // if (cred.file_ids.length > 0) {
      //   axios.post(env.BASE_URL + "/media/api/buyAllActionMedias", cred, {
      //     headers: { Authorization: `Bearer ${store.token}` },
      //   })
      //     .then((res) => {
      //       setCartCount(res.data.data.user_cart_count);
      //       setSpinner(false);
      //       // setTimeout(() => {
      //       //   toastr.success("Files added to cart successfully");
      //       // }, 1000)
      //       // navigation.navigate("MyCartScreen");
      //       if (Platform.OS == "android") {
      //         setModalVisible1(!modalVisible1);
      //       }
      //       else {
      //         Alert.alert(
      //           "Files added to cart successfully",
      //           "",
      //           [
      //             { text: "OK", onPress: () => navigation.navigate("MyCartScreen") }
      //           ]
      //         );
      //       }
      //     })
      //     .catch((err) => {
      //       setSpinner(false);
      //       if (err.response.status == "400") {
      //         if (err.response.data.message == "jwt expired") {
      //           clearAllDetails();
      //         } else {
      //           setTimeout(() => {
      //             toastr.warning(err.response.data.message);
      //           }, 500);
      //         }
      //       } else {
      //         setTimeout(() => {
      //           toastr.warning(err.response.data.message);
      //         }, 500);
      //       }
      //     })
      // }
      // else {
      //   setSpinner(false);
      //   setTimeout(() => {
      //     toastr.success("No media is available for purchase");
      //   }, 1000)
      // }
      axios.post(env.BASE_URL + "/media/api/buyAllActionMedias", encryptData(cred), {
        headers: { Authorization: `Bearer ${store.token}` },
      })
        .then(async (res) => {
          res.data = await decryptData(res.data);
          setCartCount(res.data.data.user_cart_count);
          if (Platform.OS == "android") {
            setModalVisible1(!modalVisible1);
          }
          else {
            Alert.alert(
              store.textData.files_added_cart_text,
              "",
              [
                { text: store.textData.okay_text, onPress: () => navigation.navigate("") }
              ]
            );
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
        })
    }
  }

  const handleRotate = () => {
    // console.log('route.params.flag--', route.params.flag)
    // if ((rotateImage + 90) > 360) {
    //   setRotateImage(90)
    // } else {
    //   setRotateImage(rotateImage + 90);
    // }
    if (route.params.flag == 'purchased') {

      setRotate(!rotate);
    }
    else {
      if (rotateImage == 270) {
        setRotateImage(360)
      }
      else if (rotateImage == 360) {
        setRotateImage(270)
      }
    }
    // console.log('rotateImage', rotateImage);
    // if (rotateImage == 270) {
    //   setRotateImage(360)
    // }
    // else if (rotateImage == 360) {
    //   setRotateImage(270)
    // } else if (rotateImage == 90) {
    //   setRotateImage(0)
    // } else if (rotateImage == 0) {
    //   setRotateImage(90)
    // }
  }

  onPackageSelect = (item, index) => {
    if (store.token == "") {
      setmodal(false);
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
      if (item.is_different == 0) {
        if (item.is_personalised == 0) {

          if (is_free == 1 && item.is_digital == 1) {
            setmodal(false);
            if (Platform.OS == "android") {
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
            setmodal(false);
            // console.log("123456", images[sourceIndex]);
            // console.log("search_by---", search_by);
            const cred = {
              file_ids: (item.is_quick_buy == 1 || item.is_quick_buy == 2 || item.is_quick_buy == 3) ? [] : [images[sourceIndex]?.file_id],
              event_id: eventID,
              event_package_id: item.event_package_id,
              search_by: route.params.flag == "purchased" ? images[sourceIndex]?.folder_name : search_by,
              is_quick_buy: item.is_quick_buy,
              source_screen: route.params.flag == "purchased" ? 'purchased_media' : 'view_media'
            }
            axios.post(env.BASE_URL + "/media/api/addFilesToCart", encryptData(cred), {
              headers: { Authorization: `Bearer ${store.token}` },
            })
              .then(async (res) => {
                res.data = await decryptData(res.data);
                setCartCount(res.data.data.user_cart_count);
                setSelectedPackage({});
                setPackageListArray([]);
                if (Platform.OS == "android") {
                  setModalVisible(!modalVisible);
                }
                else {
                  Alert.alert(

                    store.textData.packges_added_to_cart_text,
                    "",
                    [
                      { text: store.textData.okay_text, onPress: () => console.log("") }
                    ]
                  );
                }
              })
              .catch((err) => {
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
          }
        }
        else {
          if (is_free == 1 && item.is_digital == 1) {
            setmodal(false);
            if (Platform.OS == "android") {
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
            // let packageImages = packageListArray;
            setmodal(false);
            // setSelectedPackage(item);
            // packageImages.push({
            //   file_id: images[sourceIndex].id,
            //   file_url: images[sourceIndex].file_url
            // });
            // setPackageListArray(packageImages);
            // console.log('FID', images[sourceIndex].file_id);
            setTimeout(() => {
              // console.log("data---2", res.data.data);
              navigation.navigate("Personalized", {
                event_id: eventID,
                packageDet: item,
                act_number: route.params.flag == "purchased" ? images[sourceIndex]?.folder_name : search_by,
                fid: images[sourceIndex]?.file_id,
                flag: route.params.flag,
                event_mode_id: route.params.event_mode_id,
                videos: videos,
                search_by: search_by
              });
            }, 500);
          }
        }
      }
      else {
        let packageImages = packageListArray;
        if (item.no_of_files <= 0) {
          if (packageImages.length >= images?.length) {
            setTimeout(() => {
              toastr.warning(store.textData.max_no_files_added_text);
            }, 500);
          }
          else {
            packageImages.push({
              file_id: images[sourceIndex]?.file_id,
              file_url: images[sourceIndex]?.file_url
            });
            setPackageListArray(packageImages);
          }
        }
        else {
          if (packageImages.length >= item.no_of_files) {
            setTimeout(() => {
              toastr.warning(store.textData.max_no_files_added_text);
            }, 500);
          }
          else {
            packageImages.push({
              file_id: images[sourceIndex]?.file_id,
              file_url: images[sourceIndex]?.file_url
            });
            setPackageListArray(packageImages);
          }
        }
        setmodal(false);
        setSelectedPackage(item);
        setTimeout(() => {
          navigation.navigate("ViewPackageScreen", {
            packageDet: item,
            event_id: eventID,
            imageCount: images?.length,
            act_number: route.params.flag == "purchased" ? images[sourceIndex]?.folder_name : search_by,
            images: images,
            imageUrl: imageUrl,
            fileName: fileName,
            eventID: eventID,
            flag: route.params.flag,
            imageIndex: sourceIndex,
            event_mode_id: route.params.event_mode_id,
            videos: videos,
            search_by: search_by
          });
        }, 500);
      }
    }
  }

  addToPackage = () => {
    let packageImages = packageListArray;
    if (SelectedPackage.no_of_files <= 0) {
      if (packageImages.length >= images?.length) {
        setTimeout(() => {
          toastr.warning(store.textData.max_no_files_added_text);
        }, 500);
      }
      else {
        packageImages.push({
          file_id: images[sourceIndex]?.file_id,
          file_url: images[sourceIndex]?.file_url
        });
        setPackageListArray(packageImages);
      }
    }
    else {
      if (packageImages.length >= SelectedPackage.no_of_files) {
        setTimeout(() => {
          toastr.warning(store.textData.max_no_files_added_text);
        }, 500);
      }
      else {
        packageImages.push({
          file_id: images[sourceIndex]?.file_id,
          file_url: images[sourceIndex]?.file_url
        });
        setPackageListArray(packageImages);
      }
    }
    navigation.navigate("ViewPackageScreen", {
      packageDet: SelectedPackage,
      event_id: eventID,
      imageCount: images?.length,
      act_number: route.params.flag == "purchased" ? images[sourceIndex]?.folder_name : search_by,
      images: images,
      imageUrl: imageUrl,
      fileName: fileName,
      eventID: eventID,
      flag: route.params.flag,
      imageIndex: sourceIndex,
      event_mode_id: route.params.event_mode_id,
      videos: videos,
      search_by: search_by
    });
  }

  useDeviceOrientationChange((o) => {
    if (images?.length > 0) {
      if (flag == 'purchased') {
        if (images[sourceIndex]?.file_orientation == 'horizontal') {
          if (o == 'LANDSCAPE-LEFT') {
            setRotate(true);
            // setRotateImage(360);
          }
          else if (o == 'LANDSCAPE-RIGHT') {
            setRotate(true);
            // Orientation.lockToLandscapeRight();
            // setRotateImage(180);
          }
          else if (o == 'PORTRAIT') {
            setRotate(false);
            setRotateImage(270);
          }
          else if (o == 'PORTRAIT-UPSIDEDOWN') {
            setRotate(false);
            if (Platform.OS === 'ios') {
              // Orientation.lockToAllOrientationsButUpsideDown();
              setRotateImage(270);
            }
            else {
              // Orientation.lockToPortraitUpsideDown();
              setRotateImage(270);
            }
          }
          else {
            // Orientation.unlockAllOrientations();
            setRotateImage(270);
          }
        }
        else {
          if (o == 'LANDSCAPE-LEFT') {
            setRotate(true);
            setRotateImage(90);
          }
          else if (o == 'LANDSCAPE-RIGHT') {
            // Orientation.lockToLandscapeRight();
            setRotate(true);
            setRotateImage(270);
          }
          else if (o == 'PORTRAIT') {
            setRotate(false);
            setRotateImage(270);

          }
          else if (o == 'PORTRAIT-UPSIDEDOWN') {
            setRotate(false);
            if (Platform.OS === 'ios') {
              // Orientation.lockToAllOrientationsButUpsideDown();
              setRotateImage(270);
            }
            else {
              // Orientation.lockToPortraitUpsideDown();
              setRotateImage(270);
            }
          }
          else {
            // Orientation.unlockAllOrientations();
            setRotateImage(270);
            setRotate(false);
          }
        }
      }
      else {
        if (o == 'LANDSCAPE-LEFT') {
          setRotateImage(360);
        }
        else if (o == 'LANDSCAPE-RIGHT') {
          // Orientation.lockToLandscapeRight();
          setRotateImage(180);
        }
        else if (o == 'PORTRAIT') {
          setRotateImage(270);
        }
        else if (o == 'PORTRAIT-UPSIDEDOWN') {
          if (Platform.OS === 'ios') {
            // Orientation.lockToAllOrientationsButUpsideDown();
            setRotateImage(270);
          }
          else {
            // Orientation.lockToPortraitUpsideDown();
            setRotateImage(270);
          }
        }
        else {
          // Orientation.unlockAllOrientations();
          setRotateImage(270);
        }
      }
    }
  });

  saveFile1 = (file_id) => {
    const cred = {
      file_id: file_id,
      event_id: eventID
    };
    axios.post(env.BASE_URL + '/media/api/downloadVideo', encryptData(cred), {
      headers: { Authorization: `Bearer ${store.token}` },
    },
    ).then(async (res) => {
      // res = await decryptData(res);
    }).catch((err) => {
    })
  }

  getPosition = () => {
    if (images[sourceIndex - 1] && images[sourceIndex + 1]) {
      return "center";
    }
    else if (!images[sourceIndex - 1]) {
      return "flex-start";
    }
    else if (!images[sourceIndex + 1]) {
      return "flex-end";
    }
  }
  // console.log('View Image------', images)

  const bacKToScreen = async () => {
    console.log('BACK1', isFavourite);
    await AsyncStorage.setItem("isFavouriteCheck", JSON.stringify(isFavourite));
    navigation.goBack({ isFavouriteCheck: isFavourite, cred: route.params.cred })
  }
  return (
    <>
      <SafeAreaView style={styles.screen}>
        <Spinner visible={spinner} />

        <View style={styles.screen} onLayout={(event) => {
          var { x, y, width, height } = event.nativeEvent.layout;
          setAreaHeight(height);
        }}>
          <LinearGradient colors={["#393838", "#222222"]}>
            {modalVisible5 ?
              <View style={styles.mainView}>
                <StatusBar barStyle="light-content" />
                <View style={styles.leftMenuView}>
                  <Image
                    source={require("../../assets/auth/leftMenu.png")}
                    style={styles.leftMenuImage}
                  />
                </View>
                <View style={styles.bandView}>
                  <View style={styles.headerView}>
                    <Image
                      source={require("../../assets/UEPcopy.png")}
                      style={styles.headerImage}
                    />
                  </View>
                </View>

                {/* Wifi View  */}
                <TouchableOpacity style={styles.wifiView} />
                <TouchableOpacity style={styles.wifiView} disabled={true}>
                  <View style={styles.cartView1}>
                    <Image
                      resizeMode="contain"
                      source={require("../../assets/auth/cart.png")}
                      style={styles.cartImage}
                    />
                  </View>
                  {cartCount > 0 && (
                    <View style={{
                      height: 20,
                      width: 20,
                      borderRadius: 10,
                      backgroundColor: "#EA377C",
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'absolute',
                      right: -5,
                      top: 20,
                    }}>
                      <Text style={{ color: '#FFF' }}>{cartCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.wifiView} disabled={true}>
                  <View style={styles.notificationsView}>
                    <Image
                      resizeMode="contain"
                      source={require("../../assets/auth/notifications.png")}
                      style={styles.notificationImage}
                    />
                  </View>
                  {notificationCount > 0 && (
                    <>
                      {notificationCount < 100 && (
                        <View style={{
                          height: 20,
                          width: 20,
                          borderRadius: 10,
                          backgroundColor: "#EA377C",
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'absolute',
                          right: 0, top: 20
                        }}>
                          <Text style={{ color: '#FFF' }}>{notificationCount}</Text>
                        </View>
                      )}
                      {notificationCount >= 100 && (
                        <View style={{
                          height: 30,
                          width: 30,
                          borderRadius: 15,
                          backgroundColor: "#EA377C",
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'absolute',
                          right: -2, top: 15
                        }}>
                          <Text style={{ color: '#FFF' }}>{notificationCount}</Text>
                        </View>
                      )}
                    </>
                  )}

                </TouchableOpacity>
              </View> :
              <Header
                onPressLeftMenu={() => navigation.openDrawer()}
                onWiFiPress={() => {
                  navigation.navigate("ConnectWiFi");
                }}
              />
            }
          </LinearGradient>

          {images?.length > 0 ? (
            <>
              <ScrollView Style={{ flexGrow: 1, justifyContent: 'center' }} bounces={false}>

                <Animatable.View ref={handleAnimation}>
                  <GestureRecognizerView
                    onSwipeLeft={(state) => onSwipeLeft(state)}
                    onSwipeRight={(state) => onSwipeRight(state)}
                    config={config}
                  >
                    {flag != 'purchased' && (
                      <View style={{ flexDirection: 'row', justifyContent: getPosition() }}>
                        {images[sourceIndex - 1] && (
                          <Image
                            source={{ uri: images[sourceIndex - 1].file_url }}
                            style={{
                              // aspectRatio: 3 / 2,
                              width: Dimensions.get("window").width,
                              height: Dimensions.get("window").width * 1.5,
                              transform: [{ rotate: `${rotateImage}deg` }, { scale: getScale() }],
                              resizeMode: 'contain',
                              paddingHorizontal: 1
                            }}
                          />
                        )}
                        <Image
                          source={{ uri: images[sourceIndex]?.file_url }}
                          style={{
                            // aspectRatio: 3 / 2,
                            width: Dimensions.get("window").width,
                            height: Dimensions.get("window").width * 1.5,
                            transform: [{ rotate: `${rotateImage}deg` }, { scale: getScale() }],
                            resizeMode: 'contain',
                            paddingHorizontal: 1
                          }}
                        />
                        {images[sourceIndex + 1] && (
                          <Image
                            source={{ uri: images[sourceIndex + 1].file_url }}
                            style={{
                              // aspectRatio: 3 / 2,
                              width: Dimensions.get("window").width,
                              height: Dimensions.get("window").width * 1.5,
                              transform: [{ rotate: `${rotateImage}deg` }, { scale: getScale() }],
                              resizeMode: 'contain',
                              paddingHorizontal: 1
                            }}
                          />
                        )}
                      </View>
                    )}

                    {flag == 'purchased' && (
                      <View style={{ flexDirection: 'row', justifyContent: getPosition() }}>
                        {images[sourceIndex - 1] && (
                          <Image
                            source={{ uri: images[sourceIndex - 1].file_url }}
                            style={
                              images[sourceIndex - 1].file_orientation == 'horizontal' ? {
                                width: Dimensions.get("window").width,
                                height: Dimensions.get("window").width * 1.5,
                                resizeMode: 'contain',
                                paddingHorizontal: 1,
                                transform: [{ rotate: `${rotateImage}deg` }, { scale: 1.5 }]
                              } : {
                                width: Dimensions.get("window").width,
                                height: Dimensions.get("window").width * 1.5,
                                resizeMode: 'contain',
                                paddingHorizontal: 1
                              }
                            }
                          />
                        )}

                        {/* <Image
                        // source={{ uri: images[sourceIndex].file_url }}
                        source={loading ? require('../../assets/loading3.png') : { uri: images[sourceIndex].file_url }}
                        style={
                          rotate === true ?
                            (images[sourceIndex].file_orientation == 'horizontal' ? {
                              width: Dimensions.get("window").width,
                              height: Dimensions.get("window").width * 1.5,
                              resizeMode: 'contain',
                              paddingHorizontal: 1
                            } : {
                              width: Dimensions.get("window").width,
                              height: Dimensions.get("window").width * 1.5,
                              resizeMode: 'contain',
                              paddingHorizontal: 1,
                              transform: [{ rotate: `${rotateImage}deg` }, { scale: 0.65 }]
                            })
                            : (images[sourceIndex].file_orientation == 'horizontal' ? {
                              width: Dimensions.get("window").width,
                              height: Dimensions.get("window").width * 1.5,
                              resizeMode: 'contain',
                              paddingHorizontal: 1,
                              transform: [{ rotate: `${rotateImage}deg` }, { scale: 1.5 }]
                            } : {
                              width: Dimensions.get("window").width,
                              height: Dimensions.get("window").width * 1.5,
                              resizeMode: 'contain',
                              paddingHorizontal: 1
                            })
                        }
                        onLoadEnd={e => {
                          setSpinner(false);
                          setLoading(false);
                        }}
                      /> */}
                        {images[sourceIndex]?.file_orientation == 'horizontal' && (
                          <Image
                            source={{ uri: images[sourceIndex]?.file_url }}
                            style={rotate === true ? {
                              width: Dimensions.get("window").width,
                              height: Dimensions.get("window").width * 1.5,
                              resizeMode: 'contain',
                              paddingHorizontal: 1
                            } : {
                              width: Dimensions.get("window").width,
                              height: Dimensions.get("window").width * 1.5,
                              resizeMode: 'contain',
                              paddingHorizontal: 1,
                              transform: [{ rotate: `${rotateImage}deg` }, { scale: 1.5 }]
                            }}
                            onLoadEnd={e => {
                              setSpinner(false);
                            }}
                          />
                        )}
                        {images[sourceIndex]?.file_orientation != 'horizontal' && (
                          <Image
                            source={{ uri: images[sourceIndex]?.file_url }}
                            style={rotate === true ? {
                              width: Dimensions.get("window").width,
                              height: Dimensions.get("window").width * 1.5,
                              resizeMode: 'contain',
                              paddingHorizontal: 1,
                              transform: [{ rotate: `${rotateImage}deg` }, { scale: 0.65 }]
                            } : {
                              width: Dimensions.get("window").width,
                              height: Dimensions.get("window").width * 1.5,
                              resizeMode: 'contain',
                              paddingHorizontal: 1,
                            }}
                            onLoadEnd={e => {
                              setSpinner(false);
                            }}
                          />
                        )}

                        {images[sourceIndex + 1] && (
                          <Image
                            source={{ uri: images[sourceIndex + 1].file_url }}
                            style={
                              images[sourceIndex + 1].file_orientation == 'horizontal' ? {
                                width: Dimensions.get("window").width,
                                height: Dimensions.get("window").width * 1.5,
                                resizeMode: 'contain',
                                paddingHorizontal: 1,
                                transform: [{ rotate: `${rotateImage}deg` }, { scale: 1.5 }]
                              } : {
                                width: Dimensions.get("window").width,
                                height: Dimensions.get("window").width * 1.5,
                                resizeMode: 'contain',
                                paddingHorizontal: 1
                              }
                            }
                          />
                        )}
                      </View>
                    )}

                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        // //padding: "2%",
                        marginVertical: '1%',
                        width: '100%',
                        position: 'absolute',
                        top: 0
                      }}
                    >
                      <Text
                        style={{
                          color: colors.header,
                          fontFamily: fonts.BebasNeueRegular,
                        }}
                      >
                        {images[sourceIndex]?.file_name}
                      </Text>
                    </View>
                    {store.token != "" && (
                      <View
                        style={{
                          position: 'absolute',
                          top: 0,
                          alignSelf: 'flex-end',
                        }}
                      >
                        {images[sourceIndex]?.is_favourite == 0 && (
                          <TouchableOpacity onPress={() => addFavourite1(images[sourceIndex]?.file_id, images[sourceIndex]?.file_name)}>
                            <Image
                              style={{
                                width: 35,
                                height: 31,
                                // paddingVertical: '1%',
                                alignSelf: "flex-end",
                                tintColor: "#FFF",
                                //marginHorizontal: "2%",
                                // marginVertical: "2%",
                                marginTop: 15,
                                marginRight: 15
                              }}
                              source={require("../../assets/home/fav.png")}
                            />
                          </TouchableOpacity>
                        )}
                        {images[sourceIndex]?.is_favourite == 1 && (
                          <TouchableOpacity onPress={() => removeFavourite1(images[sourceIndex]?.file_id)}>
                            <Image
                              style={{
                                width: 35,
                                height: 31,
                                // paddingVertical: '1%',
                                alignSelf: "flex-end",
                                tintColor: colors.uep_pink,
                                //marginHorizontal: "2%",
                                // marginVertical: "2%",
                                marginTop: 15,
                                marginRight: 15
                              }}
                              source={require("../../assets/home/fav.png")}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                    <View style={{
                      // height: 40,
                      width: '100%',
                      position: 'absolute',
                      bottom: 10,
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}>
                      <TouchableOpacity
                        onPress={() => bacKToScreen()}
                        // onPress={() => navigation.navigate("ViewMediaScreen", {
                        //   cred: route.params.cred,
                        // })}
                        // onPress={() => {
                        //   console.log('View Image Event Name---', route.params.event_name);
                        //   if (route.params.event_mode_id == 1) {
                        //     console.log('VIKALP2');
                        //     navigation.navigate("ViewMediaScreen", {
                        //       cred: {
                        //         act_number: cred?.act_number,
                        //         event_id: String(cred?.event_id)
                        //       },
                        //       eventID: eventID,
                        //       event_name: route.params.event_name,
                        //     });
                        //   }
                        //   else {
                        //     console.log('VIKALP3');
                        //     navigation.navigate("ViewMediaScreen", {
                        //       cred: {
                        //         team_name: cred?.act_number,
                        //         event_id: String(cred.event_id)
                        //       },
                        //       eventID: eventID,
                        //       event_name: route.params.event_name,
                        //     });
                        //   }

                        // }}
                        style={{
                          width: '50%',
                          flexDirection: 'row',
                          justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap'
                        }}>
                        <Image source={backIcon} style={{
                          width: 35,
                          height: 35,
                          tintColor: 'white',
                          alignSelf: 'flex-start',
                          marginLeft: 15,
                          bottom: '1%',
                          marginRight: 10
                        }}
                          resizeMode="cover" />
                        <Text style={{ color: '#FFF', fontSize: 16, fontFamily: fonts.AvenirNextCondensedBold, textAlign: 'center', lineHeight: 18 }}>Return to{"\n"}Thumbnails</Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => handleRotate()}
                        style={{
                          width: '50%', flexDirection: 'row',
                          justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap'
                        }}>
                        <Text style={{ color: '#FFF', fontSize: 16, fontFamily: fonts.AvenirNextCondensedBold, textAlign: 'center', lineHeight: 18 }}>Rotate{"\n"}Image</Text>
                        <Image source={rotateImageIcon} style={{
                          width: 35,
                          height: 35,
                          tintColor: 'white',
                          alignSelf: 'flex-end',
                          marginRight: 15,
                          bottom: '1%',
                          marginLeft: 10
                        }}
                          resizeMode="cover" />
                      </TouchableOpacity>

                    </View>
                  </GestureRecognizerView>
                </Animatable.View>

              </ScrollView>
            </>
          ) : (
            <View style={{
              flex: 1
            }}>
            </View>
          )}

          {store.token != "" && (
            <View style={styles.favAndAddVideoToCartView}>
              {/* Fav View  */}

              {flag == "purchased" ? (
                <View style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginVertical: '1%'
                }}>
                  <View style={styles.favView}>
                    <Checkbox
                      onPress={() => showFavouriteFun1()}
                      colorScheme="pink"
                      isChecked={isFavourite}
                      accessibilityLabel="This is a dummy checkbox"
                      style={{ borderRadius: 0 }}
                    />
                    <TouchableOpacity onPress={() => showFavouriteFun1()}>
                      <Text
                        style={{
                          color: "white",
                          marginLeft: 10,
                          fontFamily: fonts.AvenirNextCondensedDemiBold,
                        }}
                      >
                        {store.textData.show_fvrt_only_text}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.cartView}>
                    {images?.length > 0 && (
                      <>
                        <TouchableOpacity onPress={async () => {
                          var arr = images[sourceIndex]?.file_url.split('/');
                          if (Platform.OS == 'ios') {
                            RNFetchBlob
                              .config(
                                {
                                  fileCache: true,
                                  useDownloadManager: true,
                                  notification: true,
                                  mediaScannable: true,
                                  path: RNFetchBlob.fs.dirs.DocumentDir + '/UEP/' + moment().unix() + arr[arr.length - 1],
                                })
                              .fetch('GET', images[sourceIndex]?.file_url, {
                                //some headers ..
                              })
                              .then((res) => {
                                const image = CameraRoll.save(res.data, 'photo');
                                setTimeout(() => {
                                  // RNFetchBlob.fs.writeFile(RNFetchBlob.fs.dirs.DocumentDir + '/UEP/' + moment().unix() + arr[arr.length - 1], res.data, 'base64');
                                  toastr.success(store.textData.dowload_successfully_text);
                                  saveFile1(images[sourceIndex]?.file_id);
                                  // RNFetchBlob.ios.openDocument(res.data);
                                }, 1000);
                              })
                          }
                          else {
                            try {
                              // const granted = await PermissionsAndroid.request(
                              //   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                              //   {
                              //     title: "Storage Permission",
                              //     message:
                              //       "UEP App needs access to your files " +
                              //       "so you can save documents.",
                              //     buttonNeutral: "Ask Me Later",
                              //     buttonNegative: store.textData.cancel_text,
                              //     buttonPositive: store.textData.okay_text
                              //   }
                              // );
                              // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                              RNFetchBlob
                                .config({
                                  addAndroidDownloads: {
                                    useDownloadManager: true,
                                    notification: true,
                                    path: RNFetchBlob.fs.dirs.DownloadDir + '/UEP/' + moment().unix() + arr[arr.length - 1],
                                    mediaScannable: true,
                                  },
                                  fileCache: true,
                                })
                                .fetch('GET', images[sourceIndex]?.file_url, {
                                  //some headers ..
                                })
                                .then((res) => {
                                  setTimeout(() => {
                                    toastr.success(store.textData.dowload_successfully_text);
                                    saveFile1(images[sourceIndex]?.file_id);
                                  }, 1000);
                                })

                              // } else {
                              //   setTimeout(() => {
                              //     toastr.warning(store.textData.permission_denied_text);
                              //   }, 1000);
                              // }
                            } catch (err) {
                              setTimeout(() => {
                                toastr.warning(store.textData.something_went_wrong_text);
                              }, 1000);
                            }
                          }
                        }}>
                          <Image
                            source={require("../../assets/download.png")}
                            style={{
                              width: 26,
                              height: 20,
                              tintColor: "white"
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                          const encodedUrl = encodeURIComponent(images[sourceIndex]?.file_url);
                          console.log("emailLarge screem==", encodedUrl);
                          if (Platform.OS == "ios") {
                            Linking.openURL('mailto:?subject=UEP Viewer: Download Purchased media&body=Please click on the link below to download purchased image file: ' + images[sourceIndex]?.file_url)
                          }
                          else {
                            Linking.openURL('mailto:?subject=UEP%20Viewer:%20Download%20Purchased%20media&body=Please click on the link below to download purchased image file:%0D%0A%0D%0A' + encodedUrl)
                          }
                        }}>
                          <Image
                            source={require("../../assets/email.png")}
                            style={{
                              width: 31,
                              height: 20,
                              tintColor: "white"
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={async () => {
                          try {
                            const result = await Share.share({
                              title: 'Share Image',
                              message: 'Download Image from link: ' + images[sourceIndex]?.file_url,
                              url: images[sourceIndex]?.file_url
                            });
                            if (result.action === Share.sharedAction) {
                              if (result.activityType) {
                                // shared with activity type of result.activityType
                              } else {
                                // shared
                              }
                            } else if (result.action === Share.dismissedAction) {
                              // dismissed
                            }
                          } catch (error) {
                            setTimeout(() => {
                              toastr.warning(store.textData.something_went_wrong_text);
                            }, 1000);
                          }
                        }}>
                          <Image
                            source={require("../../assets/share.png")}
                            resizeMode="contain"
                            style={{
                              width: 25,
                              height: 24,
                              tintColor: "white",

                            }}
                          />
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              ) : (
                // Not Purchased
                <View style={styles.NPfavView}>
                  <Checkbox
                    onPress={() => showFavouriteFun1()}
                    colorScheme="pink"
                    isChecked={isFavourite}
                    accessibilityLabel="This is a dummy checkbox"
                    style={{ borderRadius: 0 }}
                  />
                  <TouchableOpacity onPress={() => showFavouriteFun1()}>
                    <Text
                      style={{
                        color: "white",
                        marginLeft: 10,
                        fontFamily: fonts.AvenirNextCondensedDemiBold,
                      }}
                    >
                      {store.textData.show_fvrt_only_text}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          <View
            style={{
              marginHorizontal: "5%",
              // backgroundColor: 'yellow'
            }}
            onLayout={(event) => {
              var { x, y, width, height } = event.nativeEvent.layout;
              setButtonHeight(height);
            }}>
            {SelectedPackage.event_package_id ?
              <View style={{ marginTop: -5 }}>
                <UEPButton
                  title={store.textData.add_to_package_text}
                  onPressButton={() => {
                    if (images?.length > 0) {
                      if (images[sourceIndex]?.is_team_potrait == 1) {
                        if (SelectedPackage?.is_team_potrait == 1) {
                          addToPackage();
                        }
                        else {
                          setTimeout(() => {
                            // toastr.warning(store.textData.image_cannot_be_added_text);

                            //Styling for the pop-up fixes added below:
                            if (Platform.OS == "android") {
                              setModalVisible3(!modalVisible3);
                            }
                            else {
                              Alert.alert(
                                store.textData.image_cannot_be_added_text,
                                "",
                                [
                                  {
                                    text: store.textData.okay_text,
                                    // onPress: () => navigation.navigate("MyCartScreen")
                                  }
                                ]
                              );
                            }

                            // Alert.alert(
                            //   store.textData.image_cannot_be_added_text,
                            //   "",
                            //   [
                            //     {
                            //       text: "OK",
                            //       style: "cancel",
                            //       //  onPress: () => navigation.navigate("MyCartScreen")
                            //     }
                            //   ]
                            // )

                          }, 500);
                        }
                      }
                      else {
                        addToPackage();
                      }
                    }
                  }}
                />
              </View>
              :
              <View style={{ marginTop: -5 }}>
                <UEPButton
                  title={store.textData.tap_here_to_view_all_product_text}
                  onPressButton={

                    () => {
                      if (images?.length > 0) {
                        setmodal(!modal);
                      }
                    }}
                />
              </View>
            }
          </View>
        </View>
        {/* Create New Account Modal */}
        <Modal
          animationType="slide"
          style={{
            justifyContent: 'flex-end'
          }}
          transparent={true}
          visible={modal}
          onRequestClose={() => setmodal(false)}
          onBackdropPress={() => setmodal(false)}
          onSwipeComplete={this.toggleSideMenu} // Swipe to discard
          propagateSwipe
        >
          <View style={{
            backgroundColor: "rgb(61,61,61)",
            width: Dimensions.get("window").width - 30,
            alignSelf: 'center',
            position: 'absolute',
            bottom: Platform.OS === "ios" ? 80 : 45,
            borderRadius: 10,
          }}>
            <View onLayout={(event) => {
              var { x, y, width, height } = event.nativeEvent.layout;
              setMheaderHeight(height);
            }}>
              <Text style={styles.selectHeaderText}>
                {store.textData.select_package_menu_text}
              </Text>
              <Text style={styles.selectHeaderText1}>
                {store.textData.scroll_down_view_more_packages_text}
              </Text>
              <TouchableOpacity
                style={styles.studioOrderText}
                onPress={() => {
                  setmodal(false);
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
                    if (route.params.event_mode_id == 1) {
                      // if (is_free == 1 && item.is_digital == 1) {
                      //   setmodal(false);
                      //   if (Platform.OS == "android") {
                      //     console.log("if");
                      //     setModalVisible4(!modalVisible4);
                      //   }
                      //   else {
                      //     Alert.alert(

                      //       store.textData.packges_added_to_cart_text,
                      //       "",
                      //       [
                      //         { text: store.textData.okay_text, onPress: () => console.log("") }
                      //       ]
                      //     );
                      //   }

                      // }
                      // else {
                      if (is_free == 1 && digital == 1) {
                        // setmodal(false);
                        if (Platform.OS == "android") {
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
                        setTimeout(() => {
                          navigation.navigate("PricesListScreen", {
                            eventID: eventID,
                            file_id: images[sourceIndex]?.file_id,
                            search_by: route.params.flag == "purchased" ? images[sourceIndex]?.folder_name : search_by,
                            flag: route.params.flag
                          });
                        }, 500);
                      }
                    }
                    else {
                      // if (is_free == 1 && item.is_digital == 1) {
                      //   setmodal(false);
                      //   if (Platform.OS == "android") {
                      //     console.log("if");
                      //     setModalVisible4(!modalVisible4);
                      //   }
                      //   else {
                      //     Alert.alert(

                      //       store.textData.packges_added_to_cart_text,
                      //       "",
                      //       [
                      //         { text: store.textData.okay_text, onPress: () => console.log("") }
                      //       ]
                      //     );
                      //   }

                      // }
                      // else {
                      quickbuy1();
                      // }
                    }
                  }
                }}
              >
                <Text style={styles.studioText} numberOfLines={1}>
                  {route.params.event_mode_id == 1 ? store.textData.studio_order_text : store.textData.quick_buy_all_images_from_this_routine_text}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{
              maxHeight: areaHeight - mheaderHeight - buttonHeight - (Platform.OS == 'ios' ? 90 : 90),
              marginVertical: '2%'
            }}>
              <FlatList
                bounces={false}
                data={packageList}
                renderItem={({ item, index }) => (
                  // <PackageItem
                  //   name={item.routine_name}
                  //   price={item.price}
                  //   onPress={() => {
                  //     onPackageSelect(item, index);
                  //   }}
                  // />
                  <>
                    {images[sourceIndex]?.is_team_potrait == 0 && (

                      <PackageItem
                        name={item.routine_name}
                        price={item.price}
                        onPress={() => {
                          onPackageSelect(item, index);
                        }}
                      />
                    )}
                    {images[sourceIndex]?.is_team_potrait == 1 && (
                      <>
                        {item.is_team_potrait == 1 && (
                          <PackageItem
                            name={item.routine_name}
                            price={item.price}
                            onPress={() => {
                              onPackageSelect(item, index);
                            }}
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              />
            </View>
          </View>
        </Modal>
        {/* Cart modal */}
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
                title={store.textData.packges_added_to_cart_text}
                activeOpacity={1}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
                showButton={true}
              />
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>

        {/* new modal */}
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

        {modalVisible5 &&
          <View style={{ position: 'absolute', left: 0, right: 0, top: 80 + INSEST.top, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1 }}>
            <View style={{ flexDirection: 'column', justifyContent: 'space-between', padding: 16, marginTop: 5, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                  colorScheme="pink"
                  onPress={() => overlayFunction()}
                  isChecked={isEnlargeImage}
                  style={{ borderRadius: 0 }}
                  size="sm"
                >
                </Checkbox>
                <TouchableOpacity onPress={() => overlayFunction()} style={{ bottom: 1 }}>
                  <Text style={{ color: "white", marginLeft: 10, fontFamily: fonts.BarlowCondensedSemiBoldItalic, fontSize: 18, }}>DO NOT SHOW THIS AGAIN</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => isContinue()}>
                <View style={styles.buttonContainer}>
                  <Text style={styles.buttonText1}>CONTINUE</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ height: '30%', flexDirection: "row", alignItems: 'flex-end', marginBottom: 10 }}>
              <View style={{ flex: 1, alignItems: 'flex-end', alignSelf: 'flex-end', marginBottom: '4%' }}>
                <Image source={require("../../assets/overlay/OverlayEnlarged_Left.png")} style={{ width: '80%', height: '50%', resizeMode: 'contain' }} />
              </View>
              <View style={{ flex: 2, alignItems: 'center', bottom: Platform.OS == "ios" ? 10 : 0 }}>
                <Text style={{ color: 'white', fontSize: 34, textAlign: "center", fontFamily: "Farmhouse", width: '95%', }}>SCROLL THROUGH IMAGES BY SWIPING LEFT & RIGHT</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-start', alignSelf: 'flex-end', marginBottom: '4%' }}>
                <Image source={require("../../assets/overlay/OverlayEnlarged_right.png")} style={{ width: '80%', height: '50%', resizeMode: 'contain' }} />
              </View>
            </View>
            <View style={{ height: Platform.OS == "ios" ? '40%' : '45%', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
              <Text style={{ color: "white", fontSize: 34, marginHorizontal: 20, textAlign: 'center', fontFamily: fonts.Farmhouse, }}>{"TAP HERE TO OPEN THE PACKAGE\n MENU. THEN TAP ON A PACKAGE\n TO ADD IT TO YOUR CART."}</Text>
              <Image source={require("../../assets/overlay/OverlayEnlarged_down.png")} style={{ width: '50%', height: '32%', resizeMode: 'contain', marginVertical: "2%" }} />
            </View>
            <View style={styles.buttonView}>
              <TouchableOpacity style={styles.button} disabled={true}>
                <Text style={styles.buttonText}>TAP HERE TO VIEW ALL PRODUCTS</Text>
              </TouchableOpacity>
            </View>
          </View>
        }

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
                title={store.textData.files_added_cart_text}
                activeOpacity={1}
                onPress={() => {
                  setModalVisible1(!modalVisible1);
                  setTimeout(() => {
                    navigation.navigate("");
                  }, 500);
                }}
                showButton={true}
              />
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>

        {/* Pop-up Modal fixes added below: */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible3}
          onRequestClose={() => {
            setModalVisible3(!modalVisible3);
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
                title={store.textData.image_cannot_be_added_text}
                activeOpacity={1}
                onPress={() => {
                  setModalVisible3(!modalVisible3);
                  // setTimeout(() => {
                  //   navigation.navigate("MyCartScreen");
                  // }, 500);
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
                yestxt={store.textData.create_account_text}
                notxt={store.textData.cancel_text}
              />
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>

      </SafeAreaView >


    </>
  );
};

export default ViewImage;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    // backgroundColor: '#212121',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  screen: {
    flex: 1,
    backgroundColor: colors.screen_bg
  },
  imageBG: {
    flex: 1,
    justifyContent: "center",
  },
  brandImageView: {
    justifyContent: "center",
    alignItems: "center",
  },
  brandImage: {
    width: "82%",
    height: "70%",
  },
  bottomView: {
    backgroundColor: colors.uep_pink,
    justifyContent: "center",
    alignItems: "center",
  },
  tapToViewText: {
    color: "white",
    padding: 10,
  },
  selectHeaderText: {
    color: "white",
    justifyContent: "center",
    textAlign: "center",
    // padding: 5,
    fontSize: RFValue(16),
    fontFamily: fonts.BebasNeueRegular,
    // marginVertical: "2%",
    marginTop: 10
  },
  selectHeaderText1: {
    color: "white",
    justifyContent: "center",
    textAlign: "center",
    // padding: 5,
    // fontSize: RFValue(16),
    // fontFamily: fonts.BebasNeueRegular,
    marginBottom: 10,
    // marginVertical: "2%",

    fontFamily: fonts.AvenirNextCondensedRegular,
    fontSize: RFValue(12),
  },
  studioOrderText: {
    backgroundColor: "#FFB31A",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    height: 50,
  },
  studioText: {
    fontSize: RFValue(14),
    fontFamily: fonts.AvenirNextCondensedDemiBold,
  },

  packageListView: {
    // maxHeight: Dimensions.get("window").width * 1.20,
    maxHeight: 763 - 160,
    marginVertical: '2%'
  },
  favAndAddVideoToCartView: {
    flexDirection: "row",
    marginHorizontal: "5%",
    // backgroundColor: 'red',
    // justifyContent: "center",
    // marginBottom: 5,
    paddingTop: 10,
    // marginBottom: -10
  },
  favView: {
    width: "60%",
    alignItems: "center",
    flexDirection: "row",
    //paddingVertical: 5
  },
  NPfavView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: 'center',
    // paddingVertical: 5
  },
  cartView: {
    width: "40%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
  },
  commonImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width * 1.5,
    resizeMode: 'contain',
    paddingHorizontal: 1,
    transform: [{ scale: 1.5 }]
  },
  commonImage1: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width * 1.5,
    resizeMode: 'contain',
    paddingHorizontal: 1,
    transform: [{ rotate: `${270}deg` }, { scale: 0.65 }]
  },
  commonImage2: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width * 1.5,
    resizeMode: 'contain',
    paddingHorizontal: 1,
  },
  button: {
    backgroundColor: colors.uep_pink,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    height: 50,
    width: '90%',
  },
  buttonText: {
    color: "white",
    fontSize: RFValue(22),
    fontFamily: fonts.BebasNeueRegular,
  },
  buttonView: {
    flex: 1,
    marginVertical: Platform.OS == "ios" ? "12%" : "4%",
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    // marginHorizontal: '4%',
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    height: 45,
    width: 250,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center'
  },
  buttonText1: {
    color: 'white',
    fontSize: 24,
    bottom: Platform.OS == "android" ? 2 : 0,
    fontFamily: fonts.BarlowCondensedSemiBoldItalic,
  },
  headerView: {
    height: 80,
    marginTop: 0,
    marginLeft: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    resizeMode: "stretch",
    width: Dimensions.get("window").width - 200,
    height: Dimensions.get("window").height / 18,
  },

  mainView: {
    height: 80,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: "2%",
  },

  leftMenuImage: {
    width: 30,
    height: 30,
  },
  cartImage: {
    width: 30,
    height: 30,
  },
  wifiImage: {
    width: 35,
    height: 30,
  },
  noWifiImage: {
    width: 35,
    height: 30,
  },
  notificationImage: {
    width: 30,
    height: 30,
    tintColor: "white",
  },
  leftMenuView: {
    height: 80,
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  bandView: {
    height: 80,
    width: "60%",
  },
  cartView1: {
    height: 80,
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  wifiView: {
    height: 80,
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationsView: {
    height: 80,
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
});
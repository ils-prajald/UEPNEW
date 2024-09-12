import React, { useState, useEffect, useRef } from "react";
import {
    StyleSheet,
    Text,
    View,
    // SafeAreaView,
    FlatList,
    Dimensions,
    ScrollView,
    Switch,
    TouchableOpacity,
    Image,
    ImageBackground,
    Platform,
    Share,
    Linking,
    PermissionsAndroid,
    TouchableWithoutFeedback, ActivityIndicator,

} from "react-native";
import { Checkbox, SimpleGrid, Box } from "native-base";
import colors from "../../constants/colors";
import Header from "../../components/Header";
import LinearGradient from "react-native-linear-gradient";
import { store } from "../../store/Store";
import fonts from "../../constants/fonts";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { createThumbnail } from "react-native-create-thumbnail";
import { getLinkPreview, getPreviewFromContent } from "link-preview-js";
import { RFValue } from "react-native-responsive-fontsize";
const video_thumb = require("../../assets/home/video_thumbnail.png");
import { useFocusEffect } from "@react-navigation/native";
import env from "../../constants/env";
import axios from "axios";
import { LoginContext } from "../../Context/LoginProvider";
import { toastr } from "../utilities/index";
import Spinner from "react-native-loading-spinner-overlay";
import moment from "moment";
import RNFetchBlob from 'rn-fetch-blob';
import LazyImage from "../../components/LazyImage";
import Modal from "react-native-modal";
import NoDataCard from '../../components/NoDataCard';
import { BlurView } from "@react-native-community/blur";
import FastImage from 'react-native-fast-image'
import {
    encryptData,
    decryptData
} from '../../utilities/Crypto';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import CameraRoll from "@react-native-community/cameraroll";
import Video from 'react-native-video';
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFS from 'react-native-fs';

import email from 'react-native-email'
// import RNFetchBlob from 'react-native-fetch-blob';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const PurchasedMediaHome = ({ props, route, navigation }) => {
    const { clearAllDetails, imagesData, setImagesData, isFavourite, setIsFavourite, images1, setImages1 } = React.useContext(LoginContext);
    const event_id = route.params.event_id;
    console.log("event_id", event_id);
    const scrollRef = React.useRef(null);
    let [pHeight, setpHeight] = useState(0);
    let [spinner, setSpinner] = useState(false);
    let [videos, setVideos] = useState([]);
    let [images, setImages] = useState([]);
    let [newImages, setNewImages] = useState([]);
    let [imageCount, setImageCount] = useState(0);
    let [subHeader, setSubHeader] = useState("");
    let [event_mode_id, setEvent_mode_id] = useState(1);
    let [page, setPage] = useState(1);
    let [dataLoaded, setDataLoaded] = useState(false);
    let [modalVisible, setModalVisible] = useState(false);
    let [isVideoLoading, setIsVideoLoading] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [downloadPath, setDownloadPath] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(true);
    const player = useRef(null);
    const [visible, setVisible] = useState(false);
    const [isPurchaseImage, setIsPurchaseImage] = useState(false);
    const [is_free, setIs_free] = useState(0);

    const screenDimensions = Dimensions.get('screen');

    const INSEST = useSafeAreaInsets();
    getReso = (url) => {
        return new Promise((resolve, reject) => {
            Image.getSize(url, (width, height) => {
                if (width > height) {
                    resolve('horizontal');
                }
                else {
                    resolve('vertical');
                }
            });
        });
    }

    // useFocusEffect(
    //     React.useCallback(() => {
    //         if (imagesData.length > 0) {
    //             for (var i = 0; i < imagesData.length; i++) {
    //                 for (var j = 0; j < images1.length; j++) {
    //                     if (imagesData[i].id == images1[j].id) {
    //                         images1[j].is_favourite = imagesData[i].is_favourite;
    //                     }
    //                 }
    //             }
    //         }
    //         if (isFavourite) {
    //             if (images1.length > 0) {
    //                 const newData = images1.filter(item => {
    //                     return item.is_favourite == 1;
    //                 });
    //                 // if (newData.length <= 0) {
    //                 //   setTimeout(() => {
    //                 //     toastr.warning("No Images selected as favourite");
    //                 //   }, 1000);
    //                 // }
    //                 setImagesData(newData);
    //                 setTimeout(() => {
    //                     if (newImages.length >= 100) {
    //                         this.loadMore();
    //                     }
    //                 }, 300);
    //             }
    //             else {
    //                 setIsFavourite(false);
    //             }
    //         }
    //         else {
    //             if (images1.length > 0) {
    //                 setImagesData(images1);
    //             }
    //         }
    //     }, [isFavourite])
    // );

    useFocusEffect(
        React.useCallback(() => {
            global.userIndex = 2;
            if (scrollRef.current) {
                scrollRef.current.scrollToIndex({ index: scrollRef.current.getCurrentIndex() });
            }
        }, [])
    );

    useEffect(() => {
        setImages1([]);
        setImagesData([]);
        setIsFavourite(false);
        global.userIndex = 2;
        getMediaDetails();
        // onLoadingStart();
        setScreen();
        getIsOverlayFromStorage();
    }, []);

    overlayFunction = async () => {
        setIsPurchaseImage(prev => !prev);
    }

    isContinue = async () => {
        if (isPurchaseImage === true) {
            try {
                await AsyncStorage.setItem('isPurchaseImage', JSON.stringify(isPurchaseImage));
            } catch (error) {
                console.error('Error saving isPurchaseImage to AsyncStorage:', error);
            }
        }
        setVisible(false);
    }

    const getIsOverlayFromStorage = async () => {
        try {
            const value = await AsyncStorage.getItem('isPurchaseImage');
            if (value === null) {
                setVisible(true);
            }
        } catch (error) {
            console.error('Error getting isPurchaseImage from AsyncStorage:', error);
            console.error('Error getting isPurchaseImage from AsyncStorage:', error);
        }
    };


    const handleImageLoad = () => {
        if (imagesData[0]?.file_url) {
            setImageLoaded(false);
        }
    };

    const setScreen = async () => {
        try {
            await AsyncStorage.setItem("isScreen", '1');
        } catch (e) {
        }
    };

    getThumbail = async (id, url) => {
        return new Promise((resolve, reject) => {
            createThumbnail({
                url: url,
                type: 'high',
                timeStamp: 10000,
                // cacheName: id.toString(),
            })
                .then(response => {
                    resolve({ uri: response.path })
                    setIsVideoLoading(false);
                    setIsLoaded(true);
                })
                .catch(err => reject(require('../../assets/loading.png')));
        });
    }

    const generateThumbnail = async () => {
        try {
            const options = {
                url: videoUrl,
                type: 'high',
                timeStamp: 10000, // Capture thumbnail at 10 seconds into the video
            };

            const thumbnailUrl = await VideoThumbnails.getThumbnail(options);
            setThumbnail(thumbnailUrl);
            setIsThumbnailGenerated(true);
        } catch (error) {
            console.error('Failed to generate thumbnail:', error);
            setIsThumbnailGenerated(true);
        }
    };

    getMediaDetails = () => {
        const encodedSearchBy = (
            route.params.search_by.includes("&") ||
            route.params.search_by.includes("#") ||
            route.params.search_by.includes("+") ||
            route.params.search_by.includes("!") ||
            route.params.search_by.includes("(") ||
            route.params.search_by.includes(")")
        )
            ? encodeURIComponent(route.params.search_by)
            : route.params.search_by;
        setSpinner(true);
        axios
            .get(env.BASE_URL + '/media/api/getPurchasedEventFilesList?event_id=' + event_id + '&search_by=' + encodedSearchBy + '&limit=100&page=1', {
                headers: { Authorization: `Bearer ${store.token}` },
            })
            .then(async ({ data }) => {
                data = await decryptData(data);
                console.log("dataMedia", data.data);
                setSubHeader(data.data.event_name);
                setEvent_mode_id(data.data.event_mode_id);
                setImagesData(data.data.images);
                setImages1(data.data.images);
                setNewImages(data.data.images);
                setImageCount(data.data.media_count);
                setIs_free(data.data.is_free);
                setPage(2);

                var tmpvid = data.data.videos;
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
                // for (var i = 0; i < data.data.images.length; i++) {
                //     data.data.images[i].itype = await getReso(data.data.images[i].file_url);
                // }
                // setImages(data.data.images);
                if (data.data.images.length >= 100) {
                    this.loadMore();
                }
                else {
                    setSpinner(false);
                    setDataLoaded(true);
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
        // .finally(() => {
        //     setSpinner(false);
        // });
    }

    loadMore = () => {
        const encodedSearchBy = (
            route.params.search_by.includes("&") ||
            route.params.search_by.includes("#") ||
            route.params.search_by.includes("+") ||
            route.params.search_by.includes("!") ||
            route.params.search_by.includes("(") ||
            route.params.search_by.includes(")")
        )
            ? encodeURIComponent(route.params.search_by)
            : route.params.search_by;
        axios
            .get(env.BASE_URL + '/media/api/getPurchasedEventFilesList?event_id=' + event_id + '&search_by=' + encodedSearchBy + '&limit=100&page=' + page, {
                headers: { Authorization: `Bearer ${store.token}` },
            })
            .then(async ({ data }) => {
                data = await decryptData(data);
                console.log("dataLoadMore", data.data);
                setImagesData(imagesData.concat(data.data.images));
                setImages1(images1.concat(data.data.images));
                setNewImages(data.data.images);
                setPage(page + 1);
                if (data.data.images.length >= 100) {
                    this.loadMore();
                }
                else {
                    setSpinner(false);
                    setDataLoaded(true);
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

    console.log("data", videos);


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
                        if (tmpi[i].file_id == file_id) {
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
                // getMediaDetails();
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
                // getMediaDetails();
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

    showFavouriteFun = () => {
        // setIsFavourite(!isFavourite);
        setSpinner(true);
        if (isFavourite) {
            setImagesData(images1);
            setIsFavourite(!isFavourite);
            setSpinner(false);
        }
        else {
            const newData = images1.filter(item => {
                return item.is_favourite == 1;
            });
            setImagesData(newData);
            setIsFavourite(!isFavourite);
            setSpinner(false);
            if (newData.length <= 0) {
                setTimeout(() => {
                    toastr.warning(store.textData.no_image_select_fvrt_text);
                }, 1000);
            }
        }
    }

    saveFile = (file_id) => {
        console.log("file_id", file_id);
        console.log("event_id", event_id);
        const cred = {
            file_id: file_id,
            event_id: event_id
        };
        axios.post(env.BASE_URL + '/media/api/downloadVideo', encryptData(cred), {
            headers: { Authorization: `Bearer ${store.token}` },
        },
        ).then(async (res) => {
            res = await decryptData(res);
            console.log('Downolad Video', res)
        }).catch((err) => {
        })
    }

    sendZip = () => {
        setModalVisible(true);
        axios.post(env.BASE_URL + '/media/api/emailLinkForAllPhotosPurchased', encryptData({
            event_name: subHeader,
            event_id: event_id,
            search_by: route.params.search_by,
        }), {
            headers: { Authorization: `Bearer ${store.token}` },
        },
        ).then(async (res) => {
            // setModalVisible(false);
            // res.data.responseObj = await decryptData(res.data.responseObj);
            // if (res.data.statusCode == 200) {
            //     if (Platform.OS == "ios") {
            //         Linking.openURL('mailto:?subject=UEP Viewer: Download Purchased media&body=Please click on the link below to download all your purchased media: ' + res.data.responseObj.Zipped_files_link);
            //     }
            //     else {
            //         Linking.openURL('mailto:?subject=UEP%20Viewer:%20Download%20Purchased%20media&body=Please click on the link below to download all your purchased media:%0D%0A%0D%0A' + res.data.responseObj.Zipped_files_link);
            //     }
            // }
        }).catch((err) => {
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
                }, 3000);
            }
        })
    }

    shift = (arr, direction, n) => {
        var times = n > arr.length ? n % arr.length : n;
        return arr.concat(arr.splice(0, (direction > 0 ? arr.length - times : times)));
    }
    onLoadingStart = () => {
        setIsVideoLoading(true);
    }
    onLoadingEnd = () => {
        setIsVideoLoading(false);
    }


    getVideoFileSize = (videoUrl) => {
        return new Promise((resolve, reject) => {
            fetch(videoUrl, { method: 'HEAD' })
                .then(response => {
                    const contentLength = response.headers.get('content-length');
                    const fileSizeBytes = parseInt(contentLength, 10);
                    const fileSizeMB = fileSizeBytes / 1048576; // Convert to MB
                    resolve(fileSizeMB);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }


    const handleLoad = () => {
        setIsLoaded(true);
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
                            {/* Banner View  */}
                            <View style={styles.bannerView}>
                                <View style={styles.headingView}>
                                    <Text style={styles.headingText} numberOfLines={1}>
                                        {subHeader}
                                    </Text>
                                    <Text style={styles.headingText} numberOfLines={1}>
                                        {route.params.search_by}
                                    </Text>
                                </View>
                                <View style={styles.countView}>
                                    <Text style={styles.text}>{imageCount} PHOTOS</Text>
                                    <Text style={styles.text}>{videos?.length} VIDEOS</Text>
                                </View>
                            </View>

                            <FlatList
                                // data={images}
                                data={imagesData}
                                bounces={false}
                                keyExtractor={(item, index) => {
                                    return item.file_id;
                                }}
                                // extraData={isRender}
                                ListHeaderComponent={(
                                    <>
                                        {videos.length > 0 && (
                                            <SwiperFlatList
                                                ref={scrollRef}
                                                data={videos}
                                                disableGesture={true}
                                                renderItem={({ item, index }) => (
                                                    <>{Platform.os === 'ios' ? (
                                                        <TouchableOpacity
                                                            style={{
                                                                height: Dimensions.get("window").height / 4,
                                                                width: Dimensions.get("window").width,
                                                                // alignItems: 'center',
                                                                justifyContent: 'center',
                                                                marginVertical: 5,
                                                                paddingTop: 10,
                                                                // paddingHorizontal: 40
                                                                // backgroundColor: 'orange'
                                                            }}
                                                            activeOpacity={1}
                                                            onPressOut={() => {
                                                                navigation.navigate("VideoPlayerScreen", {
                                                                    videoUrl: item.file_url,
                                                                });
                                                            }}
                                                        >
                                                            <View
                                                                style={{
                                                                    height: Dimensions.get("window").height,
                                                                    width: Dimensions.get("window").width - 20,
                                                                    // marginTop: "2%",
                                                                    // marginTop: 25,
                                                                    paddingTop: 15,
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',

                                                                }}
                                                            >
                                                                <>
                                                                    {!isLoaded && (
                                                                        // <TouchableOpacity
                                                                        //     style={{
                                                                        //         height: Dimensions.get("window").height / 4,
                                                                        //         width: Dimensions.get("window").width,
                                                                        //         // alignItems: 'center',
                                                                        //         justifyContent: 'center',
                                                                        //         marginVertical: 5,
                                                                        //         // paddingHorizontal: 40
                                                                        //     }}
                                                                        //     activeOpacity={1}
                                                                        //     onPressOut={() => {
                                                                        //         navigation.navigate("VideoPlayerScreen", {
                                                                        //             videoUrl: item.file_url,
                                                                        //         });
                                                                        //     }}
                                                                        // >
                                                                        //     <ImageBackground
                                                                        //         // source={video_thumb}
                                                                        //         source={item.thumb}
                                                                        //         resizeMode={item.thumb == require('../../assets/loading.png') ? 'contain' : 'cover'}
                                                                        //         style={{
                                                                        //             height: Dimensions.get("window").height / 4,
                                                                        //             width: Dimensions.get("window").width - 20,
                                                                        //             marginTop: "2%",
                                                                        //             alignItems: 'center',
                                                                        //             justifyContent: 'center'
                                                                        //         }}
                                                                        //     >
                                                                        //         {item.thumb != require('../../assets/loading.png') && (
                                                                        //             <Text style={{
                                                                        //                 color: '#FFF', fontFamily: fonts.AvenirNextCondensedBold, fontSize: RFValue(22.4),
                                                                        //                 textShadowColor: 'rgba(0, 0, 0, 0.75)',
                                                                        //                 textShadowOffset: { width: -1, height: 1 },
                                                                        //                 textShadowRadius: 10
                                                                        //             }}>{store.textData.thirty_second_video_preview_text}</Text>
                                                                        //         )}
                                                                        //         {videos.length > 1 && index != 0 && (
                                                                        //             <TouchableWithoutFeedback onPress={() => {
                                                                        //                 scrollRef.current.scrollToIndex({ index: scrollRef.current.getCurrentIndex() - 1 });
                                                                        //             }}>
                                                                        //                 <Image
                                                                        //                     source={require("../../assets/home/left-arrow.png")}
                                                                        //                     style={styles.leftArrowImage}
                                                                        //                 />
                                                                        //             </TouchableWithoutFeedback>
                                                                        //         )}
                                                                        //         {videos.length > 1 && index != videos.length - 1 && (
                                                                        //             <TouchableWithoutFeedback onPress={() => {
                                                                        //                 scrollRef.current.scrollToIndex({ index: scrollRef.current.getCurrentIndex() + 1 });
                                                                        //             }}>
                                                                        //                 <Image
                                                                        //                     source={require("../../assets/home/right-arrow.png")}
                                                                        //                     style={styles.rightArrowImage}
                                                                        //                 />
                                                                        //             </TouchableWithoutFeedback>
                                                                        //         )}
                                                                        //     </ImageBackground>
                                                                        // </TouchableOpacity>
                                                                        <>
                                                                            {Platform.OS === 'ios' && <View style={{ position: 'absolute', zIndex: 999, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                                                                                <ActivityIndicator size="large" color="#FFFFFF" />
                                                                            </View>}
                                                                        </>

                                                                    )}
                                                                    {Platform.OS === 'ios' ? (
                                                                        <Video
                                                                            paused={true}
                                                                            ref={player}
                                                                            style={{
                                                                                height: Dimensions.get("window").height,
                                                                                width: Dimensions.get("window").width - 20,
                                                                                // marginTop: "5%",
                                                                                // marginTop: 25,
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                                position: 'relative',
                                                                                zIndex: 1,
                                                                            }}
                                                                            source={{ uri: item.file_url, type: 'mp4' }}
                                                                            onLoad={() => {
                                                                                player.current.seek(0); // this will set second frame of video as thumbnail
                                                                            }}
                                                                            onReadyForDisplay={handleLoad}
                                                                        // onLoad={() => onLoadingEnd()}
                                                                        // onLoadStart={() => onLoadingStart()}
                                                                        />
                                                                    )
                                                                        :
                                                                        (
                                                                            <Video
                                                                                paused={true}
                                                                                // poster={Image.resolveAssetSource(require('../../assets/thumb.png')).uri}
                                                                                poster={item?.thumb ? Image.resolveAssetSource(item.thumb).uri : Image.resolveAssetSource(require('../../assets/thumb.png')).uri}
                                                                                posterResizeMode={'contain'}
                                                                                ref={player}
                                                                                style={{
                                                                                    height: Dimensions.get("window").height,
                                                                                    width: Dimensions.get("window").width - 20,
                                                                                    // marginTop: "5%",
                                                                                    marginTop: 20,
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center',
                                                                                    position: 'relative',
                                                                                    zIndex: 1,
                                                                                    // backgroundColor: 'red'
                                                                                }}
                                                                                source={{ uri: item.file_url, type: 'mp4' }}
                                                                                onLoad={() => {
                                                                                    player.current.seek(0); // this will set second frame of video as thumbnail
                                                                                }}
                                                                                onReadyForDisplay={handleLoad}
                                                                            // onLoad={() => onLoadingEnd()}
                                                                            // onLoadStart={() => onLoadingStart()}
                                                                            />
                                                                        )
                                                                    }

                                                                    {isVideoLoading === false && (
                                                                        <Text style={{
                                                                            color: '#FFF', fontFamily: fonts.AvenirNextCondensedBold, fontSize: RFValue(22.4),
                                                                            textShadowColor: 'rgba(0, 0, 0, 0.75)',
                                                                            textShadowOffset: { width: -1, height: 1 },
                                                                            textShadowRadius: 10
                                                                        }}>
                                                                            {/* {store.textData.thirty_second_video_preview_text} */}
                                                                        </Text>
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
                                                                </>
                                                            </View>
                                                        </TouchableOpacity>
                                                    ) :
                                                        (<TouchableOpacity
                                                            style={{
                                                                height: Dimensions.get("window").height / 4,
                                                                width: Dimensions.get("window").width,
                                                                // alignItems: 'center',
                                                                justifyContent: 'center',
                                                                marginVertical: 5,
                                                                // paddingHorizontal: 40
                                                            }}
                                                            activeOpacity={1}
                                                            onPressOut={() => {
                                                                navigation.navigate("VideoPlayerScreen", {
                                                                    videoUrl: item.file_url,
                                                                });
                                                            }}
                                                        >
                                                            <ImageBackground
                                                                // source={video_thumb}
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
                                                                    }}></Text>
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
                                                        </TouchableOpacity>)}</>

                                                )}
                                            />
                                        )}

                                        {videos.length > 0 && (
                                            <View style={styles.cartView}>
                                                <TouchableOpacity
                                                    onPress={async () => {

                                                        var arr = videos[scrollRef.current.getCurrentIndex()].file_url.split('/');
                                                        console.log("video===", videos[scrollRef.current.getCurrentIndex()]);
                                                        const videoUrl = videos[scrollRef.current.getCurrentIndex()].file_url;
                                                        if (Platform.OS == 'ios') {
                                                            toastr.success('Video downloading started.');
                                                            RNFetchBlob
                                                                .config({
                                                                    fileCache: true,
                                                                    useDownloadManager: true,
                                                                    notification: true,
                                                                    mediaScannable: true,
                                                                    // path: RNFetchBlob.fs.dirs.DocumentDir + '/UEP/' + moment().unix() + '.mp4',
                                                                    // path: RNFetchBlob.fs.dirs.DocumentDir + '/UEP/' + moment().unix() + arr[arr.length - 1],
                                                                    path: RNFetchBlob.fs.dirs.DocumentDir + '/UEP/' + arr[arr.length - 1],
                                                                    appendExt: '.mp4'
                                                                })
                                                                .fetch('GET', videos[scrollRef.current.getCurrentIndex()].file_url, {
                                                                    //some headers ..
                                                                })


                                                                .then((res) => {
                                                                    const video = CameraRoll.save(res.data, 'video');
                                                                    console.log("res.data", res.data);
                                                                    // const video = CameraRoll.save(res.data, { album: "UEP" });
                                                                    setTimeout(() => {
                                                                        // RNFetchBlob.fs.writeFile(RNFetchBlob.fs.dirs.DocumentDir + '/UEP/' + moment().unix() + arr[arr.length - 1], res.data, 'base64');
                                                                        toastr.success(store.textData.dowload_successfully_text);
                                                                        saveFile(videos[scrollRef?.current?.getCurrentIndex()]?.id);
                                                                        console.log("file_id", videos[scrollRef?.current?.getCurrentIndex()]?.id);
                                                                        // RNFetchBlob.ios.openDocument(res.data);
                                                                        // RNFetchBlob.ios.openDocument(res.data);
                                                                    }, 1000);
                                                                })
                                                                .catch((err) => {
                                                                    // sendZip(videos[scrollRef.current.getCurrentIndex()].file_url);
                                                                    console.log("Error-----", err)
                                                                })
                                                        }
                                                        else {
                                                            try {
                                                                // const granted = await PermissionsAndroid.request(
                                                                //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                                                                //     {
                                                                //         title: "Storage Permission",
                                                                //         message:
                                                                //             "UEP App needs access to your files " +
                                                                //             "so you can save documents.",
                                                                //         buttonNeutral: "Ask Me Later",
                                                                //         buttonNegative: store.textData.cancel_text,
                                                                //         buttonPositive: store.textData.okay_text
                                                                //     }
                                                                // );
                                                                // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                                                toastr.success('Video downloading started.');
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
                                                                    .fetch('GET', videos[scrollRef?.current?.getCurrentIndex()]?.file_url, {
                                                                        //some headers ..
                                                                    })
                                                                    .then((res) => {
                                                                        setTimeout(() => {
                                                                            toastr.success(store.textData.dowload_successfully_text);
                                                                            saveFile(videos[scrollRef?.current?.getCurrentIndex()]?.id);
                                                                            console.log("res.data", videos[scrollRef?.current?.getCurrentIndex()]?.id);
                                                                        }, 1000);
                                                                    })
                                                                    .catch((err) => {
                                                                        // sendZip(videos[scrollRef.current.getCurrentIndex()].file_url);
                                                                        console.log("Error-----", err)
                                                                    })
                                                                // } else {
                                                                //     setTimeout(() => {
                                                                //         toastr.warning(store.textData.permission_denied_text);
                                                                //     }, 1000);
                                                                // }
                                                            } catch (err) {
                                                                setTimeout(() => {
                                                                    toastr.warning(store.textData.something_went_wrong_text);
                                                                }, 1000);
                                                            }
                                                        }

                                                    }}
                                                // onPress={() => {
                                                //     // const videoUrl = videos[scrollRef.current.getCurrentIndex()].file_url;
                                                //     // const destinationPath = `${RNFS.DocumentDirectoryPath}/UEP${moment().unix()}.mov`;
                                                //     // const destinationPath = `${RNFS.DocumentDirectoryPath} + '/UEP' + moment().unix() + '.mov' `;
                                                //     // path: RNFetchBlob.fs.dirs.DocumentDir + '/UEP/' + moment().unix() + '.mov',

                                                //     // downloadVideoFile(videoUrl, destinationPath)
                                                //     //     .then(filePath => {
                                                //     //         console.log('Video file downloaded:', filePath);
                                                //     //     })
                                                //     //     .catch(error => {
                                                //     //         console.error('Error downloading video file:', error);
                                                //     //     });
                                                //     // const videoUrl = videos[scrollRef.current.getCurrentIndex()].file_url;
                                                //     // const savePath = `${RNFS.DocumentDirectoryPath}/UEP${moment().unix()}.mp4`;
                                                //     const videoUrl = videos[scrollRef.current.getCurrentIndex()].file_url;
                                                //     const savePath = `${RNFS.DocumentDirectoryPath}/UEP${moment().unix()}.mp4`;
                                                //     const chunkSize = 10 * 1024 * 1024; // 10 MB
                                                //     downloadAndSaveVideo(videoUrl, savePath, chunkSize)
                                                //         .then((message) => {
                                                //             console.log(message);
                                                //             // Video downloaded successfully.
                                                //         })
                                                //         .catch((error) => {
                                                //             console.log(error);
                                                //             // Failed to download video.
                                                //         });
                                                //     // setTimeout(() => {
                                                //     //     downloadAndSaveVideo(videoUrl, savePath);
                                                //     // }, 0);

                                                //     // downloadAndSaveVideo(videoUrl, savePath);

                                                // }}
                                                >
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
                                                    const encodedUrl = encodeURIComponent(videos[scrollRef.current.getCurrentIndex()].file_url);
                                                    console.log("emailLarge screem==", encodedUrl);
                                                    if (Platform.OS == "ios") {
                                                        Linking.openURL('mailto:?subject=UEP Viewer: Download Purchased media&body=Please click on the link below to download purchased video file: ' + videos[scrollRef.current.getCurrentIndex()].file_url)
                                                    }
                                                    else {
                                                        Linking.openURL('mailto:?subject=UEP%20Viewer:%20Download%20Purchased%20media&body=Please click on the link below to download purchased video file:%0D%0A%0D%0A' + encodedUrl);
                                                    }
                                                }}>
                                                    <Image
                                                        source={require("../../assets/email.png")}
                                                        style={{
                                                            width: 31,
                                                            height: 20,
                                                            tintColor: "white",
                                                            marginLeft: 25
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={async () => {
                                                    try {
                                                        const result = await Share.share({
                                                            // message:
                                                            //     'Download video from link: ' + videos[scrollRef.current.getCurrentIndex()].file_url,
                                                            title: 'Share Video',
                                                            message: 'Download video from link: ' + videos[scrollRef.current.getCurrentIndex()].file_url,
                                                            url: videos[scrollRef.current.getCurrentIndex()].file_url
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
                                                        style={{
                                                            width: 24,
                                                            height: 26,
                                                            tintColor: "white",
                                                            marginLeft: 25,
                                                            marginRight: 30,
                                                            resizeMode: 'contain',
                                                            paddingVertical: '1%'
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        )}

                                        {(imagesData?.length > 0 || images1.length > 0) && (
                                            <View style={styles.favAndAddVideoToCartView}>
                                                {/* Fav View  */}
                                                <View style={videos?.length > 0 ? styles.favView : styles.favView1}>
                                                    <Checkbox
                                                        onPress={() => showFavouriteFun()}
                                                        colorScheme="pink"
                                                        isChecked={isFavourite}
                                                        accessibilityLabel="This is a dummy checkbox"
                                                        style={{ borderRadius: 0 }}
                                                    />
                                                    <TouchableOpacity
                                                        onPress={() => showFavouriteFun()}
                                                    >
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
                                            </View>
                                        )}
                                    </>
                                )}
                                renderItem={({ item, index }) => (
                                    <View style={{
                                        flex: 0.5,
                                    }}>
                                        <TouchableOpacity onPress={() => {
                                            var iIndex = index;
                                            // if (isFavourite) {
                                            //     for (var i = 0; i < images1.length; i++) {
                                            //         if (item.id == images1[i].id) {
                                            //             iIndex = i;
                                            //         }
                                            //     }
                                            // }
                                            // alert(JSON.stringify(imagesData.length))
                                            // alert(JSON.stringify(images1.length))
                                            const cred = event_mode_id === 1 ? {
                                                act_number: route.params.search_by,
                                                event_id: String(route.params.event_id)
                                            } :
                                                {
                                                    team_name: route.params.search_by,
                                                    event_id: String(route.params.event_id)
                                                }
                                            navigation.navigate("ViewImage", {
                                                imageUrl: item.file_url,
                                                fileName: item.file_name,
                                                eventID: event_id,
                                                flag: 'purchased',
                                                imageIndex: iIndex,
                                                event_mode_id: event_mode_id,
                                                videos: videos,
                                                search_by: route.params.search_by,
                                                imagesDataList: imagesData,
                                                event_name: subHeader,
                                                cred: cred,
                                                event_id: route.params.event_id,
                                                is_free,
                                            });
                                        }}
                                            style={{
                                                flex: 0.5, aspectRatio: 2 / 3, justifyContent: 'center',
                                                // marginVertical: 2,
                                                paddingLeft: index % 2 == 0 ? 0 : 4, paddingRight: index % 2 == 0 ? 4 : 0,
                                            }}
                                        >
                                            <LazyImage imgUrl={item.file_url} showWatermark={false} image_orientation={item.file_orientation} />
                                            <View style={{
                                                position: 'absolute',
                                                top: 4,
                                                width: '100%',
                                                flexDirection: 'row',
                                                left: index % 2 == 0 ? 0 : 4, right: index % 2 == 0 ? 4 : 0,
                                            }}>
                                                <View style={{ width: store.token == "" ? "100%" : "80%", alignItems: 'center', paddingTop: 2 }}>
                                                    <Text
                                                        style={{
                                                            fontSize: RFValue(12),
                                                            color: "white",
                                                            fontFamily: fonts.BebasNeueRegular,
                                                            marginLeft: 15
                                                        }}
                                                    >
                                                        {item.file_name}
                                                    </Text>
                                                </View>
                                                {store?.token != "" && (
                                                    <View style={{ width: '20%', alignItems: 'center', paddingTop: 5 }}>
                                                        {item.is_favourite == 0 && (
                                                            <TouchableOpacity onPress={() => addFavourite(item.file_id, item.file_name)}>
                                                                <Image
                                                                    style={{
                                                                        width: 25,
                                                                        height: 22,
                                                                        // paddingVertical: '1%'
                                                                        tintColor: "#FFF",
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
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 5, width: (Dimensions.get("window").width - 24) / 2 }}>
                                            <View style={{ width: '30%', alignItems: 'center', justifyContent: 'center' }} >
                                                <TouchableOpacity
                                                    onPress={async () => {
                                                        var arr = item.file_url.split('/');
                                                        if (Platform.OS == 'ios') {
                                                            RNFetchBlob
                                                                .config({
                                                                    fileCache: true,
                                                                    useDownloadManager: true,
                                                                    notification: true,
                                                                    mediaScannable: true,
                                                                    path: RNFetchBlob.fs.dirs.DocumentDir + '/UEP/' + moment().unix() + arr[arr.length - 1],
                                                                })
                                                                .fetch('GET', item.file_url, {
                                                                    //some headers ..
                                                                })
                                                                .then((res) => {
                                                                    const image = CameraRoll.save(res.data, 'photo');
                                                                    setTimeout(() => {
                                                                        // RNFetchBlob.fs.writeFile(RNFetchBlob.fs.dirs.DocumentDir + '/UEP/' + moment().unix() + arr[arr.length - 1], res.data, 'base64');
                                                                        toastr.success(store.textData.dowload_successfully_text);
                                                                        saveFile(item.file_id);
                                                                        // RNFetchBlob.ios.openDocument(res.data);
                                                                    }, 1000);
                                                                })
                                                        }
                                                        else {
                                                            try {
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
                                                                    .fetch('GET', item.file_url, {
                                                                        //some headers ..
                                                                    })

                                                                    .then((res) => {
                                                                        setTimeout(() => {
                                                                            toastr.success(store.textData.dowload_successfully_text);
                                                                            saveFile(item.file_id);
                                                                        }, 1000);
                                                                    })

                                                            } catch (err) {
                                                                setTimeout(() => {
                                                                    toastr.warning(store.textData.something_went_wrong_text);
                                                                }, 1000);
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <Image
                                                        source={require("../../assets/download.png")}
                                                        style={{
                                                            width: 26,
                                                            height: 20,
                                                            tintColor: "white"
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ width: '30%', alignItems: 'center', justifyContent: 'center' }} >
                                                <TouchableOpacity onPress={() => {
                                                    const encodedUrl = encodeURIComponent(item.file_url);
                                                    console.log("emailLarge screem==", encodedUrl);
                                                    if (Platform.OS == "ios") {
                                                        Linking.openURL('mailto:?subject=UEP Viewer: Download Purchased media&body=Please click on the link below to download purchased image file: ' + item.file_url)
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
                                            </View>
                                            <View style={{ width: '30%', alignItems: 'center', justifyContent: 'center' }} >
                                                <TouchableOpacity onPress={async () => {
                                                    try {
                                                        const result = await Share.share({
                                                            // message:
                                                            //     'Download video from link: ' + videos[scrollRef.current.getCurrentIndex()].file_url,
                                                            title: 'Share Image',
                                                            message: 'Download Image from link: ' + item.file_url,
                                                            url: item.file_url
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
                                                            width: 24,
                                                            height: 26,
                                                            tintColor: "white",
                                                            paddingVertical: '1%'
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                )}
                                onEndReached={() => {
                                    // if (!isFavourite) {
                                    // if (newImages.length >= 100) {
                                    // if (!onEndReachedCalledDuringMomentum) {
                                    // loadMore();
                                    // setOnEndReachedCalledDuringMomentum(true);
                                    // }
                                    // }
                                    // }
                                }}
                                numColumns={2}
                                keyExtractor={(item, index) => index.toString()}
                                contentContainerStyle={{ paddingBottom: 10, marginHorizontal: 10 }}
                            />
                        </View>
                        {imagesData.length > 0 && (
                            <TouchableOpacity onPress={() => {
                                sendZip("");
                            }} style={styles.bottomView} onLayout={(event) => {
                                var { x, y, width, height } = event.nativeEvent.layout;
                                setpHeight(height);
                            }} activeOpacity={1}>
                                <Text style={styles.quickBuyText}>
                                    {store.textData.email_link_for_all_photos_purchased_text}
                                </Text>
                            </TouchableOpacity>
                        )}
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
                            showButton={true}
                            title={store.textData.download_link_processing_text}
                            activeOpacity={1}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        />
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
            <View>
                {imageCount != 0 && dataLoaded && (
                    <Modal
                        style={{ margin: 0, paddingTop: 80 + INSEST.top, }}
                        animationType="slide"
                        transparent={true}
                        visible={visible}
                        onRequestClose={() => {
                            setVisible(false);
                        }}
                    >
                        <SafeAreaView style={{ flex: 1 }}>
                            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
                                {videos.length > 0 &&
                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                                            <Checkbox
                                                colorScheme="pink"
                                                onPress={() => overlayFunction()}
                                                isChecked={isPurchaseImage}
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
                                        {subHeader}
                                    </Text>
                                    <Text style={styles.headingText1} numberOfLines={1}>
                                        {route.params.search_by}
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
                                        <Text style={{
                                            color: "white", fontSize: 34, letterSpacing: 2,
                                            marginHorizontal: 0, textAlign: 'center', fontFamily: fonts.Farmhouse, top: "12%", marginRight: '5%'
                                        }}>
                                            {"TAP ON ANY THUMBNAIL\n TO ENLARGE & VIEW\n AVAILABLE PACKAGES"}</Text>
                                    </View> : null}


                                <View style={{ flex: 1, flexDirection: 'row', }}>
                                    <View
                                        style={
                                            imagesData[0]?.file_orientation === 'horizontal' && imagesData[0]?.is_team_potrait == 0 ?
                                                {
                                                    flex: 0.5, justifyContent: 'flex-start', marginVertical: 0, marginHorizontal: 10, paddingLeft: 0 % 2 == 0 ? 0 : 4, paddingRight: 0 % 2 == 0 ? 4 : 0, resizeMode: 'contain', marginTop: Platform.OS == "ios" ? videos.length > 0 ? "17%" : "11.5%" : videos.length > 0 ? "17.5%" : "12.3%",
                                                } :
                                                {
                                                    flex: 0.5, justifyContent: 'flex-start', marginVertical: 0, marginHorizontal: 10, paddingLeft: 0 % 2 == 0 ? 0 : 4, paddingRight: 0 % 2 == 0 ? 4 : 0, resizeMode: 'contain', marginTop: Platform.OS == "ios" ? videos.length > 0 ? "-3%" : "-8%" : videos.length > 0 ? "-3%" : "-7%", top: Platform.OS == "ios" ? imagesData[0]?.is_team_potrait == 1 ? "19.5%" : 0 : imagesData[0]?.is_team_potrait == 1 ? "20%" : 0,
                                                }
                                        }
                                    >

                                        <LazyImage imgUrl={imagesData[0]?.file_url} showWatermark={false} image_orientation={imagesData[0]?.file_orientation} />
                                    </View>
                                    {videos.length > 0 ?
                                        <View style={{ flex: 0.5, justifyContent: 'flex-start' }}>
                                            <Image source={require("../../assets/overlay/OverlayWithVideo.png")} style={{ width: '50%', height: '40%', resizeMode: 'contain', bottom: '5%' }} />
                                        </View> :
                                        <View style={{ flex: 0.5, justifyContent: 'flex-end' }}>
                                            <Image source={require("../../assets/overlay/OverlayNoVideo.png")} style={{ width: '50%', height: '45%', resizeMode: 'contain', bottom: Platform.OS == "android" ? '15%' : "18%" }} />
                                        </View>
                                    }
                                </View>

                                {videos.length <= 0 ?

                                    <View style={{ flex: 0.5, marginVertical: 0, alignItems: 'center', bottom: "3%", marginLeft: '2%' }}>
                                        <Text style={{ color: "white", fontFamily: 'BebasNeue-Regular', fontSize: 34, letterSpacing: 2, marginHorizontal: 20, textAlign: 'center', fontFamily: fonts.Farmhouse }}>{"TAP ON ANY THUMBNAIL\n TO ENLARGE & VIEW\n AVAILABLE PACKAGES"}</Text></View> : null}

                                {videos.length <= 0 &&
                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', paddingBottom: INSEST.bottom }}>
                                        <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center', }}>
                                            <Checkbox
                                                colorScheme="pink"
                                                onPress={() => overlayFunction()}
                                                isChecked={isPurchaseImage}
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
                        </SafeAreaView>
                    </Modal>
                )}
            </View>
        </SafeAreaView >
    );
};

export default PurchasedMediaHome;

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
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
        // backgroundColor: 'yellow',
        alignItems: "center",
    },
    gridView: {
        height: "92%",
    },
    imageGridView: {
        marginHorizontal: "1%",
        marginVertical: "2%",
        alignItems: "center",
        marginBottom: "15%",
    },
    imageItemView: {
        // height: (Dimensions.get("window").width / 2) * 1.5, //240
        // height: 222, //240
        aspectRatio: 2 / 3,
        width: (Dimensions.get("window").width - 24) / 2, //158
        // backgroundColor: 'red',
        justifyContent: 'center',
        marginRight: 4,
        marginVertical: 2
    },
    imageItemView1: {
        // height: (Dimensions.get("window").width / 2) * 1.5, //240
        // height: 222, //240
        aspectRatio: 2 / 3,
        width: (Dimensions.get("window").width - 24) / 2, //158
        // backgroundColor: 'green',
        justifyContent: 'center',
        marginLeft: 4,
        marginVertical: 2
    },
    imageStyle: {
        flex: 1,
        width: null,
        height: null,
    },
    favAndAddVideoToCartView: {
        flexDirection: "row",
        // marginHorizontal: "4%",
        // justifyContent: "center",
        // marginBottom: 5,
        alignItems: 'center',
        marginVertical: 5,
    },
    favView: {
        width: "60%",
        alignItems: "center",
        flexDirection: "row",
    },
    favView1: {
        width: "60%",
        alignItems: "center",
        flexDirection: "row",
        paddingVertical: 10
    },
    cartView: {
        flexDirection: "row",
        alignItems: "center",
        // backgroundColor: 'red',
        marginTop: 5,
        justifyContent: 'flex-end'
        // justifyContent: 'space-between'
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
        left: 10,
        zIndex: 2,
        // elevation: 999,
    },
    rightArrowImage: {
        width: 30,
        height: 30,
        tintColor: "white",
        position: 'absolute',
        right: 10,
        zIndex: 2,
        // elevation: 999,
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
        padding: 8,
    },
    headingView: {
        width: "80%",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: "15%"
    },
    headingText: {
        color: "white",
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
        backgroundColor: colors.uep_pink,
        // position: "absolute",
        // width: "100%",
        // // height: 60,
        // flexDirection: "row",
        // // paddingHorizontal: 40,
        // justifyContent: "center",
        // alignItems: "center",
        // paddingVertical: 15
        // bottom: 0,
        // backgroundColor: "#FFB31A",
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
        // height: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    quickBuyCartView: {
        justifyContent: "center",
        alignItems: "center",
    },
    quickBuyText: {
        fontFamily: fonts.BebasNeueRegular,
        fontSize: RFValue(20),
        color: '#FFF',
        textAlign: 'center'
    },
    quickBuyCartImage: {
        width: 35,
        height: 30,
    },
    originalImg: {
        width: 190,
        height: 150,
        transform: [{ rotate: `270deg` }, { scale: 1.5 }],
        resizeMode: 'contain',
    },
    originalImg1: {
        width: 190,
        height: 250,
        transform: [{ scale: 1 }],
        resizeMode: 'contain',

    },
    buttonContainer: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#FFFFFF',
        height: 45,
        width: 250,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: "1%",
        justifyContent: 'center'
    },
    buttonText1: {
        color: 'white',
        fontSize: 24,
        bottom: Platform.OS == "android" ? 2 : 0,
        fontFamily: fonts.BarlowCondensedSemiBoldItalic,
    },
    headingView1: {
        width: "80%",
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

});

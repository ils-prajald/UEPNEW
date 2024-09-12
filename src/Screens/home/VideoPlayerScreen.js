import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Platform,
    StatusBar,
    ActivityIndicator,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import Orientation, {
    useDeviceOrientationChange,
} from 'react-native-orientation-locker';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { PLAYER_STATES } from 'react-native-media-controls';
import WebView from 'react-native-webview';

const VideoPlayerScreen = ({ navigation, route }) => {
    const [pause, setPause] = useState(false)
    const [showcontrols, setShowcontrols] = useState(false)
    const [fullScreen, setFullScreen] = useState(false);
    const [orientation, setOrientation] = useState(false);
    const [showbtn, setShowbtn] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const [isBuffering, setIsBuffering] = useState(false);
    const videoPlayer = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [
        playerState, setPlayerState
    ] = useState(PLAYER_STATES.PLAYING);
    const [screenType, setScreenType] = useState('content');

    React.useEffect(() => {
        console.log('Video Url on play---', route.params.videoUrl);
        const uri = route.params.videoUrl
        const unsubscribe = navigation.addListener('focus', () => {
            setShowcontrols(true);
            setPause(false);
        });
        return unsubscribe;

    }, [navigation]);

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                setPause(true);
                setShowcontrols(false);
                Orientation.lockToPortrait();
            }
        }, [])
    );

    useDeviceOrientationChange((o) => {
        setOrientation(o);
        if (o == 'LANDSCAPE-LEFT') {
            Orientation.lockToLandscapeLeft();
            setFullScreen(true);
            StatusBar.setHidden(true);
        }
        else if (o == 'LANDSCAPE-RIGHT') {
            Orientation.lockToLandscapeRight();
            setFullScreen(true);
            StatusBar.setHidden(true);
        }
        else if (o == 'PORTRAIT') {
            Orientation.unlockAllOrientations();
            setFullScreen(false);
            StatusBar.setHidden(false);
        }
        else if (o == 'PORTRAIT-UPSIDEDOWN') {
            if (Platform.OS === 'ios') {
                Orientation.lockToAllOrientationsButUpsideDown();
                setFullScreen(false);
                StatusBar.setHidden(false);
            }
            else {
                Orientation.lockToPortraitUpsideDown();
                setFullScreen(false);
                StatusBar.setHidden(false);
            }
        }
        else {
            Orientation.unlockAllOrientations();
            setFullScreen(false);
            StatusBar.setHidden(false);
        }
    });

    const handleLoad = () => {
        setIsLoaded(true);
    };


    const onProgress = (data) => {
        // Video Player will progress continue even if it ends
        if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
            setCurrentTime(data.currentTime);
        }
    };

    const onLoad = (data) => {
        setDuration(data.duration);
        setIsLoading(false);
        setIsLoaded(true);
    };

    const onLoadStart = (data) => setIsLoading(true);
    const onBuffer = () => {
        setIsLoaded(false);
    }

    const onEnd = () => {
        setPlayerState(PLAYER_STATES.ENDED);
        navigation.goBack();
    };

    const onEndIos = () => {
        navigation.goBack();
    };




    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            <TouchableWithoutFeedback onPress={() => setShowbtn(!showbtn)} style={{ flex: 1 }}>
                <View style={styles.container}>
                    {showcontrols && (
                        <>
                            {/* {!isLoaded && (
                                <View style={{ position: 'absolute', zIndex: 999, elevation: 999, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                                    <ActivityIndicator size="large" color="#FFFFFF" />
                                </View>
                            )} */}
                            {Platform.OS === 'ios' ? (
                                <Video
                                    paused={pause}
                                    source={{ uri: route.params.videoUrl, type: 'mp4' }}
                                    ref={ref => (videoPlayer.current = ref)}
                                    style={fullScreen ? styles.fullscreenVideo : styles.video}
                                    controls={true}
                                    progressive={true}
                                    resizeMode={'contain'}
                                    ignoreSilentSwitch={"ignore"}
                                    onError={(error) => console.log("error----", error)}
                                    maxBitRate={2000000} // 2 megabits
                                    minLoadRetryCount={5} // retry 5 times
                                    onEnd={onEndIos}
                                    bufferConfig={{
                                        minBufferMs: 1000,
                                        maxBufferMs: 5000,
                                        bufferForPlaybackMs: 500,
                                        bufferForPlaybackAfterRebufferMs: 500
                                    }}
                                    onReadyForDisplay={handleLoad}

                                />
                            ) : (
                                <>
                                    {/* <Video
                                        paused={pause}
                                        source={{ uri: route.params.videoUrl, type: 'mp4' }}
                                        ref={ref => (videoPlayer.current = ref)}
                                        style={fullScreen ? styles.fullscreenVideo : styles.video}
                                        controls={true}
                                        resizeMode={'contain'}
                                        ignoreSilentSwitch={"ignore"}
                                        onError={(error) => console.log("error----", error)}
                                        onEnd={onEnd}
                                        onLoad={onLoad}
                                        onLoadStart={onLoadStart}
                                        onProgress={onProgress}
                                        onBuffer={(event) => console.log('buffer', event.isBuffering)}
                                    /> */}
                                    <WebView
                                        automaticallyAdjustContentInsets={true}
                                        androidLayerType={'hardware'}
                                        key={"video"}
                                        source={{
                                            html: `<html><body bgcolor="#000">
                                            <video width="100%" height="100%" controls autoplay>
                                            <source src=${route.params.videoUrl} type="video/mp4">
                                            Video is not supported.
                                            </video>
                                            </body></html>`
                                        }}
                                        style={{ height: 100, width: Dimensions.get('window').width, backgroundColor: '#000' }}
                                        scalesPageToFit={false}
                                        javaScriptEnabled
                                        allowsFullscreenVideo={true}
                                    />
                                    {/* {isBuffering && (
                                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                            <ActivityIndicator size="large" color="white" />
                                        </View>
                                    )} */}
                                </>
                            )}
                        </>
                    )}
                    {showbtn && (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.goBack();
                            }}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            style={styles.fullscreenButton}>
                            <Icon name="times" size={30} color="#FFF" />
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center'
    },
    video: {
        height: Dimensions.get('window').width * (9 / 16),
        width: Dimensions.get('window').width,
        backgroundColor: 'black',
        position: 'relative',
        zIndex: 1,
    },
    fullscreenVideo: {
        height: Dimensions.get('window').width,
        width: Dimensions.get('window').height,
        backgroundColor: 'black',
    },
    fullscreenVideo1: {
        height: Dimensions.get('window').width,
        width: Dimensions.get('window').height,
        backgroundColor: 'black',
        transform: [{ rotate: '180deg' }]
    },
    text: {
        marginTop: 30,
        marginHorizontal: 20,
        fontSize: 15,
        textAlign: 'justify',
    },
    fullscreenButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    controlOverlay: {
        bottom: 0,
        left: 0,
        justifyContent: 'space-between',
    },
    toolbar: {
        marginTop: 30,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
    },
    mediaPlayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'black',
        justifyContent: 'center',
    },
});

export default VideoPlayerScreen;
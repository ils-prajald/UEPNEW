import React, { useState } from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { store } from "../../store/Store";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Webview from 'react-native-webview'
//Components
import Header from "../../components/Header";

const Chat = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const ActivityIndicatorElement = () => {
        return (
            <View style={styles.loadingView}>
                <ActivityIndicator size="large" color="#EA377C" />
                <Text style={styles.loadingText}>{store.textData.loding_text}</Text>
            </View>
        );
    };

    return (
        <View style={styles.screen} >
            <SafeAreaView>
                <LinearGradient colors={["#393838", "#222222"]}>
                    <Header />
                    <Webview
                        style={{ flex: 1, opacity: 0.99, overflow: 'hidden' }}
                        source={{ uri: "https://static.zdassets.com/web_widget/latest/liveChat.html?v=10#key=uepinc.zendesk.com" }}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        renderLoading={ActivityIndicatorElement}
                        onLoad={() => setTimeout(() => {
                            setLoading(false)
                        }, 3000)} />
                    {loading ? <ActivityIndicatorElement /> : null}
                </LinearGradient>
            </SafeAreaView>
        </View>
    );
};

export default Chat;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#3F3F3F",
        alignItems: "center",
    },
    loadingView: {
        marginTop: 0,
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
    },
    loadingText: {
        marginVertical: 10,
        color: "gray",
    },
});


/* Crash issues solutions in android 
Solution 1
{ opacity: 0.99, overflow: 'hidden' } to the WebView style 

Solution 2
renderToHardwareTextureAndroid={true} to parent view 

Solution 3
androidHardwareAccelerationDisabled={true} to webview
*/
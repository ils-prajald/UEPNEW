import React, { Component } from 'react';
import { View, Image, Platform, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image'

export default class LazyImage extends Component {
    state = {
        loading: true,
    }
    render() {
        var image = this.state.loading ? require('../assets/loading.png') : { uri: this.props.imgUrl };
        return (
            <View>
                {Platform.OS == 'android' && (
                    <Image
                        source={image}
                        style={this.state.loading ? styles.placeholderImg : this.props.image_orientation == 'horizontal' ? styles.originalImg : styles.originalImg1}
                        onLoadEnd={e => this.setState({ loading: false })}
                    />
                )}
                {Platform.OS == 'ios' && (
                    <FastImage
                        source={image}
                        style={this.state.loading ? styles.placeholderImg : this.props.image_orientation == 'horizontal' ? styles.originalImg : styles.originalImg1}
                        // style={this.state.loading ? styles.placeholderImg : styles.originalImg}
                        onLoadEnd={e => this.setState({ loading: false })}
                        resizeMode={'contain'}
                    />
                )}
                {/* {this.props.showWatermark && (
                    <>
                        {!this.state.loading && (
                            <FastImage
                                source={{ uri: 'https://storage.googleapis.com/sa-uep-viewer-176-stg/users/watermark(1).png' }}
                                style={{
                                    aspectRatio: 3 / 2,
                                    transform: [{ rotate: `270deg` }, { scale: 1.5 }],
                                    resizeMode: 'contain',
                                    position: 'absolute',
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0
                                }}
                            />
                        )}
                    </>
                )} */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    placeholderImg: {
        height: 50,
        width: 60,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    originalImg: {
        aspectRatio: 3 / 2,
        transform: [{ rotate: `270deg` }, { scale: 1.5 }],
        resizeMode: 'contain',
    },
    originalImg1: {
        aspectRatio: 2 / 3,
        transform: [{ scale: 1 }],
        resizeMode: 'contain',
    }
})
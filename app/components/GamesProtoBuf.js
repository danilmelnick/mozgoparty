import React from 'react'
import {Text, View, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview';
export const GamesProtoBuf = ({jsonGames}) => {
    return(
        <WebView source={{ uri: `${jsonGames}` }} />
    )
}

export default GamesProtoBuf

const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'space-between',

        flexDirection : 'row',
        width : '100%',
        paddingHorizontal : 30
    }
})
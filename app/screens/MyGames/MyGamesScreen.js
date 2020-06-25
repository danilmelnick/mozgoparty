import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import { Header } from "react-native-elements";
import GameListItem from '../../components/GameListItem'

export  default class MyGamesScreen extends React.Component {

    render() {
        return(
            <SafeAreaView style={{backgroundColor : '#fff', height : '100%'}}>
                <Header
                    leftComponent={
                        <TouchableOpacity
                        style={{ marginLeft: 8 }}
                        onPress={() => this.props.navigation.openDrawer()}
                        >
                        <Image source={require("../../src/burgerMenu.png")} />
                        </TouchableOpacity>
                    }
                    
                    containerStyle={styles.header}
                />

                <Text
                    style={{
                        fontFamily: "Montserrat-Bold",
                        fontSize: 34,
                        marginLeft: 16
                    }}
                    >
                    Мои игры
                </Text>
            
                <GameListItem
                    press={() => this.props.navigation.navigate('LikeScreen')}
                />
                
            </SafeAreaView>
        )
    }

}

const styles = StyleSheet.create({
    container : {
        paddingHorizontal: 16
    },
    header: {
        backgroundColor: "#fff",
        borderBottomWidth: 0.4,
        paddingBottom: 0,
        borderBottomColor: "white",
        paddingTop: 0,
        height: 44
    },
})
import React, {Component} from 'react'
import {StyleSheet,TouchableOpacity, View, Image, Text} from 'react-native'
import { AsyncStorage } from 'react-native';

export default class Favorite extends Component {

    

    render(){

        const {image, rating, title,removeFav} = this.props

        return(
            <View style={styles.headerGames}>
                <TouchableOpacity 
                    style={{flexDirection: 'row'}}
                    onPress={()=>alert('sosi')}
                >
                <View
                    style={{width: '22.22%'}}
                >
                    <Image
                        source={{uri : `${image}`}}
                        style={styles.logo}
                    />
                </View>

                <View style={styles.FavGameInfoWrapper}>
                    <View
                        style={styles.FavGameRaiting}
                    >
                        <Image
                            source={require('../src/raitingStar.png')}
                            style={{
                            }}
                        >
                        </Image>
                        <Text style={styles.FavGameRaitingNum}>{rating}</Text>
                    </View>
                    <View style={styles.FavGameInfoTextLike}>
                        <Text style={styles.FavGameTitle}>{title}</Text>
                        <TouchableOpacity
                            onPress = {()=>removeFav()}
                            style={styles.LikeDisable}
                        >
                            <Image
                                    source={require('../src/likered.png')}
                                    style={{
                                    }}
                                >
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    headerGames : {
        flexDirection : 'row',
        justifyContent : 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.12)',
        paddingHorizontal: 16,
        paddingVertical: 11,
        backgroundColor: 'white',
        width: '100%'
    },
    logo: {
        width : '100%',
        height : 0,
        paddingBottom : '100%',
        borderRadius : 5
    },
    FavGameInfoWrapper : {
        paddingLeft: 8,
        width: '77.78%'
    },
    FavGameRaiting : {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 6
    },
    FavGameRaitingNum : {
        color: '#979797',
        fontSize: 10,
        paddingTop : 2,
        paddingHorizontal : 3, 
        lineHeight: 12,
        fontWeight :  'bold'
    },
    FavGameTitle : {
        color: '#333333',
        fontSize: 12,
        lineHeight: 15,
        fontWeight: 'bold'
    },
    FavGameInfoTextLike : {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    LikeDisable : {
        padding: 3,
        minWidth: 30
    }
})
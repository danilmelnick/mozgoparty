import React, { Component, useState } from 'react'
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native'

export default class CardItem extends Component {

    constructor(props){
        super(props)

        this.state = {
            like : false
        }
    }

    like(isLike = Boolean){
        if(isLike === true) {
            this.setState({like : false})
        } else {
            this.setState({like : true})
        }
    }

    handleLike(event){
        this.like(this.state.like)
        event()
    }

    render() {

        const {raiting,title,url,price, press, addFav} = this.props
        
        return (
            <View style={styles.cardItemWrapper}>
                <View style={styles.cardImageWrapper}>
                    
                    <TouchableOpacity
                        onPress={() => press()}
                    >
                        <>
                        <View style={{position : 'relative'}}>
                            <TouchableOpacity
                                onPress={() => this.handleLike(addFav)}
                                style={{top : 0, 
                                    right : 0,
                                    position : 'absolute',
                                    zIndex : 2,
                                    paddingHorizontal : 7,
                                    paddingVertical : 9
                                }}
                            >
                                <Image
                                    source = {this.state.like ? require('../src/like.png') : require('../src/defLike.png')}
                                    style={{
                                        width : 18,
                                        height : 16,
                                        
                                    }}
                                />
                            </TouchableOpacity>
                            <Image
                                source = {{uri: `${url}`}}
                                style={{
                                    width : "100%",
                                    height : 0,
                                    paddingBottom: '100%',
                                    borderTopLeftRadius: 4,
                                    borderTopRightRadius: 4,
                                }}
                            />
                        </View>
    
                        </>
                    </TouchableOpacity>
                    
                    
                </View>
                <View style={styles.cardItemDesc}>
                    <View style={styles.cardItemRaitingWrapper}>
                        <Text style={styles.cardItemRaiting}>{raiting}</Text>
                        <Text style={styles.cardItemStatus}>NEW!</Text>
                    </View>
                    <Text style={styles.cardItemTitle}>{title}</Text>
                    <Text style={styles.cardItemPrice}>{`${price} P`}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardItemWrapper : {
        width: '47%',
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        marginRight : '4.5%',
        elevation: 4,
    },
    cardImageWrapper : {
        width: '100%',
    },
    cardItemDesc : {
        paddingTop: 6,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    cardItemRaitingWrapper : {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardItemRaiting : {
        color: "#979797",
        fontSize: 10,
        lineHeight: 12,
    },
    cardItemStatus : {
        color: "#BD006C",
        fontSize: 10,
        lineHeight: 12,
        textTransform: 'uppercase',
    },
    cardItemTitle : {
        marginTop: 2,
        color: "#333333",
        fontSize: 12,
        lineHeight: 12,
        marginBottom: 8,
    },
    cardItemPrice : {
        color: "#BD006C",
        fontSize: 12,
        lineHeight : 15,
    },
})



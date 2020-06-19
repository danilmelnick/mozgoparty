import React, {Component} from 'react';
import { StyleSheet, Text, View, FlatList, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { CheckBox } from 'react-native-elements';
import {Button, Dialog, Colors, PanningProvider, Constants} from 'react-native-ui-lib';
import {Header} from 'react-native-elements'
import Icon from '../../components/Icon'
import { AsyncStorage } from 'react-native';


import CardItem from '../../components/CardItem'


export default class ShopScreen extends Component{

    constructor(props) {
        super(props)

        this.SCROLL_TYPE = {
            NONE: 'none',
            VERTICAL: 'vertical',
            HORIZONTAL: 'horizontal'
        };

        this.state = {
            data : [],
            panDirection: PanningProvider.Directions.UP,
            position: 'bottom',
            scroll: this.SCROLL_TYPE.NONE,
            showHeader: true,
            isRounded: true,
            showDialog: false,
            like : false,
            favGames : []
        }
    }

    addItemToFavorite = async (id) => {
        let arr = this.state.favGames
        arr.push(id)
        this.setState({favGames : arr})
        console.log(this.state.favGames)
        if(this.state.like === false) {
            await AsyncStorage.setItem('favArray', JSON.stringify(this.state.favGames))
            setTimeout(() => {
                console.log(AsyncStorage.getItem('favArray'))
            },1000)
        } else {
            console.log('remove Array' + arr)
        }
    }

    

    showDialog = () => {
        this.setState({showDialog: true});
    }

    hideDialog = () => {
        this.setState({showDialog: false});
    }

    renderContent = () => {
        return (
            <>
            
            <View style={styles.modalWrapper}>

                

                <Text style={{color : '#333333', fontSize : 14, fontWeight : 'bold'}}>Какие игры показать сначала?</Text>

                <CheckBox
                    left
                    iconRight
                    title={<Text style={styles.sort}>С высоким рейтингом </Text>}
                    checkedIcon={<Image source={require('../../src/check.png')} />}
                    uncheckedIcon={<Image source={require('../../src/check.png')} />}
                    checked={this.state.checked}
                    onPress={() => this.props.navigation.navigate('ShopCardStack')}
                />
                <CheckBox
                    left
                    iconRight
                    title={<Text style={styles.sort}>Новые</Text>}
                    checkedIcon={<Image source={require('../../src/sort.png')} />}
                    uncheckedIcon={<Image source={require('../../src/check.png')} />}
                    checked={this.state.checked}
                    onPress={() => this.props.navigation.navigate('MyGames')}
                />
                <CheckBox
                    left
                    iconRight
                    title={<Text style={styles.sort}>Старые</Text>}
                    checkedIcon={<Image source={require('../../src/check.png')} />}
                    uncheckedIcon={<Image source={require('../../src/check.png')} />}
                    checked={this.state.checked}
                    style={{backgroundColor : 'transparent'}}
                />

                <TouchableOpacity
                    style={styles.btnAuth}
                >
                    <Text style={{textAlign : 'center', color : '#fff', fontSize : 14}}>
                        ПОКАЗАТЬ
                    </Text>
                </TouchableOpacity>


            </View>
            </>
        )
    }

    getDialogKey = height => {
        const {position} = this.state;
        return `dialog-key-${position}-${height}`;
    }

    renderDialog = () => {
        const {
            showDialog,
            panDirection,
            position,
            scroll,
            showHeader,
            isRounded
        } = this.state;
        const renderPannableHeader = showHeader
            ? this.renderPannableHeader
            : undefined;
        const height = scroll !== this.SCROLL_TYPE.NONE
            ? '70%'
            : undefined;

        return (
            <Dialog
                migrate
                useSafeArea
                key={this.getDialogKey(height)}
                top={position === 'top'}
                bottom={position === 'bottom'}
                height={height}
                panDirection={panDirection}
                containerStyle={isRounded
                ? styles.roundedDialog
                : styles.dialog}
                visible={showDialog}
                onDismiss={this.hideDialog}
                renderPannableHeader={renderPannableHeader}
                pannableHeaderProps={this.pannableTitle}
                supportedOrientations={this.supportedOrientations}>
                {this.renderContent()}
            </Dialog>
        );
    }

    getGamesData = async token => {
        try {
            const response = await fetch('https://api.party.mozgo.com/api/games', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization': 'Bearer ' + token
              }
            });
            const json = await response.json();
            this.setState({data : json})
            console.log('Успех:', JSON.stringify(json));
          } catch (error) {
            console.error('Ошибка:', error);
        }
    }
    
    async componentDidMount(){
        const token = await AsyncStorage.getItem('userToken');
        await this.getGamesData(token)
        await AsyncStorage.setItem('cardGames', [1])
    }

    render() {

        return (
        
            <SafeAreaView style={styles.container}>

                <Header
                    leftComponent={
                        <Icon
                            src={require('../../src/shape.png')}
                            press={() => this.props.navigation.openDrawer()}
                        />
                    }
                    centerComponent={{ text: 'MozgoParty', style: { color: '#000', fontSize : 18 } }}
                    containerStyle={styles.header}
                />

                <CheckBox
                    right
                    checkedIcon={<Image source={require('../../src/sort.png')} />}
                    uncheckedIcon={<Image source={require('../../src/sort.png')} />}
                    onPress={() => this.showDialog()}
                />

                {this.renderDialog()}

                <View style={styles.shopContainer} >

                    <FlatList
                        data={this.state.data}
                        numColumns={2}
                        renderItem={({ item }) => 
                            <CardItem
                                raiting={item.rating}
                                title={item.party.name}
                                url={item.media.avatar}
                                addFav={() => this.addItemToFavorite(item.id)}
                                like={this.state.like}
                                price={item.party.price}
                                press={() => this.props.navigation.navigate('CardGameScreen', {
                                    title : item.party.name,
                                    image : item.media.avatar,
                                    description : item.description,
                                    age_rating : item.age_rating,
                                    price : item.party.price,
                                    id : item.id
                                })}
                            />
                        }
                        keyExtractor={item => item.id}
                        contentContainerStyle={{margin: 1}}
                    />

                </View>

            </SafeAreaView>
        
        )

    }

}

const styles = StyleSheet.create({
    container : {
        // paddingHorizontal : 16,
        // paddingVertical : 16
    },
    sort : {
        fontSize : 12,
        color : '#333333',
        fontWeight : '100',
        marginRight : 10
    },  
    btnAuth : {
        marginTop : 10,
        backgroundColor : '#0B2A5B',
        padding : 16,
        borderRadius : 5
    },
    shopContainer : {
        marginTop : 3,
        paddingHorizontal : 16,
        height : '100%'
    },
    listChatWrapper: {
        width: '100%',
        alignItems: 'center',
        flex: 1,
        paddingTop: 25
    },
    searchChanel: {
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 30,
        padding: 0,
        paddingLeft: 5,
        paddingRight: 5,
        width: '70%',
        textAlign: 'center',
        marginBottom: 25
    },
    dialog: {
        backgroundColor: Colors.white
    },
    roundedDialog: {
        backgroundColor: Colors.white,
        marginBottom: Constants.isIphoneX
            ? 0
            : 20,
        borderRadius: 12
    },
    button: {
        margin: 5,
        alignSelf: 'flex-start'
    },
    verticalScroll: {
        marginTop: 20
    },
    horizontalTextContainer: {
        alignSelf: 'center',
        position: 'absolute',
        top: 10
    },
    modalButton: {
        backgroundColor: 'transparent',
        justifyContent: 'flex-start'
    },
    modalWrapper: {
        padding: 10
    },
    buttonTitle: {
        marginLeft: 10,
        fontSize: 16
    },
    header:{
        backgroundColor: '#fff',
        borderBottomWidth : 0.4,
        paddingBottom : 0,
        borderBottomColor : '#000',
        paddingTop : 0,
        height : 60
    },
})
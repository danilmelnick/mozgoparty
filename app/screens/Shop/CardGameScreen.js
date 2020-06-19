import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { AsyncStorage } from 'react-native';

export default class CardGameScreen  extends Component{

    constructor(){
        super()

        this.state = {
            addGames : false,
            cardGames: []
        }
    } 


    addItemToCard = async (id) => {
        this.setState({addGames : true})
        let arrGames = AsyncStorage.getItem('cardGames')
            .then(res => JSON.parse(res))
        console.log(arrGames)
        // arr.push(id)
        // this.setState({favGames : arr})
        // console.log(this.state.favGames)
        // if(this.state.like === false) {
        //     await AsyncStorage.setItem('favArray', JSON.stringify(this.state.favGames))
        //     setTimeout(() => {
        //         console.log(AsyncStorage.getItem('favArray'))
        //     },1000)
        // } else {
        //     console.log('remove Array' + arr)
        // }
    }
    
    renderFootBtn(){
        if(this.state.addGames === false) {
            return null
        }
        return(
            <TouchableOpacity
            style={styles.btnAuth2}
            onPress={() => this.props.navigation.navigate('BusketScreen')}
        >
            <Text style={{textAlign : 'left', color : '#fff', fontSize : 14}}>
                КОРЗИНА
            </Text>
        </TouchableOpacity>
        )
    }
  render() {

    const navigationProps = this.props.navigation.state.params;

    

    return (
      
      <View style={styles.container}>

        <View style={styles.headerGames}>
            <Image
                source={{uri : navigationProps.image}}
                style={styles.logo}
            />

            <Text style={{color : "#333333", fontSize : 18, fontWeight : 'bold'}}>{navigationProps.title}</Text>
        </View>

        <View style={styles.aboutGame}>

            <Text style={{color : "#BD006C", fontSize : 12, fontWeight : 'bold', marginRight : 24}}>{`${navigationProps.price} ₽`}</Text>

            <Text style={{color : "#333", fontSize : 12, fontWeight : 'bold', marginRight : 24}}>122 Мб</Text>

            <Text style={{color : "#333", fontSize : 12, fontWeight : 'bold', marginRight : 24}}>{navigationProps.age_rating}</Text>

            <TouchableOpacity
                style={{flexDirection : 'row', alignItems : 'center'}}
            >
                <Image
                    source={require('../../src/like.png')}
                    style={
                        {
                            width : 20.5,
                            height : 18,
                            marginRight : 5
                        }
                    }
                />
                <Text>В избранное</Text>
            </TouchableOpacity>
        </View>
            

        <TouchableOpacity
            style={styles.btnAuth}
            onPress={() => this.addItemToCard(navigationProps.id)}
        >
            <Text style={{textAlign : 'center', color : '#fff', fontSize : 14}}>
                ДОБАВИТЬ В КОРЗИНУ
            </Text>
        </TouchableOpacity>

        <View style={styles.description}>
            <Text style={{fontSize : 14, fontWeight : 'bold', marginBottom : 10}}>Описание</Text>
            <Text style={{fontSize : 12, fontWeight : '200', marginBottom : 10}}>
                {navigationProps.description}
            </Text>
            <TouchableOpacity
                style={styles.categor}
            >
                <Text style={{textAlign : 'center', color : '#333333', fontSize : 12}}>
                    Топ-5
                </Text>
            </TouchableOpacity>
        </View>

        {this.renderFootBtn()}
      </View>
     
    )

  }

}

const styles = StyleSheet.create({
    container : {
        paddingHorizontal : 16,
        paddingVertical : 16,
        height : '100%'
    },
    logo: {
        width : 94,
        height : 94,
        borderRadius : 5,
        marginRight : 10
    },
    btnAuth : {
        backgroundColor : '#0B2A5B',
        padding : 16,
        borderRadius : 5
    },
    headerGames : {
        flexDirection : 'row',
        justifyContent : 'flex-start',
        alignItems : 'center'
    },
    aboutGame : {
        marginVertical : 30,
        flexDirection : 'row',
        justifyContent : 'flex-start',
        alignItems : 'center',

    },
    categor : {
        backgroundColor : 'rgba(255, 206, 66, 0.5)',
        width : 60,
        padding : 6,
        borderRadius : 24
    },
    description : {
        marginVertical : 30
    },
    btnAuth2 :{
        backgroundColor : '#0B2A5B',
        padding : 16,
        borderRadius : 5,
        textAlign : 'left',
        position : 'absolute',
        left : 18,
         right : 18,
        bottom : 20
    }
})
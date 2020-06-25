import React, {Component} from 'react';
import { StyleSheet, Text, View, SafeAreaView , TouchableOpacity, Image } from 'react-native';
import { AsyncStorage } from 'react-native';
import { Header } from "react-native-elements";

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
        this.renderFootBtn()
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
        <SafeAreaView>
        <Header
          leftComponent={
            <TouchableOpacity
              style={{ marginLeft: 8 }}
              onPress={() => this.props.navigation.goBack()}
            >
              <Image source={require("../../src/back.png")} />
            </TouchableOpacity>
          }
          
          containerStyle={styles.header}
        />

      <SafeAreaView style={styles.container}>

      

        <View style={styles.headerGames}>
            <Image
                source={{uri : navigationProps.image}}
                style={styles.logo}
            />
          <View style={{width : '60%'}}>
            <View style={{flexDirection : 'row', marginBottom : 4}}>
                <Image
                    source={require('../../src/rating.png')}
                    style={{width : 13.33, height: 13.33}}
                />
                <Text style={styles.rating}>4.3</Text>
            </View>
            <Text style={styles.title}>{navigationProps.title}</Text>

          </View>
        </View>

        <View style={styles.aboutGame}>

            <Text style={{color : "#BD006C",fontFamily: "Montserrat-Regular", fontSize : 12, fontWeight : '600',  marginRight : 24}}>{navigationProps.price + ' '  + navigationProps.currency}</Text>

            <Text style={{color : "#333",fontFamily: "Montserrat-Regular", fontSize : 12, fontWeight : '600', marginRight : 24}}>122 Мб</Text>

            <Text style={{color : "#333",fontFamily: "Montserrat-Regular", fontSize : 12, fontWeight : '600', marginRight : 24}}>{navigationProps.age_rating + '+'}</Text>

            {/* <TouchableOpacity
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
            </TouchableOpacity> */}
        </View>
            

        <TouchableOpacity
            style={styles.btnAuth}
            onPress={() => this.addItemToCard(navigationProps.id)}
        >
            <Text style={{textAlign : 'center',textTransform : 'none' , color : '#fff',fontFamily: "Montserrat-Regular", fontSize : 17}}>
                {! this.state.addGames ? 'Добавить в корзину' : 'В корзине'}
            </Text>
        </TouchableOpacity>

        <View style={styles.description}>
            <Text style={{fontSize : 14, fontWeight : '600', marginBottom : 10, fontFamily: "Montserrat-Regular",}}>Описание</Text>
            <Text style={{fontSize : 12, fontWeight : 'normal', marginBottom : 10, fontFamily: "Montserrat-Regular",}}>
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
        
      </SafeAreaView>
      {this.renderFootBtn()}
      </SafeAreaView>
    )

  }

}

const styles = StyleSheet.create({
    container : {
        paddingHorizontal : 16,
        paddingVertical : 22,
        height : '95%',
        backgroundColor : '#fff'
    },
    title : {
        color : "#333333", fontSize : 18, fontWeight : '600', 
        fontFamily: "Montserrat-Regular",
        lineHeight : 18
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
        alignItems : 'flex-start',
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
        marginVertical : 30,
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
    },
    header: {
        backgroundColor: "#fff",
        borderBottomWidth: 0.4,
        paddingBottom: 0,
        borderBottomColor: "white",
        paddingTop: 0,
        height: 44
    },
    rating : {
        color : "#979797", fontSize : 12, fontWeight : '600', 
        fontFamily: "Montserrat-Regular",
        alignItems : 'center',

    }
})
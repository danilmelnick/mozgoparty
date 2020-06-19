import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';


export default class BusketScreen  extends Component{

  render() {

    return (
      
      <View style={styles.container}>

        <View style={styles.headerGames}>

            <TouchableOpacity style={{flexDirection: 'row', marginBottom : 15}}>
                <Image
                    source={require('../../src/game.png')}
                    style={styles.logo}
                />
                <View style={{width : '80%'}}>
                    <Text style={{color : "#333", fontSize : 12, fontWeight : 'bold', marginRight : 24}}>4.8</Text>


                    <Text style={{color : "#333333", fontSize : 18, fontWeight : 'bold'}}>Кино и Музыка. Эпоха  VHS</Text>
            
                    <Text style={{color : "#BD006C", fontSize : 12, fontWeight : 'bold', marginRight : 24}}>300 ₽</Text>
                </View>
            </TouchableOpacity>


        </View>

        <View style={styles.headerGames}>

            <TouchableOpacity style={{flexDirection: 'row', marginBottom : 15}}>
                <Image
                    source={require('../../src/game.png')}
                    style={styles.logo}
                />
                <View style={{width : '80%'}}>
                    <Text style={{color : "#333", fontSize : 12, fontWeight : 'bold', marginRight : 24}}>4.8</Text>


                    <Text style={{color : "#333333", fontSize : 18, fontWeight : 'bold'}}>Кино и Музыка. Эпоха  VHS</Text>
            
                    <Text style={{color : "#BD006C", fontSize : 12, fontWeight : 'bold', marginRight : 24}}>300 ₽</Text>
                </View>
            </TouchableOpacity>

            

        </View>


        <Text style={{fontSize : 12, fontWeight : 'bold', marginBottom: 16}}>Итого: </Text>
        <View style={styles.isues}>
            <View style={{justifyContent : 'space-between', flexDirection : 'row', width : '100%'}}>
                <Text>Игры (× 2)</Text>
                <Text>600 ₽</Text>
            </View>
        </View>
        <View style={styles.isues}>
            <View style={{justifyContent : 'space-between', flexDirection : 'row', width : '100%'}}>
                <Text style={{fontWeight : '100'}}>Скидка</Text>
                <Text>0 ₽</Text>
            </View>
        </View>
            

        <View style={{flexDirection : 'row', alignItems : 'center', position : 'absolute', bottom : 15, left : 16, right :16}}>
            <Text style={{width : '50%', fontSize : 12, fontWeight : 'bold'}}>К оплате: 600 ₽</Text>
            <TouchableOpacity
                style={styles.btnAuths}
            >
                <Text style={{textAlign : 'center', color : '#fff', fontSize : 14}}>
                    Оплатить
                </Text>
            </TouchableOpacity>
        </View>

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
    btnAuths : {
        backgroundColor : '#0B2A5B',
        padding : 16,
        borderRadius : 5,
        width : '50%'
    },
    headerGames : {
        flexDirection : 'row',
        justifyContent : 'flex-start',
        alignItems :'flex-start'
    },
    
    isues : {
        flexDirection : 'row',
        
    },
})
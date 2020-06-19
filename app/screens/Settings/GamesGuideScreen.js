import React from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native'

class GamesGuideScreen extends React.Component {

    render () {

        return(
            <View style={styles.container}>
                <TouchableOpacity>
                    <Text style={{fontSize : 16, fontWeight : 'bold', paddingVertical : 20}}>Особенности игры</Text>
                </TouchableOpacity>
                <View style={styles.guideWrapper}>
                    <View style={{marginRight:5, width : '5%'}}><View style={{width: 12,
   height: 12,
   borderRadius: 12/2, backgroundColor : 'red'}}></View></View>
                    <Text style={{width : '92%'}}>Каждая игра имеет 3 запуска. Выход
из приложения в момент игры считается потраченным запуском. Пауза игры без выхода из приложения не считается отдельно потраченным запуском. После третьего запуска игра становится недоступна.</Text>
                </View>
                <View style={styles.guideWrapper}>
                    <View style={{marginRight:5, width : '5%'}}><View style={{width: 12,
   height: 12,
   borderRadius: 12/2, backgroundColor : 'blue'}}></View></View>
                    <Text style={{width : '92%'}}>Каждая игра имеет 3 запуска. Выход
из приложения в момент игры считается потраченным запуском. Пауза игры без выхода из приложения не считается отдельно потраченным запуском. После третьего запуска игра становится недоступна.</Text>
                </View>
                <View style={styles.guideWrapper}>
                    <View style={{marginRight:5, width : '5%'}}><View style={{width: 12,
   height: 12,
   borderRadius: 12/2, backgroundColor : 'black'}}></View></View>
                    <Text style={{width : '92%'}}>Каждая игра имеет 3 запуска. Выход
из приложения в момент игры считается потраченным запуском. Пауза игры без выхода из приложения не считается отдельно потраченным запуском. После третьего запуска игра становится недоступна.</Text>
                </View>
                <View style={styles.guideWrapper}>
                    <View style={{marginRight:5, width : '5%'}}><View style={{width: 12,
   height: 12,
   borderRadius: 12/2, backgroundColor : 'grey '}}></View></View>
                    <Text style={{width : '92%'}}>Каждая игра имеет 3 запуска. Выход
из приложения в момент игры считается потраченным запуском. Пауза игры без выхода из приложения не считается отдельно потраченным запуском. После третьего запуска игра становится недоступна.</Text>
                </View>
                <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Profile')}
                        style={{marginTop : 30}}
                    >
                    <Text>Profile</Text>
                </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('GameProgressScreen')}
                        style={{marginTop : 30}}
                    >
                        <Text>GameProgressScreen</Text>
                    </TouchableOpacity>
            </View>
        )

    }

}

export default GamesGuideScreen

const styles = StyleSheet.create({
    container : {
        paddingHorizontal : 16,
        marginVertical : 20
    },
    guideWrapper : {
        flexDirection : 'row',
        width: '100%',
        marginBottom : 20
    }
})

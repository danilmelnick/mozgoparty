import React from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native'

class SettingsScreen extends React.Component {

    render () {

        return(
            <View style={styles.container}>
                <TouchableOpacity>
                    <Text style={{fontSize : 16, fontWeight : 'bold', paddingVertical : 20}}>Пользовательское соглашение</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={{fontSize : 16, fontWeight : 'bold', paddingVertical : 20}}>Политика конфиденциальности</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('GamesGuideScreen')}
                    style={{marginTop : 30}}
                >
                    <Text>GamesGuideScreen</Text>
                </TouchableOpacity>
            </View>
        )

    }

}

export default SettingsScreen

const styles = StyleSheet.create({
    container : {
        paddingHorizontal : 16,
        marginVertical : 20
    },
    header : {
        paddingVertical : 28,
        borderBottomWidth : 1,
        borderBottomColor : '#333'
    }, 
    headerText : {
        fontSize : 14,
        fontWeight : 'bold'
    },
    content : {
        paddingVertical : 20,
    }
})
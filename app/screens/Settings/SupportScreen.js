import React from 'react'
import {StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

class SupportScreen extends React.Component {

    render () {

        return(
            <View style={styles.container}>
                <Text style={{fontSize : 16, fontWeight : 'bold', paddingVertical : 20}}>Запрос в тех. поддержку</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => text}
                    placeholder='Описать подробнее'
                />
                <DropDownPicker
                    items={[
                        {label: 'Выберите причину', value: 'item1'},
                        {label: 'Сбой в приложении', value: 'item2'},
                        {label: 'Ошибка при загрузке игры', value: 'item3'},
                        {label: 'Ошибка воспроизведения игры', value: 'item4'},
                    ]}
                    defaultValue="item1"
                    containerStyle={{height: 45}}
                    onChangeItem={item => console.log(item.label, item.value)}
                    style={styles.dropdownWrapper}
                    dropDownStyle={styles.itemContent}
                />

                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('SettingsScreen')}
                    style={{marginTop : 30}}
                >
                    <Text>SettingsScreen</Text>
                </TouchableOpacity>
            </View>
        )

    }

}

export default SupportScreen

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
    },
    dropdownWrapper : {
        borderWidth : 0,
        backgroundColor : 'transparent',
        borderBottomWidth : 1,
    },
    itemContent : {
        borderWidth : 0,
        backgroundColor : 'transparent',
        borderBottomColor : '#333', 
        borderWidth : 1,
        borderColor : 'rgba(0, 0, 0, 0.24)'
    },
    input : { 
        height: 40, 
        borderColor: 'gray', 
        borderWidth: 1 ,
        marginBottom : 20,
        borderWidth : 0,
        borderBottomWidth : 1,
        borderBottomColor : '#333'
    }
})
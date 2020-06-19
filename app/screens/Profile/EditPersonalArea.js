import React from "react";
import {View, Image, Text, StyleSheet, TouchableOpacity, TextInput} from "react-native";
import ImagePicker from 'react-native-image-picker';
import {Dialog, Colors} from 'react-native-ui-lib';

export class EditPersonalArea extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            name: null,
            phone: null,
            email: null,
            photo: true
        }

        this.SCROLL_TYPE = {
            NONE: 'none',
            VERTICAL: 'vertical',
            HORIZONTAL: 'horizontal'
        };
    }

    getDialogKey = height => {
        const {position} = this.state;
        return `dialog-key-${position}-${height}`;
    }


    showDialog = () => {
        this.setState({showDialog: true});
    }

    hideDialog = () => {
        this.setState({showDialog: false});
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
            ? '30%'
            : undefined;

        return (
            <Dialog
                migrate
                useSafeArea
                key={this.getDialogKey(height)}
                bottom='0'
                height={this.state.photo ? '30%' : '24%'}
                width='100%'
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

    renderContent = () => {
        return (
            <View style={styles.modalWrapper}>

                <Text style={{color : '#333333', fontSize : 14, paddingVertical: 12, fontWeight : 'bold'}}>Выбрать фото</Text>
                <TouchableOpacity
                    onPress={()=>{}}
                    activeOpacity={0.9}
                >
                    <Text style={{color : '#333333', fontSize : 12,paddingVertical: 12, fontWeight : 'normal'}}>Загрузить из галереи</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=>{}}
                    activeOpacity={0.9}
                >
                    <Text style={{color : '#333333', fontSize : 12, paddingVertical: 12, fontWeight : 'normal'}}>Сделать снимок</Text>
                </TouchableOpacity>
                {this.state.photo
                    ?
                    <TouchableOpacity
                        onPress={()=>{}}
                        activeOpacity={0.9}
                    >
                        <Text style={{color : '#ED1C24', fontSize : 12, paddingVertical: 12, fontWeight : 'normal'}}>Удалить фото</Text>
                    </TouchableOpacity>
                    :
                    console.log('санчи')
                }

            </View>
        )
    }

    render(){
        return(
            <View style={styles.PersonalAreaWrapper}>
                <View style={styles.PersonAvatarImage}>
                    <Image
                        source = {this.state.photo ? require('../../src/PersonAvatar.png') : require('../../src/DefaultAvatar.png')}
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            marginBottom: 29
                        }}
                    />
                    {this.renderDialog()}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() =>this.showDialog()}
                        style={styles.PersonalActionButton}
                    >
                        <View
                            style={styles.EditAvatarIcon}
                        >
                            <Image
                                source = {require('../../src/avatarEdit.png')}
                                style={{
                                    width: 12,
                                    height: 12
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.PersonInfoWrapper}>
                    <Text style={styles.PersonInfoTitle}>Имя и фамилия</Text>
                    <TextInput
                        style={styles.PersonInfoDesc}
                        placeholder={'Василий Петечкин'}
                        defaultValue={'Василий Петечкин'}
                    />
                </View>
                <View style={styles.PersonInfoWrapper}>
                    <Text style={styles.PersonInfoTitle}>Номер телефона</Text>
                    <TextInput
                        style={styles.PersonInfoDesc}
                        keyboardType={'number-pad'}
                        placeholder={'+7 (992) 020-02-20'}
                        defaultValue={'+7 (992) 020-02-20'}
                    />
                </View>
                <View style={styles.PersonInfoWrapper}>
                    <Text style={styles.PersonInfoTitle}>E-mail</Text>
                    <TextInput
                        style={styles.PersonInfoDesc}
                        placeholder={'vasyapetechkin@gmail.com'}
                        defaultValue={'vasyapetechkin@gmail.com'}
                    />
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    PersonalAreaWrapper : {
        paddingTop: 24,
        paddingHorizontal: 16,
        paddingBottom: 24,

    },
    PersonAvatarImage : {
        position: 'relative',
        width: 80,
        height: 80,
        marginBottom: 30
    },
    PersonalActionButton : {
        position: 'absolute',
        bottom: 0,
        right: 0
    },
    EditAvatarIcon : {
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 12,
      shadowColor: "rgba(0, 0, 0, 0.08)",
      shadowOffset: {
          width: 0,
          height: 0,
      },
      shadowOpacity: 0.36,
      shadowRadius: 6.68,
       elevation: 11,
    },
    PersonInfoWrapper: {
        marginBottom: 30
    },
    PersonInfoTitle : {
        paddingHorizontal: 12,
        color: '#979797',
        fontSize: 12,
        lineHeight: 16,
    },
    PersonInfoDesc : {
        paddingHorizontal: 12,
        color: '#333333',
        fontSize: 16,
        lineHeight: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#000'
    },
    dialog: {
        backgroundColor: Colors.white
    },
    modalWrapper: {
        padding: 16,
        width: '100%'
    },
})

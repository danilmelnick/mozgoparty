import React from "react";
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from "react-native";

export class ChangePass extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            stateStyle: 'styles.ChangePassDecorText',
            active: 'ChangePassDecorTextActive',
            actives:false,
            oldPass:'',
            newPass:'',
            repeatPass:'',
            oldPass1:'Текущий пароль',
            newPass1:'Новый пароль',
            repeatPass1:'Повторите пароль'
        }
    }
    startEdit(val, id){
        if(this.state.actives){
            return val
        } return ''
    }
    endEdit(val){
        if(val.length <= 0){
            return this.setState({actives:false})
        } return ''
    }
    render(){
        return(
            <View style={styles.ChangePassWrapper}>
                <View style={styles.ChangePassInputWrapper}>
                    <Text style={styles.ChangePassDecorTextActive}>{this.startEdit(this.state.oldPass1, 1)}</Text>
                    <TextInput
                        style={styles.PassInput}
                        secureTextEntry={true}
                        value={this.state.oldPass}
                        onChangeText={text => this.setState({oldPass : text})}
                        placeholder={this.state.oldPass1}
                        onEndEditing={()=>this.endEdit(this.state.oldPass)}
                        onFocus={()=> this.setState({actives:true})}

                    />
                </View>
                <View style={styles.ChangePassInputWrapper}>
                    <Text style={styles.ChangePassDecorTextActive}>{this.startEdit(this.state.newPass1, 2)}</Text>
                    <TextInput
                        style={styles.PassInput}
                        secureTextEntry={true}
                        value={this.state.newPass}
                        onChangeText={text => this.setState({newPass : text})}
                        placeholder={this.state.newPass1}
                        onEndEditing={()=>this.endEdit(this.state.newPass)}
                        onFocus={()=> this.setState({actives:true})}

                    />
                </View>
                <View style={styles.ChangePassInputWrapper}>
                    <Text style={styles.ChangePassDecorTextActive}>{this.startEdit(this.state.repeatPass1, 3)}</Text>
                    <TextInput
                        style={styles.PassInput}
                        secureTextEntry={true}
                        value={this.state.repeatPass}
                        onChangeText={text => this.setState({repeatPass : text})}
                        placeholder={this.state.repeatPass1}
                        onEndEditing={()=>this.endEdit(this.state.repeatPass)}
                        onFocus={()=> this.setState({actives:true})}

                    />
                </View>
                <View style={styles.ForgotPassWrapper}>
                    <TouchableOpacity
                        onPress={()=>{}}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.ForgotPassText}>Забыли пароль?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ChangePassWrapper : {
        paddingHorizontal: 16,
        paddingVertical: 29
    },
    ChangePassInputWrapper : {
        position: 'relative',
        marginBottom: 30,
        justifyContent: 'flex-end'
    },
    ChangePassDecorText : {
        fontSize: 16,
        lineHeight: 24,
        color: '#979797',
        position: 'absolute',
        top: 19,
        left: 12,
    },
    ChangePassDecorTextActive : {
        top: 0,
        fontSize: 12,
        lineHeight: 16,
    },
    PassInput : {
        paddingHorizontal: 12,
        paddingTop: 19,
        paddingBottom: 6,
        borderBottomWidth: 1,
        fontSize: 16,
        lineHeight: 24,
        color: '#333333',
        borderBottomColor: 'rgba(0, 0, 0, 0.38)'
    },
    ForgotPassWrapper : {
        marginTop: 11,
        alignItems: 'center'
    },
    ForgotPassText : {
        fontSize: 12,
        lineHeight: 15,
        color: '#0B2A5B',
        textDecorationLine: 'underline'
    }
})

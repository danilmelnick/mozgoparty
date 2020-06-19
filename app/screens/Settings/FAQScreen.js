import React from 'react'
import Accordion from 'react-native-collapsible/Accordion';
import {StyleSheet, View, Text} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';

class FAQScreen extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            activeSections: [],
            data : [
                {
                    title: 'Как долго длится одна игра?',
                    content: 'В игре вам понадобиться отвечать на вопросы, поэтому мы рекомендуем подготовить ручку и лист бумаги для записи ответов.',
                },
                {
                    title: 'Сколько раз я могу сыграть в одну и ту же игру?',
                    content: 'В игре вам понадобиться отвечать на вопросы, поэтому мы рекомендуем подготовить ручку и лист бумаги для записи ответов.',
                },
                {
                    title: 'Что необходимо для игры?',
                    content: 'В игре вам понадобиться отвечать на вопросы, поэтому мы рекомендуем подготовить ручку и лист бумаги для записи ответов.',
                },
                {
                    title: 'Произошла ошибка оплаты',
                    content: 'В игре вам понадобиться отвечать на вопросы, поэтому мы рекомендуем подготовить ручку и лист бумаги для записи ответов.',
                },
            ]
        }
    }

    _renderHeader = section => {
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>{section.title}</Text>
            </View>
        );
    };

    _renderContent = section => {
        return (
            <View style={styles.content}> 
                <Text>{section.content}</Text>
            </View>
        );
    };

    _updateSections = activeSections => {
        this.setState({ activeSections });
    };

    render () {

        return(
            <View style={styles.container}>
                <Text style={{fontSize : 16, fontWeight : 'bold', paddingVertical : 20}}>FAQ</Text>
                <Text style={{fontSize : 13,  paddingVertical : 4}}>Здесь вы найдете ответы на все часто задаваемые вопросы.</Text>
                <Accordion
                    sections={this.state.data}
                    activeSections={this.state.activeSections}
                    renderHeader={this._renderHeader}
                    renderContent={this._renderContent}
                    onChange={this._updateSections}
                />
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('SupportScreen')}
                    style={{marginTop : 30}}
                >
                    <Text>SupportScreen</Text>
                </TouchableOpacity>
            </View>
        )

    }

}

export default FAQScreen

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
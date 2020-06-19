import React, {Component} from 'react'
import Favorite from '../../components/Favorite'
import { AsyncStorage } from 'react-native';
import {StyleSheet, View, Image, FlatList} from 'react-native'


export default class FavoriteScreen extends Component {

    constructor(){
        super()

        this.state = {
            data : [],

            favId : null
        }
    }

    getItemFromStore(){
        AsyncStorage.getItem('favArray')
            .then(req => JSON.parse(req))
            .then(json => this.setState({favId : json}))
            .then(() => console.log(this.state.favId))
            .catch(error => console.log('error!'))
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
            this.setState({datas : json})
          } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    sortItem(itemsStore = [], allsGames = []){
        
        var result = allsGames.filter(({id}) => itemsStore.includes(id))
        this.setState({data : result})
        console.log('Sort >>>>>>' + JSON.stringify(result));
    }

    async componentDidMount() {
        const token = await AsyncStorage.getItem('userToken');
        this.getItemFromStore()
        this.getGamesData(token)
        setTimeout(() => {
            console.log(this.state.data)
            this.sortItem(this.state.favId, this.state.datas)
        }, 1000)
    }

    deleteItemById = id => {
        const filteredData = this.state.data.filter(item => item.id !== id);
        this.setState({ data: filteredData });
    }

    render(){
        return( 
            <View style={styles.wrapper}>
                <FlatList
                    data={this.state.data}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <Favorite 
                        title={item.party.name}
                        image={item.media.avatar}
                        rating={item.rating}
                        removeFav = {()=> this.deleteItemById(item.id)}                  
                    /> }
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    wrapper : {
        flex : 1,
        height : '100%',
        backgroundColor: 'white',
        paddingTop : 13
    }
})
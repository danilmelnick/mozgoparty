import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList
} from "react-native";
import { Header } from "react-native-elements";
import GameListItem from "../../components/GameListItem";
import GameCard from "../Card/GameCard";
import userDataAction from "../../actions/userDataAction";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";

class MyGamesScreen extends React.Component {
  state = {
    games: []
  };

  getGamesData = async () => {
    try {
      const response = await fetch("https://api.party.mozgo.com/api/games", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + this.state.token
        }
      });
      const json = await response.json();

      const ids = this.props.user.userInfo.purchases.map(item => item.game_id);
      console.log(ids);
      console.log(json.map(item => item.party.id));

      let games = [];
      json.forEach(element => {
        ids.forEach(id => {
          if (element.party.id == id) {
            games.push(element);
          }
        });
      });

      this.setState({ games });
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  getToken = async () => {
    const res = await AsyncStorage.getItem("userToken");
    const token = res.slice(1, -1);
    this.setState({ token });
  };

  async componentDidMount() {
    await this.getToken();
    this.getGamesData();
  }

  render() {
    return (
      <SafeAreaView style={{ backgroundColor: "#fff", height: "100%" }}>
        <Header
          leftComponent={
            <TouchableOpacity
              style={{ marginLeft: 8 }}
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Image source={require("../../src/burgerMenu.png")} />
            </TouchableOpacity>
          }
          containerStyle={styles.header}
        />

        <Text
          style={{
            fontFamily: "Montserrat-Bold",
            fontSize: 34,
            marginLeft: 16
          }}
        >
          Мои игры
        </Text>

        <FlatList
          style={{ flex: 1 }}
          data={this.state.games}
          renderItem={itemProps => {
            return (
              <GameCard
                isMyGame={true}
                onDelete={element => this.delete(element)}
                item={itemProps.item}
                title={itemProps.item.party.name}
                image={itemProps.item.media.avatar}
                description={itemProps.item.description}
                age_rating={itemProps.item.party.age_rating}
                price={itemProps.item.party.price}
                rating={itemProps.item.rating}
                id={itemProps.item.id}
                size={itemProps.item.size}
                isTop={itemProps.item.popular_rank != null}
                isNew={itemProps.item.party.show_on_main_page}
                currency={itemProps.item.party.currency}
                onPress={() => {
                  this.props.navigation.navigate("CardGameScreen", {
                    isMyGame: true,
                    item: itemProps.item,
                    title: itemProps.item.party.name,
                    image: itemProps.item.media.avatar,
                    description: itemProps.item.description,
                    age_rating: itemProps.item.party.age_rating,
                    price: itemProps.item.party.price,
                    rating: itemProps.item.rating,
                    id: itemProps.item.id,
                    size: itemProps.item.size,
                    isTop: itemProps.item.popular_rank != null,
                    isNew: itemProps.item.party.show_on_main_page,
                    currency: itemProps.item.party.currency
                  });
                }}
              />
            );
          }}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  console.log("mapStateToProps >>>>>>>>");
  console.log(JSON.stringify(state));
  return {
    user: state.userData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    userDataAction: token => dispatch(userDataAction(token))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyGamesScreen);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16
  },
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 0.4,
    paddingBottom: 0,
    borderBottomColor: "white",
    paddingTop: 0,
    height: 44
  }
});

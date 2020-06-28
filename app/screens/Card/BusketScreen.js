import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "react-native-elements";
import GameCard from "./GameCard";
import AsyncStorage from "@react-native-community/async-storage";
import { Linking } from "expo";

export default class BusketScreen extends Component {
  state = {
    games: []
  };

  getToken = async () => {
    const res = await AsyncStorage.getItem("userToken");
    if (res) {
      const token = res.slice(1, -1);
      this.setState({ token });
    }
  };

  async componentDidMount() {
    await this.getToken();
    let items = JSON.parse(await AsyncStorage.getItem("cardGames"));
    console.log(items);
    this.setState({ games: items });
  }

  delete = async element => {
    this.setState({ addGames: false });
    let items = JSON.parse(await AsyncStorage.getItem("cardGames"));
    items = items.filter(item => item.id != element.id);
    AsyncStorage.setItem("cardGames", JSON.stringify(items));
    this.setState({ games: items });

    if (this.state.token != "") {
      try {
        const response = await fetch(
          "https://api.party.mozgo.com/api/cart/" + element.id,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + this.state.token
            }
          }
        );
        const json = await response.json();
        console.log(response);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    }
  };

  pay = () => {
    if (!this.state.token) {
      this.props.navigation.navigate("AuthScreen");
    } else {
      Linking.openURL("https://party.mozgo.com/cart");
    }
  };

  render() {
    const prices = this.state.games.map(item => item.party.price);
    let price = 0;
    prices.forEach(item => {
      price += item / 100;
    });

    return (
      <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
        <View>
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

          <Text
            style={{
              fontFamily: "Montserrat-Bold",
              fontSize: 34,
              marginLeft: 16,
              marginBottom: 20
            }}
          >
            Корзина
          </Text>

          <FlatList
            data={this.state.games}
            scrollEnabled={false}
            renderItem={itemProps => {
              return (
                <GameCard
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
                />
              );
            }}
          />
        </View>

        <View style={styles.container}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              fontFamily: "Montserrat-Bold",
              marginBottom: 16,
              marginTop: 25,
              color: "#333333"
            }}
          >
            Итого:{" "}
          </Text>
          <View style={styles.isues}>
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%"
              }}
            >
              <Text
                style={{
                  color: "#333333",
                  fontSize: 12,
                  fontFamily: "Montserrat-Regular"
                }}
              >
                Игры (× {this.state.games.length})
              </Text>
              <Text
                style={{
                  color: "#333333",
                  fontSize: 12,
                  fontFamily: "Montserrat-Medium",
                  fontWeight: "600"
                }}
              >
                {price} ₽
              </Text>
            </View>
          </View>
          <View style={styles.isues}>
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
                marginTop: 8
              }}
            >
              <Text
                style={{
                  color: "#333333",
                  fontSize: 12,
                  fontFamily: "Montserrat-Regular"
                }}
              >
                Скидка
              </Text>
              <Text
                style={{
                  color: "#333333",
                  fontSize: 12,
                  fontFamily: "Montserrat-Medium",
                  fontWeight: "600"
                }}
              >
                0 ₽
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              position: "absolute",
              bottom: 15,
              left: 16,
              right: 16,
              justifyContent: "space-between"
            }}
          >
            <Text
              style={{
                color: "#333333",
                fontSize: 12,
                fontFamily: "Montserrat-Medium",
                fontWeight: "600"
              }}
            >
              К оплате: {price} ₽
            </Text>
            <TouchableOpacity
              style={styles.btnAuths}
              onPress={() => this.pay()}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#fff",
                  fontSize: 17,
                  fontFamily: "Montserrat-Regular"
                }}
              >
                Оплатить
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flex: 1,
    backgroundColor: "#fff"
  },
  logo: {
    width: 94,
    height: 94,
    borderRadius: 5,
    marginRight: 10
  },
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 0.4,
    paddingBottom: 0,
    borderBottomColor: "white",
    paddingTop: 0,
    height: 44
  },
  btnAuth: {
    backgroundColor: "#0B2A5B",
    padding: 16,
    borderRadius: 5
  },
  btnAuths: {
    backgroundColor: "#0B2A5B",
    padding: 16,
    borderRadius: 5,
    width: 160
  },
  headerGames: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },

  isues: {
    flexDirection: "row"
  }
});

import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Header } from "react-native-elements";
import userDataAction from "../../actions/userDataAction";
import { connect } from "react-redux";

class CardGameScreen extends Component {
  constructor() {
    super();

    this.state = {
      addGames: false,
      count: 0,
      cardGames: [],
      token: ""
    };
  }

  getToken = async () => {
    const res = await AsyncStorage.getItem("userToken");
    const token = res.slice(1, -1);
    this.setState({ token });
  };

  getItems = async () => {
    let id = this.props.navigation.state.params.id;
    let items = JSON.parse(await AsyncStorage.getItem("cardGames"));
    this.setState({ count: items ? items.length : 0 });
    items &&
      items.forEach(item => {
        if (item.id == id) {
          this.setState({ addGames: true });
        }
      });
  };

  async componentDidMount() {
    await this.getItems();
    this.getToken();

    this.props.navigation.addListener("didFocus", () => {
      this.getItems();
    });
  }

  playGame = async item => {
    console.log("playGame", item.hash);

    try {
      const response = await fetch(
        "https://api.party.mozgo.com/game-content/" + item.hash,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + this.state.token
          }
        }
      );
      const json = await response.json();

      this.props.navigation.navigate("GameScreen", { data: json });
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  addItemToCard = async element => {
    if (this.state.addGames) {
      this.setState({ addGames: false });
      let items = JSON.parse(await AsyncStorage.getItem("cardGames"));
      items = items.filter(item => item.id != element.id);
      AsyncStorage.setItem("cardGames", JSON.stringify(items));
      this.getItems();

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
    } else {
      this.setState({ addGames: true });
      let items = JSON.parse(await AsyncStorage.getItem("cardGames"));
      if (!items) {
        items = [];
      }
      items.push(element);
      AsyncStorage.setItem("cardGames", JSON.stringify(items));
      this.getItems();

      if (this.state.token != "") {
        try {
          const response = await fetch(
            "https://api.party.mozgo.com/api/cart/" + element.id,
            {
              method: "POST",
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
    }
  };

  renderFootBtn() {
    if (this.state.count === 0) {
      return null;
    }
    return (
      <TouchableOpacity
        style={styles.btnAuth2}
        onPress={() => this.props.navigation.navigate("BusketScreen")}
      >
        <Text
          style={{
            textAlign: "left",
            color: "#fff",
            fontSize: 17,
            fontFamily: "Montserrat-Regular"
          }}
        >
          Корзина
        </Text>
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 8
          }}
        >
          <Text
            style={{
              textAlign: "left",
              color: "#fff",
              fontSize: 12,
              fontFamily: "Montserrat-Regular"
            }}
          >
            {this.state.count}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    const navigationProps = this.props.navigation.state.params;

    return (
      <SafeAreaView style={{ backgroundColor: "white" }}>
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

        <SafeAreaView style={styles.container}>
          <View style={styles.headerGames}>
            <Image
              source={{ uri: navigationProps.image }}
              style={styles.logo}
            />
            <View style={{ width: "60%" }}>
              {navigationProps.rating && (
                <View style={{ flexDirection: "row", marginBottom: 4 }}>
                  <Image
                    source={require("../../src/rating.png")}
                    style={{ width: 13.33, height: 13.33, marginRight: 3 }}
                  />
                  <Text style={styles.rating}>{navigationProps.rating}</Text>
                </View>
              )}
              <Text style={styles.title}>{navigationProps.title}</Text>
            </View>
          </View>

          <View style={styles.aboutGame}>
            {!navigationProps.isMyGame && (
              <Text
                style={{
                  color: "#BD006C",
                  fontFamily: "Montserrat-Regular",
                  fontSize: 12,
                  fontWeight: "600",
                  marginRight: 24
                }}
              >
                {navigationProps.price / 100 + " " + navigationProps.currency}
              </Text>
            )}

            <Text
              style={{
                color: "#333",
                fontFamily: "Montserrat-Regular",
                fontSize: 12,
                fontWeight: "600",
                marginRight: 24
              }}
            >
              {Math.floor(navigationProps.size / 1000000)} Мб
            </Text>

            <Text
              style={{
                color: "#333",
                fontFamily: "Montserrat-Regular",
                fontSize: 12,
                fontWeight: "600",
                marginRight: 24
              }}
            >
              {navigationProps.age_rating + "+"}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.btnAuth,
              {
                borderWidth: 1,
                borderColor: "#DADADA",
                backgroundColor: !this.state.addGames
                  ? navigationProps.isMyGame
                    ? "#0B2A5B"
                    : "#0B2A5B"
                  : "white"
              }
            ]}
            onPress={() =>
              !this.state.addGames
                ? navigationProps.isMyGame
                  ? this.playGame(navigationProps.item)
                  : this.addItemToCard(navigationProps.item)
                : this.addItemToCard(navigationProps.item)
            }
          >
            <Text
              style={{
                textAlign: "center",
                textTransform: "none",
                color: !this.state.addGames
                  ? navigationProps.isMyGame
                    ? "#fff"
                    : "#fff"
                  : "#333333",
                fontFamily: "Montserrat-Regular",
                fontSize: 17
              }}
            >
              {!this.state.addGames
                ? navigationProps.isMyGame
                  ? "Играть"
                  : "Добавить в корзину"
                : "В корзине"}
            </Text>
          </TouchableOpacity>

          <View style={styles.description}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 10,
                fontFamily: "Montserrat-Regular"
              }}
            >
              Описание
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "normal",
                marginBottom: 10,
                fontFamily: "Montserrat-Regular"
              }}
            >
              {navigationProps.description}
            </Text>
            <View style={{ flexDirection: "row" }}>
              {navigationProps.isTop && (
                <TouchableOpacity style={styles.categor}>
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#333333",
                      fontSize: 12
                    }}
                  >
                    Топ-5
                  </Text>
                </TouchableOpacity>
              )}
              {navigationProps.isNew && (
                <TouchableOpacity style={styles.categor}>
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#333333",
                      fontSize: 12
                    }}
                  >
                    Новинка
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </SafeAreaView>
        {this.renderFootBtn()}
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

export default connect(mapStateToProps, mapDispatchToProps)(CardGameScreen);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 22,
    height: "95%",
    backgroundColor: "#fff"
  },
  title: {
    color: "#333333",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Montserrat-Regular",
    lineHeight: 18
  },
  logo: {
    width: 94,
    height: 94,
    borderRadius: 5,
    marginRight: 10
  },
  btnAuth: {
    backgroundColor: "#0B2A5B",
    padding: 16,
    borderRadius: 5
  },
  headerGames: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  aboutGame: {
    marginVertical: 30,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  categor: {
    backgroundColor: "rgba(255, 206, 66, 0.5)",
    padding: 6,
    flexWrap: "wrap",
    borderRadius: 24,
    paddingHorizontal: 16,
    marginRight: 8
  },
  description: {
    marginVertical: 30
  },
  btnAuth2: {
    flexDirection: "row",
    backgroundColor: "#0B2A5B",
    padding: 16,
    borderRadius: 5,
    textAlign: "left",
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 20
  },
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 0.4,
    paddingBottom: 0,
    borderBottomColor: "white",
    paddingTop: 0,
    height: 44
  },
  rating: {
    color: "#979797",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Montserrat-Regular",
    alignItems: "center"
  }
});

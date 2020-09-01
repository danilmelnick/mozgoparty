import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "react-native-elements";
import GameCard from "./GameCard";
import AsyncStorage from "@react-native-community/async-storage";
import userDataAction from "../../actions/userDataAction";
import { connect } from "react-redux";
import Loader from "../../components/Loader";

class BusketScreen extends Component {
  state = {
    games: [],
    promoCode: false,
    visible: false,
    promoCodeEnter: "",
    promoId: 0
  };

  promocodeEnable = async () => {
    this.setState({ visible: true });

    try {
      const response = await fetch(
        "https://api.party.mozgo.com/check-promo?email=" +
          this.props.user.userInfo.email +
          "&model_type=game&code=" +
          this.state.promoCodeEnter +
          "&game_id=" +
          this.state.promoId,
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

      if (json.status == "error") {
        Alert.alert(json.text, undefined, [
          {
            text: "OK",
            style: "default"
          }
        ]);
      } else if (json.status == "success") {
        Alert.alert(json.text, undefined, [
          {
            text: "OK",
            style: "default",
            onPress: () => {
              const games = [...this.state.games];
              const index = games.findIndex(
                item => item.id == this.state.promoId
              );

              const discount =
                games[index].party.price * (json.discount.value / 100);
              games[index].party.price -= discount;

              games[index].party.discount = discount / 100;
              games[index].party.promoCode = this.state.promoCodeEnter;

              this.setState({ games });

              AsyncStorage.setItem(
                "cardGames",
                JSON.stringify(this.state.games)
              );

              this.setState({ promoCode: false, promoCodeEnter: "" });
            }
          }
        ]);
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }

    this.setState({ visible: false });
  };

  getToken = async () => {
    const res = await AsyncStorage.getItem("userToken");
    if (res) {
      const token = res.slice(1, -1);
      this.setState({ token });
    }
  };

  renderPromoCode = () => {
    return (
      <Modal visible={this.state.promoCode} transparent={true}>
        <TouchableWithoutFeedback
          onPress={() => this.setState({ promoCode: false })}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(4, 4, 15, 0.4)",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                width: "100%"
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  marginHorizontal: 50,
                  paddingHorizontal: 24,
                  paddingVertical: 29
                }}
              >
                <Text
                  style={{
                    color: "#979797",
                    fontSize: 12,
                    fontFamily: "Montserrat-Regular",
                    paddingLeft: 10
                  }}
                >
                  Промокод
                </Text>
                <TextInput
                  placeholderTextColor={"#979797"}
                  style={styles.inputForm}
                  onChangeText={promoCodeEnter =>
                    this.setState({ promoCodeEnter })
                  }
                />
                <TouchableOpacity
                  onPress={() => this.promocodeEnable()}
                  style={styles.btnAuth}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      fontFamily: "Montserrat-Regular",
                      fontSize: 17
                    }}
                  >
                    Применить
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  async componentDidMount() {
    this.props.navigation.addListener("didFocus", async () => {
      await this.getToken();
      let items = JSON.parse(await AsyncStorage.getItem("cardGames"));
      this.setState({ games: items });
    });

    await this.getToken();
    let items = JSON.parse(await AsyncStorage.getItem("cardGames"));
    this.setState({ games: items });
  }

  delete = async element => {
    this.setState({ visible: true });

    this.setState({ addGames: false });
    let items = JSON.parse(await AsyncStorage.getItem("cardGames"));
    items = items.filter(item => item.id != element.id);
    AsyncStorage.setItem("cardGames", JSON.stringify(items));
    this.setState({ games: items });

    if (this.state.token != "") {
      try {
        const response = await fetch(
          "https://api.party.mozgo.com/api/cart/" + element.party.id,
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
      } catch (error) {
        console.error("Ошибка:", error);
      }
    }

    this.setState({ visible: false });
  };

  pay = async () => {
    if (!this.state.token) {
      this.props.navigation.navigate("AuthScreen");
    } else {
      this.setState({ visible: true });

      try {
        const response = await fetch(
          "https://api.party.mozgo.com/api/games/buy/bulk",
          {
            method: "POST",
            body: JSON.stringify({
              gift_certificates: null,
              purchases: this.state.games.map(item => ({
                model_id: item.party.id,
                model_type: "game",
                promocode: item.party.promoCode,
                roistat: null
              }))
            }),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + this.state.token
            }
          }
        );
        const json = await response.json();

        const url = json.additionalData.redirectUrl;
        if (url.includes("/free/")) {
          const splitedUrl = url.split("/");
          const id = splitedUrl[splitedUrl.length - 1];

          await this.sendCheckRequest(id);
        } else {
          this.props.navigation.navigate("Payment", {
            url: url,
            id: json.additionalData.id
          });
        }
      } catch (err) {}

      this.setState({ visible: false });
      // this.props.navigation.navigate("Payment");
    }
  };

  sendCheckRequest = async id => {
    try {
      const response = await fetch(
        "https://api.party.mozgo.com/check-payment/" + id,
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

      if (json.status == "success") {
        this.props.userDataAction(this.state.token);
        await AsyncStorage.setItem("cardGames", JSON.stringify([]));
        this.props.navigation.navigate("MyGamesScreen");
      }
    } catch (err) {}
  };

  render() {
    const prices = this.state.games.map(item => item.party.price);
    let price = 0;
    prices.forEach(item => {
      price += item / 100;
    });

    const discounts = this.state.games.map(item => item.party.discount);
    let discount = 0;
    discounts.forEach(item => {
      if (item) {
        discount += item;
      }
    });

    return (
      <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
        <Loader visible={this.state.visible} />

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
            style={{ maxHeight: Dimensions.get("screen").height - 380 }}
            data={this.state.games}
            scrollEnabled={true}
            renderItem={itemProps => {
              return (
                <GameCard
                  onDelete={element => this.delete(element)}
                  onPromoCode={() =>
                    this.setState({
                      promoCode: true,
                      promoId: itemProps.item.id
                    })
                  }
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
                {discount} ₽
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
        {this.renderPromoCode()}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.userData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    userDataAction: token => dispatch(userDataAction(token))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BusketScreen);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flex: 1,
    backgroundColor: "#fff"
  },
  inputForm: {
    color: "#333333",
    height: 40,
    fontFamily: "Montserrat-Regular",
    borderBottomWidth: 1,
    paddingLeft: 9,
    paddingRight: 15,
    borderBottomColor: "rgba(0, 0, 0, 0.38)",
    fontSize: 16,
    marginBottom: 25
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
  btnAuth: {
    backgroundColor: "#0B2A5B",
    height: 44,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  isues: {
    flexDirection: "row"
  }
});

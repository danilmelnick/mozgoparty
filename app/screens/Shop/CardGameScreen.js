import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image
} from "react-native";
import Orientation from "react-native-orientation";
import AsyncStorage from "@react-native-community/async-storage";
import { Header } from "react-native-elements";
import userDataAction from "../../actions/userDataAction";
import setDownload, {
  setCancelDownloadVariable
} from "../../actions/setDownload";
import { connect } from "react-redux";

let filesCount = 99;

class CardGameScreen extends Component {
  constructor() {
    super();

    this.state = {
      persent: 0,
      countJSON: undefined,
      isMyGame: false,
      game: undefined,
      addGames: false,
      loading: false,
      count: 0,
      cardGames: [],
      token: "",
      runCount: 3,
      currentTour: 1,
      persent1: 0,
      persent2: 0,
      persent3: 0,
      hash: undefined
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.download.gameId == this.props.navigation.state.params.id) {
      this.setState({
        persent: nextProps.download.persent,
        loading: !nextProps.game.json,
        currentTour: nextProps.download.tour
      });

      if (nextProps.game.cancel) {
        this.setState({
          game: undefined,
          loading: false,
          currentTour: 1,
          persent1: 0,
          persent2: 0,
          persent3: 0
        });
      }

      if (nextProps.game.json) {
        this.setState({
          game: nextProps.game.json,
          loading: nextProps.download.persent < filesCount
        });
      }

      if (nextProps.download.persent1) {
        this.setState({ persent1: nextProps.download.persent1 });
      }

      if (nextProps.download.persent2) {
        this.setState({ persent2: nextProps.download.persent2 });
      }

      if (nextProps.download.persent3) {
        this.setState({ persent3: nextProps.download.persent3 });
      }
    }
  }

  getToken = async () => {
    const res = await AsyncStorage.getItem("userToken");
    const token = res.slice(1, -1);
    this.setState({ token });
  };

  getItems = async () => {
    let id = this.props.navigation.state.params.id;
    let items = JSON.parse(await AsyncStorage.getItem("cardGames"));
    this.setState({ count: items ? items.length : 0, addGames: false });
    items &&
      items.forEach(item => {
        if (item.id == id) {
          this.setState({ addGames: true });
        }
      });
  };

  async componentDidMount() {
    this.props.navigation.addListener("didFocus", () => {
      this.getItems();
    });

    const params = this.props.navigation.state.params.loading;
    if (params && params.loading) {
      this.setState({
        loading: true,
        currentTour: params.tour,
        persent1: params.persent1,
        persent2: params.persent2,
        persent3: params.persent3,
        persent: params.persent
      });
    }

    Orientation.lockToPortrait();

    // await AsyncStorage.setItem(item.id.toString(), undefined);

    await this.getGame();
    await this.getItems();
    await this.getToken();
    // this.countGame();

    if (this.props.navigation.state.params.isMyGame) {
      this.setState({ isMyGame: this.props.navigation.state.params.isMyGame });
    }

    if (this.props.user.userInfo.purchases) {
      const itemParams = this.props.navigation.state.params.item;
      const purchases = this.props.user.userInfo.purchases;

      purchases.forEach(item => {
        if (item.game_id == itemParams.party.id) {
          this.setState({ isMyGame: true, hash: item.hash }, () => {
            this.countGame();
          });
          return;
        }
      });
    }
  }

  countGame = async () => {
    const item = this.props.navigation.state.params.item;

    try {
      const response = await fetch(
        "https://api.party.mozgo.com/count/" + (item.hash || this.state.hash),
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
      this.setState({ runCount: json.total - json.runs, countJSON: json });
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  postGame = async () => {
    const item = this.props.navigation.state.params.item;

    try {
      const response = await fetch("https://api.party.mozgo.com/count/", {
        method: "POST",
        body: JSON.stringify({
          game_id: item.hash || this.state.hash,
          runs: this.state.countJSON.runs + 1
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + this.state.token
        }
      });
      const json = await response.json();
      this.setState({
        runCount: json.total - json.runs,
        countJSON: { ...this.state.countJSON, runs: json.runs }
      });
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  getGame = async () => {
    const item = this.props.navigation.state.params;
    const data = await AsyncStorage.getItem(item.id.toString());
    this.setState({ game: JSON.parse(data) });
  };

  loadGame = async () => {
    const item = this.props.navigation.state.params.item;

    this.props.setCancelDownloadVariable(false, item.id.toString());

    if (this.state.loading) {
      this.props.setCancelDownloadVariable(true, item.id.toString());
      return;
    }

    this.props.setDownload({
      gameId: item.id.toString(),
      item,
      token: this.state.token
    });
  };

  playGame = async item => {
    this.postGame();
    this.props.navigation.replace("GameScreen", { data: this.state.game });
  };

  addItemToCard = async element => {
    if (!this.state.addGames) {
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
            "https://api.party.mozgo.com/api/cart/" +
              this.props.navigation.state.params.item.party.id,
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

    const rating5 = navigationProps.item.review_details
      ? navigationProps.item.review_details.filter(item => item.rating == 5)
      : [];
    const rating4 = navigationProps.item.review_details
      ? navigationProps.item.review_details.filter(item => item.rating == 4)
      : [];
    const rating3 = navigationProps.item.review_details
      ? navigationProps.item.review_details.filter(item => item.rating == 3)
      : [];
    const rating2 = navigationProps.item.review_details
      ? navigationProps.item.review_details.filter(item => item.rating == 2)
      : [];
    const rating1 = navigationProps.item.review_details
      ? navigationProps.item.review_details.filter(item => item.rating == 1)
      : [];
    const review_details = [
      { rating: 5, count: rating5.length > 0 && rating5[0].count },
      { rating: 4, count: rating4.length > 0 && rating4[0].count },
      { rating: 3, count: rating3.length > 0 && rating3[0].count },
      { rating: 2, count: rating2.length > 0 && rating2[0].count },
      { rating: 1, count: rating1.length > 0 && rating1[0].count }
    ];

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
            {!this.state.isMyGame && (
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

            {!this.state.isMyGame && (
              <View
                style={{
                  width: 1,
                  height: 24,
                  backgroundColor: "#DADADA",
                  marginRight: 8
                }}
              />
            )}

            <Text
              style={{
                color: "#333",
                fontFamily: "Montserrat-Regular",
                fontSize: 12,
                fontWeight: "600",
                marginRight: 16
              }}
            >
              {Math.floor(navigationProps.size / 1000000)} Мб
            </Text>

            <View
              style={{
                width: 1,
                height: 24,
                backgroundColor: "#DADADA",
                marginRight: 8
              }}
            />

            <Text
              style={{
                color: "#333",
                fontFamily: "Montserrat-Regular",
                fontSize: 12,
                fontWeight: "600",
                marginRight: 16
              }}
            >
              {navigationProps.age_rating + "+"}
            </Text>

            {this.state.isMyGame && (
              <View
                style={{
                  width: 1,
                  height: 24,
                  backgroundColor: "#DADADA",
                  marginRight: 8
                }}
              />
            )}

            {this.state.isMyGame && (
              <Text
                style={{
                  color: "#333",
                  fontFamily: "Montserrat-Regular",
                  fontSize: 12,
                  fontWeight: "600",
                  marginRight: 24
                }}
              >
                {"Осталось запусков: " +
                  (this.state.runCount < 0 ? 0 : this.state.runCount)}
              </Text>
            )}
          </View>

          {this.state.loading && (
            <View style={{ marginBottom: 44, marginTop: -10 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: 10,
                    color: "#979797"
                  }}
                >
                  В процессе
                </Text>
                <Text
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: 10,
                    color: "#979797"
                  }}
                >
                  {Math.floor((this.state.persent / filesCount) * 100) + "%"}
                </Text>
              </View>
              <View
                style={{
                  height: 4,
                  backgroundColor: "#DADADA",
                  borderRadius: 10,
                  width: "100%"
                }}
              >
                <View
                  style={{
                    height: 4,
                    backgroundColor:
                      this.state.currentTour - 1 >= 1
                        ? this.state.currentTour - 1 >= 2
                          ? this.state.currentTour - 1 >= 3
                            ? "#6FCF97"
                            : "#FFCE42"
                          : "#F2994A"
                        : "#EB5757",
                    borderRadius: 10,
                    width: (this.state.persent / filesCount) * 100 + "%"
                  }}
                />
                {this.state.currentTour - 1 >= 1 && (
                  <View
                    style={{
                      position: "absolute",
                      left: this.state.persent1 - 2 + "%",
                      top: -4
                    }}
                  >
                    <View
                      style={{
                        backgroundColor:
                          this.state.currentTour - 1 >= 1
                            ? this.state.currentTour - 1 >= 2
                              ? this.state.currentTour - 1 >= 3
                                ? "#6FCF97"
                                : "#FFCE42"
                              : "#F2994A"
                            : "#EB5757",
                        width: 12,
                        height: 12,
                        borderRadius: 6
                      }}
                    />
                    <Text
                      style={{
                        color: "#979797",
                        fontFamily: "Montserrat-Regular",
                        fontSize: 10,
                        left: -7,
                        top: 8
                      }}
                    >
                      1 тур
                    </Text>
                  </View>
                )}

                {this.state.currentTour - 1 >= 2 && (
                  <View
                    style={{
                      position: "absolute",
                      left: this.state.persent2 - 2 + "%",
                      top: -4
                    }}
                  >
                    <View
                      style={{
                        backgroundColor:
                          this.state.currentTour - 1 >= 2
                            ? this.state.currentTour - 1 >= 3
                              ? "#6FCF97"
                              : "#FFCE42"
                            : "#F2994A",
                        width: 12,
                        height: 12,
                        borderRadius: 6
                      }}
                    />
                    <Text
                      style={{
                        color: "#979797",
                        fontFamily: "Montserrat-Regular",
                        fontSize: 10,
                        left: -7,
                        top: 8
                      }}
                    >
                      2 тур
                    </Text>
                  </View>
                )}

                {this.state.currentTour - 1 >= 3 && (
                  <View
                    style={{
                      position: "absolute",
                      left: this.state.persent3 - 2 + "%",
                      top: -4
                    }}
                  >
                    <View
                      style={{
                        backgroundColor:
                          this.state.currentTour - 1 >= 3
                            ? "#6FCF97"
                            : "#FFCE42",
                        width: 12,
                        height: 12,
                        borderRadius: 6
                      }}
                    />
                    <Text
                      style={{
                        color: "#979797",
                        fontFamily: "Montserrat-Regular",
                        fontSize: 10,
                        left: -7,
                        top: 8
                      }}
                    >
                      3 тур
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {((this.state.isMyGame && this.state.game) ||
            (this.state.isMyGame && this.state.runCount == 0) ||
            !this.state.isMyGame) && (
            <TouchableOpacity
              disabled={
                (this.state.addGames && !this.state.isMyGame) ||
                this.state.addGames
              }
              style={[
                styles.btnAuth,
                {
                  borderWidth: 1,
                  borderColor: "#DADADA",
                  backgroundColor: !this.state.addGames
                    ? this.state.isMyGame && this.state.runCount != 0
                      ? "#0B2A5B"
                      : "#0B2A5B"
                    : "white"
                }
              ]}
              onPress={() =>
                !this.state.addGames
                  ? this.state.isMyGame && this.state.runCount > 0
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
                    ? this.state.isMyGame && this.state.runCount != 0
                      ? "#fff"
                      : "#fff"
                    : "#333333",
                  fontFamily: "Montserrat-Regular",
                  fontSize: 17
                }}
              >
                {!this.state.addGames
                  ? this.state.isMyGame && this.state.runCount > 0
                    ? "Играть"
                    : "Добавить в корзину"
                  : "В корзине"}
              </Text>
            </TouchableOpacity>
          )}

          {this.state.isMyGame &&
            (!this.state.game || (this.state.game && this.state.loading)) &&
            this.state.runCount != 0 && (
              <TouchableOpacity
                style={[
                  styles.btnAuth,
                  {
                    marginTop: 8,
                    borderWidth: 1,
                    borderColor: "#DADADA",
                    backgroundColor: "white"
                  }
                ]}
                onPress={() => this.loadGame()}
              >
                <Text
                  style={{
                    textAlign: "center",
                    textTransform: "none",
                    color: "#333333",
                    fontFamily: "Montserrat-Regular",
                    fontSize: 17
                  }}
                >
                  {this.state.loading ? "Отменить загрузку" : "Загрузить игру"}
                </Text>
              </TouchableOpacity>
            )}

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

          {navigationProps.item.rating && (
            <View style={styles.description}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  marginBottom: 10,
                  fontFamily: "Montserrat-Regular"
                }}
              >
                Отзывы
              </Text>

              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 70,
                      fontFamily: "Montserrat-Medium",
                      fontWeight: "600",
                      color: "#333333"
                    }}
                  >
                    {navigationProps.item.rating.toString().length == 1
                      ? navigationProps.item.rating.toString() + ",0"
                      : navigationProps.item.rating
                          .toString()
                          .replace(".", ",")}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Montserrat-Medium",
                      fontWeight: "600",
                      color: "#979797",
                      marginLeft: 20
                    }}
                  >
                    {navigationProps.item.review_count + " отзыва"}
                  </Text>
                </View>
                <View style={{ flex: 1, marginTop: 13 }}>
                  {review_details
                    .sort(function(a, b) {
                      if (a.rating < b.rating) {
                        return 1;
                      }
                      if (a.rating > b.rating) {
                        return -1;
                      }
                      return 0;
                    })
                    .map(item => {
                      return (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 3
                          }}
                        >
                          <Text
                            style={{
                              color: "#333333",
                              fontSize: 12,
                              width: 7,
                              fontFamily: "Montserrat-Regular"
                            }}
                          >
                            {item.rating}
                          </Text>
                          <View
                            style={{
                              flex: 1,
                              height: 5,
                              backgroundColor: "#DADADA",
                              borderRadius: 10,
                              marginLeft: 10
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: "#0B2A5B",
                                height: 5,
                                borderRadius: 10,
                                width:
                                  (item.count /
                                    navigationProps.item.review_count) *
                                    100 +
                                  "%"
                              }}
                            />
                          </View>
                        </View>
                      );
                    })}
                </View>
              </View>
            </View>
          )}
        </SafeAreaView>
        {this.renderFootBtn()}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.userData,
    download: state.userData.download || { persent: 0 },
    game: state.userData.game || {}
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCancelDownloadVariable: (cancel, gameId) =>
      dispatch(setCancelDownloadVariable(cancel, gameId)),
    userDataAction: token => dispatch(userDataAction(token)),
    setDownload: token => dispatch(setDownload(token))
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

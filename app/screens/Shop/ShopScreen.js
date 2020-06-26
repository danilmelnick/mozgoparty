import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  TextInput
} from "react-native";
import { CheckBox } from "react-native-elements";
import {
  Button,
  Dialog,
  Colors,
  PanningProvider,
  Constants
} from "react-native-ui-lib";
import { Header } from "react-native-elements";
import { AsyncStorage } from "react-native";

import CardItem from "../../components/CardItem";

export default class ShopScreen extends Component {
  constructor(props) {
    super(props);

    this.SCROLL_TYPE = {
      NONE: "none",
      VERTICAL: "vertical",
      HORIZONTAL: "horizontal"
    };

    this.state = {
      data: [],
      panDirection: PanningProvider.Directions.UP,
      position: "bottom",
      scroll: this.SCROLL_TYPE.NONE,
      showHeader: true,
      isRounded: true,
      showDialog: false,
      like: false,
      favGames: [],
      showSearch: false,
      searchText: "",
      showenTab: 0,
      selectedTab: 0,
      categories: []
    };
  }

  addItemToFavorite = async id => {
    let arr = this.state.favGames;
    arr.push(id);
    this.setState({ favGames: arr });
    console.log(this.state.favGames);
    if (this.state.like === false) {
      await AsyncStorage.setItem(
        "favArray",
        JSON.stringify(this.state.favGames)
      );
      setTimeout(() => {
        console.log(AsyncStorage.getItem("favArray"));
      }, 1000);
    } else {
      console.log("remove Array" + arr);
    }
  };

  showDialog = () => {
    this.setState({ showDialog: true });
  };

  hideDialog = () => {
    this.setState({ showDialog: false, showenTab: this.state.selectedTab });
  };

  renderContent = () => {
    return (
      <>
        <View style={styles.modalWrapper}>
          <Text
            style={{
              color: "#333333",
              fontSize: 14,
              fontWeight: "600",
              fontFamily: "Montserrat-Medium",
              marginTop: 24,
              marginBottom: 10
            }}
          >
            Какие игры показать сначала?
          </Text>

          <TouchableOpacity
            onPress={() => this.setState({ showenTab: 0 })}
            style={{
              height: 40,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor:
                this.state.showenTab == 0 ? "rgba(0, 0, 0, 0.03)" : "white",
              left: -16,
              paddingLeft: 16,
              paddingRight: 20,
              width: Dimensions.get("window").width,
              justifyContent: "space-between"
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: 12,
                color: "#333333"
              }}
            >
              С высоким рейтингом
            </Text>
            {this.state.showenTab == 0 && (
              <Image source={require("../../src/checkItem.png")} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({ showenTab: 1 })}
            style={{
              height: 40,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor:
                this.state.showenTab == 1 ? "rgba(0, 0, 0, 0.03)" : "white",
              left: -16,
              paddingHorizontal: 16,
              width: Dimensions.get("window").width,
              justifyContent: "space-between"
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: 12,
                color: "#333333"
              }}
            >
              Новые
            </Text>
            {this.state.showenTab == 1 && (
              <Image source={require("../../src/checkItem.png")} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({ showenTab: 2 })}
            style={{
              height: 40,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor:
                this.state.showenTab == 2 ? "rgba(0, 0, 0, 0.03)" : "white",
              left: -16,
              paddingHorizontal: 16,
              justifyContent: "space-between",
              width: Dimensions.get("window").width
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: 12,
                color: "#333333"
              }}
            >
              Старые
            </Text>
            {this.state.showenTab == 2 && (
              <Image source={require("../../src/checkItem.png")} />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnAuth}>
            <Text
              style={{
                textAlign: "center",
                color: "#fff",
                fontSize: 17,
                fontFamily: "Montserrat-Regular"
              }}
              onPress={() => {
                this.hideDialog();
                this.setState({ selectedTab: this.state.showenTab });
              }}
            >
              Показать
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  getDialogKey = height => {
    const { position } = this.state;
    return `dialog-key-${position}-${height}`;
  };

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
    const height = scroll !== this.SCROLL_TYPE.NONE ? "70%" : undefined;

    return (
      <Dialog
        migrate
        useSafeArea
        key={this.getDialogKey(height)}
        top={position === "top"}
        bottom={position === "bottom"}
        height={height}
        panDirection={"down"}
        containerStyle={styles.dialog}
        visible={showDialog}
        onDismiss={this.hideDialog}
        renderPannableHeader={renderPannableHeader}
        pannableHeaderProps={this.pannableTitle}
        supportedOrientations={this.supportedOrientations}
      >
        {this.renderContent()}
      </Dialog>
    );
  };

  getGamesData = async token => {
    try {
      const response = await fetch("https://api.party.mozgo.com/api/games", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token
        }
      });
      const json = await response.json();
      this.setState({ data: json });

      console.log(json[0]);

      const categories = Object.entries(
        json
          .map(item => item.category.toUpperCase())
          .reduce((acc, el) => {
            acc[el] = (acc[el] || 0) + 1;
            return acc;
          }, {})
      );

      categories.unshift(["ВСЕ", json.length]);

      this.setState({ categories });
      console.log(categories);
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  showSearch = () => {
    this.setState({ showSearch: true });
  };

  renderSearch = () => {
    const data = this.state.data.filter(item => {
      return item.party.name.includes(this.state.searchText);
    });

    return (
      <Modal visible={this.state.showSearch}>
        <SafeAreaView>
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              marginLeft: 19,
              marginRight: 16,
              marginBottom: 25,
              alignItems: "flex-end"
            }}
          >
            <Image source={require("../../src/search.png")} />
            <TextInput
              style={{
                flex: 1,
                color: "#979797",
                marginLeft: 20,
                top: 2,
                marginRight: 8,
                fontSize: 17,
                fontFamily: "Montserrat-Regular"
              }}
              onChangeText={text => this.setState({ searchText: text })}
              placeholder={"Найти в Магазине"}
              placeholderTextColor={"#979797"}
            />
            <TouchableOpacity
              onPress={() => {
                this.setState({ showSearch: false, searchText: "" });
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Montserrat-Regular",
                  textDecorationLine: "underline",
                  color: "#979797"
                }}
              >
                Отмена
              </Text>
            </TouchableOpacity>
          </View>

          {this.state.searchText != "" && (
            <View style={styles.shopContainer}>
              <FlatList
                data={data}
                numColumns={2}
                renderItem={({ item, index }) => (
                  <CardItem
                    isSecond={index % 2 == 1}
                    raiting={item.rating}
                    title={item.party.name}
                    url={item.media.avatar}
                    addFav={() => this.addItemToFavorite(item.id)}
                    like={this.state.like}
                    price={item.party.price}
                    press={() => {
                      this.setState({ showSearch: false });

                      this.props.navigation.navigate("CardGameScreen", {
                        title: item.party.name,
                        image: item.media.avatar,
                        description: item.description,
                        age_rating: item.age_rating,
                        price: item.party.price,
                        id: item.id
                      });
                    }}
                  />
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={{ margin: 1 }}
              />
            </View>
          )}
        </SafeAreaView>
      </Modal>
    );
  };

  async componentDidMount() {
    const token = await AsyncStorage.getItem("userToken");
    await this.getGamesData(token);
    console.log(this.state.data)
    // await AsyncStorage.setItem("cardGames", [1]);
  }

  render() {
    let data = this.state.filteredBy
      ? this.state.data.filter(
          item => item.category.toUpperCase() == this.state.filteredBy
        )
      : this.state.data;

    if (this.state.selectedTab == 0) {
      data = data.sort((a, b) => {
        if (a.rating < b.rating) {
          return 1;
        }
        if (a.rating > b.rating) {
          return -1;
        }
        return 0;
      });
    } else if (this.state.selectedTab == 1) {
      data = data.sort((a, b) => {
        if (a.published_at < b.published_at) {
          return 1;
        }
        if (a.published_at > b.published_at) {
          return -1;
        }
        return 0;
      });
    } else if (this.state.selectedTab == 2) {
      data = data.sort((a, b) => {
        if (a.published_at < b.published_at) {
          return -1;
        }
        if (a.published_at > b.published_at) {
          return 1;
        }
        return 0;
      });
    }

    return (
      <SafeAreaView style={styles.container}>
        <Header
          leftComponent={
            <TouchableOpacity
              style={{ marginLeft: 8 }}
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Image source={require("../../src/burgerMenu.png")} />
            </TouchableOpacity>
          }
          rightComponent={
            <TouchableOpacity
              style={{ marginRight: 12 }}
              onPress={() => this.showSearch()}
            >
              <Image source={require("../../src/search.png")} />
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
          Магазин
        </Text>

        <View
          style={{
            height: 48,
            width: "100%",
            marginTop: 8
          }}
        >
          {this.state.categories && (
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={this.state.categories}
              renderItem={itemProps => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        filteredBy:
                          itemProps.index == 0 ? undefined : itemProps.item[0]
                      })
                    }
                    style={{
                      paddingHorizontal: 20,
                      flex: 1,
                      justifyContent: "center",
                      borderBottomWidth: 2,
                      borderBottomColor: this.state.filteredBy
                        ? this.state.filteredBy == itemProps.item[0]
                          ? "#FFCE42"
                          : "#DADADA"
                        : itemProps.index == 0
                        ? "#FFCE42"
                        : "#DADADA"
                    }}
                  >
                    <Text style={{ fontFamily: "Montserrat-Regular" }}>
                      {itemProps.item[0]} ({itemProps.item[1]})
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
        {/* {this.state.categories && (
          <ScrollView
            style={{ flex: 1, backgroundColor: "red" }}
            //   data={this.state.categories}
            //   renderItem={itemProps => {
            //     return (
            //       <View>
            //         <Text>{itemProps.item}</Text>
            //       </View>
            //     );
            //   }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {this.state.categories.map(item => (
              <View>
                <Text>{item}</Text>
              </View>
            ))}
          </ScrollView>
        )} */}

        <CheckBox
          right
          checkedIcon={<Image source={require("../../src/sort.png")} />}
          uncheckedIcon={<Image source={require("../../src/sort.png")} />}
          onPress={() => this.showDialog()}
        />

        {this.renderDialog()}

        <View style={styles.shopContainer}>
          <FlatList
            data={data}
            numColumns={2}
            renderItem={({ item, index }) => (
              <CardItem
                isSecond={index % 2 == 1}
                raiting={item.rating}
                title={item.party.name}
                url={item.media.avatar}
                addFav={() => this.addItemToFavorite(item.id)}
                like={this.state.like}
                price={item.party.price}
                press={() =>
                  this.props.navigation.navigate("CardGameScreen", {
                    title: item.party.name,
                    image: item.media.avatar,
                    description: item.description,
                    age_rating: item.party.age_rating,
                    price: item.party.price,
                    id: item.id,
                    currency : item.party.currency
                  })
                }
              />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={{ margin: 1 }}
          />
        </View>
        {this.renderSearch()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: 16
    // paddingVertical : 16
  },
  sort: {
    fontSize: 12,
    color: "#333333",
    fontWeight: "100",
    marginRight: 10
  },
  btnAuth: {
    marginTop: 20,
    backgroundColor: "#0B2A5B",
    padding: 16,
    borderRadius: 5,
    marginBottom: 24
  },
  shopContainer: {
    marginTop: 3,
    height: "100%",
    backgroundColor: "white"
  },
  listChatWrapper: {
    width: "100%",
    alignItems: "center",
    flex: 1,
    paddingTop: 25
  },
  searchChanel: {
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 30,
    padding: 0,
    paddingLeft: 5,
    paddingRight: 5,
    width: "70%",
    textAlign: "center",
    marginBottom: 25
  },
  dialog: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    backgroundColor: Colors.white,
    width: Dimensions.get("window").width,
    marginLeft: -20,
    marginBottom: -60
  },
  roundedDialog: {
    backgroundColor: Colors.white,
    marginBottom: Constants.isIphoneX ? 0 : 20,
    borderRadius: 12
  },
  button: {
    margin: 5,
    alignSelf: "flex-start"
  },
  verticalScroll: {
    marginTop: 20
  },
  horizontalTextContainer: {
    alignSelf: "center",
    position: "absolute",
    top: 10
  },
  modalButton: {
    backgroundColor: "transparent",
    justifyContent: "flex-start"
  },
  modalWrapper: {
    padding: 16
  },
  buttonTitle: {
    marginLeft: 10,
    fontSize: 16
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

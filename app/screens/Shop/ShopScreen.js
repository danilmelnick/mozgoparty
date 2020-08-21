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
import Orientation from "react-native-orientation";
import Loader from "../../components/Loader";
import {
  Button,
  Dialog,
  Colors,
  PanningProvider,
  Constants
} from "react-native-ui-lib";
import { Header } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";

import CardItem from "../../components/CardItem";

export default class ShopScreen extends Component {
  flatListRef = undefined;

  constructor(props) {
    super(props);

    this.SCROLL_TYPE = {
      NONE: "none",
      VERTICAL: "vertical",
      HORIZONTAL: "horizontal"
    };

    this.state = {
      data: [],
      count: 0,
      visible: false,
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
      showenTab: 1,
      selectedTab: 1,
      categories: []
    };
  }

  componentDidUpdate() {
    Orientation.lockToPortrait();
  }

  getItems = async () => {
    let items = JSON.parse(await AsyncStorage.getItem("cardGames"));
    this.setState({ count: items ? items.length : 0 });
  };

  addItemToFavorite = async id => {
    let arr = this.state.favGames;
    arr.push(id);
    this.setState({ favGames: arr });
    if (this.state.like === false) {
      await AsyncStorage.setItem(
        "favArray",
        JSON.stringify(this.state.favGames)
      );
    } else {
    }
  };

  showDialog = () => {
    this.setState({ showDialog: true });
  };

  hideDialog = () => {
    this.setState({ showDialog: false });
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

  getGamesData = async () => {
    this.setState({ visible: true });

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
      this.setState({ data: json });

      const categories = [];

      categories.push(["ВСЕ", json.length]);
      categories.push([
        "КЛАССИЧЕСКИЕ",
        json.filter(item => item.category.toUpperCase() == "КЛАССИЧЕСКАЯ ИГРА")
          .length
      ]);
      categories.push([
        "ТЕМАТИЧЕСКИЕ",
        json
          .filter(item => item.category.toUpperCase() == "ТЕМАТИЧЕСКАЯ")
          .filter(item => item.party.price > 0).length
      ]);
      categories.push([
        "ДЕТСКИЕ",
        json.filter(item => item.category.toUpperCase() == "ДЕТСКАЯ").length
      ]);
      categories.push([
        "СПЕЦИАЛЬНЫЕ",
        json.filter(item => item.category.toUpperCase() == "СПЕЦИАЛЬНАЯ").length
      ]);

      this.setState({ categories });
    } catch (error) {
      console.error("Ошибка:", error);
    }

    this.setState({ visible: false });
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
        <SafeAreaView style={{ flex: 1 }}>
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
              placeholderTextColor={"#979797"}
              style={{
                color: "#333333",
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
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
                style={{ flex: 1 }}
                data={data}
                numColumns={2}
                renderItem={({ item, index }) => {
                  return (
                    <CardItem
                      isSecond={index % 2 == 1}
                      raiting={item.rating}
                      title={item.party.name}
                      url={item.media.avatar}
                      addFav={() => this.addItemToFavorite(item.id)}
                      like={this.state.like}
                      price={item.party.price}
                      isNew={item.party.show_on_main_page}
                      press={() => {
                        this.setState({ showSearch: false });

                        this.props.navigation.navigate("CardGameScreen", {
                          item: item,
                          title: item.party.name,
                          image: item.media.avatar,
                          description: item.description,
                          age_rating: item.party.age_rating,
                          price: item.party.price,
                          rating: item.rating,
                          id: item.id,
                          size: item.size,
                          isTop: item.popular_rank != null,
                          isNew: item.party.show_on_main_page,
                          currency: item.party.currency
                        });
                      }}
                    />
                  );
                }}
                keyExtractor={item => item.id}
                contentContainerStyle={{ margin: 1 }}
              />
            </View>
          )}
        </SafeAreaView>
      </Modal>
    );
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
    await this.getGamesData();
    this.getItems();

    this.props.navigation.addListener("didFocus", () => {
      this.getItems();
    });
    // await AsyncStorage.setItem("cardGames", [1]);
  }

  render() {
    let data = this.state.filteredBy
      ? this.state.data
          .filter(item =>
            item.category
              .toUpperCase()
              .includes(this.state.filteredBy.substring(0, 4))
          )
          .filter(item => {
            return item.category.toUpperCase().includes("ТЕМАТИЧЕСКАЯ")
              ? item.party.price > 0
              : true;
          })
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
        <Loader visible={this.state.visible} />
        <Header
          leftComponent={
            <TouchableOpacity
              style={{ marginLeft: 8 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Image
                style={{ width: 20, height: 14 }}
                source={require("../../src/burgerMenu.png")}
              />
            </TouchableOpacity>
          }
          rightComponent={
            <TouchableOpacity
              style={{ marginRight: 12 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
                    onPress={() => {
                      this.flatListRef.scrollToOffset({
                        animated: false,
                        offset: 0
                      });
                      this.setState({
                        filteredBy:
                          itemProps.index == 0 ? undefined : itemProps.item[0]
                      });
                    }}
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
            ref={ref => (this.flatListRef = ref)}
            data={data}
            numColumns={2}
            renderItem={({ item, index }) => {
              return (
                <CardItem
                  isSecond={index % 2 == 1}
                  raiting={item.rating}
                  title={item.party.name}
                  url={item.media.avatar}
                  addFav={() => this.addItemToFavorite(item.id)}
                  like={this.state.like}
                  isNew={item.party.show_on_main_page}
                  price={item.party.price}
                  press={() => {
                    this.props.navigation.navigate("CardGameScreen", {
                      item: item,
                      title: item.party.name,
                      image: item.media.avatar,
                      description: item.description,
                      age_rating: item.party.age_rating,
                      price: item.party.price,
                      rating: item.rating,
                      id: item.id,
                      size: item.size,
                      isTop: item.popular_rank != null,
                      isNew: item.party.show_on_main_page,
                      currency: item.party.currency
                    });
                  }}
                />
              );
            }}
            keyExtractor={item => item.id}
            contentContainerStyle={{ margin: 1 }}
          />
        </View>
        {this.renderSearch()}
        {this.renderFootBtn()}
      </SafeAreaView>
    );
  }

  renderFootBtn() {
    if (this.state.count === 0) {
      return null;
    }

    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          backgroundColor: "#0B2A5B",
          padding: 16,
          marginHorizontal: 16,
          borderRadius: 5,
          textAlign: "left",
          marginTop: 16,
          marginBottom: 20
        }}
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
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    flex: 1
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
    backgroundColor: "white",
    flex: 1
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
    marginBottom: -60,
    paddingBottom: 20
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
    padding: 16,
    marginBottom: 20
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

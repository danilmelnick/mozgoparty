import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActionSheetIOS
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import userDataAction from "../../actions/userDataAction";
import setDownload from "../../actions/setDownload";
import { connect } from "react-redux";
var RNFS = require("react-native-fs");

let filesCount = 100;

class GameCard extends Component {
  state = {
    game: undefined,
    runCount: 3,
    startLoading: false
  };

  async componentDidMount() {
    this.countGame();

    const item = this.props.item;
    // await AsyncStorage.setItem(item.id.toString(), undefined);
    const data = await AsyncStorage.getItem(item.id.toString());
    data && this.setState({ game: JSON.parse(data) });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.download.gameId == this.props.item.id) {
      this.setState({ startLoading: true });
    }
  }

  countGame = async () => {
    const item = this.props.item;

    try {
      const response = await fetch(
        "https://api.party.mozgo.com/count/" + item.hash,
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
      this.setState({ runCount: json.total - json.runs });
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  loadGame = async () => {
    if (this.state.startLoading) {
      this.setState({ startLoading: false });
      return;
    }

    this.setState({ startLoading: true });

    const item = this.props.item;
    let notSavedFile = true;

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

      let jsonString = JSON.stringify(json);

      filesCount = jsonString.split("https://").length;
      console.log("filesCount", filesCount);

      while (jsonString.indexOf("https://") != -1 && this.state.startLoading) {
        const firstIndexOfHttps = jsonString.indexOf("https://");
        const lastLinkIndex = jsonString.indexOf('"', firstIndexOfHttps);
        const url = jsonString.slice(firstIndexOfHttps, lastLinkIndex);
        const splitUrl = url.split("/");
        const fileName = splitUrl[splitUrl.length - 1];
        console.log(firstIndexOfHttps, lastLinkIndex, url, fileName);

        const download = RNFS.downloadFile({
          fromUrl: url,
          toFile: RNFS.DocumentDirectoryPath + "/" + fileName
        });
        const result = await download.promise;

        jsonString = jsonString.replace(
          url,
          "file://" + RNFS.DocumentDirectoryPath + "/" + fileName
        );

        this.props.setDownload({
          persent: this.props.download.persent + 1,
          gameId: item.id.toString()
        });
      }

      if (this.state.startLoading) {
        await AsyncStorage.setItem(item.id.toString(), jsonString);
        this.setState({ game: JSON.parse(jsonString), startLoading: false });
        console.log("SAVE");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  renderDownloadView = () => {
    return (
      this.state.startLoading && (
        <View style={{}}>
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
              {Math.floor((this.props.download.persent / filesCount) * 100) +
                "%"}
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
                  this.props.download.persent > filesCount / 4
                    ? this.props.download.persent > filesCount / 2
                      ? this.props.download.persent >
                        filesCount / 2 + filesCount / 4
                        ? "#6FCF97"
                        : "#FFCE42"
                      : "#F2994A"
                    : "#EB5757",
                borderRadius: 10,
                width: (this.props.download.persent / filesCount) * 100 + "%"
              }}
            />
          </View>
        </View>
      )
    );
  };

  render() {
    return (
      <TouchableOpacity
        disabled={this.props.onPress == undefined}
        onPress={this.props.onPress}
      >
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 10,
            paddingHorizontal: 16
          }}
        >
          <Image
            style={{ width: 80, height: 80, borderRadius: 5 }}
            source={{ uri: this.props.image }}
          />

          <View style={{ flex: 1, marginLeft: 8 }}>
            {this.props.rating && (
              <View style={{ flexDirection: "row", marginBottom: 4 }}>
                <Image
                  source={require("../../src/rating.png")}
                  style={{ width: 13.33, height: 13.33, marginRight: 3 }}
                />
                <Text style={styles.rating}>{this.props.rating}</Text>
              </View>
            )}
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                fontFamily: "Montserrat-Medium",
                color: "#333333",
                marginTop: 2
              }}
            >
              {this.props.title}
            </Text>
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              {!this.props.isMyGame && (
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    fontFamily: "Montserrat-Medium",
                    color: "#BD006C"
                  }}
                >
                  {this.props.price / 100} {this.props.currency}
                </Text>
              )}
            </View>
            {this.props.isMyGame &&
              !this.state.game &&
              !this.state.startLoading &&
              this.state.runCount !== 0 && (
                <TouchableOpacity
                  onPress={() => this.loadGame()}
                  style={{ alignItems: "flex-end" }}
                >
                  <Image source={require("../../src/download.png")} />
                </TouchableOpacity>
              )}
            {this.state.runCount > 0 && this.renderDownloadView()}
            {this.props.isMyGame &&
              (this.state.game || this.state.runCount === 0) && (
                <Text
                  style={{
                    color: "#979797",
                    fontFamily: "Montserrat-Regular",
                    fontSize: 10
                  }}
                >
                  {this.state.runCount > 0
                    ? "Загружено"
                    : "Нет доступных запусков"}
                </Text>
              )}
          </View>

          {!this.props.isMyGame && (
            <TouchableOpacity
              onPress={() => this.showActionImageMenu(this.props.item)}
            >
              <Image source={require("../../src/moreButtons.png")} />
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{ backgroundColor: "#DADADA", height: 1, width: "100%" }}
        />
      </TouchableOpacity>
    );
  }

  showActionImageMenu = element => {
    let options = ["Отменить", "Применить промокод", "Удалить из корзины"];

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0
      },
      buttonIndex => {
        if (buttonIndex === 2) {
          this.props.onDelete(element);
        } else if (buttonIndex === 1) {
          this.props.onPromoCode();
        }
      }
    );
  };
}

const mapStateToProps = state => {
  // console.log("mapStateToProps >>>>>>>>", state);
  // console.log(JSON.stringify(state));
  return {
    user: state.userData,
    download: state.userData.download || { persent: 0 }
  };
};
const mapDispatchToProps = dispatch => {
  return {
    userDataAction: token => dispatch(userDataAction(token)),
    setDownload: token => dispatch(setDownload(token))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameCard);

const styles = StyleSheet.create({
  rating: {
    color: "#979797",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Montserrat-Regular",
    alignItems: "center"
  }
});

import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActionSheetIOS,
  SafeAreaView
} from "react-native";
import { Header } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import userDataAction from "../../actions/userDataAction";
import setDownload, {
  setCancelDownloadVariable
} from "../../actions/setDownload";
import { connect } from "react-redux";
import { WebView } from "react-native-webview";
import Loader from "../../components/Loader";

class Payment extends Component {
  interval;

  state = {
    visible: false,
    token: undefined
  };

  getToken = async () => {
    const res = await AsyncStorage.getItem("userToken");
    if (res) {
      const token = res.slice(1, -1);
      this.setState({ token });
    }
  };

  sendCheckRequest = async () => {
    const id = this.props.navigation.state.params.id;

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
        clearInterval(interval);
        this.props.userDataAction(this.state.token);
        await AsyncStorage.setItem("cardGames", JSON.stringify([]));
        this.props.navigation.navigate("MyGamesScreen");
      }
    } catch (err) {}
  };

  async componentDidMount() {
    await this.getToken();

    this.setState({ visible: true });

    interval = setInterval(() => {
      this.sendCheckRequest();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(interval);
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Loader visible={this.state.visible} />

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
        <WebView
          onLoadEnd={() => {
            this.setState({ visible: false });
          }}
          source={{ uri: this.props.navigation.state.params.url }}
          goBack={() => {}}
          onMessage={() => {}}
        />
      </SafeAreaView>
    );
  }
}

const styles = {
  header: {
    backgroundColor: "transparent",
    borderBottomWidth: 0.4,
    paddingBottom: 0,
    borderBottomColor: "transparent",
    paddingTop: 0,
    height: 44
  }
};

const mapStateToProps = state => {
  return {
    user: state.userData,
    download: state.userData.download || { persent: 0 },
    game: state.userData.game || {}
  };
};
const mapDispatchToProps = dispatch => {
  return {
    userDataAction: token => dispatch(userDataAction(token)),
    setDownload: token => dispatch(setDownload(token)),
    setCancelDownloadVariable: (cancel, gameId) =>
      dispatch(setCancelDownloadVariable(cancel, gameId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);

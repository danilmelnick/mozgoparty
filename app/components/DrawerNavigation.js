import React, { Component } from "react";
import { NavigationActions } from "react-navigation";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import Icon from "../components/Icon";
import userDataAction from "../actions/userDataAction";
import { connect } from "react-redux";

class drawerContentComponents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: ""
    };
  }

  navigateToScreen = route => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  };

  getToken = async () => {
    const res = await AsyncStorage.getItem("userToken");
    console.log("TOKEN,", res);
    if (!res) {
      this.setState({ token: undefined });
      return;
    }
    const token = res.slice(1, -1);
    this.setState({ token });
  };

  async componentDidUpdate(prevProps) {
    const isDrawerOpen = this.props.navigation.state.isDrawerOpen;
    const wasDrawerOpen = prevProps.navigation.state.isDrawerOpen;

    if (!wasDrawerOpen && isDrawerOpen) {
      console.log("componentDidUpdate");

      await this.getToken();
      await this.props.userDataAction(this.state.token);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { avatar_url } = nextProps.user.userInfo;
    console.log("prefetch", avatar_url);

    avatar_url && Image.prefetch(avatar_url);
    avatar_url && Image.queryCache([avatar_url]);
  }

  async componentDidMount() {
    await this.getToken();
    await this.props.userDataAction(this.state.token);
  }

  render() {
    const { name, email, avatar_url } = this.props.user.userInfo;

    const { token } = this.state;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.headerContainer}
          onPress={() => {
            if (token) {
              this.props.navigation.navigate("Profile");
              this.props.navigation.goBack();
            } else {
              this.props.navigation.navigate("AuthScreen");
            }
          }}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Image
              source={
                avatar_url ? { uri: avatar_url } : require("../src/noAuth.png")
              }
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                marginBottom: 12
              }}
            />
            <Text style={styles.headerText}>
              {token ? name : "Войти в аккаунт"}
            </Text>
            <Text style={styles.subText}>{token ? email : ""}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.screenContainer}>
          <TouchableOpacity
            style={[
              styles.screenStyle,
              this.props.activeItemKey == "MyGames"
                ? styles.activeBackgroundColor
                : null
            ]}
            onPress={() => {
              if (token) {
                this.props.navigation.navigate("MyGames");
                this.props.navigation.goBack();
              } else {
                this.props.navigation.navigate("AuthScreen");
              }
            }}
          >
            <Icon
              src={
                this.props.activeItemKey == "MyGames"
                  ? require("../src/purchasesActive.png")
                  : require("../src/purchases.png")
              }
              h={24}
              w={24}
            />
            <Text
              style={[
                styles.screenTextStyle,
                this.props.activeItemKey == "MyGames"
                  ? styles.activeBackgroundColor
                  : styles.selectedTextStyle
              ]}
            >
              Мои игры
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.screenStyle,
              this.props.activeItemKey == "Shop"
                ? styles.activeBackgroundColor
                : styles.selectedTextStyle
            ]}
            onPress={() => {
              this.props.navigation.navigate("Shop", {
                token: token
              });
              this.props.navigation.goBack();
            }}
          >
            <Icon
              src={
                this.props.activeItemKey == "Shop"
                  ? require("../src/joystickActive.png")
                  : require("../src/joystick.png")
              }
              h={24}
              w={24}
            />
            <Text
              style={[
                styles.screenTextStyle,
                this.props.activeItemKey == "Shop"
                  ? styles.activeBackgroundColor
                  : styles.selectedTextStyle
              ]}
            >
              Магазин MozgoParty
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.screenContainer}>
          <TouchableOpacity
            style={[
              styles.screenStyle,
              this.props.activeItemKey == "ScreenA"
                ? styles.activeBackgroundColor
                : null
            ]}
            onPress={() => {
              this.props.navigation.navigate("SupportGroup");
              this.props.navigation.goBack();
            }}
          >
            <Icon
              src={
                this.props.activeItemKey == "SupportGroup"
                  ? require("../src/forumsActive.png")
                  : require("../src/forums.png")
              }
              h={24}
              w={24}
            />
            <Text
              style={[
                styles.screenTextStyle,
                this.props.activeItemKey == "SupportGroup"
                  ? styles.activeBackgroundColor
                  : styles.selectedTextStyle
              ]}
            >
              Служба поддержки
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.screenStyle,
              this.props.activeItemKey == "ScreenA"
                ? styles.activeBackgroundColor
                : null
            ]}
            onPress={() => this.props.navigation.navigate("Faq")}
          >
            <Icon
              src={
                this.props.activeItemKey == "Faq"
                  ? require("../src/faqActive.png")
                  : require("../src/faq.png")
              }
              h={24}
              w={24}
            />
            <Text
              style={[
                styles.screenTextStyle,
                this.props.activeItemKey == "Faq"
                  ? styles.activeBackgroundColor
                  : styles.selectedTextStyle
              ]}
            >
              FAQ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.screenStyle,
              this.props.activeItemKey == "ScreenA"
                ? styles.activeBackgroundColor
                : null
            ]}
            onPress={() => {
              this.props.navigation.navigate("GamesGuide");
              this.props.navigation.goBack();
            }}
          >
            <Icon
              src={
                this.props.activeItemKey == "GamesGuide"
                  ? require("../src/informationActive.png")
                  : require("../src/information.png")
              }
              h={24}
              w={24}
            />
            <Text
              style={[
                styles.screenTextStyle,
                this.props.activeItemKey == "GamesGuide"
                  ? styles.activeBackgroundColor
                  : styles.selectedTextStyle
              ]}
            >
              Руководство к играм
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.screenStyle,
            { marginTop: 16 },
            this.props.activeItemKey == "ScreenA"
              ? styles.activeBackgroundColor
              : null
          ]}
          onPress={() => {
            this.props.navigation.navigate("SettingsStack");
            this.props.navigation.goBack();
          }}
        >
          <Icon
            src={
              this.props.activeItemKey == "SettingsStack"
                ? require("../src/settingsActive.png")
                : require("../src/settings.png")
            }
            h={24}
            w={24}
          />
          <Text
            style={[
              styles.screenTextStyle,
              this.props.activeItemKey == "SettingsStack"
                ? styles.activeBackgroundColor
                : styles.selectedTextStyle
            ]}
          >
            Настройки
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => {
  console.log("mapStateToProps >>>>>>>>");
  // alert(JSON.stringify(state));
  return {
    user: state.userData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userDataAction: token => dispatch(userDataAction(token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(drawerContentComponents);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: "100%"
  },
  headerContainer: {
    height: "26%",
    width: "100%",
    borderBottomColor: "rgba(0, 0, 0, 0.12)",
    borderBottomWidth: 1,
    paddingHorizontal: 16
  },
  headerText: {
    color: "rgba(0, 0, 0, 0.87)",
    fontWeight: "500",
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
    marginBottom: 5
  },
  subText: {
    color: "rgba(0, 0, 0, 0.54)",
    fontWeight: "500",
    fontSize: 14,
    fontFamily: "Montserrat-Regular"
  },
  screenContainer: {
    paddingTop: 20,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.12)",
    paddingBottom: 12
  },
  screenStyle: {
    height: 30,
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 16
  },
  screenTextStyle: {
    fontSize: 20,
    marginLeft: 20,
    textAlign: "center"
  },
  selectedTextStyle: {
    fontWeight: "600",
    color: "#333333",
    fontFamily: "Montserrat-Regular",
    fontSize: 14
  },
  activeBackgroundColor: {
    fontWeight: "600",
    color: "#0B2A5B",
    fontFamily: "Montserrat-Regular",
    fontSize: 14
  }
});

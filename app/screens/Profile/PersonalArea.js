import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ActionSheetIOS,
  Alert,
  ImageBackground
} from "react-native";
import ImagePicker from "react-native-image-picker";
import AsyncStorage from "@react-native-community/async-storage";
import userDataAction from "../../actions/userDataAction";
import logoutAction from "../../actions/logoutAction";
import { connect } from "react-redux";
import Loader from "../../components/Loader";
import { Header } from "react-native-elements";
import ImageResizer from "react-native-image-resizer";
import Icon from "../../components/Icon";
import { SafeAreaView } from "react-native-safe-area-context";

class PersonalArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null,
      visible: false,
      hasChanges: false,
      nameChanged: undefined,
      emailChanged: undefined,
      phoneChanged: undefined,
      name: undefined,
      email: undefined,
      phone: undefined
    };
  }

  static navigationOptions = {
    drawerLabel: "Home",
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require("../../src/check.png")}
        style={[styles.icon, { tintColor: tintColor }]}
      />
    )
  };

  getToken = async () => {
    const res = await AsyncStorage.getItem("userToken");
    const token = res.slice(1, -1);
    this.setState({ token });
  };

  async componentDidMount() {
    await this.getToken();
    await this.props.userDataAction(this.state.token);
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.user.userInfo) {
      const { name, email, phone } = nextprops.user.userInfo;
      this.setState({ name, email, phone });
    }
  }

  change = async () => {
    this.setState({ visible: true });

    const { email, phone, name } = this.state;
    const settings = {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      },
      body: JSON.stringify({
        email: email,
        phone,
        name
      })
    };
    try {
      const data = await fetch(
        `https://api.base.mozgo.com/api/users/` + this.props.user.userInfo.id,
        settings
      );
      const json = await data.json();
      console.log("Update >>>>>>>>>>>" + JSON.stringify(json), data);

      if (data.status == 422) {
        let error = "";
        if (json.errors.password) {
          error = json.errors.password[0];
        } else if (json.errors.name) {
          error = json.errors.name[0];
        } else if (json.errors.phone) {
          error = json.errors.phone[0];
        } else if (json.errors.email) {
          error = json.errors.email[0];
        }

        this.setState({ visible: false }, () => {
          setTimeout(() => {
            Alert.alert(error, "", [
              {
                text: "OK",
                style: "default"
              }
            ]);
          }, 200);
        });
      } else {
        this.setState({ visible: false }, () => {
          setTimeout(() => {
            Alert.alert("Данные успешно изменены", undefined, [
              {
                text: "OK"
              }
            ]);
          }, 200);
        });

        await this.props.userDataAction(this.state.token);
      }
    } catch (error) {
      alert(error);
    }
  };

  showActionMenu = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Отменить", "Изменить пароль", "Выйти"],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          this.props.navigation.navigate("ChangePass");
        } else if (buttonIndex === 2) {
          AsyncStorage.setItem("userToken", "");
          this.props.logoutAction();
          this.props.navigation.navigate("ShopScreen");
        }
      }
    );
  };

  loadAvatar = async url => {
    this.setState({ visible: true });

    const res = await ImageResizer.createResizedImage(url, 200, 200, "PNG", 50);

    let body = new FormData();
    body.append("avatar", {
      uri: res.uri,
      name: "photo.png",
      filename: "imageName.png",
      type: "image/png"
    });
    body.append("Content-Type", "image/png");

    const settings = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + this.state.token
      },
      body
    };
    try {
      const data = await fetch(
        `https://api.base.mozgo.com/partners/avatar/`,
        settings
      );
      const json = await data.json();

      await this.props.userDataAction(this.state.token);
      setTimeout(() => {
        this.setState({ visible: false });
      }, 1000);
    } catch (error) {
      alert(error);
      this.setState({ visible: false });
    }
  };

  deleteAvatar = async () => {
    this.setState({ visible: true });

    const settings = {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      }
    };
    try {
      const data = await fetch(
        `https://api.base.mozgo.com/partners/avatar/`,
        settings
      );
      const json = await data.json();

      console.log(json);

      await this.props.userDataAction(this.state.token);
    } catch (error) {
      alert(error);
    }

    this.setState({ visible: false });
  };

  showActionImageMenu = () => {
    let options = ["Отменить", "Загрузить из галереи", "Сделать снимок"];

    if (this.props.user.userInfo.avatar_url) {
      options.push("Удалить фото");
    }

    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: "Выбрать фото",
        options,
        destructiveButtonIndex: 3,
        cancelButtonIndex: 0
      },
      buttonIndex => {
        if (buttonIndex === 2) {
          ImagePicker.launchCamera(options, response => {
            this.loadAvatar(response.uri);
          });
        } else if (buttonIndex === 1) {
          ImagePicker.launchImageLibrary(options, response => {
            this.loadAvatar(response.uri);
          });
        } else if (buttonIndex === 3) {
          this.deleteAvatar();
        }
      }
    );
  };

  render() {
    let { loading } = this.props.user;

    if (!loading == true) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator color={"#000"} />
        </View>
      );
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
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
                style={{ marginRight: 6 }}
                onPress={() => this.showActionMenu()}
              >
                <Image source={require("../../src/more.png")} />
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
            Аккаунт
          </Text>

          <View style={styles.PersonalAreaWrapper}>
            <View style={{ width: 80, height: 80, marginBottom: 25 }}>
              <View
                style={{
                  borderRadius: 40,
                  overflow: "hidden",
                  width: 80,
                  height: 80
                }}
              >
                <Image
                  source={
                    this.props.user.userInfo.avatar_url
                      ? { uri: this.props.user.userInfo.avatar_url }
                      : require("../../src/avatarDefault.png")
                  }
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    marginBottom: 29
                  }}
                />
              </View>
              <TouchableOpacity
                style={{ position: "absolute", right: -5, bottom: -5 }}
                onPress={this.showActionImageMenu}
              >
                <Image source={require("../../src/edit.png")} />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                color: "#979797",
                fontSize: 12,
                fontFamily: "Montserrat-Regular",
                paddingLeft: 10
              }}
            >
              Имя и фамилия
            </Text>
            <TextInput
              style={[
                styles.inputForm,
                {
                  borderBottomColor: this.state.nameChanged
                    ? "#0B2A5B"
                    : "rgba(0, 0, 0, 0.38)"
                }
              ]}
              value={this.state.name}
              onChangeText={name =>
                this.setState({ name, hasChanges: true, nameChanged: true })
              }
            />

            <Text
              style={{
                color: "#979797",
                fontSize: 12,
                fontFamily: "Montserrat-Regular",
                paddingLeft: 10
              }}
            >
              Номер телефона
            </Text>
            <TextInput
              style={[
                styles.inputForm,
                {
                  borderBottomColor: this.state.phoneChanged
                    ? "#0B2A5B"
                    : "rgba(0, 0, 0, 0.38)"
                }
              ]}
              value={this.state.phone}
              onChangeText={phone =>
                this.setState({ phone, hasChanges: true, phoneChanged: true })
              }
            />

            <Text
              style={{
                color: "#979797",
                fontSize: 12,
                fontFamily: "Montserrat-Regular",
                paddingLeft: 10
              }}
            >
              E-mail
            </Text>
            <TextInput
              style={[
                styles.inputForm,
                {
                  borderBottomColor: this.state.emailChanged
                    ? "#0B2A5B"
                    : "rgba(0, 0, 0, 0.38)"
                }
              ]}
              value={this.state.email}
              onChangeText={email => {
                this.setState({ email, hasChanges: true, emailChanged: true });
              }}
            />

            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                marginBottom: 30
              }}
            >
              <TouchableOpacity
                disabled={!this.state.hasChanges}
                onPress={() => this.change()}
                style={{
                  backgroundColor: !this.state.hasChanges
                    ? "#DADADA"
                    : "#0B2A5B",
                  height: 44,
                  borderRadius: 5,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "#fff",
                    fontFamily: "Montserrat-Regular",
                    fontSize: 17
                  }}
                >
                  Сохранить изменения
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
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
    userDataAction: token => dispatch(userDataAction(token)),
    logoutAction: () => dispatch(logoutAction())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonalArea);

const styles = StyleSheet.create({
  PersonalAreaWrapper: {
    flex: 1,
    paddingTop: 24,
    marginTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 24
  },
  PersonInfoWrapper: {
    paddingHorizontal: 12,
    marginBottom: 32
  },
  inputForm: {
    height: 40,
    fontFamily: "Montserrat-Regular",
    borderBottomWidth: 1,
    paddingLeft: 9,
    paddingRight: 15,
    borderBottomColor: "rgba(0, 0, 0, 0.38)",
    fontSize: 16,
    marginBottom: 25
  },
  PersonInfoTitle: {
    color: "#979797",
    fontSize: 12,
    lineHeight: 16
  },
  PersonInfoDesc: {
    color: "#333333",
    fontSize: 16,
    lineHeight: 24
  },
  PersonalActionButtonsWrapper: {
    marginTop: 19
  },
  PersonalActionButton: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#DADADA",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 5
  },
  PersonalActionButtonText: {
    color: "#333333",
    textAlign: "center",
    textTransform: "uppercase"
  },
  PersonalLogoutButtonText: {
    color: "#ED1C24",
    textAlign: "center",
    textTransform: "uppercase"
  },
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 0.4,
    paddingBottom: 0,
    borderBottomColor: "white",
    paddingTop: 0,
    height: 44
  },
  preloader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

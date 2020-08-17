import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import userDataAction from "../../actions/userDataAction";
import { connect } from "react-redux";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-community/async-storage";
import Loader from "../../components/Loader";

class ChangePass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPass: "",
      newPass: "",
      visible: false,
      repeatPass: ""
    };
  }

  componentDidMount() {
    this.getToken();
  }

  getToken = async () => {
    const res = await AsyncStorage.getItem("userToken");
    const token = res.slice(1, -1);
    this.setState({ token });
  };

  savePassword = async () => {
    this.setState({ visible: true });

    const { oldPass, newPass, repeatPass } = this.state;
    console.log(oldPass, newPass, repeatPass);

    const settings = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + this.state.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password: oldPass,
        new_password: newPass,
        new_password_confirmation: repeatPass
      })
    };

    try {
      const data = await fetch(
        `https://api.base.mozgo.com/players/password/reset`,
        settings
      );
      const json = await data.json();
      console.log("Resp >>>>>>>>>>>" + JSON.stringify(json));
      console.log(data);

      if (data.status == 422) {
        let error = "";
        if (json.errors.new_password) {
          error = json.errors.new_password[0];
        } else if (json.errors.password) {
          error = json.errors.password[0];
        } else if (json.errors.new_passwordd_confirmation) {
          error = json.errors.new_passwordd_confirmation[0];
        }

        Alert.alert(error, "", [
          {
            text: "OK",
            style: "default"
          }
        ]);
      } else {
        Alert.alert("Пароль успешно сброшен!", "", [
          {
            text: "OK",
            style: "default"
          }
        ]);
      }
    } catch (error) {
      alert(error);
    }

    this.setState({ visible: false });
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.ChangePassWrapper}>
          <Loader visible={this.state.visible} />
          <Header
            title={"Изменить пароль"}
            onPressLeftButton={() => {
              this.props.navigation.goBack();
            }}
          />

          <View style={{ marginBottom: 15, marginTop: 30 }}>
            {this.state.oldPass != "" && (
              <Text
                style={{
                  color: "#979797",
                  fontSize: 12,
                  fontFamily: "Montserrat-Regular",
                  paddingLeft: 10
                }}
              >
                Текущий пароль
              </Text>
            )}
            <TextInput
              secureTextEntry={true}
              placeholder={"Текущий пароль"}
              placeholderTextColor={"#979797"}
              style={styles.inputForm}
              onChangeText={oldPass => this.setState({ oldPass })}
            />
            {this.state.newPass != "" && (
              <Text
                style={{
                  color: "#979797",
                  fontSize: 12,
                  fontFamily: "Montserrat-Regular",
                  paddingLeft: 10
                }}
              >
                Новый пароль
              </Text>
            )}
            <TextInput
              style={styles.inputForm}
              placeholder={"Новый пароль"}
              placeholderTextColor={"#979797"}
              onChangeText={newPass => this.setState({ newPass })}
              secureTextEntry={true}
            />
            {this.state.repeatPass != "" && (
              <Text
                style={{
                  color: "#979797",
                  fontSize: 12,
                  fontFamily: "Montserrat-Regular",
                  paddingLeft: 10
                }}
              >
                Повторите пароль
              </Text>
            )}
            <TextInput
              style={styles.inputForm}
              placeholder={"Повторите пароль"}
              placeholderTextColor={"#979797"}
              onChangeText={repeatPass => this.setState({ repeatPass })}
              secureTextEntry={true}
            />
          </View>

          <TouchableOpacity
            onPress={() => this.savePassword()}
            disabled={
              this.state.oldPass == "" ||
              this.state.repeatPass == "" ||
              this.state.newPass == ""
            }
            style={[
              styles.btnAuth,
              {
                backgroundColor:
                  this.state.oldPass == "" ||
                  this.state.repeatPass == "" ||
                  this.state.newPass == ""
                    ? "#DADADA"
                    : "#0B2A5B"
              }
            ]}
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

          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() =>
              this.props.navigation.navigate("RecoverProfileScreeen")
            }
          >
            <Text
              style={{
                fontSize: 12,
                marginTop: 32,
                color: "#0B2A5B",
                fontWeight: "600",
                fontFamily: "Montserrat-Bold"
              }}
            >
              Забыли пароль?
            </Text>
          </TouchableOpacity>
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
    userDataAction: token => dispatch(userDataAction(token))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePass);

const styles = StyleSheet.create({
  ChangePassWrapper: {
    paddingHorizontal: 16
  },
  btnAuth: {
    backgroundColor: "#0B2A5B",
    height: 44,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  ChangePassInputWrapper: {
    position: "relative",
    marginBottom: 30,
    justifyContent: "flex-end"
  },
  ChangePassDecorText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#979797",
    position: "absolute",
    top: 19,
    left: 12
  },
  ChangePassDecorTextActive: {
    top: 0,
    fontSize: 12,
    lineHeight: 16
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
  PassInput: {
    paddingHorizontal: 12,
    paddingTop: 19,
    paddingBottom: 6,
    borderBottomWidth: 1,
    fontSize: 16,
    lineHeight: 24,
    color: "#333333",
    borderBottomColor: "rgba(0, 0, 0, 0.38)"
  },
  ForgotPassWrapper: {
    marginTop: 11,
    alignItems: "center"
  },
  ForgotPassText: {
    fontSize: 12,
    lineHeight: 15,
    color: "#0B2A5B",
    textDecorationLine: "underline"
  }
});

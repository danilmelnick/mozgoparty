import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from "react-native";
import { connect } from "react-redux";
import Loader from "../../components/Loader";
import AsyncStorage from "@react-native-community/async-storage";
import userDataAction from "../../actions/userDataAction";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

class AuthScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      visible: false
    };
  }

  auth = async () => {
    this.setState({ visible: true });

    const { email, password } = this.state;
    const settings = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    };
    try {
      const data = await fetch(`https://api.base.mozgo.com/login`, settings);
      const json = await data.json();
      console.log("Resp >>>>>>>>>>>" + JSON.stringify(json));

      if (JSON.stringify(json.access_token)) {
        await AsyncStorage.setItem(
          "userToken",
          JSON.stringify(json.access_token)
        );
        await this.props.navigation.goBack();
      } else {
        Alert.alert(`${json.errors.email}`, "", [
          {
            text: "Закрыть",
            style: "default"
          }
        ]);
      }
    } catch (error) {
      Alert.alert(error);
    }

    this.setState({ visible: false });
  };

  render() {
    const { email, password } = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styeles.container}>
          <Loader visible={this.state.visible} />

          <Header
            title={"Авторизация"}
            onPressLeftButton={() => {
              this.props.navigation.goBack();
            }}
          />
          <Text
            style={{
              marginTop: 24,
              fontFamily: "Montserrat-Regular",
              fontSize: 12,
              color: "#979797"
            }}
          >
            Для авторизации вы можете использовать логин и пароль от сайта
            mozgo.com
          </Text>
          <View style={styeles.form}>
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
              style={styeles.inputForm}
              onChangeText={email => this.setState({ email })}
            />
            <Text
              style={{
                color: "#979797",
                fontSize: 12,
                fontFamily: "Montserrat-Regular",
                paddingLeft: 10
              }}
            >
              Пароль
            </Text>
            <TextInput
              style={styeles.inputForm}
              onChangeText={password => this.setState({ password })}
              secureTextEntry={true}
            />
          </View>

          <TouchableOpacity
            onPress={() => this.auth(email, password)}
            style={styeles.btnAuth}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#fff",
                fontFamily: "Montserrat-Regular",
                fontSize: 17
              }}
            >
              Войти
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("RecoverScreeen")}
          >
            <Text
              style={{
                textAlign: "center",
                marginVertical: 32,
                marginBottom: 16,
                fontSize: 12,
                color: "#0B2A5B",
                fontWeight: "600",
                fontFamily: "Montserrat-Bold"
              }}
            >
              Забыли пароль?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() =>
              this.props.navigation.navigate("RegistrationScreeen")
            }
          >
            <Text>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  fontFamily: "Montserrat-Regular",
                  color: "#979797"
                }}
              >
                Нет аккаунта?{" "}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#0B2A5B",
                  fontWeight: "600",
                  fontFamily: "Montserrat-Bold"
                }}
              >
                Зарегистрируйтесь.
              </Text>
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
  return {};
};
const mapDispatchToProps = dispatch => {
  return {
    authorizationUser: (email, password) =>
      dispatch(userDataAction(email, password))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);

const styeles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flex: 1
  },
  text: {
    fontSize: 16,
    fontWeight: "100"
  },
  form: {
    marginVertical: 30
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
  btnAuth: {
    backgroundColor: "#0B2A5B",
    height: 44,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  }
});

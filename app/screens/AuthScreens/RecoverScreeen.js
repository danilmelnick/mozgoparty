import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

export default class RecoverScreeen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: ""
    };
  }

  isCorrectEmail = text => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(text);
  };

  recoverAction = async () => {
    const { email } = this.state;

    const settings = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email
      })
    };
    try {
      const data = await fetch(
        `https://api.base.mozgo.com/password/email`,
        settings
      );

      const json = await data.json();
      console.log("Resp >>>>>>>>>>>" + JSON.stringify(json));

      if (data.status == 200) {
        Alert.alert(
          "Письмо с сылкой на сброс пароля отправленно на почту",
          "",
          [
            {
              text: "OK",
              style: "default"
            }
          ]
        );
      } else if (data.status == 422) {
        Alert.alert(json.errors.email[0], "", [
          {
            text: "OK",
            style: "default"
          }
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styeles.container}>
          <Header
            title={"Восстановить пароль"}
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
            Укажите адрес электронный почты, который вы использовали для
            регистрации
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
              onChangeText={text => this.setState({ email: text })}
            />
          </View>

          <TouchableOpacity
            style={styeles.btnAuth}
            onPress={() => this.recoverAction(this.state.email)}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#fff",
                fontFamily: "Montserrat-Regular",
                fontSize: 17
              }}
            >
              Восстановить пароль
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }
}

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
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    borderRadius: 5
  }
});

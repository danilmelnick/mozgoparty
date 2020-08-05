import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from "react-native";
import { CheckBox } from "react-native-elements";
import { connect } from "react-redux";
import registrationUser, {
  registrationSuccess
} from "../../actions/registrationUser";
import Loader from "../../components/Loader";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

class RegistrationScreeen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false,
      name: "",
      visible: false,
      email: "",
      phone: "",
      password: "",
      password_confirmation: ""
    };
  }

  registration = async (
    name,
    email,
    password,
    password_confirmation,
    phone
  ) => {
    this.setState({ visible: true });

    try {
      const data = await fetch("https://api.base.mozgo.com/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          password_confirmation: password_confirmation,
          phone: phone
        })
      });
      const json = await data.json();
      console.log("Resp >>>>>>>>>>>" + JSON.stringify(json));
      console.log(data);

      if (data.status == 200) {
        this.setState({ visible: false }, () => {
          setTimeout(() => {
            Alert.alert(
              "Письмо для подтверждения аккаунта направлено на указанную почту",
              "",
              [
                {
                  text: "OK",
                  style: "default",
                  onPress: () => {
                    this.props.navigation.goBack();
                  }
                }
              ]
            );
          }, 300);
        });
      } else {
        let error = "";
        if (json.errors.email) {
          error = json.errors.email[0];
        } else if (json.errors.name) {
          error = json.errors.name[0];
        } else if (json.errors.phone) {
          error = json.errors.phone[0];
        } else if (json.errors.password) {
          error = json.errors.password[0];
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
      }
    } catch (error) {
      this.setState({ visible: false });
      Alert.alert(error);
    }
  };

  render() {
    const { registrationUser } = this.props;
    const { name, email, password, password_confirmation, phone } = this.state;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styeles.container}>
          <Loader visible={this.state.visible} />
          <Header
            title={"Регистрация"}
            onPressLeftButton={() => {
              this.props.navigation.goBack();
            }}
          />

          <View style={styeles.form}>
            <TextInput
              style={styeles.inputForm}
              onChangeText={name => this.setState({ name })}
              placeholder="Имя и фамилия"
              value={this.state.name}
            />
            <TextInput
              style={styeles.inputForm}
              onChangeText={email => this.setState({ email })}
              placeholder="E-mail"
              value={this.state.email}
            />
            <TextInput
              style={styeles.inputForm}
              onChangeText={phone => this.setState({ phone })}
              placeholder="Номер телефона"
              value={this.state.phone}
            />
            <TextInput
              style={styeles.inputForm}
              onChangeText={password => this.setState({ password })}
              secureTextEntry={true}
              placeholder="Пароль"
              value={this.state.password}
            />
            <TextInput
              style={styeles.inputForm}
              onChangeText={pass =>
                this.setState({ password_confirmation: pass })
              }
              secureTextEntry={true}
              placeholder="Подтвердить пароль"
              value={this.state.password_confirmation}
            />
          </View>

          <View style={{ marginVertical: 20, flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => this.setState({ checked: !this.state.checked })}
              style={{ marginRight: 8 }}
            >
              <Image source={require("../../src/Rectangle.png")} />
              {this.state.checked && (
                <Image
                  style={{ position: "absolute", top: 5, left: 3 }}
                  source={require("../../src/Vector.png")}
                />
              )}
            </TouchableOpacity>
            <Text style={{ fontSize: 12, flex: 1 }}>
              <Text
                style={{
                  color: "#979797",
                  fontFamily: "Montserrat-Regular"
                }}
              >
                Я соглашаюсь на{" "}
              </Text>
              <Text
                style={{
                  color: "#0B2A5B",
                  fontWeight: "600",
                  fontFamily: "Montserrat-Bold"
                }}
                onPress={() =>
                  this.props.navigation.navigate("PdfScreenn", {
                    url: "https://party.mozgo.com/confidence.pdf"
                  })
                }
              >
                обработку персональных данных
              </Text>
              <Text
                style={{
                  color: "#979797",
                  fontFamily: "Montserrat-Regular"
                }}
              >
                {" "}
                и прочитал
              </Text>
              <Text
                style={{
                  color: "#0B2A5B",
                  fontWeight: "600",
                  fontFamily: "Montserrat-Bold"
                }}
                onPress={() =>
                  this.props.navigation.navigate("PdfScreenn", {
                    url: "https://party.mozgo.com/userAgr.pdf"
                  })
                }
              >
                {" "}
                пользовательское соглашение
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            style={styeles.btnAuth}
            onPress={() =>
              this.registration(
                name,
                email,
                password,
                password_confirmation,
                phone
              )
            }
          >
            <Text
              style={{
                textAlign: "center",
                color: "#fff",
                fontFamily: "Montserrat-Regular",
                fontSize: 17
              }}
            >
              Зарегистрироваться
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
  console.log("mapDispatchToProps >>>>>>>>");
  return {
    registrationUser: (name, email, password, password_confirmation, phone) => {
      dispatch(
        registrationUser(name, email, password, password_confirmation, phone)
      );
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationScreeen);

const styeles = StyleSheet.create({
  container: {
    backgroundColor: "#EEEEEE",
    paddingHorizontal: 16
  },
  text: {
    fontSize: 16,
    fontWeight: "100"
  },
  form: { marginTop: 38 },
  inputForm: {
    fontFamily: "Montserrat-Regular",
    height: 40,
    borderBottomWidth: 1,
    paddingLeft: 9,
    paddingRight: 15,
    borderBottomColor: "#979797",
    fontSize: 16,
    marginBottom: 25
  },
  btnAuth: {
    marginTop: 30,
    backgroundColor: "#0B2A5B",
    padding: 16,
    borderRadius: 5
  }
});

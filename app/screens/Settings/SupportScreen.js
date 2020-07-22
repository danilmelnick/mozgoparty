import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { Header } from "react-native-elements";
import userDataAction from "../../actions/userDataAction";
import { connect } from "react-redux";
import Loader from "../../components/Loader";

class SupportScreen extends React.Component {
  state = {
    reason: "",
    showDropDown: false,
    reasonRequest: "",
    y: 0,
    comment: "",
    visible: false,
    name: "",
    email: ""
  };

  send = async () => {
    if (this.state.reason == "") {
      Alert.alert("Поле причины обязательно для заполнения.", "", [
        {
          text: "OK",
          style: "default"
        }
      ]);

      return;
    }

    this.setState({ visible: true });

    const settings = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    try {
      const data = await fetch(
        "https://api.party.mozgo.com/support?email=" +
          (this.props.user.userInfo.email || this.state.email) +
          "&comment=" +
          this.state.comment +
          "&name=" +
          (this.props.user.userInfo.name || this.state.name) +
          "&site=egames&reason=" +
          this.state.reasonRequest,
        settings
      );

      const json = await data.json();
      console.log(data);

      console.log("Resp >>>>>>>>>>>" + JSON.stringify(json));

      if (data.status == 200) {
        this.setState(
          {
            reason: "",
            reasonRequest: "",
            comment: "",
            email: "",
            name: "",
            visible: false
          },
          () => {
            setTimeout(() => {
              Alert.alert("Спасибо, ваша заявка будет обработана!", "", [
                {
                  text: "OK",
                  style: "default"
                }
              ]);
            }, 200);
          }
        );
      } else if (data.status == 422) {
        this.setState({ visible: false }, () => {
          setTimeout(() => {
            let error = "";
            if (json.errors.comment) {
              error = json.errors.comment[0];
            } else if (json.errors.name) {
              error = json.errors.name[0];
            } else if (json.errors.email) {
              error = json.errors.email[0];
            }

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
      console.log(error);
    }
  };

  renderDropDown = () => {
    return (
      <Modal transparent={true} visible={this.state.showDropDown}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => this.setState({ showDropDown: false })}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 4,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              marginHorizontal: 16,
              marginTop: this.state.y + 10
            }}
          >
            <TouchableOpacity
              style={styles.dropViewStyle}
              onPress={() =>
                this.setState({
                  reason: "Сбой в приложении",
                  reasonRequest: "not_receive",
                  showDropDown: false
                })
              }
            >
              <Text style={styles.dropTextStyle}>Сбой в приложении</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropViewStyle}
              onPress={() =>
                this.setState({
                  reason: "Ошибка оплаты",
                  reasonRequest: "not_pay",
                  showDropDown: false
                })
              }
            >
              <Text style={styles.dropTextStyle}>Ошибка оплаты</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropViewStyle}
              onPress={() =>
                this.setState({
                  reason: "Ошибка при загрузке игры",
                  reasonRequest: "game_doesnt_work",
                  showDropDown: false
                })
              }
            >
              <Text style={styles.dropTextStyle}>Ошибка при загрузке игры</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropViewStyle}
              onPress={() =>
                this.setState({
                  reason: "Ошибка воспроизведения игры",
                  reasonRequest: "game_doesnt_work",
                  showDropDown: false
                })
              }
            >
              <Text style={styles.dropTextStyle}>
                Ошибка воспроизведения игры
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropViewStyle}
              onPress={() =>
                this.setState({
                  reason: "Другое",
                  reasonRequest: "another",
                  showDropDown: false
                })
              }
            >
              <Text style={styles.dropTextStyle}>Другое</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  render() {
    console.log("this.props.user.userInfo", this.props.user.userInfo);

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <Loader visible={this.state.visible} />
          <Header
            leftComponent={
              <TouchableOpacity
                style={{ marginLeft: 8 }}
                onPress={() => this.props.navigation.openDrawer()}
              >
                <Image
                  style={{ width: 20, height: 14 }}
                  source={require("../../src/burgerMenu.png")}
                />
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
            Служба
          </Text>
          <Text
            style={{
              fontFamily: "Montserrat-Bold",
              fontSize: 34,
              marginLeft: 16
            }}
          >
            поддержки
          </Text>

          <Text
            style={{
              fontSize: 12,
              marginLeft: 16,
              marginTop: 16,
              marginBottom: 45,
              fontFamily: "Montserrat-Regular",
              color: "#979797"
            }}
          >
            Запрос в тех. поддержку
          </Text>

          {!this.props.user.userInfo.email && (
            <View style={{ marginHorizontal: 16 }}>
              {this.state.name.length > 0 && (
                <Text
                  style={{
                    fontSize: 12,
                    color: "#979797",
                    fontFamily: "Montserrat-Regular",
                    marginLeft: 10,
                    marginBottom: -8
                  }}
                >
                  Имя и фамилия
                </Text>
              )}
              <TextInput
                placeholder={"Имя и фамилия"}
                style={[styles.inputForm, { marginTop: 10 }]}
                value={this.state.name}
                onChangeText={name => this.setState({ name })}
              />
            </View>
          )}

          {!this.props.user.userInfo.email && (
            <View
              style={{ marginHorizontal: 16 }}
              onLayout={evt => {
                this.setState({ y: evt.nativeEvent.layout.y });
              }}
            >
              {this.state.email.length > 0 && (
                <Text
                  style={{
                    fontSize: 12,
                    color: "#979797",
                    fontFamily: "Montserrat-Regular",
                    marginLeft: 10,
                    marginBottom: -8
                  }}
                >
                  E-mail
                </Text>
              )}
              <TextInput
                placeholder={"E-mail"}
                style={[styles.inputForm, { marginTop: 10 }]}
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
              />
            </View>
          )}

          <View
            style={{
              marginHorizontal: 16,
              marginVertical: 30,
              marginTop: 10,
              marginBottom: -10
            }}
            onLayout={evt => {
              this.setState({ y: evt.nativeEvent.layout.y });
            }}
          >
            {this.state.reason != "" && (
              <Text
                style={{
                  color: "#979797",
                  fontSize: 12,
                  fontFamily: "Montserrat-Regular",
                  paddingLeft: 10
                }}
              >
                Причина
              </Text>
            )}
            <TextInput
              placeholder={"Выберите причину"}
              value={this.state.reason}
              style={styles.inputField}
            />

            <TouchableOpacity
              onPress={() => this.setState({ showDropDown: true })}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                justifyContent: "center",
                alignItems: "flex-end"
              }}
            >
              <Image source={require("../../src/arrow.png")} />
            </TouchableOpacity>
          </View>

          <View
            style={{ marginHorizontal: 16 }}
            onLayout={evt => {
              this.setState({ y: evt.nativeEvent.layout.y });
            }}
          >
            <TextInput
              placeholder={"Описать подробнее"}
              style={styles.inputForm}
              value={this.state.comment}
              onChangeText={comment => this.setState({ comment })}
            />
          </View>

          <TouchableOpacity onPress={() => this.send()} style={styles.btnAuth}>
            <Text
              style={{
                textAlign: "center",
                color: "#fff",
                fontFamily: "Montserrat-Regular",
                fontSize: 17
              }}
            >
              Отправить
            </Text>
          </TouchableOpacity>
          {this.renderDropDown()}
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

export default connect(mapStateToProps, mapDispatchToProps)(SupportScreen);

const styles = StyleSheet.create({
  form: {
    marginVertical: 30
  },
  container: {
    paddingHorizontal: 16,
    marginVertical: 20
  },
  btnAuth: {
    marginHorizontal: 16,
    backgroundColor: "#0B2A5B",
    height: 44,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  inputField: {
    height: 40,
    fontFamily: "Montserrat-Regular",
    borderBottomWidth: 1,
    paddingLeft: 9,
    paddingRight: 15,
    borderBottomColor: "rgba(0, 0, 0, 0.38)",
    fontSize: 16
  },
  dropViewStyle: {
    padding: 16
  },
  dropTextStyle: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16
  },
  inputForm: {
    marginTop: 45,
    height: 40,
    fontFamily: "Montserrat-Regular",
    borderBottomWidth: 1,
    paddingLeft: 9,
    paddingRight: 15,
    borderBottomColor: "#979797",
    fontSize: 16,
    marginBottom: 25
  },
  header: {
    paddingVertical: 28,
    borderBottomWidth: 1,
    borderBottomColor: "#333"
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold"
  },
  content: {
    paddingVertical: 20
  },
  dropdownWrapper: {
    borderWidth: 0,
    backgroundColor: "transparent",
    borderBottomWidth: 1
  },
  itemContent: {
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
    borderWidth: 0,
    backgroundColor: "white",
    borderBottomColor: "#333",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.24)"
  },
  container: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    flex: 1
    // paddingVertical : 16
  },
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 0.4,
    paddingBottom: 0,
    borderBottomColor: "white",
    paddingTop: 0,
    height: 44
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#333"
  }
});

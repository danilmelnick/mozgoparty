import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import userDataAction from "../../actions/userDataAction";
import { connect } from "react-redux";
import { Header } from "react-native-elements";
import Icon from "../../components/Icon";

class PersonalArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null
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

  outGoing = async () => {
    AsyncStorage.getAllKeys()
      .then(keys => AsyncStorage.multiRemove(keys))
    await this.props.navigation.navigate("Loading");
  };

  render() {
    const { name, email, phone } = this.props.user.userInfo;
    let { loading } = this.props.user;
    const {token} = this.state

    return (
      <>
        <Header
          leftComponent={
            <Icon
              src={require("../../src/shape.png")}
              press={() => this.props.navigation.openDrawer()}
            />
          }
          centerComponent={{
            text: "Аккаунт",
            style: { color: "#000", fontSize: 18 }
          }}
          containerStyle={styles.header}
        />
        <View style={styles.PersonalAreaWrapper}>
          <View style={styles.PersonAvatarImage}>
            <Image
              source={require("../../src/noAuth.png")}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                marginBottom: 29
              }}
            />
          </View>
          <View style={styles.PersonInfoWrapper}>
            <Text style={styles.PersonInfoTitle}>Имя и фамилия</Text>
          </View>
          <View style={styles.PersonInfoWrapper}>
            <Text style={styles.PersonInfoTitle}>Номер телефона</Text>
            {/* <Text style={styles.PersonInfoDesc}>
              {!phone ? <Text>...</Text> : phone}
            </Text> */}
          </View>
          <View style={styles.PersonInfoWrapper}>
            <Text style={styles.PersonInfoTitle}>E-mail</Text>
            {/* <Text style={styles.PersonInfoDesc}>{email}</Text> */}
          </View>
          <View style={styles.PersonalActionButtonsWrapper}>
           
            
            {
              token ? (
                <>
                 <TouchableOpacity
                    onPress={() => this.props.navigation.navigate("EditPersonalArea")}
                    style={styles.PersonalActionButton}
                  >
                    <Text style={styles.PersonalActionButtonText}>
                      Изменить данные
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate("ChangePass")}
                    style={styles.PersonalActionButton}
                  >
                    <Text style={styles.PersonalActionButtonText}>
                      Изменить пароль
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.outGoing()}
                    style={styles.PersonalActionButton}
                  >
                    <Text style={styles.PersonalLogoutButtonText}>Выйти</Text>
                  </TouchableOpacity>
                </>
              ) : null
            }
          </View>
        </View>
      </>
    );
  }
}

const mapStateToProps = state => {
  // console.log("mapStateToProps >>>>>>>>");
  // console.log(JSON.stringify(state));
  return {
    user: state.userData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    userDataAction: token => dispatch(userDataAction(token))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonalArea);

const styles = StyleSheet.create({
  PersonalAreaWrapper: {
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 24
  },
  PersonInfoWrapper: {
    paddingHorizontal: 12,
    marginBottom: 32
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
    borderBottomColor: "#000",
    paddingTop: 0,
    height: 60
  },
  preloader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

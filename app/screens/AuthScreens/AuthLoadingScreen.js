import * as React from "react";
import { ActivityIndicator, StatusBar, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();

    this.checkFirstEnter();
  }

  checkFirstEnter = async () => {
    if (await AsyncStorage.getItem("firstEnter")) {
      this.props.navigation.navigate("MyDrawerNavigator");
    } else {
      AsyncStorage.setItem("firstEnter", "true");
      this.setState({ showButton: true });
    }
  };

  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem("userToken");

    this.props.navigation.navigate(userToken ? "Profile" : "Loading");
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default AuthLoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

import * as React from "react";
import { ActivityIndicator, StatusBar, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

class AuthLoadingScreen extends React.Component {
  constructor() {
    super();

    this.checkFirstEnter();
  }

  checkFirstEnter = async () => {
    if (await AsyncStorage.getItem("firstEnter")) {
      this.props.navigation.navigate("MyDrawerNavigator");
    } else {
      this.props.navigation.navigate("StartedScreen");
      AsyncStorage.setItem("firstEnter", "true");
      this.setState({ showButton: true });
    }
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

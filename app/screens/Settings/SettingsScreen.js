import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image
} from "react-native";
import { Header } from "react-native-elements";

class SettingsScreen extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          leftComponent={
            <TouchableOpacity
              style={{ marginLeft: 8 }}
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Image source={require("../../src/burgerMenu.png")} />
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
          Настройки
        </Text>

        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("PdfScreen", {
              url: "https://party.mozgo.com/userAgr.pdf"
            })
          }
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              paddingHorizontal: 16,
              paddingTop: 32,
              color: "#333333"
            }}
          >
            Пользовательское соглашение
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("PdfScreen", {
              url: "https://party.mozgo.com/confidence.pdf"
            })
          }
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              paddingHorizontal: 16,
              paddingTop: 24,
              color: "#333333"
            }}
          >
            Политика конфиденциальности
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    flex: 1
    // paddingVertical : 16
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
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 0.4,
    paddingBottom: 0,
    borderBottomColor: "white",
    paddingTop: 0,
    height: 44
  }
});

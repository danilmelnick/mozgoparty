import React, { Component } from "react";
import { StyleSheet, Text, View, Image, ImageBackground } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class StartedScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../../src/backLoginScreen.png")}
          style={styles.images}
        >
          <Image
            style={{ marginBottom: 100 }}
            source={require("../../src/logo.png")}
          />
          <View
            style={{ paddingHorizontal: 16, position: "absolute", bottom: 30 }}
          >
            <Text
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: 12,
                color: "#FFFFFF",
                textAlign: "center"
              }}
            >
              <Text>Нажимая «Продолжить», вы соглашаетесь на</Text>
              <Text style={{ color: "#FFCE42", fontWeight: "600" }}>
                {" "}
                обработку персональных данных
              </Text>
              <Text> и принимаете условия</Text>
              <Text style={{ color: "#FFCE42", fontWeight: "600" }}>
                {" "}
                пользовательского соглашения
              </Text>
            </Text>
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={() => this.props.navigation.navigate("Shop")}
            >
              <Text
                style={{
                  fontFamily: "Montserrat-Medium",
                  fontSize: 17,
                  fontWeight: "600",
                  color: "#fff",
                  textAlign: "center"
                }}
              >
                Продолжить
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column"
  },
  images: {
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    height: "100%"
  },
  description: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "100"
  },
  nextBtn: {
    marginBottom: 10,
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#BD006C",
    borderRadius: 45,
    height: 48,
    width: "100%"
  }
});

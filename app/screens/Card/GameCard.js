import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActionSheetIOS
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";

export default class GameCard extends Component {
  render() {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 10,
            paddingHorizontal: 16
          }}
        >
          <Image
            style={{ width: 80, height: 80, borderRadius: 5 }}
            source={{ uri: this.props.image }}
          />

          <View style={{ flex: 1, marginLeft: 8 }}>
            {this.props.rating && (
              <View style={{ flexDirection: "row", marginBottom: 4 }}>
                <Image
                  source={require("../../src/rating.png")}
                  style={{ width: 13.33, height: 13.33, marginRight: 3 }}
                />
                <Text style={styles.rating}>{this.props.rating}</Text>
              </View>
            )}
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                fontFamily: "Montserrat-Medium",
                color: "#333333",
                marginTop: 2
              }}
            >
              {this.props.title}
            </Text>
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  fontFamily: "Montserrat-Medium",
                  color: "#BD006C"
                }}
              >
                {this.props.price / 100} {this.props.currency}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => this.showActionImageMenu(this.props.item)}
          >
            <Image source={require("../../src/moreButtons.png")} />
          </TouchableOpacity>
        </View>
        <View
          style={{ backgroundColor: "#DADADA", height: 1, width: "100%" }}
        />
      </View>
    );
  }

  showActionImageMenu = element => {
    let options = ["Отменить", "Применить промокод", "Удалить из корзины"];

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0
      },
      buttonIndex => {
        if (buttonIndex === 2) {
          this.props.onDelete(element);
        } else if (buttonIndex === 1) {
        }
      }
    );
  };
}

const styles = StyleSheet.create({
  rating: {
    color: "#979797",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Montserrat-Regular",
    alignItems: "center"
  }
});

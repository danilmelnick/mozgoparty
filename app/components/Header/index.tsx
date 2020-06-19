import React from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import styles from "./styles";

export interface HeaderProps {
  title: string;
  onPressLeftButton: () => void;
}

const Header = (props: HeaderProps) => {
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.titleStyle}>{props.title}</Text>
      <TouchableOpacity
        onPress={props.onPressLeftButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Image source={require("../../src/backArrow.png")} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

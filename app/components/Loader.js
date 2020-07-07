import React from "react";
import {
  TouchableWithoutFeedback,
  Modal,
  View,
  ActivityIndicator
} from "react-native";

export const Loader = ({ press, visible }) => {
  return (
    <Modal transparent={true} visible={visible}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.5)"
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    </Modal>
  );
};

export default Loader;

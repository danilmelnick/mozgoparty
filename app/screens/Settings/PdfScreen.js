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
import PDFView from "react-native-view-pdf";

class PdfScreen extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          leftComponent={
            <TouchableOpacity
              style={{ marginLeft: 8 }}
              onPress={() => this.props.navigation.goBack()}
            >
              <Image source={require("../../src/back.png")} />
            </TouchableOpacity>
          }
          containerStyle={styles.header}
        />

        <PDFView
          fadeInDuration={250.0}
          style={{ flex: 1 }}
          resource={this.props.navigation.state.params.url}
          onLoad={() => console.log(`PDF rendered from `)}
          onError={error => console.log("Cannot render PDF", error)}
        />
      </SafeAreaView>
    );
  }
}

export default PdfScreen;

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

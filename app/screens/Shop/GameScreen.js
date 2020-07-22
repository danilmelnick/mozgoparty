import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  Easing,
  ImageBackground,
  TouchableWithoutFeedback,
  Modal,
  Animated
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Header } from "react-native-elements";
import userDataAction from "../../actions/userDataAction";
import { connect } from "react-redux";
import Orientation from "react-native-orientation";
import Game from "./Game";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Video from "react-native-video";
import Sound from "react-native-sound";

// MaskGroup
class GameScreen extends Component {
  game;
  whoosh;
  videoRef;
  interval = 0;
  audioPlayed = false;

  state = {
    textScale: new Animated.Value(0.1),
    pause: false,
    showAnswer: false,
    scale: new Animated.Value(1),
    opacity: new Animated.Value(1),
    buttons: false,
    data: {
      id: "123689cd-1b44-4163-86ad-5a8bfffcded2",
      type: "video-slide",
      properties: {
        background:
          "https://d2e4swo881ck2r.cloudfront.net/mozgo-party/start.png"
      },
      settings: {
        type: "click_play",
        properties: {
          link: null
        }
      },
      tour: 0,
      slide: 0,
      hasTimer: false
    },
    timer: 0
  };

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
    Image.prefetch(this.props.navigation.state.params.data.meta.gameBackground);
    Image.queryCache([
      this.props.navigation.state.params.data.meta.gameBackground
    ]);
  }

  _orientationDidChange = orientation => {
    this.forceUpdate();
  };

  setTimer() {
    console.log("setTimer");

    this.interval = setInterval(() => {
      if (!this.state.pause && this.state.timer < 25) {
        Animated.parallel([
          Animated.timing(this.state.scale, {
            toValue: 2,
            duration: 300
          }),
          Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 300
          })
        ]).start(() => {
          this.state.scale.setValue(1);
          this.state.opacity.setValue(1);
          this.setState({
            timer: this.state.timer + 1
          });
        });
      }
    }, 1000);
  }

  showPause = () => {
    if (this.whoosh) {
      this.whoosh.pause();
    }

    this.setState({ pause: true });
  };

  hidePause = () => {
    if (this.whoosh) {
      this.whoosh.play();
    }

    this.setState({ pause: false });
  };

  renderPauseButton() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.showPause();
        }}
        style={{
          position: "absolute",
          top: 16,
          right: 110,
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: "#BD006C",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image source={require("../../src/pause.png")} />
      </TouchableOpacity>
    );
  }

  renderNextStepButton() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.showNextGame(
            !(
              this.state.data.properties.type == "repeat" ||
              this.state.data.type == "slide-timer"
            )
          );
        }}
        style={{
          position: "absolute",
          top: 16,
          right: 30,
          width: 64,
          height: 64,
          borderRadius: 32,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image
          style={{ width: 64, height: 64 }}
          source={require("../../src/arrowInCircleToRight.png")}
        />
      </TouchableOpacity>
    );
  }

  componentWillMount() {
    Orientation.lockToLandscape();

    this.game = new Game(this.props.navigation.state.params.data);
    this.setState({ data: this.game.initialScreen() });
  }

  showButtons = () => {
    this.setState({ buttons: true });

    setTimeout(() => {
      this.setState({ buttons: false });
    }, 3000);
  };

  showNextGame = skip => {
    if (!this.game.hasNextScreen()) {
      this.props.navigation.goBack();
    }

    if (this.whoosh) {
      this.whoosh.stop();
    }

    this.circularProgress &&
      this.circularProgress.animate(100, 1, Easing.linear);
    this.circularProgress = undefined;
    this.state.scale.setValue(1);
    this.state.opacity.setValue(1);
    this.state.textScale.setValue(0.1);
    clearInterval(this.interval);
    this.audioPlayed = false;
    let nextScreen = this.game.nextScreen();

    const tour = this.state.data.tour;
    const slide = this.state.data.slide;
    if (tour > 0 && slide > 0 && !!skip) {
      while (nextScreen.tour == tour || nextScreen.tour == 0) {
        nextScreen = this.game.nextScreen();
      }
    }

    this.setState(
      {
        data: nextScreen,
        timer: nextScreen.type == "slide-timer" ? -74 : 0,
        buttons: false,
        showAnswer: false
      },
      () => {
        if (nextScreen.type == "slide-timer") {
          this.setTimer();
        }

        if (
          nextScreen.properties.type == "repeat" ||
          nextScreen.properties.type == "question" ||
          nextScreen.properties.type == "answer"
        ) {
          Animated.timing(this.state.textScale, {
            toValue: 1,
            duration: 1000
          }).start();
        }
      }
    );
  };

  componentDidUpdate() {
    console.log(this.state.data.leading);

    if (this.state.data.properties.videoStart === false) {
      this.showNextGame();
    } else if (
      this.state.data.hasTimer === true ||
      (this.state.data.properties.type == "repeat" &&
        this.state.data.type == "question") ||
      this.state.data.properties.type == "answer" ||
      this.state.data.type == "slide-timer" ||
      this.state.data.type == "text-and-sounds"
    ) {
      if (!this.audioPlayed && this.state.data.leading[0].action == "audio") {
        if (this.state.data.type == "slide-timer") {
          this.circularProgress &&
            this.circularProgress.animate(0, 100000, Easing.linear);
        }

        if (this.whoosh) {
          this.whoosh.stop();
          this.audioPlayed = false;
        }

        if (this.state.data.type == "slide-timer") {
          setTimeout(() => {
            this.showNextGame();
          }, 101000);
        }

        this.whoosh = new Sound(
          this.state.data.leading[0].params[0],
          null,
          error => {
            if (error) {
              console.log("failed to load the sound", error);
              return;
            }

            this.audioPlayed = true;
            this.whoosh.play(success => {
              if (success) {
                this.audioPlayed = false;
                if (
                  this.state.data.properties.type == "repeat" ||
                  (this.state.data.tour == 4 &&
                    this.state.data.properties.type == "question")
                ) {
                  setTimeout(() => {
                    this.showNextGame();
                  }, 2000);
                  return;
                }

                if (this.state.data.properties.type == "answer") {
                  this.setState({ showAnswer: true });
                }

                this.circularProgress &&
                  this.circularProgress.animate(0, 26000, Easing.linear);
                this.setTimer();

                if (
                  (!this.state.data.properties.sound &&
                    this.state.data.leading.length > 2 &&
                    this.state.data.leading[2].action == "audio") ||
                  this.state.data.type == "text-and-sounds"
                ) {
                  if (this.whoosh) {
                    this.whoosh.stop();
                    this.audioPlayed = false;
                  }

                  this.whoosh = new Sound(
                    this.state.data.properties.sounds ||
                      this.state.data.leading[2].params[0],
                    null,
                    error => {
                      if (error) {
                        console.log("failed to load the sound", error);
                        return;
                      }

                      this.audioPlayed = true;
                      this.whoosh.play(success => {
                        if (success) {
                          this.audioPlayed = false;
                          this.showNextGame();
                        } else {
                          console.log(
                            "playback failed due to audio decoding errors"
                          );
                        }
                      });
                    }
                  );
                }
              } else {
                console.log("playback failed due to audio decoding errors");
              }
            });
          }
        );
      }
    }
  }

  prepareText(text, removedText) {
    while (text.indexOf(removedText) != -1) {
      text = text.replace(removedText, " ");
    }

    return text.split("**");
  }

  renderPause = () => {
    return (
      <Modal
        visible={this.state.pause}
        supportedOrientations={["portrait", "landscape"]}
      >
        <ImageBackground
          resizeMode={"cover"}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center"
          }}
          source={require("../../src/MaskGroup.png")}
        >
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity onPress={() => this.hidePause()}>
              <Text
                style={{
                  fontFamily: "Montserrat-Medium",
                  fontSize: 24,
                  fontWeight: "600",
                  color: "#4A0045",
                  marginBottom: 30
                }}
              >
                Продолжить
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Text
                style={{
                  fontFamily: "Montserrat-Medium",
                  fontWeight: "600",
                  fontSize: 24,
                  color: "#4A0045"
                }}
              >
                Выйти
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </Modal>
    );
  };

  render() {
    if (this.state.data.properties.background) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.showNextGame();
          }}
          style={{ flex: 1 }}
        >
          <Image
            source={{ uri: this.state.data.properties.background }}
            style={{
              width: Dimensions.get("screen").width,
              height: Dimensions.get("screen").height
            }}
          />
        </TouchableOpacity>
      );
    } else if (this.state.data.properties.videoStart) {
      console.log(this.state.data);

      return (
        <TouchableWithoutFeedback onPress={() => this.showButtons()}>
          <View style={{ flex: 1 }}>
            <Video
              paused={this.state.pause}
              ref={ref => (this.videoRef = ref)}
              source={{ uri: this.state.data.properties.videoStart }}
              onEnd={() => {
                // if (
                //   this.state.data.properties.videoStart &&
                //   this.state.data.tour != 0
                // ) {
                this.showNextGame();
                // }
              }}
              resizeMode={"cover"}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0
              }}
            />
            {this.state.buttons && this.renderPauseButton()}
            {(this.state.buttons ||
              this.state.data.properties.type == "repeat" ||
              this.state.data.type == "slide-timer") &&
              this.renderNextStepButton()}
            {this.renderPause()}
          </View>
        </TouchableWithoutFeedback>
      );
    } else if (this.state.data.type == "slide-timer") {
      const backgroundImage = this.props.navigation.state.params.data.meta
        .gameBackground;

      return (
        <ImageBackground
          source={{ uri: backgroundImage }}
          resizeMode={"cover"}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Animated.View
            style={{
              transform: [{ scale: this.state.scale }],
              opacity: this.state.opacity
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 65,
                fontFamily: "Montserrat-Bold"
              }}
            >
              {25 - this.state.timer}
            </Text>
          </Animated.View>
          <AnimatedCircularProgress
            style={{
              position: "absolute",
              top: 40,
              left:
                Dimensions.get("window").width / 2 -
                (Dimensions.get("window").height - 80) / 2,
              transform: [
                {
                  rotateY: "-180deg"
                }
              ]
            }}
            ref={ref => (this.circularProgress = ref)}
            size={Dimensions.get("window").height - 80}
            width={15}
            rotation={0}
            fill={100}
            tintColor={"white"}
            backgroundColor={"transparent"}
          />
          {this.state.buttons && this.renderPauseButton()}
          {(this.state.buttons ||
            this.state.data.properties.type == "repeat" ||
            this.state.data.type == "slide-timer") &&
            this.renderNextStepButton()}
        </ImageBackground>
      );
    } else if (this.state.data.properties.text) {
      console.log(this.state.data);

      const backgroundImage = this.props.navigation.state.params.data.meta
        .gameBackground;

      return (
        <ImageBackground
          source={{ uri: backgroundImage }}
          resizeMode={"cover"}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
          }}
        >
          <TouchableWithoutFeedback onPress={() => this.showButtons()}>
            <Animated.View
              style={{ flex: 1, transform: [{ scale: this.state.textScale }] }}
            >
              <View
                style={{
                  flex: 1,
                  // alignItems: "center",
                  flexDirection: "row",
                  paddingHorizontal: 50
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 28,
                    flex: 1,
                    alignSelf: "center",
                    textAlign: "center",
                    marginRight: 30,
                    fontFamily: "Montserrat-Bold"
                  }}
                >
                  {this.prepareText(
                    this.state.data.properties.text.text,
                    "&nbsp;"
                  ).map((item, index) => (
                    <Text
                      style={
                        index % 2 == 1
                          ? {
                              color: this.props.navigation.state.params.data.meta.gameStrongFont.slice(
                                0,
                                7
                              )
                            }
                          : {}
                      }
                    >
                      {item}
                    </Text>
                  ))}
                </Text>
                {this.state.data.properties.image && (
                  <ImageBackground
                    resizeMode={"contain"}
                    style={{
                      flex: 1,
                      marginTop: 40,
                      maxHeight: Dimensions.get("window").height - 120
                    }}
                    source={{
                      uri:
                        this.state.data.properties.type == "answer" &&
                        !this.state.showAnswer
                          ? undefined
                          : this.state.data.properties.image
                    }}
                  />
                )}
              </View>
              {this.state.data.properties.textAnswer && this.state.showAnswer && (
                <Text
                  style={{
                    color: "white",
                    paddingTop: 25,
                    paddingHorizontal: 50,
                    fontSize: 30,
                    flex: 1,
                    textAlign: "center",
                    fontFamily: "Montserrat-Bold"
                  }}
                >
                  {this.prepareText(
                    this.state.data.properties.textAnswer.text,
                    "&nbsp;"
                  ).map((item, index) => (
                    <Text
                      style={
                        index % 2 == 1
                          ? {
                              color: this.props.navigation.state.params.data.meta.gameStrongFont.slice(
                                0,
                                7
                              )
                            }
                          : {}
                      }
                    >
                      {item}
                    </Text>
                  ))}
                </Text>
              )}
              {this.state.buttons && this.renderPauseButton()}
              {this.state.data.properties.type != "question" &&
                (this.state.buttons ||
                  this.state.data.properties.type == "repeat" ||
                  this.state.data.type == "slide-timer") &&
                this.renderNextStepButton()}
              <View
                style={{
                  position: "absolute",
                  height: 100,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: "Montserrat-Bold",
                    fontWeight: "700",
                    fontSize: 28
                  }}
                >
                  {this.state.data.tour} ТУР
                </Text>
                {this.returnNumberView(1)}
                {this.returnNumberView(2)}
                {this.returnNumberView(3)}
                {this.returnNumberView(4)}
                {this.returnNumberView(5)}
                {this.returnNumberView(6)}
                {this.returnNumberView(7)}
                {this.state.data.properties.type != "repeat" &&
                  this.state.data.properties.type != "answer" &&
                  this.state.data.tour != 4 &&
                  (this.state.timer == 25 ? (
                    <TouchableOpacity
                      onPress={() => this.showNextGame(false)}
                      style={{ width: 50, height: 50 }}
                    >
                      <Image
                        style={{ width: 50, height: 50 }}
                        source={require("../../src/arrowInCircleToRight.png")}
                      />
                    </TouchableOpacity>
                  ) : (
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        borderWidth: 3,
                        borderColor:
                          this.state.timer == 0 ? "white" : "transparent",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <AnimatedCircularProgress
                        style={{
                          position: "absolute",
                          borderWidth: 0,
                          transform: [
                            {
                              rotateY: "-180deg"
                            }
                          ]
                        }}
                        ref={ref => (this.circularProgress = ref)}
                        size={50}
                        width={3}
                        rotation={0}
                        fill={100}
                        tintColor={"white"}
                        backgroundColor={"transparent"}
                        prefill={100}
                      />
                      <Animated.View
                        style={{
                          transform: [{ scale: this.state.scale }],
                          opacity: this.state.opacity
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontFamily: "Montserrat-Bold",
                            fontWeight: "600",
                            fontSize: 18
                          }}
                        >
                          {25 - this.state.timer}
                        </Text>
                      </Animated.View>
                    </View>
                  ))}
              </View>
              {this.renderPause()}
            </Animated.View>
          </TouchableWithoutFeedback>
        </ImageBackground>
      );
    } else if (this.state.data.properties.text) {
      const backgroundImage = this.props.navigation.state.params.data.meta
        .gameBackground;

      return (
        <ImageBackground
          source={{ uri: backgroundImage }}
          resizeMode={"cover"}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
          }}
        >
          <TouchableWithoutFeedback onPress={() => this.showButtons()}>
            <Animated.View
              style={{ flex: 1, transform: [{ scale: this.state.textScale }] }}
            >
              <Text
                style={{
                  color: "white",
                  paddingTop: 25,
                  paddingHorizontal: 50,
                  fontSize: 30,
                  width: "100%",
                  height: "100%",
                  textAlign: "center"
                }}
              >
                {this.prepareText(
                  this.state.data.properties.text.text,
                  "&nbsp;"
                ).map((item, index) => (
                  <Text
                    style={
                      index % 2 == 1
                        ? {
                            color: this.props.navigation.state.params.data.meta.gameStrongFont.slice(
                              0,
                              7
                            )
                          }
                        : {}
                    }
                  >
                    {item}
                  </Text>
                ))}
              </Text>
              {this.state.buttons && this.renderPauseButton()}
              {(this.state.buttons ||
                this.state.data.properties.type == "repeat" ||
                this.state.data.type == "slide-timer") &&
                this.renderNextStepButton()}
              <View
                style={{
                  position: "absolute",
                  height: 100,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: "Montserrat-Bold",
                    fontWeight: "700",
                    fontSize: 28
                  }}
                >
                  {this.state.data.tour} ТУР
                </Text>
                {this.returnNumberView(1)}
                {this.returnNumberView(2)}
                {this.returnNumberView(3)}
                {this.returnNumberView(4)}
                {this.returnNumberView(5)}
                {this.returnNumberView(6)}
                {this.returnNumberView(7)}
                {this.state.data.properties.type != "repeat" && (
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      borderWidth: 2,
                      borderColor:
                        this.state.timer == 0 ? "white" : "transparent",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Animated.View
                      style={{
                        transform: [{ scale: this.state.scale }],
                        opacity: this.state.opacity
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontFamily: "Montserrat-Bold",
                          fontWeight: "600",
                          fontSize: 18
                        }}
                      >
                        {25 - this.state.timer}
                      </Text>
                    </Animated.View>
                  </View>
                )}
              </View>
              {this.renderPause()}
            </Animated.View>
          </TouchableWithoutFeedback>
        </ImageBackground>
      );
    }

    return <View onLayout={() => this.showNextGame()} />;
  }

  returnNumberView = item => {
    return (
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          borderWidth: 4,
          borderColor:
            this.state.data.slide == item ? "#A03269" : "transparent",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "#A03269",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              color: "white",
              fontFamily: "Montserrat-Bold",
              fontWeight: "600",
              fontSize: 18
            }}
          >
            {item}
          </Text>
        </View>
      </View>
    );
  };
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

export default connect(mapStateToProps, mapDispatchToProps)(GameScreen);

const styles = StyleSheet.create({});

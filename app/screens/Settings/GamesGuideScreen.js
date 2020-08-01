import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Image,
  FlatList,
  ScrollView
} from "react-native";
import { Header } from "react-native-elements";

class GamesGuideScreen extends React.Component {
  state = {
    categories: ["особенности игры", "ход игры", "правила игры"],
    filteredBy: 0
  };

  componentDidMount() {
    this.props.navigation.addListener("didFocus", () => {
      this.setState({ filteredBy: 0 });
    });
  }

  renderThirdCategory = () => {
    return (
      <ScrollView style={{ flex: 1, marginTop: 15, marginHorizontal: 16 }}>
        <Text style={[styles.titleStyle, styles.additionalTitleStyle]}>
          Правила 1-3 туров
        </Text>

        <View style={styles.guideWrapper}>
          <View style={{ marginRight: 5, width: "5%" }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#0B2A5B"
              }}
            ></View>
          </View>
          <Text
            style={{
              marginTop: -3,
              flex: 1,
              fontSize: 12,
              fontFamily: "Montserrat-Regular",
              color: "#333333"
            }}
          >
            Голос Мозгобойни зачитает вам вопросы и даст немного времени, чтобы
            их обдумать. В конце каждого тура будет повтор вопросов и 100
            секунд, чтобы обсудить и записать ответы. После этого команды смогут
            подсчитать набранные ими баллы. Если вы справитесь раньше, можете
            пропустить таймер.
          </Text>
        </View>

        <View style={styles.guideWrapper}>
          <View style={{ marginRight: 5, width: "5%" }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#BD006C"
              }}
            ></View>
          </View>
          <Text
            style={{
              marginTop: -3,
              flex: 1,
              fontSize: 12,
              fontFamily: "Montserrat-Regular",
              color: "#333333"
            }}
          >
            За каждый правильный ответ команда получает 1 балл, за неправильный
            или его отсутствие – 0 баллов.
          </Text>
        </View>

        <Text style={[styles.titleStyle, styles.additionalTitleStyle]}>
          Правила 4 тура
        </Text>

        <View style={styles.guideWrapper}>
          <View style={{ marginRight: 5, width: "5%" }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#FFCE42"
              }}
            ></View>
          </View>
          <Text
            style={{
              marginTop: -3,
              flex: 1,
              fontSize: 12,
              fontFamily: "Montserrat-Regular",
              color: "#333333"
            }}
          >
            Вам дается всего 100 секунд на все 7 вопросов. Вопросы этого тура
            звучат один раз и более не повторяются.
          </Text>
        </View>

        <View style={styles.guideWrapper}>
          <View style={{ marginRight: 5, width: "5%" }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#3F9CE4"
              }}
            ></View>
          </View>
          <Text
            style={{
              marginTop: -3,
              flex: 1,
              fontSize: 12,
              fontFamily: "Montserrat-Regular",
              color: "#333333"
            }}
          >
            Если вы уверены в ответе, в правом столбце вашего бланка напротив
            ответа можете поставить галочку. В этом случае, если ваш ответ
            окажется правильным, вы получите за него 2 балла, а если
            неправильным – минус 2 балла. Если галочки нет, все как в предыдущих
            турах: 1 балл за правильный и 0 баллов за неправильный ответ.
          </Text>
        </View>

        <Text style={[styles.titleStyle, styles.additionalTitleStyle]}>
          Победа в игре
        </Text>

        <View style={styles.guideWrapper}>
          <View style={{ marginRight: 5, width: "5%" }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#0B2A5B"
              }}
            ></View>
          </View>
          <Text
            style={{
              marginTop: -3,
              flex: 1,
              fontSize: 12,
              fontFamily: "Montserrat-Regular",
              color: "#333333"
            }}
          >
            Побеждает команда, набравшая в сумме наибольшее количество баллов.
          </Text>
        </View>

        <View style={styles.guideWrapper}>
          <View style={{ marginRight: 5, width: "5%" }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#BD006C"
              }}
            ></View>
          </View>
          <Text
            style={{
              marginTop: -3,
              flex: 1,
              fontSize: 12,
              fontFamily: "Montserrat-Regular",
              color: "#333333"
            }}
          >
            В случае, если после 4-го тура несколько команд набрали равное
            количество баллов, побеждает команда, набравшая больше баллов в
            блиц-туре. Если у вас одинаковое количество баллов и в блиц-туре –
            побеждает дружба
          </Text>
        </View>
      </ScrollView>
    );
  };

  renderSecondCategory = () => {
    return (
      <ScrollView
        style={{
          flex: 1,
          marginTop: 24,
          marginHorizontal: 16
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.defaultTextStyle}>
            В игре 4 тура по 7 вопросов. Вопросы демонстрируются на экране. На
            протяжении всей игры Голос Мозгобойни будет сопровождать и
            направлять вас. Он расскажет, что и когда нужно делать, прочитает
            вам вопросы и даже пожелает удачи! :) Нужно лишь довериться ему!
          </Text>

          <Text style={styles.numberStyle}>01</Text>

          <Text style={styles.titleStyle}>Выберите игру в магазине</Text>

          <Text style={styles.defaultTextStyle}>
            В меню приложения выберите раздел «Магазин MozgoParty». Это основной
            магазин игр, который представлен на сайте.
          </Text>

          <Text style={styles.numberStyle}>02</Text>

          <Text style={styles.titleStyle}>
            Загрузите игру на ваше устройство
          </Text>

          <Text style={styles.defaultTextStyle}>
            После того как вы выбрали игру, в разделе «Мои игры» нажмите на
            кнопку «Загрузить игру», после загрузки первого тура вы уже можете
            начать играть. Также можно скачать игру полностью и запустить ее в
            любое удобное время, не используя интернет.
          </Text>

          <Text style={styles.numberStyle}>03</Text>

          <Text style={styles.titleStyle}>Разделитесь на команды</Text>

          <Text style={styles.defaultTextStyle}>
            Никаких ограничений по минимальному количеству игроков в одной
            команде не существует, но мы рекомендуем вам не создавать команды
            более 5 человек. Лучше увеличьте количество команд – так будет
            интереснее!
          </Text>
        </View>
      </ScrollView>
    );
  };

  renderFirstCategory = () => {
    return (
      <View style={{ marginTop: 24, marginHorizontal: 16 }}>
        <View style={styles.guideWrapper}>
          <View style={{ marginRight: 5, width: "5%" }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#0B2A5B"
              }}
            ></View>
          </View>
          <Text
            style={{
              marginTop: -3,
              flex: 1,
              fontSize: 12,
              fontFamily: "Montserrat-Regular",
              color: "#333333"
            }}
          >
            Каждая игра имеет 3 запуска. Выход из приложения в момент игры
            считается потраченным запуском. Пауза игры без выхода из приложения
            не считается отдельно потраченным запуском. После третьего запуска
            игра становится недоступна.
          </Text>
        </View>

        <View style={styles.guideWrapper}>
          <View style={{ marginRight: 5, width: "5%" }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 8 / 2,
                backgroundColor: "#BD006C"
              }}
            ></View>
          </View>
          <Text
            style={{
              marginTop: -3,
              flex: 1,
              fontSize: 12,
              fontFamily: "Montserrat-Regular",
              color: "#333333"
            }}
          >
            Игра доступна для запуска без подключения к интернету, если ранее
            была загружена в приложении.
          </Text>
        </View>

        <View style={styles.guideWrapper}>
          <View style={{ marginRight: 5, width: "5%" }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 8 / 2,
                backgroundColor: "#FFCE42"
              }}
            ></View>
          </View>
          <Text
            style={{
              marginTop: -3,
              flex: 1,
              fontSize: 12,
              fontFamily: "Montserrat-Regular",
              color: "#333333"
            }}
          >
            У каждой игры есть своя оценка, это средний балл на основании всех
            оценок пользователями конкретной игры. Игру можно оценить сразу
            после ее окончания.
          </Text>
        </View>

        <View style={styles.guideWrapper}>
          <View style={{ marginRight: 5, width: "5%" }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 8 / 2,
                backgroundColor: "#3F9CE4"
              }}
            ></View>
          </View>
          <Text
            style={{
              marginTop: -3,
              flex: 1,
              fontSize: 12,
              fontFamily: "Montserrat-Regular",
              color: "#333333"
            }}
          >
            Запустить игру можно до того, как она полностью загрузится на
            устройство. Необходимо дождаться загрузки медиафайлов первого тура,
            чтобы игра стала доступна для запуска.
          </Text>
        </View>

        <View style={styles.guideWrapper}>
          <View style={{ marginRight: 5, width: "5%" }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 8 / 2,
                backgroundColor: "#0B2A5B"
              }}
            ></View>
          </View>
          <Text
            style={{
              marginTop: -3,
              flex: 1,
              fontSize: 12,
              fontFamily: "Montserrat-Regular",
              color: "#333333"
            }}
          >
            В игре теперь есть элементы управления: можно пропустить анимацию,
            пропустить тур или повтор вопросов, поставить игру на паузу.
          </Text>
        </View>
      </View>
    );
  };

  renderSections = () => {
    return (
      <View
        style={{
          height: 48,
          width: "100%",
          marginTop: 8
        }}
      >
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={this.state.categories}
          renderItem={itemProps => {
            return (
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    filteredBy: itemProps.index
                  })
                }
                style={{
                  paddingHorizontal: 20,
                  flex: 1,
                  justifyContent: "center",
                  borderBottomWidth: 2,
                  borderBottomColor:
                    this.state.filteredBy == itemProps.index
                      ? "#FFCE42"
                      : "#DADADA"
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: 14,
                    fontWeight: "500",
                    color:
                      this.state.filteredBy == itemProps.index
                        ? "#333333"
                        : "#DADADA"
                  }}
                >
                  {itemProps.item.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Header
            leftComponent={
              <TouchableOpacity
                style={{ marginLeft: 8 }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => this.props.navigation.openDrawer()}
              >
                <Image
                  style={{ width: 20, height: 14 }}
                  source={require("../../src/burgerMenu.png")}
                />
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
            Руководство
          </Text>
          <Text
            style={{
              fontFamily: "Montserrat-Bold",
              fontSize: 34,
              marginLeft: 16
            }}
          >
            к игре
          </Text>

          {this.renderSections()}
        </View>

        {this.state.filteredBy == 0 && this.renderFirstCategory()}
        {this.state.filteredBy == 1 && this.renderSecondCategory()}
        {this.state.filteredBy == 2 && this.renderThirdCategory()}
      </SafeAreaView>
    );
  }
}

export default GamesGuideScreen;

const styles = StyleSheet.create({
  additionalTitleStyle: {
    marginBottom: 16,
    marginTop: 20
  },
  titleStyle: {
    fontFamily: "Montserrat-Medium",
    fontWeight: "600",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8
  },
  numberStyle: {
    marginTop: 24,
    fontSize: 36,
    fontFamily: "Montserrat-Bold",
    fontWeight: "bold",
    color: "#0B2A5B"
  },
  flatListStyle: {
    height: 48
  },
  defaultTextStyle: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    color: "#333333"
  },
  container: {
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    flex: 1
  },
  guideWrapper: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 20
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

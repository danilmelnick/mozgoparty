import React from "react";
import Accordion from "react-native-collapsible/Accordion";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Header } from "react-native-elements";

class FAQScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSections: [],
      data: [
        {
          title: "Что необходимо подготовить для игры?",
          content:
            "В игре вам понадобится отвечать на вопросы, поэтому мы рекомендуем подготовить ручку и лист бумаги для записи ответов.",
          showen: false
        },
        {
          title: "Как долго длится одна игра?",
          content:
            "В игре 4 тура по 7 вопросов. Игра длится приблизительно 40-45 минут.",
          showen: false
        },
        {
          title: "Сколько раз я могу сыграть в одну и ту же игру?",
          content:
            "Игра имеет ограниченное количество запусков – три. Каждое обновление страницы после старта игры (после первого нажатия пробела) считается перезапуском.После третьего запуска игра будет недоступна.",
          showen: false
        },
        {
          title: "Произошла ошибка оплаты",
          content:
            "При ошибке оплаты проверьте сообщения от банка, система может обрабатывать платеж с задержкой. Если денежные средства не списались с карты, попробуйте повторить оплату или обратитесь в Службу поддержки.",
          showen: false
        },
        {
          title: "Не могу применить промокод",
          content:
            "Ошибка может возникнуть, если вы пытаетесь применить промокод, который был использован ранее. Также ошибка возникает, если вы пытаетесь применить промокод с истекшим сроком действия. Если вы столкнулись с другой ошибкой, обратитесь в Службу поддержки.",
          showen: false
        },
        {
          title: "Где найти купленные игры?",
          content: "Все купленные игры хранятся в разделе “Мои игры”.",
          showen: false
        },
        {
          title: "Как запустить игру?",
          content:
            "В разделе “Мои игры” нажмите на значок загрузки рядом с нужной игрой или нажмите на карточку игры, кнопка “Загрузить игру” на странице с подробной информацией. После загрузки медиафайлов на странице с подробной информацией об игре появится кнопка “Играть”. Запустить игру можно сразу после того, как загрузится первый тур. После запуска загрузка игры продолжится в фоновом режиме.",
          showen: false
        },
        {
          title: "Как пропустить правила или тур?",
          content:
            "Нажмите на экран, чтобы в левом верхнем углу появилось меню управления игрой. Нажмите и удерживайте стрелочку вправо, чтобы пропустить нужный блок игры.",
          showen: false
        },
        {
          title: "Могу ли я остановить игру?",
          content:
            "Нажмите на экран один раз и в правом верхнем углу появятся кнопки управления игрой. Нажмите на кнопку паузы, чтобы остановить игру. Игра автоматически перейдет в режим паузы, если вам позвонили. Вы сможете продолжить игру сразу после окончания разговора.",
          showen: false
        },
        {
          title: "Могу ли я играть без интернета?",
          content:
            "Игра доступна для запуска без интернета, если вы ранее загружали эту игру в приложение.",
          showen: false
        }
      ]
    };
  }

  _renderHeader = section => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{section.title}</Text>
      </View>
    );
  };

  _renderContent = section => {
    return (
      <View style={styles.content}>
        <Text>{section.content}</Text>
      </View>
    );
  };

  _updateSections = activeSections => {
    this.setState({ activeSections });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
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
          FAQ
        </Text>

        <Text
          style={{
            fontSize: 12,
            fontFamily: "Montserrat-Regular",
            color: "#979797",
            padding: 16
          }}
        >
          Здесь вы найдете ответы на все часто задаваемые вопросы.
        </Text>

        <ScrollView>
          {this.state.data.map((item, index) => {
            return (
              <View>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginVertical: 24,
                    marginHorizontal: 16
                  }}
                  onPress={() => {
                    const data = [...this.state.data];
                    data[index].showen = !data[index].showen;
                    this.setState({ data });
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Montserrat-Bold",
                      fontSize: 12,
                      color: "#333333",
                      fontWeight: "600"
                    }}
                  >
                    {item.title}
                  </Text>
                  <Image
                    source={
                      item.showen
                        ? require("../../src/expandLess.png")
                        : require("../../src/expandMore.png")
                    }
                  />
                </TouchableOpacity>
                {item.showen && (
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Montserrat-Regular",
                      color: "#333333",
                      paddingHorizontal: 16,
                      paddingBottom: 24
                    }}
                  >
                    {item.content}
                  </Text>
                )}
                <View
                  style={{
                    backgroundColor: "#DADADA",
                    height: 1,
                    width: "100%"
                  }}
                />
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default FAQScreen;

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
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 0.4,
    paddingBottom: 0,
    borderBottomColor: "white",
    paddingTop: 0,
    height: 44
  },
  content: {
    paddingVertical: 20
  }
});

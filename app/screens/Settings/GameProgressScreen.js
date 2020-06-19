import  React from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Text} from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

const FirstRoute = () => (
    <View style={styles.container}>
        <ScrollView>
            <Text style={styles.GameProgressStepTitle}>Особенности игры</Text>
            <View style={styles.guideWrapper}>
                <View style={{marginRight:5, width : '5%'}}>
                    <View style={{
                        width: 12,
                        height: 12,
                        borderRadius: 12/2,
                        backgroundColor : '#0B2A5B'}}>
                    </View>
                </View>
                <Text style={{width : '92%'}}>Каждая игра имеет 3 запуска. Выход
                    из приложения в момент игры считается потраченным запуском. Пауза игры без выхода из приложения не считается отдельно потраченным запуском. После третьего запуска игра становится недоступна.</Text>
            </View>
            <View style={styles.guideWrapper}>
                <View style={{marginRight:5, width : '5%'}}>
                    <View style={{
                        width: 12,
                        height: 12,
                        borderRadius: 12/2,
                        backgroundColor : '#BD006C'}}>
                    </View>
                </View>
                <Text style={{width : '92%'}}>
                    Игра доступна для запуска без подключения
                    к интернету, если ранее была загружена
                    в приложении.
                </Text>
            </View>
            <View style={styles.guideWrapper}>
                <View style={{marginRight:5, width : '5%'}}>
                    <View style={{
                        width: 12,
                        height: 12,
                        borderRadius: 12/2,
                        backgroundColor : '#FFCE42'}}>
                    </View>
                </View>
                <Text style={{width : '92%'}}>
                    У каждой игры есть своя оценка, это средний балл на основании всех оценок пользователями конкретной игры. Игру можно оценить сразу после ее окончания.
                </Text>
            </View>
            <View style={styles.guideWrapper}>
                <View style={{marginRight:5, width : '5%'}}>
                    <View style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor : '#3F9CE4'}}>
                    </View>
                </View>
                <Text style={{width : '92%'}}>
                    Запустить игру можно до того, как она полностью загрузится на устройство. Необходимо дождаться загрузки медиафайлов первого тура, чтобы игра стала доступна для запуска.
                </Text>
            </View>
            <View style={styles.guideWrapper}>
                <View style={{marginRight:5, width : '5%'}}>
                    <View style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor : '#0B2A5B'}}>
                    </View>
                </View>
                <Text style={{width : '92%'}}>
                    В игре теперь есть элементы управления: можно пропустить анимацию, пропустить тур или повтор вопросов, поставить игру на паузу.
                </Text>
            </View>
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Profile')}
                style={{marginTop : 30}}
            >
                <Text>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('GameProgressScreen')}
                style={{marginTop : 30}}
            >
                <Text>GameProgressScreen</Text>
            </TouchableOpacity>
        </ScrollView>
    </View>
);

const SecondRoute = () => (
    <View style={styles.containerSecond}>
        <ScrollView>
            <View style={styles.GameProgressWrapper}>
                <Text style={styles.GameProgressStepTitle}>Ход игры</Text>
                <Text style={styles.GameProgressStepDescription}>В игре 4 тура по 7 вопросов. Вопросы демонстрируются на экране. На протяжении всей игры Голос Мозгобойни будет сопровождать
                    и направлять вас. Он расскажет, что и когда нужно делать, прочитает вам вопросы и даже пожелает удачи! :) Нужно лишь довериться ему!</Text>
            </View>
            <View style={styles.GameProgressWrapper}>
                <Text style={styles.GameProgressStep}>01</Text>
                <Text style={styles.GameProgressStepTitle}>Выберите игру в магазине</Text>
                <Text style={styles.GameProgressStepDescription}>В меню приложения выберите раздел «Магазин MozgoParty». Это основной магазин игр, который представлен на сайте.</Text>
            </View>
            <View style={styles.GameProgressWrapper}>
                <Text style={styles.GameProgressStep}>02</Text>
                <Text style={styles.GameProgressStepTitle}>Загрузите игру на ваше устройство</Text>
                <Text style={styles.GameProgressStepDescription}>После того как вы выбрали игру, в разделе «Мои игры» нажмите на кнопку «Загрузить игру», после загрузки первого тура вы уже можете начать играть. Также можно скачать игру полностью
                    и запустить ее в любое удобное время,
                    не используя интернет.
                </Text>
            </View>
            <View style={styles.GameProgressWrapper}>
                <Text style={styles.GameProgressStep}>03</Text>
                <Text style={styles.GameProgressStepTitle}>Разделитесь на команды</Text>
                <Text style={styles.GameProgressStepDescription}>Никаких ограничений по минимальному количеству игроков в одной команде
                    не существует, но мы рекомендуем вам
                    не создавать команды более 5 человек. Лучше увеличьте количество команд – так будет интереснее!</Text>
            </View>
        </ScrollView>
    </View>
);

const ThirdRoute = () => (
    <View style={styles.container}>
        <ScrollView>
            <View style={styles.SingleRulesWrapper}>
                <Text style={styles.GameProgressStepTitleThird}>Правила 1-3 туров</Text>
                <View style={styles.guideWrapper}>
                    <View style={{marginRight:5, width : '5%'}}>
                        <View style={{
                            width: 12,
                            height: 12,
                            borderRadius: 12/2,
                            backgroundColor : '#0B2A5B'}}>
                        </View>
                    </View>
                    <Text style={{width : '92%'}}>
                        Голос Мозгобойни зачитает вам вопросы и даст немного времени, чтобы их обдумать. В конце каждого тура будет повтор вопросов и 100 секунд, чтобы обсудить и записать ответы. После этого команды смогут подсчитать набранные ими баллы. Если вы справитесь раньше, можете пропустить таймер.
                    </Text>
                </View>
                <View style={styles.guideWrapper}>
                    <View style={{marginRight:5, width : '5%'}}>
                        <View style={{
                            width: 12,
                            height: 12,
                            borderRadius: 12/2,
                            backgroundColor : '#BD006C'}}>
                        </View>
                    </View>
                    <Text style={{width : '92%'}}>
                        За каждый правильный ответ команда получает 1 балл, за неправильный или его отсутствие – 0 баллов.
                    </Text>
                </View>
            </View>
            <View style={styles.SingleRulesWrapper}>
                <Text style={styles.GameProgressStepTitleThird}>Правила 4 тура</Text>
                <View style={styles.guideWrapper}>
                    <View style={{marginRight:5, width : '5%'}}>
                        <View style={{
                            width: 12,
                            height: 12,
                            borderRadius: 12/2,
                            backgroundColor : '#FFCE42'}}>
                        </View>
                    </View>
                    <Text style={{width : '92%'}}>
                        Вам дается всего 100 секунд на все 7 вопросов. Вопросы этого тура звучат один раз и более не повторяются.
                    </Text>
                </View>
                <View style={styles.guideWrapper}>
                    <View style={{marginRight:5, width : '5%'}}>
                        <View style={{
                            width: 12,
                            height: 12,
                            borderRadius: 12/2,
                            backgroundColor : '#FFCE42'}}>
                        </View>
                    </View>
                    <Text style={{width : '92%'}}>
                        Если вы уверены в ответе, в правом столбце вашего бланка напротив ответа можете поставить галочку. В этом случае, если ваш ответ окажется правильным, вы получите за него 2 балла, а если неправильным – минус 2 балла. Если галочки нет, все как в предыдущих турах: 1 балл за правильный и 0 баллов
                        за неправильный ответ.
                    </Text>
                </View>
            </View>
            <View style={styles.SingleRulesWrapper}>
                <Text style={styles.GameProgressStepTitleThird}>Победа в игре</Text>
                <View style={styles.guideWrapper}>
                    <View style={{marginRight:5, width : '5%'}}>
                        <View style={{
                            width: 12,
                            height: 12,
                            borderRadius: 12/2,
                            backgroundColor : '#0B2A5B'}}>
                        </View>
                    </View>
                    <Text style={{width : '92%'}}>
                        Побеждает команда, набравшая в сумме наибольшее количество баллов.
                    </Text>
                </View>
                <View style={styles.guideWrapper}>
                    <View style={{marginRight:5, width : '5%'}}>
                        <View style={{
                            width: 12,
                            height: 12,
                            borderRadius: 12/2,
                            backgroundColor : '#BD006C'}}>
                        </View>
                    </View>
                    <Text style={{width : '92%'}}>
                        В случае, если после 4-го тура несколько команд набрали равное количество баллов, побеждает команда, набравшая больше баллов в блиц-туре. Если у вас одинаковое количество баллов
                        и в блиц-туре – побеждает дружба
                    </Text>
                </View>
            </View>
        </ScrollView>
    </View>
);


const initialLayout = { width: Dimensions.get('window').width };

export default function GameProgressScreen() {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'особенности игры' },
        { key: 'second', title: 'Ход игры' },
        { key: 'third', title: 'Правила игры' },
    ]);

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
        third: ThirdRoute
    });

    const renderTabBar = props => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: 'white'}}
          style={styles.TabBarStyle}
        />
      );

    return (
        <TabView
            navigationState={{ index, routes }}
            renderTabBar={renderTabBar}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            style={{backgroundColor:'white'}}
        />
    );
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    container : {
        paddingHorizontal : 16,
        paddingBottom: 24,
        marginTop: 24
    },
    guideWrapper : {
        flexDirection : 'row',
        width: '100%',
        marginBottom : 16
    },
    containerSecond : {
        paddingHorizontal : 16,
        paddingBottom : 24
    },
    GameProgressWrapper : {
        marginTop: 24
    },
    GameProgressStep : {
        fontWeight: 'bold',
        fontSize: 36,
        lineHeight: 44,
        color: '#2665A2'
    },
    GameProgressStepTitle : {
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 16,
        color: '#333333',
        marginBottom: 8
    },
    GameProgressStepTitleThird :{
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 17,
        color: '#333333',
        marginBottom: 16
    },
    GameProgressStepDescription : {
        fontSize: 14,
        lineHeight: 16,
        color: '#333333',
    },
    SingleRulesWrapper : {
        marginBottom: 24
    },
    TabBarStyle : {
        color: '#000',
        backgroundColor: 'white'
    }
});

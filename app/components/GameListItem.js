import React, {Component} from 'react'
import { View, Image, ScrollView, Text, StyleSheet, ProgressBarAndroid, TouchableOpacity } from 'react-native'

export const GamesListItem = ({press, price, name, rating}) => {
    return(
        <TouchableOpacity
            onPress={() => press()}
        >
            <View style={styles.SingleGameWrapper}>
                <View style={styles.SingleGameImage}>
                    <TouchableOpacity
                        onPress={() => {}}
                    >
                        <Image
                            source = {{uri: 'https://mozgo-qiuz-materials.s3.amazonaws.com/54738/43TEe6PTYpV4MYOf.png'}}
                            style={{
                                width : '100%',
                                height : 0,
                                paddingBottom: '100%',
                                borderRadius: 4,
                            }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.SingleGameInfo}>
                    <View style={styles.SingleGameTopInfo}>
                        <View style={styles.RaitingStarWrapper}>
                            <Image
                                style={styles.RaitingStarImage}
                                source = {require('../src/raitingStar.png')}
                            />
                            <Text style={styles.SingleGameTopRaiting}>5.0</Text>
                        </View>
                        <Text style={styles.SingleGameTopTitle}>Кино и Музыка. Эпоха VHS</Text>
                    </View>
                    <View style={styles.SingleGameBottomInfo}>
                        <View style={styles.DownloadStatus}>
                            <View style={styles.PercentStatus}>
                                <Text style={styles.ProcessTitle}>В процессе</Text>
                                <Text style={styles.PercentStage}>27%</Text>
                            </View>
                            <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} color="#EB5757" progress={0.25}/>
                        </View>
                    </View>

                </View>
            </View>
        </TouchableOpacity>
    )
}

export default GamesListItem

const styles = StyleSheet.create({
    SingleGameWrapper : {
        width: '100%',
        flexDirection: 'row',
        borderBottomColor: 'rgba(0, 0, 0, 0.12)',
        borderBottomWidth: 1,
        paddingTop: 12,
        paddingHorizontal: 16,
        paddingBottom: 11
    },
    SingleGameImage : {
        width: '22.22%',
    },
    SingleGameInfo : {
        paddingLeft : 8,
        width: '77.78%',
        justifyContent: 'space-between'
    },
    SingleGameTopRaiting : {
        color: '#979797',
        fontSize: 10,
        lineHeight: 12,
        marginBottom: 6
    },
    SingleGameTopTitle : {
        color: '#333333',
        fontSize: 12,
        lineHeight: 15,
        fontWeight: 'bold'
    },
    RaitingStarWrapper : {
        flexDirection: 'row',
        alignItems: 'center'
    },
    PercentStatus : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems : 'center',
        marginBottom: 4
    },
    ProcessTitle : {
        color: '#979797',
        fontSize: 10,
        lineHeight: 12
    },
    PercentStage : {
        color: '#979797',
        fontSize: 10,
        lineHeight: 12
    },
    
})

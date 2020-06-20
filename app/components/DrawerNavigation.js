import React, { Component } from 'react';
import {NavigationActions} from 'react-navigation';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import Icon from '../components/Icon'
import userDataAction from "../actions/userDataAction";
import { connect } from "react-redux";

class drawerContentComponents extends Component {

	constructor(props) {
		super(props)

		this.state = {
			token : ''
		}
	}

    navigateToScreen = ( route ) =>(
        () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
	})
	
	getToken = async () => {
		const res = await AsyncStorage.getItem("userToken");
		const token = res.slice(1, -1);
		this.setState({ token });
	};

	async componentDidMount() {
		await this.getToken();
		await this.props.userDataAction(this.state.token);
	}

	render() {

		const {name, email} = this.props.user.userInfo

		return (
			<View style={styles.container}>
				<View style={styles.headerContainer}>
					<View style={{flex: 1, justifyContent: 'center'}} >
						<Image
							source={require('../src/PersonAvatar.png')}
							style={{width : 48, height: 48, marginBottom : 16}}
						/>
						<Text style={styles.headerText}>{name}</Text>
						<Text style={styles.subText}>{email}</Text>
					</View>
				</View>
				<View style={styles.screenContainer}>
					
					<TouchableOpacity 
						style={[styles.screenStyle, (this.props.activeItemKey=='ScreenA') ? styles.activeBackgroundColor : null]}
						onPress={() => this.props.navigation.navigate('MyGames')}
					>
						<Icon
							src={require('../src/purchases.png')}
							h={24}
							w={24}
						/>
						<Text 
							style={[styles.screenTextStyle, styles.selectedTextStyle ]} 
							>Мои игры</Text>
					</TouchableOpacity>
					<TouchableOpacity 
						style={[styles.screenStyle, (this.props.activeItemKey=='ScreenA') ? styles.activeBackgroundColor : null]}
						onPress={() => this.props.navigation.navigate('Shop')}
					>
						<Icon
							src={require('../src/joystick.png')}
							h={24}
							w={24}
						/>
						<Text 
							style={[styles.screenTextStyle, styles.selectedTextStyle ]} 
							>Магазин MozgoParty</Text>
					</TouchableOpacity>

				</View>

				<View style={styles.screenContainer}>
					
					<TouchableOpacity 
						style={[styles.screenStyle, (this.props.activeItemKey=='ScreenA') ? styles.activeBackgroundColor : null]}
						onPress={() => this.props.navigation.navigate('SettingsStack')}
					>
						<Icon
							src={require('../src/help.png')}
							h={24}
							w={24}
						/>
						<Text 
							style={[styles.screenTextStyle, styles.selectedTextStyle ]} 
							>Служба поддержки</Text>
					</TouchableOpacity>
					<TouchableOpacity 
						style={[styles.screenStyle, (this.props.activeItemKey=='ScreenA') ? styles.activeBackgroundColor : null]}
						onPress={this.props.navigation.navigate('SettingsStack')}
					>
						<Icon
							src={require('../src/faq.png')}
							h={24}
							w={24}
						/>
						<Text 
							style={[styles.screenTextStyle, styles.selectedTextStyle ]} 
							>FAQ</Text>
					</TouchableOpacity>

					<TouchableOpacity 
						style={[styles.screenStyle, (this.props.activeItemKey=='ScreenA') ? styles.activeBackgroundColor : null]}
						onPress={() => this.props.navigation.navigate('SettingsStack')}
					>
						<Icon
							src={require('../src/information.png')}
							h={24}
							w={24}
						/>
						<Text 
							style={[styles.screenTextStyle, styles.selectedTextStyle ]} 
							>Рукводство к играм</Text>
					</TouchableOpacity>

				</View>

				<TouchableOpacity 
					style={[styles.screenStyle,  {marginTop : 16},(this.props.activeItemKey=='ScreenA') ? styles.activeBackgroundColor : null]}
					onPress={() => this.props.navigation.navigate('SettingsStack')}
				>
					<Icon
						src={require('../src/settings.png')}
						h={24}
						w={24}
					/>
					<Text style={[styles.screenTextStyle, styles.selectedTextStyle ]} >Настройки</Text>
				</TouchableOpacity>
			</View>
			)
		}
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

export default connect(mapStateToProps, mapDispatchToProps)(drawerContentComponents);

const styles = StyleSheet.create({
    container: {
		alignItems: 'center',
		height : '100%',
    },
    headerContainer: {
		height: '26%',
		width: '100%',
		borderBottomColor : 'rgba(0, 0, 0, 0.12)',
		borderBottomWidth : 1,
		paddingHorizontal : 16
    },
    headerText: {
		color: '#000',
		fontWeight : '800',
		fontSize : 20,
		fontFamily : "Montserrat-Regular",
		marginBottom : 5
	},
	subText: {
		color: 'rgba(0, 0, 0, 0.54)',
		fontWeight : '500',
		fontSize : 14,
		fontFamily : "Roboto"
    },
    screenContainer: { 
        paddingTop: 20,
		width: '100%',
		borderBottomWidth : 1,
		borderBottomColor : 'rgba(0, 0, 0, 0.12)',
		paddingBottom : 12
    },
    screenStyle: {
        height: 30,
        marginTop: 2,
        flexDirection: 'row',
        alignItems: 'center',
		width: '100%',
		paddingHorizontal : 16,
		marginBottom : 16
    },
    screenTextStyle:{
        fontSize: 20,
        marginLeft: 20, 
        textAlign: 'center'
    },
    selectedTextStyle: {
        fontWeight: '600',
		color: '#0B2A5B',
		fontFamily : 'Montserrat-Regular',
		fontSize : 14
    },
    activeBackgroundColor: {
        backgroundColor: 'grey'
    }
});
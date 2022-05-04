import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    Image,
    Dimensions,
    TouchableHighlight,
    SafeAreaView,
} from 'react-native';
import {FlatList, ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import StackNavigator from '@react-navigation/stack/src/navigators/createStackNavigator';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ProfileScreen from './Profile';
import Profile from './Profile';
// import SyncStorage from 'sync-storage'
import Icon from 'react-native-vector-icons/Ionicons';
import TabNavigator from './Utils/TabNavigator';
import { AsyncStorage } from 'react-native';
import Header from './Utils/Header';


export default class MainWindow extends React.Component {
    constructor(props) {
        super(props);
    }

    getAsyncData = async () => {
        const id = await AsyncStorage.getItem('id');
        const username = await AsyncStorage.getItem('username');
        const first_name = await AsyncStorage.getItem('first_name');
        const last_name = await AsyncStorage.getItem('last_name');
        const email = await AsyncStorage.getItem('email');
        const image = await AsyncStorage.getItem('image');
        const about = await AsyncStorage.getItem('about');
        const level = await AsyncStorage.getItem('level');
        this.currentUser.id = JSON.parse(id)
        this.currentUser.username = JSON.parse(username)
        this.currentUser.first_name = JSON.parse(first_name)
        this.currentUser.last_name = JSON.parse(last_name)
        this.currentUser.email = JSON.parse(email)
        this.currentUser.image = JSON.parse(image)
        this.currentUser.about = JSON.parse(about)
        this.currentUser.level = JSON.parse(level)
        return JSON.parse(id)
    }

    state = {
        locations: [],
        selectedValue: '',
    };

    currentUser = {
        id: '',
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        image: '',
        about: '',
        level: '',
    }

    profile_user = {
        id: '',
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        image: '',
        about: '',
        level: '',
    }

    getProfileUserById = async ({id}) => {
        await fetch(ngrok + '/api/user/' + id +'/get-by-id', {
            method: 'GET',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        })
            .then(response => response.json())
            .then(data => {
                    this.profile_user.id = data['id']
                    this.profile_user.first_name = data['first_name']
                    this.profile_user.last_name = data['last_name']
                    this.profile_user.username = data['username']
                    this.profile_user.email = data['email']
                    this.profile_user.about = data['about']
                    this.profile_user.image = data['image']
                    this.profile_user.level = data['level']
                    this.props.navigation.navigate('Profile', {'current_user' : this.state.currentUser, 'profile_user' : this.profile_user});

                }
            )
            .catch(err => console.error(err));

    };

    getRecommendedLocations = async (id) => {
        let result = [];
        await fetch(ngrok + '/api/recommendations/' + id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        }).then(response => response.json())
            .then(data => {
                result = data;
            })
            .catch(err => console.error(err));
        this.setState({locations: result} )
        return result;
    };


    getRandomLocations = async () => {
        let result = [];
        await fetch(ngrok + '/api/random-locations/' + this.currentUser.id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        }).then(response => response.json())
            .then(data => {
                result = data;
            })
            .catch(err => console.error(err));
        this.setState({locations: result} )
        return result;
    };

    async componentDidMount() {
        await this.getAsyncData().then(result => {
                this.getRecommendedLocations(result);
            }
        );
    }

    options = [
        '', 'Recommended', 'Random'
    ];


    handleFilterInput = async(event) => {
        let value = event.target.options;
        this.setState({selectedValue: value})
        if(value === 'Recommended'){
            await this.getRecommendedLocations();
        }
        else
            await this.getRandomLocations();
    };


    render() {
        //this.setState({selectedValue: this.options[0]})
        return (
            <SafeAreaView style={styles.container}>
                <Header navigation={this.props.navigation}/>
                <Text style={styles.title}>
                    Your current missions:
                </Text>
                    <View style={{justifyContent: "space-between", flexDirection: "row"}}>
                        <TouchableOpacity style={{flexDirection: "row", alignItems: "center", marginLeft: 20, borderWidth: 1, borderRadius: 30, backgroundColor: "#ade2a8", marginBottom: 5 }} onPress={() => {this.getRecommendedLocations(this.currentUser.id)}}>
                            <Icon size={25} style={{padding: 5}} name="star-half"/>
                            <Text style={{fontFamily: "Georgia", fontSize: 20}}> Recommended </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection: "row", alignItems: "center", marginRight: 20, borderWidth: 1, borderRadius: 30, backgroundColor: "#ade2a8", marginBottom: 5}} onPress={() => {this.getRandomLocations()}}>
                            <Icon size={25} style={{padding: 5}} name="help"/>
                            <Text style={{fontFamily: "Georgia", fontSize: 20}}> Random </Text>
                        </TouchableOpacity>
                    </View>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>{
                    this.state.locations.map( item  => {
                        return (
                            <TouchableOpacity containerStyle={{ flexDirection: 'row' }}
                                              onPress={() => {
                                                  this.props.navigation.navigate('Map', {
                                                      lat: parseFloat(item.latitude),
                                                      lng: parseFloat(item.longitude),
                                                      item: item,
                                                  }, {navigation: this.props.navigation} )
                                              }
                                              }
                            >
                                <View style={styles.item}>
                                    <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
                                        <Text style={styles.xp}> + {item.xp} XP</Text>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center',}}>
                                        <Image style={{width: 300, height: 200, marginTop: 10, borderRadius: 10}} source={{uri:  ngrok + item.image}}/>
                                        <Text style = {styles.subtitle}> {item.name} </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );}
                    )}
                </ScrollView>
                <TabNavigator navigation={this.props.navigation}/>
            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#DFEEEA',
        flex: 1
    },
    item: {
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#2F5D62',
        borderRadius: 30,
        margin: 12,
        width: 350,
    },
    xp: {
        textAlign: "right",
        fontSize: 20,
        color: '#2F5D62',
        fontWeight: 'bold',
        marginRight: 25,
        marginTop: 3,
    },
    title: {
        textAlign: 'center',
        fontSize: 25,
        margin: 10,
        fontFamily: 'Georgia',
        color: '#2F5D62',
        fontWeight: 'bold'
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 25,
        margin: 10,
        fontFamily: 'Georgia',
        color: '#2F5D62',
    },
    dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
    dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
    dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
    dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
});



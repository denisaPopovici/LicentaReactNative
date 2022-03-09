import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, Button, Alert, Image, Dimensions, TouchableHighlight} from 'react-native';
import {FlatList, ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Tabs from '../components/BottomTabNavigator'
import Icon from 'react-native-vector-icons/FontAwesome';
import StackNavigator from '@react-navigation/stack/src/navigators/createStackNavigator';

export default class MainWindow extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        locations: [],
        currentUser: '',
    };

    getLocations = async () => {
        let result = [];
        await fetch('https://0b34-2a02-2f0e-51d-1f00-3150-5a9f-2522-9658.ngrok.io/api/locations', {
            method: 'GET',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        }).then(response => response.json())
            .then(data => {
                result = data;
            })
            .catch(err => console.error(err));

        return result;
    };

    async componentDidMount() {
        const result = await this.getLocations();
        this.setState({locations: result} )
    }


    render() {
        this.state.currentUser = this.props.route.params['current_user'];
        console.log(this.state.currentUser.id + " in maaaaain")

        const screenHeight = Dimensions.get('window').height
        return (
            <View style={{flex: 1, Height: "auto", maxHeight: screenHeight}}>
                <View style = {{flexDirection:'row'}}>
                    <TouchableHighlight onPress={()=>{this.props.navigation.navigate('Profile', {current_user: this.state.currentUser})}} activeOpacity={0.8} underlayColor="#DDDDDD" style={{marginTop: 50}}>
                        <View style = {{alignItems:'center', height: 60, flexDirection: 'row', textAlign: 'center', left: 10}}>
                            <Icon name="user" style={styles.icon} />
                            <Text style={{fontSize: 20}}> Profile </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={()=>{this.props.navigation.navigate('Feed', {current_user: this.state.currentUser} )}} activeOpacity={0.8} underlayColor="#DDDDDD" style={{marginTop: 100}}>
                        <View style = {{alignItems:'flex-start', marginLeft: 0, height: 60, flexDirection: 'row', textAlign: 'left', left: 10}}>
                            <Icon name="home" style={styles.icon} />
                            <Text style={{fontSize: 20}}> Feed </Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <Text style={styles.title}>
                    Places to visit:
                </Text>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>{
                    this.state.locations.map( item  => {
                        return (
                        <TouchableOpacity containerStyle={{ flexDirection: 'row' }}
                            onPress={() => {
                                this.props.navigation.navigate('Map', {
                                    lat: parseFloat(item.latitude),
                                    lng: parseFloat(item.longitude),
                                })
                            }
                            }
                        >
                            <View style = {styles.item}>
                                <Image style={{width: 220, height: 140, marginTop: 10}} source={{uri:  'https://0b34-2a02-2f0e-51d-1f00-3150-5a9f-2522-9658.ngrok.io' + item.image}}/>
                                <Text style = {styles.subtitle}> {item.name} </Text>
                            </View>
                        </TouchableOpacity>
                    );}
                    )}
                </ScrollView>
            </View>
        );
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#cccccc',
    borderRadius: 5,
    margin: 7,
    width: 350,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    margin: 10,
      fontFamily: 'Georgia',
      color: '#34983B',
  },
    subtitle: {
        textAlign: 'center',
        fontSize: 25,
        margin: 10,
    },
    icon: {
      fontSize: 20,
        marginLeft: 2,

    }
});



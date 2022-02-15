import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, Button, Alert, Image, Dimensions, TouchableHighlight} from 'react-native';
import {FlatList, ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import images from '../images';
import Tabs from '../components/BottomTabNavigator'
import Icon from 'react-native-vector-icons/FontAwesome';
import StackNavigator from '@react-navigation/stack/src/navigators/createStackNavigator';
export default class MainWindow extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        locations: [],
    };

    getLocations = async () => {
        let result = [];
        await fetch('http://localhost:8080/api/locations', {
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
        const current_user = this.props.route.params['current_user'];
        console.log('aaaaaaaa', current_user.username)

        const screenHeight = Dimensions.get('window').height
        return (
            <View style={{flex: 1, Height: "auto", maxHeight: screenHeight}}>
                <View style = {{flexDirection:'row'}}>
                    <TouchableHighlight onPress={()=>{this.props.navigation.navigate('Profile', {current_user: current_user})}} activeOpacity={0.8} underlayColor="#DDDDDD" style={{marginTop: 50}}>
                        <View style = {{alignItems:'center', height: 60, flexDirection: 'row', textAlign: 'center', left: 10}}>
                            <Icon name="user" style={styles.icon} />
                            <Text style={{fontSize: 20}}> Profile </Text>
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
                                <Image style={{width: 220, height: 140, marginTop: 10}} source={{uri:  'http://localhost:8080' + item.image}}/>
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
      fontSize: 20, alignItems: 'center',

    }
});



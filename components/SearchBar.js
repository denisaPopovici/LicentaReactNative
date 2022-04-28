import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {Searchbar} from 'react-native-paper';
import Header from './Utils/Header';
import {Divider} from 'react-native-elements/dist/divider/Divider';
import TabNavigator from './Utils/TabNavigator';
export default class SearchBar extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        data: [],
        filteredData: [],
    };

    fetchData = async () => {
        let result = [];
        await fetch(ngrok + '/api/all-users', {
            method: 'GET',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        }).then(response => response.json())
            .then(data => {
                result = data;
            })
            .catch(err => console.error(err));
        this.setState({data: result})
        this.setState({filteredData: result})
        return result;
    };

    searchFilterFunction = (text) => {
        if(text){
            const newData = this.state.data.filter(item => {
                const itemData = item.username ? item.username.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            })
            this.setState({filteredData: newData})
        } else {
            this.setState({filteredData: this.state.data})
        }
    }


    async componentDidMount() {
        const data = await this.fetchData();
    }

    render() {
        return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#DFEEEA'}}>
            <Header navigation={this.props.navigation}/>
            <Searchbar style={{marginTop: 10, marginLeft: 8, marginRight: 8,}} placeholder="Search"
                       onChangeText={this.searchFilterFunction} value={this.state.filteredData}/>
            <ScrollView>
                {
                    this.state.filteredData.map((item, index) => {
                        return (
                            <View key={index} style={styles.itemContainer}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', {
                                    'profile_user': item
                                })} style={styles.itemContainer}>
                                    <Image
                                        source={{uri: ngrok + item.image}}
                                        style={styles.image}
                                    />
                                        <View>
                                            <Text style={styles.textName}>{item.first_name} {item.last_name}</Text>
                                            <Text style={styles.textUsername}>{item.username}</Text>
                                        </View>
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
            </ScrollView>
            <TabNavigator navigation={this.props.navigation}/>
        </SafeAreaView>
    );
    }
}

const styles = StyleSheet.create({
    textFriends: {
        fontSize: 20,
        textAlign: 'left',
        marginLeft: 10,
        fontWeight: 'bold',
        marginTop: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    textName: {
        fontSize: 17,
        marginLeft: 10,
        fontWeight: "600",
    },
    textUsername: {
        fontSize: 14,
        marginLeft: 10,
        color: "grey",
    },
});

import React, {Component, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, Button, Alert, Image, SafeAreaView, AsyncStorage} from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';
import TouchableOpacity from 'react-native-gesture-handler';
import Header from './Utils/Header';
import {ScrollView} from 'react-native-gesture-handler';
import TabNavigator from './Utils/TabNavigator';
import {setItem} from './ProfileSettings';

function arePointsNear(latitude, longitude, centerLatitude, centerLongitude, km) {
  var ky = 40000 / 360;
  var kx = Math.cos(Math.PI * centerLatitude / 180.0) * ky;
  var dx = Math.abs(centerLongitude - longitude) * kx;
  var dy = Math.abs(centerLatitude - latitude) * ky;
  return Math.sqrt(dx * dx + dy * dy) <= km;
}

export default function Map({ route, navigation }) {

    const {lat, lng, item} = route.params;

    const currentRegion = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    const [myLatitude, setMyLatitude] = useState('');
    const [myLongitude, setMyLongitude] = useState('');
    const [id, setId] = useState(null);


    Geolocation.getCurrentPosition((position) => {
        // this.setState({position: {longitude: position.longitude, latitude: position.latitude}});
        // myLocation.latitude = position.latitude;
        // myLocation.longitude = position.longitude;
        setMyLatitude(position.coords.latitude);
        setMyLongitude(position.coords.longitude);
    }, (error) => {
        alert(JSON.stringify(error))
    }, {
        enableHighAccuracy: true,
        timeout: 20000,
    });

    const addXP = async (xpNou) => {
        // --FETCH
        await fetch(ngrok + '/api/user/' + id + "/add-xp/" + xpNou, {
            method: 'PUT',
            headers: {'Content-Type': 'multipart/form-data', Accept: 'application/json'},
        })
            .then(response => response.json())
            .then(data => {
                setItem('xp', xpNou + xp)
            })
            .catch(err => console.error(err));

    };

    const addVisitedLocation = async (locationID) => {
        // --FETCH
        await fetch( ngrok + '/api/user/' + id + '/visited-location/' + locationID, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        const fetchData = async () => {
            await getAsyncData();
        }
        fetchData();
    }, []);

    const getAsyncData = async () => {
        const id = await AsyncStorage.getItem('id');
        setId(JSON.parse(id))
    }

    return (
        <SafeAreaView style = {styles.body}>
            <View style={{flexDirection: "row", height: "20%", marginLeft: 10, marginTop: 10}}>
                <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                    <Image style={{width: 160, height: 120, marginTop: 30, borderRadius: 10}} source={{uri:  ngrok + item.image}}/>
                    <Text style = {styles.subtitle}> {item.name} </Text>
                </View>
                <ScrollView persistentScrollbar={true} showsVerticalScrollIndicator={true} style={{marginLeft: 5, marginTop: 0, marginRight: 10, flexShrink: 1, borderWidth: 0, flexGrow: 1}}>
                    <Text>
                        {item.description} ja cnscvue cs cnajb csbefhujbacb asmc sabsalkdnbfefuoilsab cshgfuoahl hudgfuei feugfousbf egfusbfe hcsouc cduihiv vvgsduoivjbjrnd vdvd
                    </Text>
                </ScrollView>
            </View>
            <View style={{alignItems: "flex-end", flexDirection: "column", marginRight: 10, marginTop: 20}}>
                <Text style={{color: '#2F5D62', fontWeight: "bold"}}> °{item.latitude} </Text>
                <Text style={{color: '#2F5D62', fontWeight: "bold"}}> °{item.longitude} </Text>
            </View>
            <MapView
                style = {styles.map}
                initialRegion={{
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker coordinate={currentRegion} />
            </MapView>
            <Button
                title="I AM HERE!"
                onPress={() => {
                    if(arePointsNear(myLatitude, myLongitude, lat, lng, 0.5 ) === true) {
                        let mesaj = "You just gained " + item.xp + "XP for visiting " + item.name + ". Would you like to post a picture from your trip?"
                        Alert.alert("Amazing!", mesaj,[{text: "Absolutely", onPress: () => {navigation.navigate("AddPost")}}, {text: "Maybe another time"}]);
                        addXP(item.xp);
                        addVisitedLocation(item.id);
                    }
                    else {
                        Alert.alert("You are not close enough yet! Keep going! ", [{text: "OK!"}])
                    }
                }
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#DFEEEA',
    },
    map: {
        borderWidth: 3,
        borderColor: '#2F5D62',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        borderRadius: 15,
        width: '95%',
        height: '67%',
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 20,
        margin: 10,
        fontFamily: 'Georgia',
        color: '#2F5D62',
        fontWeight: 'bold'
    },
    title: {
        textAlign: 'center',
        fontSize: 25,
        margin: 10,
        fontFamily: 'Georgia',
        color: '#2F5D62',
        fontWeight: 'bold'
    },
})

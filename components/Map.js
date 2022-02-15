import React, {Component, useState} from 'react';
import {View, Text, StyleSheet, TextInput, Button, Alert, Image} from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';
import Tabs from '../components/BottomTabNavigator';
import TouchableOpacity from 'react-native-gesture-handler';

function arePointsNear(latitude, longitude, centerLatitude, centerLongitude, km) {
  var ky = 40000 / 360;
  var kx = Math.cos(Math.PI * centerLatitude / 180.0) * ky;
  var dx = Math.abs(centerLongitude - longitude) * kx;
  var dy = Math.abs(centerLatitude - latitude) * ky;
  return Math.sqrt(dx * dx + dy * dy) <= km;
}

export default function Map({ route }) {

    const {lat, lng} = route.params;

    const currentRegion = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    const [myLatitude, setMyLatitude] = useState('');
    const [myLongitude, setMyLongitude] = useState('');


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

    return (
        <View style = {styles.body}>
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
                title="VALIDATE"
                onPress={() => {
                    if(arePointsNear(myLatitude, myLongitude, lat, lng, 0.5 ) === true){
                        Alert.alert("Congratulations for visiting this place! You just gained 3XP! ", [{text: "Great!"}])
                    }
                    else {
                        Alert.alert("You are not close enough yet! Keep going! ", [{text: "OK!"}])
                    }
                }
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: 30,
        margin: 10,
    },
    map: {
        width: '100%',
        height: '93%',
    }
})

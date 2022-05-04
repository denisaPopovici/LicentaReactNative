import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    TextInput,
    StyleSheet,
    SafeAreaView, TouchableHighlight, AsyncStorage, Alert, Image, Button,
} from 'react-native';
import {loader} from '../assets/images/Images';
import {useTheme} from 'react-native-paper';
import {congrats} from '../assets/images/Images';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import BottomSheet from 'reanimated-bottom-sheet';
import Animated, {diff} from 'react-native-reanimated';

import ImagePicker from 'react-native-image-crop-picker';
import TabNavigator from './Utils/TabNavigator';
import Header from './Utils/Header'
import {trophy} from '../assets/images/Images';
import Backdrop from 'native-base/src/components/composites/Backdrop/index';

const RateLocation = ({route, navigation}) => {

    const {colors} = useTheme();
    const [id, setId] = useState(null);
    const {location} = route.params;
    const [starOne, setStarOne] = useState(false);
    const [starTwo, setStarTwo] = useState(null);
    const [starThree, setStarThree] = useState(null);
    const [starFour, setStarFour] = useState(null);
    const [starFive, setStarFive] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false)

    const starPressed = (star) => {
        if(star === "one"){
            setStarOne(true);
            setStarTwo(false)
            setStarThree(false)
            setStarFour(false)
            setStarFive(false)
        }
        if(star === "two"){
            setStarOne(false);
            setStarTwo(true)
            setStarThree(false)
            setStarFour(false)
            setStarFive(false)
        }if(star === "three"){
            setStarOne(false);
            setStarTwo(false)
            setStarThree(true)
            setStarFour(false)
            setStarFive(false)
        }if(star === "four"){
            setStarOne(false);
            setStarTwo(false)
            setStarThree(false)
            setStarFour(true)
            setStarFive(false)
        }if(star === "five"){
            setStarOne(false);
            setStarTwo(false)
            setStarThree(false)
            setStarFour(false)
            setStarFive(true)
        }
    }

    const addRating = async () => {
        let rate = 0
        if(starOne) rate = 1
        else if(starTwo) rate = 2
        else if (starThree) rate = 3
        else if(starFour) rate = 4
        else if(starFive) rate = 5

        let result = []
            // --FETCH
            await fetch( ngrok + '/api/new-rating/user/' + id + '/location/' + location.id + '/rate/' + rate, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', Accept: 'application/json'},
            })
                .then(response => response.json())
                .then(data => {
                    result = data
                    console.log(data);
                })
                .catch(err => console.error(err));
        setIsDisabled(true)
        return result;
    };

    useEffect(() => {
        const fetchData = async () => {
            return getAsyncData();
        }
        fetchData();
    }, );

    const getAsyncData = async () => {
        const id = await AsyncStorage.getItem('id');
        setId(JSON.parse(id))
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header navigation={navigation}/>
            <View style={{flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                <Text style={{fontSize: 30, fontFamily: "Georgia", color: '#2F5D62', fontWeight: "bold"}}> CONGRATULATIONS!</Text>
                <Text style={{fontSize: 25, fontFamily: "Georgia", color: '#2F5D62'}}> You just won +{location.xp} XP!</Text>
                <Image source={congrats} style={{width: 200, height: 260}}/>
            </View>
            <View style={{flexDirection: "column", alignItems: "center", marginLeft: 10, marginRight: 10, justifyContent: "center", borderRadius: 20, borderWidth: 1, borderColor: "#187fc3"}}>
                <Image source={{
                    uri: ngrok + location.image,
                }} style={{width: 90, height: 90, borderColor: '#2F5D62', borderRadius: 45, borderWidth: 3, marginTop: 5}}/>
                <Text style={{fontWeight: 'bold', marginBottom: 10, marginTop: 5, fontSize: 20, fontFamily: 'Georgia'}}> {location.name} </Text>
                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <TouchableOpacity onPress={() => {starPressed("one")}}>
                        <Icon name={starOne ? "star" : "star-outline"} size={30} style={{color: "#187fc3"}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {starPressed("two")}}>
                        <Icon name={starTwo ? "star" : "star-outline"} size={30} style={{color: "#187fc3"}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {starPressed("three")}}>
                        <Icon name={starThree ? "star" : "star-outline"} size={30} style={{color: "#187fc3"}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {starPressed("four")}}>
                        <Icon name={starFour ? "star" : "star-outline"} size={30} style={{color: "#187fc3"}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {starPressed("five")}}>
                        <Icon name={starFive ? "star" : "star-outline"}size={30} style={{color: "#187fc3"}}/>
                    </TouchableOpacity>
                </View>
                <Text style={{fontSize: 18}}> Please rate your experience </Text>
                <Button disabled={isDisabled} title="Send" onPress={() => {addRating()}}/>
            </View>
            <View style={{flexDirection: 'column', justifyContent: "flex-start",marginTop: 10}}>
                <Text style={{fontWeight: "bold", fontSize: 18, textAlign: "center"}}> Would you like to post something?</Text>
                <View style={{flexDirection: "row", justifyContent: "space-between", marginRight: 35, marginLeft: 35}}>
                    <Button onPress={() => navigation.navigate("AddPost", {navigation: navigation})
                    } title="Absolutely!" />
                    <Button onPress={() => navigation.navigate("Feed")} title="Maybe later." />
                </View>
            </View>
        {/*<TabNavigator navigation={navigation}/>*/}
        </SafeAreaView>
    );
};

export default RateLocation;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DFEEEA',
    },
    commandButton: {
        marginTop: 10,
    },
    panel: {
        padding: 20,
        backgroundColor: '#DFEEEA',
        paddingTop: 30,
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        // shadowColor: '#000000',
        // shadowOffset: {width: 0, height: 0},
        // shadowRadius: 5,
        // shadowOpacity: 0.4,
    },
    header: {
        backgroundColor: '#649f91',
        shadowColor: '#333333',
        shadowOffset: {width: -1, height: -3},
        shadowRadius: 2,
        shadowOpacity: 0.4,
        // elevation: 5,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
    },
    panelHeader: {
        alignItems: 'center',

    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',

    },
    panelTitle: {
        fontSize: 30,
        textAlign: 'center',
        fontFamily: 'Georgia',
        marginBottom: 10,

    },
    panelXP: {
        fontSize: 16,
        fontFamily: 'Georgia',
        marginBottom: 3,
    },
    panelSubtitle: {
        fontSize: 16,
        color: 'gray',
        fontFamily: 'Georgia',
        marginBottom: 3,
    },
    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#649f91',
        alignItems: 'center',
        marginVertical: 7,
        borderColor: '#2F5D62',
        borderWidth: 3,
        marginTop: 10,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: 'black'
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Georgia',
        fontWeight: 'bold',
        marginTop: 5
    },
});

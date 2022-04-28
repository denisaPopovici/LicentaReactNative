import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Image, StyleSheet, Alert, AsyncStorage} from 'react-native';
import {appLogo} from '../../assets/images/Images';
import Icon from 'react-native-vector-icons/Ionicons';
const Header = ({navigation}) => {
    const [newNotifications, setNewNotifications] = useState(false)
    const [id, setId] = useState(null);
    const [level, setLevel] = useState(null);
    const [noNotifications, setNoNotifications] = useState(0)

    const removeItemValue = async(key) => {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        }
        catch(exception) {
            return false;
        }
    }

    const alertMessageLogOut = () => {
        Alert.alert("Just a second!", "Are you sure you want to log out?",
            [{text: "Yes", onPress: () => {logOut();}}, {text: "No"}])
    }


    const getAllNotifications = async (id) => {
        let result = []
        let ok = false;
        let noNotifications = 0;
        // --FETCH
        await fetch( ngrok + '/api/user/' + id + '/notifications', {
            method: 'GET',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        })
            .then(response => response.json())
            .then(data => {
                for(var i = 0; i < data.length; i++){
                    var obj = data[i]
                    if(obj['read'] === false){
                        ok = true
                        noNotifications = noNotifications + 1
                    }
                }
            }).catch(err => console.error(err));
        setNewNotifications(ok)
        setNoNotifications(noNotifications)
        return result
    }

    const logOut = async () => {
        navigation.navigate("Login");
        await removeItemValue('id')
        await removeItemValue('first_name')
        await removeItemValue('last_name')
        await removeItemValue('username')
        await removeItemValue('email')
        await removeItemValue('about')
        await removeItemValue('image')
        await removeItemValue('level')
        await removeItemValue('xp')
    }

    const getAsyncData = async () => {
        const id = await AsyncStorage.getItem('id')
        const level = await AsyncStorage.getItem('level')
        setLevel(JSON.parse(level));
        console.log(JSON.parse(id), "IDDDDDDDDDD")
        return JSON.parse(id)
    }

    useEffect(() => {
        const fetchData = async () => {
            await getAsyncData().then(result => {
                setId(result);
                getAllNotifications(result);
            });
        }
        const getNotifications = navigation.addListener('focus', () => {
            fetchData();
        });
        return getNotifications;
    }, [navigation]);

    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <Image style={styles.logo} source={appLogo}/>
            </TouchableOpacity>
            <View style={styles.iconContainer}>
                <TouchableOpacity style={{marginRight: 10}} onPress = { () => {navigation.navigate('Experience')}}>
                    <View style={{flexDirection: "row"}}>
                        <Icon name="star" style={{color: '#bdddd3'}} size={30} />
                        <Text style={{position: "absolute", fontSize: 20, marginTop: 5, marginLeft: 4}}> {level} </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={ () => {alertMessageLogOut();}
                }>
                    <Icon style={{marginRight: 5}} name="exit-outline" size={30}  />
                </TouchableOpacity>
                <TouchableOpacity style={{marginRight: 5}} onPress={() => {navigation.navigate('AddPost')}}>
                    <Icon name="add-circle-outline" size={30}  />
                </TouchableOpacity>
                <TouchableOpacity style={{marginRight: 5}} onPress={() => {navigation.navigate('Notifications')}}>
                    {
                        newNotifications ?
                            <View style={{flexDirection: "row"}}>
                                <Icon name="heart" size={30} style={{color: "red", width: 30}}/>
                                <Text style={{fontWeight: "bold", marginLeft: 19, marginTop: 19, position: "absolute"}}> {noNotifications} </Text>
                            </View>
                            : <Icon name="heart-outline" size={30} style={{color: "black"}} />
                    }
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create(
    {
        container:
            {
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                marginHorizontal: 10,
                backgroundColor: "white",
                height: 60,
                marginBottom: 10
            },
        logo:
            {
                width: 150,
                height: 90,
                resizeMode: 'contain'
            },
        iconContainer:
            {
                flexDirection: 'row',
                color: 'white',
                marginTop: 10
            },
        icons:
            {
                width: 30,
                height: 30,
                marginLeft: 10,
                color: 'black'
            }
    }
)

export default Header

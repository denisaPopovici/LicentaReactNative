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

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import BottomSheet from 'reanimated-bottom-sheet';
import Animated, {diff} from 'react-native-reanimated';

import ImagePicker from 'react-native-image-crop-picker';
import TabNavigator from './Utils/TabNavigator';
import Header from './Utils/Header'
import {trophy} from '../assets/images/Images';

const Experience = ({navigation}) => {

    const {colors} = useTheme();
    const [id, setId] = useState(null);
    const [username, setUsername] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [image, setImage] = useState(null);
    const [about, setAbout] = useState(null);
    const [level, setLevel] = useState(null);
    const [difference, setDifference] = useState(null);
    const [percent, setPercent] = useState(null);
    const [showTabNavigator, setShowTabNavigator] = useState(true);
    const [xp, setXP] = useState(null);

    let profile_user = {
        id: '',
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        image: '',
        about: '',
        level: '',
    }

    const getLevelObj = async () => {
        console.log(level, " ;V;;VV")
        let result = [];
        await fetch(ngrok + '/api/level/' + level, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        }).then(response => response.json())
            .then(data => {
                console.log("DATAAAAAAAA LEVEL ", data)
                result = data;
            })
            .catch(err => console.error(err));
        //setLevelObject(result)
        return result;
    };

    let bs;
    bs = React.createRef();
    let fall;
    fall = new Animated.Value(1);

    let renderInner;
    renderInner = () => (
        <View style={styles.panel}>
            <Text style={styles.panelTitle}> Level hierarchy </Text>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <View style={{flexDirection: "column"}}>
                    <Text style={styles.panelSubtitle}> Level 1</Text>
                    <Text style={styles.panelSubtitle}> Level 2</Text>
                    <Text style={styles.panelSubtitle}> Level 3</Text>
                    <Text style={styles.panelSubtitle}> Level 4</Text>
                    <Text style={styles.panelSubtitle}> Level 5</Text>
                </View>
                <View style={{flexDirection: "column"}}>
                    <Text style={styles.panelXP}> 0-9 XP</Text>
                    <Text style={styles.panelXP}> 10-19 XP</Text>
                    <Text style={styles.panelXP}> 20-34 XP</Text>
                    <Text style={styles.panelXP}> 35-49 XP</Text>
                    <Text style={styles.panelXP}> 50-69 XP</Text>
                </View>
                <View style={{flexDirection: "column"}}>
                    <Text style={styles.panelSubtitle}> Level 6</Text>
                    <Text style={styles.panelSubtitle}> Level 7</Text>
                    <Text style={styles.panelSubtitle}> Level 8</Text>
                    <Text style={styles.panelSubtitle}> Level 9</Text>
                    <Text style={styles.panelSubtitle}> Level 10</Text>
                </View>
                <View style={{flexDirection: "column"}}>
                    <Text style={styles.panelXP}> 70-89 XP</Text>
                    <Text style={styles.panelXP}> 90-109 XP</Text>
                    <Text style={styles.panelXP}> 110-129 XP</Text>
                    <Text style={styles.panelXP}> 130-164 XP</Text>
                    <Text style={styles.panelXP}> 165-200 XP</Text>
                </View>
            </View>
            <View style={{flexDirection: "row", justifyContent: "center", marginTop: 5}}>
                <Text style={styles.panelSubtitle}> MASTER</Text>
                <Text style={styles.panelXP}> >200</Text>
            </View>
            <TouchableOpacity
                style={styles.panelButton}
                onPress={() => {bs.current.snapTo(1); setShowTabNavigator(true)}}>
                <Text style={styles.panelButtonTitle}> OK </Text>
            </TouchableOpacity>
        </View>
    );

    let renderHeader;
    renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
            </View>
        </View>
    );

    useEffect(() => {
        const fetchData = async () => {
            await getAsyncData();
        }
        const getLevelObject = async () => {
            await getLevelObj().then(result => {
                let difference = result['superior_limit'] - xp
                console.log("diff ", difference)
                setDifference(difference);
                let percent = (xp * 100) / result['superior_limit']
                console.log("percent ", percent.toFixed(2))
                setPercent(percent.toFixed(2))
            });
        }
        const listener = navigation.addListener('focus', () => {
            getLevelObject();
        });

        fetchData();
        return listener;
    }, [navigation]);

    const getAsyncData = async () => {
        const id = await AsyncStorage.getItem('id');
        const username = await AsyncStorage.getItem('username');
        const first_name = await AsyncStorage.getItem('first_name');
        const last_name = await AsyncStorage.getItem('last_name');
        const email = await AsyncStorage.getItem('email');
        const image = await AsyncStorage.getItem('image');
        const about = await AsyncStorage.getItem('about');
        const level = await AsyncStorage.getItem('level');
        const xp = await AsyncStorage.getItem('xp')
        setXP(JSON.parse(xp));
        setId(JSON.parse(id))
        setUsername(JSON.parse(username))
        setFirstName(JSON.parse(first_name))
        setLastName(JSON.parse(last_name))
        setEmail(JSON.parse(email))
        setImage(JSON.parse(image))
        setAbout(JSON.parse(about))
        setLevel(JSON.parse(level))
    }







    return (
        <SafeAreaView style={styles.container}>
            <Header navigation={navigation}/>
            <BottomSheet
                ref={bs}
                snapPoints={[320, -90]}
                renderContent={renderInner}
                renderHeader={renderHeader}
                initialSnap={1}
                callbackNode={fall}
                enabledGestureInteraction={true}
            />
            <Animated.View style={{margin: 20, flex: 1,
                opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
            }}>
            <View style={{flexDirection: "column", margin: 4, alignItems: "center"}}>
                <Image source={{
                    uri: ngrok + image,
                }} style={{width: 75, height: 75, borderColor: '#2F5D62', borderRadius: 37.5, borderWidth: 3,}}/>
                <Text style={{fontWeight: 'bold', marginBottom: 10, marginTop: 5, fontSize: 20, fontFamily: 'Georgia'}}> {username} </Text>
            </View>
            <View style={{flexDirection: "column", alignItems: "center", borderWidth: 1, marginRight: 10, marginLeft: 10}}>
                <Text style={{fontWeight: 'bold', fontSize: 20, marginTop: 5}}> {percent}% </Text>
                <Image source={loader} style={{width: 300, height: 40}}/>
                <Text style={{fontSize: 15, margin: 5, textAlign: "center"}}> You need {difference} more points to reach the next level. </Text>
                <TouchableOpacity
                    style={{marginBottom: 5}}
                    title="Show level hierarchy"
                    onPress={() => {setShowTabNavigator(false); bs.current.snapTo(0)}}
                >
                    <Text style={{fontSize: 15, color:"#1f8815"}}> Show level hierarchy </Text>
                </TouchableOpacity>
            </View>
            <View style={{justifyContent: "flex-start", alignItems: "flex-start", marginBottom: 5, marginTop: 10}}>
                <Text style={styles.title}> Your experience: </Text>
            </View>
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1, marginLeft: 10, marginRight: 10}}>
                <View style={{flexDirection: "column", marginLeft: "30%"}}>
                    <Text style={{fontWeight: 'bold', marginBottom: 10, marginTop: 5, fontSize: 25, fontFamily: 'Georgia'}}> Level: {level} </Text>
                    <Text style={{fontWeight: 'bold', marginBottom: 10, marginTop: 5, fontSize: 25, fontFamily: 'Georgia'}}> XP: {xp} </Text>
                </View>
                <Image source={trophy} style={{width: 90, height: 90}}/>
            </View>
            <View style={{flex: 1}}></View>
            </Animated.View>
            { showTabNavigator ?
                <TabNavigator navigation={navigation}/>
                : null
            }

        </SafeAreaView>
    );
};

export default Experience;


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

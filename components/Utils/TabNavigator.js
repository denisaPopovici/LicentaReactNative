import React from 'react'
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image,
    StyleSheet,
    TouchableHighlight,
    AsyncStorage,
} from 'react-native';
import {appLogo} from '../../assets/images/Images';
import Icon from 'react-native-vector-icons/Ionicons';
import {useRoute} from '@react-navigation/native';

export default class TabNavigator extends React.Component {

    constructor(props) {
        super(props);
        this.getAsyncData();
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

    }

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

    state = {
        currentScreen: '',
    }


    render() {
        return (

            <View>
                <View style={styles.container}>
                    <TouchableHighlight style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => {
                        this.props.navigation.navigate('Profile', {
                            'profile_user': this.currentUser
                        });
                    }} activeOpacity={0.8} underlayColor="#DDDDDD">
                        <View style={{alignItems: 'center', flexDirection: 'row', textAlign: 'center'}}>
                            <Icon name= 'person-outline'
                                  style={styles.icon}/>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => {
                        this.props.navigation.navigate('Feed')
                    }} activeOpacity={0.8} underlayColor="#DDDDDD">
                        <View style={{alignItems: 'center', flexDirection: 'row', textAlign: 'center'}}>
                            <Icon name="home-outline" style={styles.icon}/>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => {
                        this.props.navigation.navigate('Search')
                    }} activeOpacity={0.8} underlayColor="#DDDDDD">
                        <View style={{alignItems: 'center', flexDirection: 'row', textAlign: 'center'}}>
                            <Icon name="search-outline" style={styles.icon}/>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} activeOpacity={0.8} underlayColor="#DDDDDD">
                        <View style={{alignItems: 'center', flexDirection: 'row', textAlign: 'center'}}>
                            <Icon name="map-outline" style={styles.icon}/>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    icon: {
        fontSize: 25,
        marginLeft: 2,

    },
    container: {
        borderColor: '#2F5D62',
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        elevation: 0,
        backgroundColor: "#5E8B7E",
        borderRadius: 15,
        height: 60,
    }
});

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
    }

    getProfileUserById = async (id) => {
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
                    this.props.navigation.navigate('Profile', {'profile_user' : this.profile_user});
                }
            )
            .catch(err => console.error(err));
    };

    getAsyncData = async () => {
        const id = await AsyncStorage.getItem('id');
        this.setState({id: JSON.parse(id)})
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

    state = {
        id: '',
    }

    async componentDidMount() {
        await this.getAsyncData();
    }

    render() {
        return (

            <View>
                <View style={styles.container}>
                    <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => {
                        this.getProfileUserById(this.state.id);
                    }} >
                        <View style={{alignItems: 'center', flexDirection: 'row', textAlign: 'center'}}>
                            <Icon name= 'person-outline'
                                  style={styles.icon}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => {
                        this.props.navigation.navigate('Feed')
                    }}>
                        <View style={{alignItems: 'center', flexDirection: 'row', textAlign: 'center'}}>
                            <Icon name="home-outline" style={styles.icon}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => {
                        this.props.navigation.navigate('Search')
                    }} >
                        <View style={{alignItems: 'center', flexDirection: 'row', textAlign: 'center'}}>
                            <Icon name="search-outline" style={styles.icon}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => {
                        this.props.navigation.navigate('Missions')
                    }} >
                        <View style={{alignItems: 'center', flexDirection: 'row', textAlign: 'center'}}>
                            <Icon name="map-outline" style={styles.icon}/>
                        </View>
                    </TouchableOpacity>
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

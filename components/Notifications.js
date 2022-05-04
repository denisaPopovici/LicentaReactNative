import React from 'react';
import {
    Alert,
    Dimensions,
    Image,
    StyleSheet,
    Button,
    Text,
    TextInput,
    TouchableHighlight,
    View,
    KeyboardAvoidingView,
    AsyncStorage,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {Divider} from 'react-native-elements/dist/divider/Divider';
import Icon from 'react-native-vector-icons/Ionicons';
import TabNavigator from './Utils/TabNavigator';
import nonIterableRest from '@babel/runtime/helpers/esm/nonIterableRest';

export default class Notifications extends React.Component {

    constructor(props) {
        super(props);
        //this.getAsyncData();
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
        notifications: [],
        doesFollow: 0,
    };

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

    followUser = async (id) => {
        // --FETCH
        await fetch(ngrok + '/api/user/' + this.currentUser.id + '/follows/' + id, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        })
            .then(response => response.json())
            .then(data => {
                //console.log(data);
            })
            .catch(err => console.error(err));
    };

    doesUserFollowUser= async (id) => {
        let result = [];
        await fetch(ngrok + '/api/does-user/' + this.currentUser.id + '/follow/' + id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        }).then(response => response.json())
            .then(data => {
                result = data;
            })
            .catch(err => console.error(err));
        this.setState({doesFollow: result.length})
        return result;
    };


    getAllNotifications = async () => {
        let result = []
        // --FETCH
        await fetch( ngrok + '/api/user/' + this.currentUser.id + '/notifications', {
            method: 'GET',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        })
            .then(response => response.json())
            .then(data => {
                console.log(data, "DATAAAA")
                result = data;
            }).catch(err => console.error(err));
        console.log(result.length, 'length')
        this.setState({notifications: result})
        return result
    }

    markAsRead = async (notification) => {
        //mark all notifications as read
        await fetch(ngrok + '/api/read-notification/' + notification.id, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(err => console.error(err));
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

    async componentDidMount() {
        await this.getAsyncData();
        const result = await this.getAllNotifications();
    }

    render() {
        const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>
        return (
            <View style={{flex: 1, marginTop: 5,width:'auto'}} >
                <ScrollView>
                    {
                        this.state.notifications.map((notification) => {
                            if(notification.read === false) {
                                this.markAsRead(notification);
                            }
                            return (
                                <View style={{marginTop: 5}}>
                                    {
                                            <View style={{ flexDirection: 'row', marginBottom: 0, marginLeft: 2, borderWidth: 0.5, borderColor: 'gray',width:'auto'}}>
                                                <View style={{flexDirection: 'row', alignItems: 'center', flexGrow: 1, flex: 1, marginTop: 3, marginBottom: 3}}>
                                                    <Image style={styles.circleImage} source={{uri:  ngrok + notification.notifying_image }}/>
                                                    {
                                                        notification.type === 'like' ?
                                                            <View style={{display: 'flex',flexDirection:'row'}}>
                                                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', alignContent: 'center', maxWidth:'85%'}}>
                                                                <Text style={{marginLeft: 5,fontFamily: 'Georgia', fontSize: 17, flexWrap: 'wrap'}}>
                                                                    <B> {notification.notifying_username} </B> liked your post.
                                                                </Text>
                                                                <Image style={styles.squareImage} source={{uri:  ngrok + notification.post_image }}/>
                                                            </TouchableOpacity>
                                                                </View>
                                                            : notification.type === 'follow' ?
                                                            <View style={{display: 'flex',flexDirection: 'row',alignItems:'center'}}>
                                                                <TouchableOpacity style={{flexDirection: 'row',maxWidth:'80%', alignItems: 'center', alignContent: 'center'}}>
                                                                    <Text style={{marginLeft:5,marginTop:0, fontFamily: 'Georgia', fontSize: 17, flexWrap: 'wrap'}}>
                                                                        <B> {notification.notifying_username} </B> started following you.
                                                                    </Text>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity onPress={() => {this.getProfileUserById(notification.notifying_id)}}>
                                                                        <Text style={{color:'#2d9ed4',fontSize:17}}> {this.state.doesFollow === 0 ? "Follow" : "Following"} </Text>
                                                                </TouchableOpacity>

                                                            </View>
                                                            : notification.type === 'comment' ?
                                                                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', alignContent: 'center', maxWidth: "85%"}}>
                                                                    <Text style={{marginLeft: 5, fontFamily: 'Georgia', fontSize: 17, flexWrap: 'wrap'}}>
                                                                        <B> {notification.notifying_username} </B> commented: {notification.comment_text}
                                                                    </Text>
                                                                    <Image style={styles.squareImage} source={{uri:  ngrok + notification.post_image }}/>
                                                                </TouchableOpacity>
                                                                : null
                                                    }
                                                </View>
                                            </View>
                                    }
                                </View>
                            )
                        })
                    }
                </ScrollView>
                <TabNavigator navigation={this.props.navigation}/>
            </View>
            // </View>
        )
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
    },
    input: {
        height: 40,
        width: 330,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        borderColor: 'green',
    },
    circleImage: {
        width: 35,
        height: 35,
        marginLeft: 10,
        borderWidth: 3,
        borderColor: "#2F5D62",
        borderRadius: 35
    },
    squareImage: {
        width: 35,
        height: 35,
        marginLeft: 10,
        borderWidth: 2,
        borderColor: "#2F5D62",
    },
});

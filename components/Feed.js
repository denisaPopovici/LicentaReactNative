import React, {Component} from 'react';
import * as Sentry from '@sentry/react-native';

import {
    Alert,
    Button,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View,
    SafeAreaView,
    AsyncStorage,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Header from './Utils/Header';
import Post from './Utils/Post';
import {Divider} from 'react-native-elements/dist/divider/Divider';
import Icon from 'react-native-vector-icons/Ionicons';
import {List} from 'react-native-paper';
import MainWindow from './MainWindow';
import ProfileSettings from './ProfileSettings';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SearchBar from './SearchBar';
import TabNavigator from './Utils/TabNavigator';
import { useIsFocused } from '@react-navigation/native';

class Feed extends React.Component {

    constructor(props) {
        super(props);
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
        posts: [],
        currentPost: '', //id of the post the user wants to like/comment on
        likedPosts: [], //all the posts the user likes
    };

    isLiked(post) {
        return this.state.likedPosts.some(item => post.id === item.id_post);
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

    addNotification = async (type, notified, postID, commentID) => {
            // --FETCH
            await fetch(ngrok + '/api/notification/' + type + '/to/' + notified + '/from/' +  this.currentUser.id + '/post/' + postID + '/comment/' + commentID, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', Accept: 'application/json'},
            })
                .then(response => response.json())
                .then(data => {
                        console.log(data);
                    }
                )
                .catch(err => console.error(err));
    };


    likePost = async ({post}) => {
        if(post !== '') {
            // --FETCH
            await fetch(ngrok + '/api/posts/' + post.id + '/users/' + this.currentUser.id + '/like-post', {
                method: 'POST',
                headers: {'Content-Type': 'application/json', Accept: 'application/json'},
            })
                .then(response => response.json())
                .then(data => {
                    //console.log(data);
                })
                .catch(err => console.error(err));
            this.getPosts();
            this.allPostsUserLikes();
        }
        else {
            Alert.alert("Null post!", [{text: "OK" }])
        }

    };

    getLocationById = async (id) => {
        let result = []
        await fetch(ngrok + '/api/location-by-id/' + id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        })
            .then(response => response.json())
            .then(data => {
                    result = data;
                    console.log(data)
                }
            )
            .catch(err => console.error(err));
        this.props.navigation.navigate('Map', {
            lat: parseFloat(result['latitude']),
            lng: parseFloat(result['longitude']),
            item: result,
        }, {navigation: this.props.navigation});

    };

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

    didUserlikePost = async ({post}) => {
        if(post !== '') {
            // --FETCH
            await fetch(ngrok + '/api/user/' + this.currentUser.id + '/post/' + post.id + '/did-like', {
                method: 'GET',
                headers: {'Content-Type': 'application/json', Accept: 'application/json'},
            })
                .then(response => response.json())
                .then(data => {
                    {
                        console.log(data.toString() + "data")
                        return data.length !== 0;

                    }
                })
                .catch(err => console.error(err));
        }
        else {
            Alert.alert("No like/comment button has been pressed!", [{text: "OK" }])
        }
    };

    allPostsUserLikes = async () => {
        let result = []
        let index = 0
        // --FETCH
        await fetch(ngrok + '/api/user/' + this.currentUser.id + '/liked-posts', {
            method: 'GET',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        })
            .then(response => response.json())
            .then(data => {
                {
                    for(var i=0; i<data.length; i++){
                        var obj = data[i]
                        result[index] = obj['id_post']
                        index = index + 1
                    }

                }
            })
            .catch(err => console.error(err));
        this.setState({likedPosts: result})
        return result

    };


    getPosts= async () => {
        const transaction = Sentry.startTransaction({
            name: 'Fetch Feed',
            op: 'network.request',
        })
        let result = [];
        await fetch(ngrok + '/api/user/' + this.currentUser.id + '/feed-posts', {
            method: 'GET',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        }).then(response => {
            transaction.finish();
            return response.json()
        })
            .then(data => {
                result = data;
            })
            .catch(err => {
                transaction.finish(err);
                console.error(err)
            });
        this.setState({posts: result} )
        return result;
    };

    getPostsEvent = async () => {
        await this.getAsyncData().then(() =>
            {this.getPosts();}
        )
    }


    async componentDidMount() {
        await this.getAsyncData();
        const resultLiked = await this.allPostsUserLikes();
        if(this.props.isFocused)
        {
            console.log("AM FACUT EVENTUL!!!")
            const result = await this.getPosts();
        }
    }


    render() {
        const {isFocused} = this.props;
        console.log(this.state.posts.length + "LUNGIME POSTS")
        if(this.currentUser.id) {
            return (
                <SafeAreaView style={styles.container}>
                    <Header navigation={this.props.navigation}/>
                    <ScrollView>
                        {
                            this.state.posts.length ? this.state.posts.map((post, index) => {
                                return (
                                    <View style={{marginBottom: 30}}>
                                        <Divider width={1} orientation='vertical'/>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            margin: 5,
                                            alignItems: 'center'
                                        }}>
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <Image style={styles.circleImage}
                                                       source={{uri: ngrok + post.profile_image}}/>
                                                <TouchableOpacity onPress={() => this.getProfileUserById(post.user_id)}>
                                                    <Text style={{
                                                        marginLeft: 5,
                                                        fontWeight: '300',
                                                        fontFamily: 'Georgia',
                                                        fontSize: 18
                                                    }}>
                                                        {post.username}
                                                    </Text>
                                                </TouchableOpacity>
                                                <Text style={{marginLeft: 180, fontSize: 12, marginTop: 5}}>
                                                    {post.date}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 10}}>
                                            <TouchableOpacity
                                                onPress={() => {this.getLocationById(post.location)}}
                                            >
                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <Icon name="pin" size={25}/>
                                                    <Text style={{
                                                        fontSize: 18,
                                                        fontWeight: '500',
                                                        color: 'black',
                                                        fontFamily: 'Georgia'
                                                    }}>
                                                        {post.location_name}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{width: '100%', height: 350}}>
                                            <Image style={{height: '100%', resizeMode: 'cover', margin: 10}}
                                                   source={{uri: ngrok + post.image}}/>
                                        </View>
                                        <View style={{
                                            flexDirection: 'row',
                                            marginTop: 20,
                                            marginLeft: 10,
                                            marginBottom: 0
                                        }}>
                                            <Text style={{flexWrap: "wrap", flex: 1}}>
                                                <Text style={{fontWeight: '700', fontSize: 18, fontFamily: 'Georgia'}}>
                                                    {post.username} ─
                                                </Text>
                                                <Text style={{fontSize: 18, fontFamily: 'Georgia'}}>
                                                    {' ' + post.description}
                                                </Text>
                                            </Text>
                                        </View>
                                        <View style={{marginHorizontal: 10}}>
                                            <View style={{marginTop: 4, flexDirection: 'row', width: '32%'}}>
                                                {
                                                    this.state.likedPosts.includes(post.id) ?
                                                        <TouchableOpacity style={{marginRight: 10}} onPress={() => {
                                                            this.likePost({post});
                                                        }}>
                                                            <Icon style={{color: '#15902C'}}
                                                                  name="heart"
                                                                  size={25}/>
                                                        </TouchableOpacity>
                                                        : <TouchableOpacity style={{marginRight: 10}} onPress={() => {
                                                            this.likePost({post});
                                                            this.addNotification("like", post.user_id, post.id, 0);
                                                        }}>
                                                            <Icon style={{color: '#15902C'}}
                                                                  name="heart-outline"
                                                                  size={25}/>
                                                        </TouchableOpacity>
                                                }
                                                <TouchableOpacity onPress={() => {
                                                    this.props.navigation.navigate('Comments', {current_post: post})
                                                }}>
                                                    <Icon name="chatbubble-outline" size={25}/>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{flexDirection: 'row', marginTop: 4, marginLeft: 3}}>
                                                <Text style={{fontWeight: '600'}}>
                                                    {post.no_likes} {post.no_likes == 1 ? 'like' : 'likes'}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            }) : null
                        }
                    </ScrollView>
                    <TabNavigator navigation={this.props.navigation}/>
                </SafeAreaView>
            );
        }
        else return (
            <View style={{marginTop: 100}}>
                <Text style={{fontSize: 30}}> Loading... </Text>
            </View>
        );
    }
}

export default function (props) {
    const isFocused = useIsFocused();
    return <Feed {...props} isFocused={isFocused}/>
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#DFEEEA',
        flex: 1
    },
    circleImage: {
        width: 35,
        height: 35,
        marginLeft: 10,
        borderWidth: 3,
        borderColor: "#2F5D62",
        borderRadius: 35
    },
    scrollContainer: {
        borderWidth: 1,
        borderColor: 'gray'
    }
})

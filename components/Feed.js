import React, {Component} from 'react';

import {Alert, Button, Dimensions, Image, StyleSheet, Text, TextInput, TouchableHighlight, View, SafeAreaView} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Header from './Home/Header';
import Post from './Home/Post';
import {Divider} from 'react-native-elements/dist/divider/Divider';
import Icon from 'react-native-vector-icons/Ionicons';
import {List} from 'react-native-paper';
import MainWindow from './MainWindow';

export default class Feed extends React.Component {

    constructor(props) {
        super(props);
        this.commentTextInput = React.createRef()
    }

    state = {
        posts: [],
        currentPost: '', //id of the post the user wants to like/comment on
        currentUser: '',
        likedPosts: [], //all the posts the user likes
    };

    isLiked(post) {
        return this.state.likedPosts.some(item => post.id === item.id_post);
    }


    likePost = async ({post}) => {
        if(post !== '') {
            // --FETCH
            await fetch('https://0b34-2a02-2f0e-51d-1f00-3150-5a9f-2522-9658.ngrok.io/api/posts/' + post.id + '/users/' + this.state.currentUser.id + '/like-post', {
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

    getUserById = async ({id}) => {
        if(post !== '') {
            // --FETCH
            await fetch('https://0b34-2a02-2f0e-51d-1f00-3150-5a9f-2522-9658.ngrok.io/api/user/' + id +'/get-by-id', {
                method: 'GET',
                headers: {'Content-Type': 'application/json', Accept: 'application/json'},
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                   return data['username']
                })
                .catch(err => console.error(err));
            this.getPosts();
        }
        else {
            Alert.alert("Null post!", [{text: "OK" }])
        }

    };

    didUserlikePost = async ({post}) => {
        if(post !== '') {
            // --FETCH
            await fetch('https://0b34-2a02-2f0e-51d-1f00-3150-5a9f-2522-9658.ngrok.io/api/user/' + this.state.currentUser.id + '/post/' + post.id + '/did-like', {
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
        await fetch('https://0b34-2a02-2f0e-51d-1f00-3150-5a9f-2522-9658.ngrok.io/api/user/' + this.state.currentUser.id + '/liked-posts', {
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
        let result = [];
        await fetch('https://0b34-2a02-2f0e-51d-1f00-3150-5a9f-2522-9658.ngrok.io/api/user/' + this.state.currentUser.id + '/feed-posts', {
            method: 'GET',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        }).then(response => response.json())
            .then(data => {
                result = data;
            })
            .catch(err => console.error(err));

        this.setState({posts: result} )
        return result;
    };

    async componentDidMount() {
        const resultLiked = await this.allPostsUserLikes();
        const result = await this.getPosts();
        const resultComm = await this.getAllComments();
    }


    render() {
        this.state.currentUser = this.props.route.params['current_user'];
        return (
            <SafeAreaView style={styles.container}>
                <Header/>
                <ScrollView>
                    {
                        this.state.posts.map((post, index) => {
                            return (
                                <View style={{marginBottom: 30}}>
                                    <Divider width={1} orientation='vertical'/>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 5, alignItems: 'center'}}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Image style={styles.circleImage} source={{uri:  'https://0b34-2a02-2f0e-51d-1f00-3150-5a9f-2522-9658.ngrok.io' + post.profile_image }}/>
                                            <TouchableOpacity>
                                                <Text style={{marginLeft: 5, fontWeight: '300', fontFamily: 'Georgia', fontSize: 18}}>
                                                    {post.username}
                                                </Text>
                                            </TouchableOpacity>
                                            <Text style={{marginLeft: 180 , fontSize: 12, marginTop: 5}}>
                                                {post.date}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 10}}>
                                        <TouchableOpacity>
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <Icon name="pin" size={25} />
                                                <Text style={{fontSize: 18, fontWeight:'500', color:'black', fontFamily: 'Georgia'}}>
                                                    {post.location_name}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{width:'100%', height: 350}}>
                                        <Image style={{height:'100%', resizeMode: 'cover', margin: 10}} source={{uri: 'https://0b34-2a02-2f0e-51d-1f00-3150-5a9f-2522-9658.ngrok.io' + post.image}}/>
                                    </View>
                                    <View style={{flexDirection: 'row', marginTop: 20, marginLeft: 10, marginBottom: 0}}>
                                        <Text style={{flexWrap: "wrap", flex:1}}>
                                            <Text style={{fontWeight: '700', fontSize: 18, fontFamily: 'Georgia'}}>
                                                {post.username} ─
                                            </Text>
                                            <Text style={{fontSize: 18, fontFamily: 'Georgia'}}>
                                                 {' '+post.description}
                                            </Text>
                                        </Text>
                                    </View>
                                    <View style={{marginHorizontal: 10}}>
                                        <View style={{ marginTop: 4, flexDirection: 'row', width: '32%'}}>
                                            <TouchableOpacity style={{marginRight: 10}} onPress={() => { this.likePost({post}); }}>
                                                <Icon style={{color: '#15902C'}} name={this.state.likedPosts.includes(post.id) ? "heart" : "heart-outline"} size={25} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('Comments', {current_post: post, current_user: this.state.currentUser}) }}>
                                                <Icon name="chatbubble-outline" size={25} />
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
                        })
                    }
                </ScrollView>
            </SafeAreaView>
        );
    }
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

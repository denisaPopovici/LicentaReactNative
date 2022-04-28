import React, {useEffect} from 'react';
import {
    View,
    SafeAreaView,
    StyleSheet,
    TouchableHighlight,
    Image,
    Button,
    Text,
    TouchableOpacity,
    Alert, AsyncStorage,
} from 'react-native';
import Header from './Utils/Header';
import {Divider} from 'react-native-elements/dist/divider/Divider';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import TabNavigator from './Utils/TabNavigator';

export default class ProfileScreen extends React.Component {


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
        try{ //image comes from current user, retrieved from server
            const image_parsed = JSON.parse(image)
            this.currentUser.image = image_parsed
        }
        catch (e) { //profile image was changed, it was not retrieved from server
            this.currentUser.image = image
        }
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
        likedPosts: [], //all the posts the user likes
        noFollowers: 0,
        noVisitedLocations: 0,
        profileUser: '', //user that owns the profile
        doesFollow: 0,
        profileImage: '',
    };

    isLiked(post) {
        return this.state.likedPosts.some(item => post.id === item.id_post);
    }

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

    followUser = async () => {
            // --FETCH
            await fetch(ngrok + '/api/user/' + this.currentUser.id + '/follows/' + this.state.profileUser.id, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', Accept: 'application/json'},
            })
                .then(response => response.json())
                .then(data => {
                    //console.log(data);
                })
                .catch(err => console.error(err));
            this.getFollowers();
            this.doesUserFollowUser();
    };

    getPosts= async () => {
        let result = [];
        await fetch(ngrok + '/api/user/' + this.state.profileUser.id + '/posts', {
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

    getFollowers= async () => {
        let result = [];
        await fetch(ngrok + '/api/user/' + this.state.profileUser.id + '/followers', {
            method: 'GET',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        }).then(response => response.json())
            .then(data => {
                result = data;
            })
            .catch(err => console.error(err));
        this.setState({noFollowers: result.length} )
        return result.length;
    };

    doesUserFollowUser= async () => {
        let result = [];
        await fetch(ngrok + '/api/does-user/' + this.currentUser.id + '/follow/' + this.state.profileUser.id, {
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

    getAllVisitedLocations= async () => {
        let result = [];
        await fetch(ngrok + '/api/user/' + this.state.profileUser.id + '/visited-locations', {
            method: 'GET',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        }).then(response => response.json())
            .then(data => {
                console.log("DATA LOCATII ", data)
                result = data.length;
            })
            .catch(err => console.error(err));
        this.setState({noVisitedLocations: result} )
        return result;
    };

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

    async componentDidUpdate() {
        await this.getAsyncData();
    }

    async componentDidMount() {
        await this.getAsyncData();
        const result = await this.getPosts();
        const resultLiked = await this.allPostsUserLikes();
        const resultFollowers = await this.getFollowers();
        const doesFollow = await this.doesUserFollowUser();
        const resultLocations = await this.getAllVisitedLocations();
    }


    render() {
        this.state.profileUser = this.props.route.params['profile_user']
        return (
            <SafeAreaView style={styles.container}>
                <Header navigation={this.props.navigation}/>
                <View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex : 1, marginLeft: 4}}>
                                <Image source={{
                                uri: ngrok + this.state.profileUser.image,
                                cache: "reload",
                                }} key={this.state.profileUser.image} style={{width: 75, height: 75, borderRadius: 37.5}}/>
                        </View>
                        <View style={{flex : 3, marginTop: 10}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                                <View style={{alignItems: 'center'}}>
                                    <Text> {this.state.noVisitedLocations} </Text>
                                    <Text style={{fontSize: 10, color: 'grey'}}> locations </Text>
                                </View>
                                <View style={{alignItems: 'center'}}>
                                    <Text> {this.state.noFollowers} </Text>
                                    <Text style={{fontSize: 10, color: 'grey'}}> followers </Text>
                                </View>
                                <View style={{alignItems: 'center'}}>
                                    <Text> {this.state.profileUser.level} </Text>
                                    <Text style={{fontSize: 10, color: 'grey'}}> level </Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                {this.state.profileUser.id === this.currentUser.id ? null :
                                    <TouchableOpacity style={{
                                        borderWidth: 1,
                                        borderColor: 'black',
                                        width: 180,
                                        alignItems: 'center',
                                    }} onPress={() => { this.followUser(); this.addNotification("follow", this.state.profileUser.id, 0, 0)}}>
                                        <View
                                            style={{alignItems: 'flex-start', flexDirection: 'row', textAlign: 'left'}}>
                                            { this.state.doesFollow === 0 ?
                                                <Icon name='add-circle-outline' size={15} style={{marginTop: 3}}/>
                                                : <Icon name='checkbox-outline' size={15} style={{marginTop: 3}}/>
                                            }
                                            { this.state.doesFollow === 0 ?
                                                <Text style={{fontSize: 15, marginTop: 2}}>Follow </Text>
                                                : <Text style={{fontSize: 15, marginTop: 2}}> Following </Text>
                                            }
                                        </View>
                                    </TouchableOpacity>
                                }
                                {this.state.profileUser.id === this.currentUser.id ?
                                    <TouchableOpacity style={{marginLeft: 230, marginTop: 3, flexDirection: 'row'}} onPress={() => {
                                        this.props.navigation.navigate('ProfileSettings', {navigation: this.props.navigation} )
                                    }}>
                                        <Icon name='settings-outline' size={20}/>
                                    </TouchableOpacity> : null
                                }
                            </View>
                        </View>
                    </View>
                    <View style={{paddingBottom: 10, paddingHorizontal: 10, marginTop: 5}}>
                        <Text style={{fontWeight: 'bold', marginBottom: 10, marginLeft: 6}}> {this.state.profileUser.username} </Text>
                        <Text style={{fontSize: 15}}> {this.state.profileUser.first_name } {this.state.profileUser.last_name} </Text>
                        <Text> {this.state.profileUser.about} </Text>
                    </View>
                </View>
                {this.state.posts.length === 0 ?
                    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                        <Icon name='camera-outline' size={50} />
                        <Text style={{fontSize: 30, marginBottom: "40%"}}> No posts yet </Text>
                    </View> :
                    <ScrollView>
                        {
                            this.state.posts.map((post, index) => {
                                return (
                                    <View style={{marginBottom: 20}}>
                                        <Divider width={1} orientation='vertical'/>
                                        <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 10}}>
                                            <TouchableOpacity>
                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <Icon name="pin" size={20}/>
                                                    <Text style={{
                                                        fontSize: 20,
                                                        fontWeight: '200',
                                                        color: 'black',
                                                        fontFamily: 'Georgia'
                                                    }}>
                                                        {post.location_name}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{width: '100%', height: 350}}>
                                            <Image style={{
                                                height: '100%',
                                                resizeMode: 'cover',
                                                marginLeft: 10,
                                                marginRight: 10,
                                                marginTop: 5
                                            }} source={{uri: ngrok + post.image}}/>
                                        </View>
                                        <View style={{
                                            flexDirection: 'row',
                                            marginTop: 10,
                                            marginLeft: 15,
                                            marginBottom: 0,
                                            alignContent: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Text style={{
                                                flexWrap: "wrap",
                                                flex: 1,
                                                alignContent: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Text style={{fontWeight: '700', fontSize: 18, fontFamily: 'Georgia'}}>
                                                    ─
                                                </Text>
                                                <Text style={{fontSize: 18, fontFamily: 'Georgia'}}>
                                                    {' ' + post.description}
                                                </Text>
                                            </Text>
                                        </View>
                                        <View style={{marginHorizontal: 10, marginLeft: 15}}>
                                            <View style={{marginTop: 4, flexDirection: 'row', width: '32%'}}>
                                                <TouchableOpacity style={{marginRight: 10}} onPress={() => {
                                                    this.likePost({post});
                                                    this.addNotification("like", post.user_id, post.id, 0);
                                                }}>
                                                    <Icon style={{color: '#15902C'}}
                                                          name={this.state.likedPosts.includes(post.id) ? "heart" : "heart-outline"}
                                                          size={25}/>
                                                </TouchableOpacity>
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
                            })
                        }
                    </ScrollView>
                }
                <TabNavigator navigation={this.props.navigation}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#DFEEEA',
        flex: 1
    },
    userInfoSection: {
        paddingHorizontal: 30,
        marginBottom: 25,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
        fontWeight: '500',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    infoBoxWrapper: {
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
        borderTopColor: '#dddddd',
        borderTopWidth: 1,
        flexDirection: 'row',
        height: 100,
    },
    infoBox: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuWrapper: {
        marginTop: 10,
    },
    menuItem: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    menuItemText: {
        color: '#777777',
        marginLeft: 20,
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 26,
    },
    icon: {
        fontSize: 20, alignItems: 'center',
    }
});

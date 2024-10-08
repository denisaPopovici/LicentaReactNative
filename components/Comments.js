import React from 'react';
import {
    Alert,
    Dimensions,
    Image,
    StyleSheet,
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

export default class Comments extends React.Component {

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
        comments: [],
        currentPost: '',
        comment: '',
        addedComment: '',
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

    noComments(post) {
        let sum = 0
        this.state.comments.some(item => post.id === item.id_post ? sum = sum + 1 : null);
        return sum
    }

    commentPost = async () => {
        let result = []
        if(this.state.currentPost !== '') {
            // --FETCH
            await fetch( ngrok + '/api/posts/' + this.state.currentPost.id + '/users/' + this.currentUser.id + '/comment-post', {
                method: 'POST',
                headers: {'Content-Type': 'application/json', Accept: 'application/json'},
                body: JSON.stringify(this.state.comment),
            })
                .then(response => response.json())
                .then(data => {
                    result = data
                    console.log(data);
                })
                .catch(err => console.error(err));
            this.setState({addedComment: result})
            this.getAllComments();
        }
        else {
            Alert.alert("No like/comment button has been pressed!", [{text: "OK" }])
        }
        return result;
    };

    deleteComment = async (id) => {
        // --FETCH
        await fetch(ngrok + '/api/delete-comment/' + id, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        })
            .then(response => response.json())
            .then(data => {
                //console.log(data);
            })
            .catch(err => console.error(err));
        this.getAllComments();
    };

    getAllComments = async () => {
        let result = []
        // --FETCH
        await fetch( ngrok + '/api/comments', {
            method: 'GET',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        })
            .then(response => response.json())
            .then(data => {
                result = data;
            }).catch(err => console.error(err));

        this.setState({comments: result})
        return result
    }

    addComment = async () => {
        await this.commentPost();
        await this.addNotification("comment", this.state.currentPost.user_id, this.state.currentPost.id, this.state.addedComment.id);
    }

    async componentDidMount() {
        const resultComm = await this.getAllComments();

    }

    render() {
        const screenHeight = Dimensions.get('window').height
        this.state.currentPost = this.props.route.params['current_post']

        return (
            <View style={{flex: 1}} >
                <ScrollView>
                {
                    this.state.comments.map((comment) => {
                        return (
                            <View>
                                {
                                    comment['id_post'] === this.state.currentPost.id ?
                                        <View style={{ flexDirection: 'row', marginBottom: 0, marginLeft: 2, borderWidth: 0.5, borderColor: 'gray'}}>
                                            <View style={{flexDirection: 'row', alignItems: 'flex-start', flexGrow: 1, flex: 1, marginTop: 3, marginBottom: 3}}>
                                                <Image style={styles.circleImage} source={{uri:  ngrok + comment.profile_image }}/>
                                                <TouchableOpacity onPress={() => this.getProfileUserById(comment.user_id)}>
                                                    <Text style={{marginTop: 5, marginLeft: 5, fontWeight: '700', fontFamily: 'Georgia', fontSize: 18, flexWrap: 'wrap'}}>
                                                        {comment.username}
                                                    </Text>
                                                </TouchableOpacity>
                                                <Text style={{textAlign: "auto", flexWrap: "wrap", fontSize: 18, fontFamily: 'Georgia', flexShrink: 2, marginTop: 5}}> {comment.text} </Text>
                                                { this.currentUser.id === comment.user_id ?
                                                    <TouchableOpacity onPress={() =>
                                                        Alert.alert("Just a second!", "Are you sure you want to delete this comment?",[{text: "Yes", onPress: () => {this.deleteComment(comment.id)}}, {text: "No"}])}
                                                    >
                                                        <Icon name="close-outline" size={20} style={{color: "red"}}/>
                                                    </TouchableOpacity> : null
                                                }
                                            </View>
                                        </View>
                                        : null
                                }
                            </View>
                        )
                    })
                }
                </ScrollView>
                <View style={{position: 'absolute', bottom: 80}}>
                    <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 10,}}>
                        <TextInput ref={input => { this.textInput = input }} placeholder="Add comment..." style={styles.input} clearButtonMode="always" onChangeText={text => (this.state.comment = text)} multiline={true} numberOfLines={100}/>
                        <TouchableOpacity onPress={() => {
                            this.addComment();
                            this.textInput.clear();
                        }}>
                            <Icon style={{marginTop: 20, marginLeft: 4}} name="paper-plane-outline" size={25} />
                        </TouchableOpacity>
                    </View>
                </View>
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
        height: 70,
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
});

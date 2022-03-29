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

    state = {
        comments: [],
        currentPost: '',
        comment: '',
    };

    noComments(post) {
        let sum = 0
        this.state.comments.some(item => post.id === item.id_post ? sum = sum + 1 : null);
        return sum
    }

    commentPost = async () => {
        if(this.state.currentPost !== '') {
            // --FETCH
            await fetch( ngrok + '/api/posts/' + this.state.currentPost.id + '/users/' + this.currentUser.id + '/comment-post', {
                method: 'POST',
                headers: {'Content-Type': 'application/json', Accept: 'application/json'},
                body: JSON.stringify(this.state.comment),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                })
                .catch(err => console.error(err));
            this.getAllComments();
        }
        else {
            Alert.alert("No like/comment button has been pressed!", [{text: "OK" }])
        }

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
                                                <TouchableOpacity>
                                                    <Text style={{marginTop: 5, marginLeft: 5, fontWeight: '700', fontFamily: 'Georgia', fontSize: 18, flexWrap: 'wrap'}}>
                                                        {comment.username}
                                                    </Text>
                                                </TouchableOpacity>
                                                <Text style={{textAlign: "auto", flexWrap: "wrap", fontSize: 18, fontFamily: 'Georgia', flexShrink: 2, marginTop: 5}}> {comment.text} </Text>
                                            </View>
                                        </View>
                                        : null
                                }
                            </View>
                        )
                    })
                }
                </ScrollView>
                <View style={{position: 'absolute', bottom: 20}}>
                    <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 10,}}>
                        <TextInput placeholder="Add comment..." defaultValue = {this.state.comment} style={styles.input} clearButtonMode="always" onChangeText={text => (this.state.comment = text)}/>
                        <TouchableOpacity onPress={() => {this.commentPost()}}>
                            <Icon style={{marginTop: 5, marginLeft: 4}} name="paper-plane-outline" size={25} />
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
});

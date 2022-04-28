import React from 'react'
import {View, Text, SafeAreaView, TouchableOpacity, Image, StyleSheet} from 'react-native'
import {appLogo} from '../../assets/images/Images';
import Icon from 'react-native-vector-icons/Ionicons';
import {Divider} from 'react-native-elements/dist/divider/Divider';

const Post = ({post}) => {
    return (
        <View style={{marginBottom: 30}}>
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
                <TouchableOpacity>
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
        </View>
    )
}

export default Post;

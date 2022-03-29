import React from 'react'
import {View, Text, SafeAreaView, TouchableOpacity, Image, StyleSheet} from 'react-native'
import {appLogo} from '../../assets/images/Images';
import Icon from 'react-native-vector-icons/Ionicons';
import {Divider} from 'react-native-elements/dist/divider/Divider';

const Post = ({post}) => {
    return (
        <View style={{marginBottom: 30}}>
            <Divider width={1} orientation='vertical'/>
            <PostHeader post={post}/>
        </View>
    )
}

const PostHeader = ({post}) => {
    return(
        <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 5, alignItems: 'center'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={{uri:  ngrok + post.image }}/>
                <Text style={{marginLeft: 5, fontWeight: '200'}}>
                    {post.user}
                </Text>
            </View>
        </View>
    )
}

const PostCommentSection = ({post}) => {
    return(
        <View style={{flexDirection: 'row', marginTop: 5}}>
            {
                !!post.noComments.length && (
                    <Text style={{color: 'gray', flexWrap: 'wrap', flex: 1}}>
                        View {
                        this.state.comments
                    }
                    </Text>
                )
            }
        </View>
    )
}


export default Post;

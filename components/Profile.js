import React from 'react';
import {View, SafeAreaView, StyleSheet, TouchableHighlight} from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    Text,
    TouchableRipple,
} from 'react-native-paper';
import images from '../images';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class ProfileScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const current_user = this.props.route.params['current_user'];
        console.log(current_user)

        return (
            <SafeAreaView style={styles.container}>
                <TouchableHighlight onPress={()=>{this.props.navigation.navigate('Settings')}} activeOpacity={0.8} underlayColor="#DDDDDD" style={{marginTop: 20}}>
                    <View View style = {{alignItems:'center', height: 60, flexDirection: 'row', textAlign: 'center', left: 10}}>
                        <Icon name="cog" style={styles.icon} />
                        <Text style={{fontSize: 20}}> Settings </Text>
                    </View>
                </TouchableHighlight>
                <View style={styles.userInfoSection}>
                    <View style={{flexDirection: 'row', marginTop: 15}}>
                        <Avatar.Image
                            source={{uri: 'http://localhost:8080' + current_user.image}}
                            size={80}
                        />
                        <View style={{marginLeft: 20}}>
                            <Title style={[styles.title, {
                                marginTop: 15,
                                marginBottom: 5,
                            }]}>{current_user.first_name} {current_user.last_name}</Title>
                            <Caption style={styles.caption}>@{current_user.username}</Caption>
                        </View>
                    </View>
                </View>

                <View style={styles.userInfoSection}>
                    <View style={styles.row}>
                        <Icon name="map-marker-radius" color="#777777" size={20}/>
                        <Text style={{color: "#777777", marginLeft: 20}}> Cluj, Romania </Text>
                    </View>
                    <View style={styles.row}>
                        <Icon name="phone" color="#777777" size={20}/>
                        <Text style={{color: "#777777", marginLeft: 20}}>+91-900000009</Text>
                    </View>
                    <View style={styles.row}>
                        <Icon name="email" color="#777777" size={20}/>
                        <Text style={{color: "#777777", marginLeft: 20}}>{current_user.email}</Text>
                    </View>
                </View>
                <View style={styles.infoBoxWrapper}>
                    <View style={[styles.infoBox, {
                        borderRightColor: '#dddddd',
                        borderRightWidth: 1
                    }]}>
                        <Title>1</Title>
                        <Caption>Visited places</Caption>
                    </View>
                    {/*<View style={styles.infoBox}>*/}
                    {/*    <Title>12</Title>*/}
                    {/*    <Caption>Orders</Caption>*/}
                    {/*</View>*/}
                </View>

                <View style={styles.menuWrapper}>
                    <TouchableRipple onPress={() => {
                    }}>
                        <View style={styles.menuItem}>
                            <Icon name="heart-outline" color="#FF6347" size={25}/>
                            <Text style={styles.menuItemText}>Your Favorites</Text>
                        </View>
                    </TouchableRipple>
                    {/*<TouchableRipple onPress={() => {*/}
                    {/*}}>*/}
                    {/*    <View style={styles.menuItem}>*/}
                    {/*        <Icon name="credit-card" color="#FF6347" size={25}/>*/}
                    {/*        <Text style={styles.menuItemText}>Payment</Text>*/}
                    {/*    </View>*/}
                    {/*</TouchableRipple>*/}
                    {/*<TouchableRipple onPress={() => {*/}
                    {/*}}>*/}
                    {/*    <View style={styles.menuItem}>*/}
                    {/*        <Icon name="share-outline" color="#FF6347" size={25}/>*/}
                    {/*        <Text style={styles.menuItemText}>Tell Your Friends</Text>*/}
                    {/*    </View>*/}
                    {/*</TouchableRipple>*/}
                    {/*<TouchableRipple onPress={() => {*/}
                    {/*}}>*/}
                    {/*    <View style={styles.menuItem}>*/}
                    {/*        <Icon name="account-check-outline" color="#FF6347" size={25}/>*/}
                    {/*        <Text style={styles.menuItemText}>Support</Text>*/}
                    {/*    </View>*/}
                    {/*</TouchableRipple>*/}
                    <TouchableRipple onPress={() => {
                    }}>
                        <View style={styles.menuItem}>
                            <Icon name="settings-outline" color="#FF6347" size={25}/>
                            <Text style={styles.menuItemText}>About us</Text>
                        </View>
                    </TouchableRipple>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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

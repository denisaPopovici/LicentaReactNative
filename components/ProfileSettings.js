import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    TextInput,
    StyleSheet,
    SafeAreaView, TouchableHighlight, AsyncStorage, Alert,
} from 'react-native';

import {useTheme} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';

import ImagePicker from 'react-native-image-crop-picker';
import TabNavigator from './Utils/TabNavigator';
import Header from './Utils/Header'

export const setItem = async (type, value) => {
    try {
        const jsonValue = JSON.stringify(value)
        console.log("JSON VALUE :", jsonValue)
        await AsyncStorage.setItem(type, jsonValue)
    } catch (e) {
        console.log('setItemErr', e)
    }
}

const ProfileSettings = ({navigation}) => {

    const {colors} = useTheme();
    const [id, setId] = useState(null);
    const [username, setUsername] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [image, setImage] = useState(null);
    const [about, setAbout] = useState(null);
    const [showTabNavigator, setShowTabNavigator] = useState(true);

    let profile_user = {
        id: '',
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        image: '',
        about: '',
        level: '',
    }

    useEffect(() => {
        const fetchData = async () => {
            await getAsyncData();
        }
        fetchData();
    }, []);

    let bs;
    bs = React.createRef();
    let fall;
    fall = new Animated.Value(1);

    const getProfileUserById = async (id) => {
        await fetch(ngrok + '/api/user/' + id +'/get-by-id', {
            method: 'GET',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        })
            .then(response => response.json())
            .then(data => {
                    profile_user.id = data['id']
                    profile_user.first_name = data['first_name']
                    profile_user.last_name = data['last_name']
                    profile_user.username = data['username']
                    profile_user.email = data['email']
                    profile_user.about = data['about']
                    profile_user.image = data['image']
                    profile_user.level = data['level']
                    navigation.navigate('Profile', {'profile_user' : profile_user});
                }
            )
            .catch(err => console.error(err));
    };

    const updateInfo = async () => {
        await changeImage(image);
        await changeUsername();
        await changeFirstName();
        await changeLastName();
        await changeEmail();
        await changeAbout();
        await getProfileUserById(id)

    }

    const getAsyncData = async () => {
        const id = await AsyncStorage.getItem('id');
        const username = await AsyncStorage.getItem('username');
        const first_name = await AsyncStorage.getItem('first_name');
        const last_name = await AsyncStorage.getItem('last_name');
        const email = await AsyncStorage.getItem('email');
        const image = await AsyncStorage.getItem('image');
        const about = await AsyncStorage.getItem('about');
        setId(JSON.parse(id))
        setUsername(JSON.parse(username))
        setFirstName(JSON.parse(first_name))
        setLastName(JSON.parse(last_name))
        setEmail(JSON.parse(email))
        try{ //image comes from current user, retrieved from server
            const image_parsed = JSON.parse(image)
            setImage(ngrok + image_parsed)
        }
        catch (e) { //profile image was changed, it was not retrieved from server
            setImage(ngrok + image)
        }
        setAbout(JSON.parse(about))
    }

    const changeAbout = async () => {
        var data = new FormData();
        if( about != ''){
            // --FETCH
            data.append('about', about)
            await fetch(ngrok + '/api/user/' + id + "/about", {
                method: 'PUT',
                headers: {'Content-Type': 'multipart/form-data', Accept: 'application/json'},
                body: data,
            })
                .then(response => response.json())
                .then(data => {
                    setItem('about', about)
                })
                .catch(err => console.error(err));
        }
        else {
            Alert.alert("About cannot be null!", [{text: "OK" }])
        }
    };

    const changeFirstName = async () => {
        var data = new FormData();
        if( firstName != ''){
            // --FETCH
            data.append('first_name', firstName)
            await fetch(ngrok + '/api/user/' + id + "/first-name", {
                method: 'PUT',
                headers: {'Content-Type': 'multipart/form-data', Accept: 'application/json'},
                body: data,
            })
                .then(response => response.json())
                .then(data => {
                    setItem('first_name', firstName)
                })
                .catch(err => console.error(err));
        }
        else {
            Alert.alert("First name cannot be null!", [{text: "OK" }])
        }
    };

    const changeLastName = async () => {
        var data = new FormData();
        if( lastName != ''){
            // --FETCH
            data.append('last_name', lastName)
            await fetch(ngrok + '/api/user/' + id + "/last-name", {
                method: 'PUT',
                headers: {'Content-Type': 'multipart/form-data', Accept: 'application/json'},
                body: data,
            })
                .then(response => response.json())
                .then(data => {
                    setItem('last_name', lastName)
                })
                .catch(err => console.error(err));
        }
        else {
            Alert.alert("Last name cannot be null!", [{text: "OK" }])
        }
    };

    const changeEmail = async () => {
        var data = new FormData();
        if( email != ''){
            // --FETCH
            data.append('email', email)
            await fetch(ngrok + '/api/user/' + id + "/email", {
                method: 'PUT',
                headers: {'Content-Type': 'multipart/form-data', Accept: 'application/json'},
                body: data,
            })
                .then(response => response.json())
                .then(data => {
                    setItem('email', email)
                })
                .catch(err => console.error(err));
        }
        else {
            Alert.alert("Email cannot be null!", [{text: "OK" }])
        }
    };

    const changeUsername = async () => {
        var data = new FormData();
        if( username != ''){
            // --FETCH
            data.append('username', username)
            await fetch(ngrok + '/api/user/' + id + "/username", {
                method: 'PUT',
                headers: {'Content-Type': 'multipart/form-data', Accept: 'application/json'},
                body: data,
            })
                .then(response => response.json())
                .then(data => {
                    setItem('username', username)
                })
                .catch(err => console.error(err));
        }
        else {
            Alert.alert("Username cannot be null!", [{text: "OK" }])
        }
    };




    const changeImage = async (image) => { //image = the path
        let body = new FormData();
        const name = username + "_profile_image_path_" + image.substring(image.length - 8, image.length - 4) + ".jpg";
        body.append('image', {uri: image, name: name, type: 'image/jpg'});
        console.log("NAME", name)
        fetch(ngrok + '/api/user/' + id + '/image',
            {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d',
                } ,
                body : body
                })
            .then((res) => checkStatus(res))
            .then((res) => res.json())
            .then((res) => {
                console.log("response" +JSON.stringify(res));
            })
            .catch((e) => console.log(e))
            .done()
        await setItem('image', "/media/" + name);
    }

    const takePhotoFromCamera = () => {
        try {
            ImagePicker.openCamera({
                compressImageMaxWidth: 300,
                compressImageMaxHeight: 300,
                cropping: true,
                compressImageQuality: 0.7
            }).then(image => {
                setShowTabNavigator(true);
                setImage(image.path);
                bs.current.snapTo(1);

            });
        } catch(error) {
            console.log(error)
        }
        finally {
            setShowTabNavigator(true);
        }
    }

    const choosePhotoFromLibrary = () => {
        try {
            ImagePicker.openPicker({
                width: 300,
                height: 300,
                cropping: true,
                compressImageQuality: 0.7
            }).then(image => {
                if(image) {
                    setShowTabNavigator(true);
                    setImage(image.path);
                }
                else {
                    setShowTabNavigator(true);
                }
            });
        } catch(error) {
            console.log(error)
        }
        finally {
            setShowTabNavigator(true);
        }
    }

    let renderInner;
    renderInner = () => (
        <View style={styles.panel}>
            <View style={{alignItems: 'center'}}>
                <Text style={styles.panelTitle}>Upload Photo</Text>
                <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
            </View>
            <TouchableOpacity style={styles.panelButton} onPress={ () => {takePhotoFromCamera(); bs.current.snapTo(1);}}>
                <Text style={styles.panelButtonTitle}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.panelButton} onPress={ () => {choosePhotoFromLibrary(); bs.current.snapTo(1);}}>
                <Text style={styles.panelButtonTitle}>Choose From Library</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.panelButton}
                onPress={() => {bs.current.snapTo(1); setShowTabNavigator(true)}}>
                <Text style={styles.panelButtonTitle}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );

    let renderHeader;
    renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={{flex: 1}}>
            <Header navigation={navigation}/>
            <BottomSheet
                ref={bs}
                snapPoints={[340, -40]}
                renderContent={renderInner}
                renderHeader={renderHeader}
                initialSnap={1}
                callbackNode={fall}
                enabledGestureInteraction={true}
            />
            <Animated.View style={{margin: 20,
                opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
            }}>
                <View style={{alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => {setShowTabNavigator(false); bs.current.snapTo(0)}}>
                        <View
                            style={{
                                height: 100,
                                width: 100,
                                borderRadius: 15,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            {image === null ? (<ImageBackground
                                source={{ uri: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png' }}
                                style={{height: 100, width: 100}}
                                imageStyle={{borderRadius: 15}}>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <Icon
                                        name="camera"
                                        size={35}
                                        color="#fff"
                                        style={{
                                            opacity: 0.7,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderWidth: 1,
                                            borderColor: '#fff',
                                            borderRadius: 10,
                                        }}
                                    />
                                </View>
                            </ImageBackground>) : (<ImageBackground
                                source={{ uri: image }}
                                style={{height: 100, width: 100}}
                                imageStyle={{borderRadius: 15}}>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <Icon
                                        name="camera"
                                        size={35}
                                        color="#fff"
                                        style={{
                                            opacity: 0.7,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderWidth: 1,
                                            borderColor: '#fff',
                                            borderRadius: 10,
                                        }}
                                    />
                                </View>
                            </ImageBackground>)}
                        </View>
                    </TouchableOpacity>
                    <Text style={{marginTop: 10, fontSize: 20, fontWeight: '500', marginBottom: 15}}>
                        {firstName} {lastName}
                    </Text>
                </View>
                <View style={styles.action}>
                    <FontAwesome name="user-o" color={colors.text} size={25} />
                    <Text style={{fontSize: 15}}> Username: </Text>
                    <TextInput
                        value={username}
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        style={[
                            styles.textInput,
                            {
                                color: colors.text,
                            },
                        ]}
                        onChangeText={
                            text => (setUsername(text))
                        }
                    />
                </View>
                <View style={styles.action}>
                    <FontAwesome name="user-o" color={colors.text} size={25} />
                    <Text style={{fontSize: 15}}> First name: </Text>
                    <TextInput
                        value={firstName}
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        style={[
                            styles.textInput,
                            {
                                color: colors.text,
                            },
                        ]}
                        onChangeText={text => (setFirstName(text))}

                    />
                </View>
                <View style={styles.action}>
                    <FontAwesome name="user-o" color={colors.text} size={25} />
                    <Text style={{fontSize: 15}}> Last name: </Text>
                    <TextInput
                        value={lastName}
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        style={[
                            styles.textInput,
                            {
                                color: colors.text,
                            },
                        ]}
                        onChangeText={text => (setLastName(text))}

                    />
                </View>
                <View style={styles.action}>
                    <FontAwesome name="envelope-o" color={colors.text} size={25} />
                    <Text style={{fontSize: 15}}> Email: </Text>
                    <TextInput
                        value={email}
                        placeholderTextColor="#666666"
                        keyboardType="email-address"
                        autoCorrect={false}
                        style={[
                            styles.textInput,
                            {
                                color: colors.text,
                            },
                        ]}
                        onChangeText={text => (setEmail(text))}
                    />
                </View>
                <View style={styles.action}>
                    <FontAwesome name="file-text-o" color={colors.text} size={25} />
                    <Text style={{fontSize: 15}}> About: </Text>
                    <TextInput
                        value={about}
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        style={[
                            styles.textInput,
                            {
                                color: colors.text,
                            },
                        ]}
                        onChangeText={text => (setAbout(text))}

                    />
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableHighlight style={styles.commandButton} underlayColor="#e6f9ff" onPress={() => {
                        updateInfo();
                    }}>
                        <Text style={{fontSize: 17, fontWeight: '600', color: '#00ace6'}}>Submit </Text>
                    </TouchableHighlight>
                </View>
            </Animated.View>
            </View>
            { showTabNavigator === true ?
                <TabNavigator navigation={navigation}/> : null
            }
        </SafeAreaView>
    );
};

export default ProfileSettings;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DFEEEA',
    },
    commandButton: {
        marginTop: 10,
    },
    panel: {
        padding: 20,
        backgroundColor: '#DFEEEA',
        paddingTop: 30,
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        // shadowColor: '#000000',
        // shadowOffset: {width: 0, height: 0},
        // shadowRadius: 5,
        // shadowOpacity: 0.4,
    },
    header: {
        backgroundColor: '#DFEEEA',
        shadowColor: '#333333',
        shadowOffset: {width: -1, height: -3},
        shadowRadius: 2,
        shadowOpacity: 0.4,
        // elevation: 5,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
    panelTitle: {
        fontSize: 30,
        height: 35,
        fontFamily: 'Georgia'
    },
    panelSubtitle: {
        fontSize: 16,
        color: 'gray',
        height: 30,
        marginBottom: 10,
        fontFamily: 'Georgia'
    },
    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#5E8B7E',
        alignItems: 'center',
        marginVertical: 7,
        borderColor: '#2F5D62',
        borderWidth: 3,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: 'orange'
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
    },
});

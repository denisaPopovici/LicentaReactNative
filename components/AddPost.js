import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    TextInput,
    StyleSheet,
    SafeAreaView, TouchableHighlight, AsyncStorage, Alert,
    Picker, Button,
} from 'react-native';

import {useTheme} from 'react-native-paper';
import {uploadImage} from '../assets/images/Images';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated, {add} from 'react-native-reanimated';
import DropDownPicker from 'react-native-dropdown-picker';
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

const AddPost = ({navigation}) => {
    const [id, setId] = useState(null);
    const [image, setImage] = useState(null);
    const [showTabNavigator, setShowTabNavigator] = useState(true);
    const [locations, setLocations] = useState([]);
    const [location, setLocation] = useState(null);
    const [description, setDescription] = useState(null);
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            await getAsyncData().then(result => {
                setId(result);
                getLocations(result);
            });
        }
        fetchData();
    }, []);

    let bs;
    bs = React.createRef();
    let fall;
    fall = new Animated.Value(1);

    const getLocations = async (id) => {
        let result = [];
        let index = 0
        await fetch(ngrok + '/api/user/' + id + '/visited-locations-dropdown', {
            method: 'GET',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        }).then(response => response.json())
            .then(data => {
                result = data;
            })
            .catch(err => console.error(err));
        setLocations(result);
        return result;
    };

    const getLocationByName = async () => {
        let result = [];
        await fetch(ngrok + '/api/location/' + location , {
            method: 'GET',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        }).then(response => response.json())
            .then(data => {
                result = data;
            })
            .catch(err => console.error(err));
        console.log(result)
        return result;
    };


    const getAsyncData = async () => {
        const id = await AsyncStorage.getItem('id')
        return JSON.parse(id)
    }

    const addPost = async () => {
        let location_object = await getLocationByName();
        let body = new FormData();
        body.append('image', {uri: image, name: image, type: 'image/jpg'});
        body.append('user', id);
        body.append('description', description);
        body.append('location', location_object['id']);
        fetch(ngrok + '/api/new-post',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d',
                } ,
                body : body
            })
            .then((res) => checkStatus(res))
            .then((res) => res.json())
            .then((res) => {
                //console.log("response" +JSON.stringify(res));
            })
            .catch((e) => console.log(e))
            .done()
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
            <View style={{flex: 1, alignItems: "center"}}>
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
                                    borderWidth: 3,
                                    borderColor: '#2F5D62',
                                    height: 250,
                                    width: 300,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                {image === null ? (<ImageBackground
                                    source={uploadImage}
                                    style={{height: 200, width: 250}}
                                    imageStyle={{borderRadius: 15}}
                                    >
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <Icon
                                            name="camera"
                                            size={100}
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
                                    style={{height: 200, width: 250}}
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
                    </View>
                </Animated.View>
                <TextInput
                    placeholder="Write something about this post..."
                    multiline={true}
                    numberOfLines={100}
                    style={styles.input}
                    autoCapitalize='none'
                    onChangeText={text => (setDescription(text))}
                />
                { showTabNavigator === true ?
                    <DropDownPicker
                        listMode="FLATLIST"
                        placeholder="Where was this photo taken?"
                        dropDownContainerStyle={{
                            width: 300,
                            marginRight: 38,
                            marginLeft: 38,
                            height: 100,
                            backgroundColor: '#DFEEEA',
                            borderLeftWidth: 3,
                            borderRightWidth: 3,
                            borderBottomWidth: 3,
                            borderColor: '#2F5D62'
                        }}
                        style={{
                            width: 300,
                            marginLeft: 38,
                            marginRight: 38,
                            backgroundColor: '#DFEEEA',
                            borderWidth: 3,
                            borderColor: '#2F5D62',
                            marginBottom: 30,
                            marginTop: 10
                        }}
                        open={open}
                        value={location}
                        items={locations}
                        setOpen={setOpen}
                        setValue={setLocation}
                        setItems={setLocations}
                    /> : null
                }
                <Button
                    title="POST"
                    onPress={() => {addPost(); navigation.navigate("Feed")}
                    }
                />
            </View>
            { showTabNavigator === true ?
                <TabNavigator navigation={navigation}/> : null
            }
        </SafeAreaView>
    );
};

export default AddPost;


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
        color: '#2F5D62'
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
    input: {
        height: 150,
        marginLeft: 12,
        marginRight: 12,
        marginBottom: 12,
        borderWidth: 3,
        padding: 10,
        width: 300,
        borderColor: '#2F5D62',
        borderRadius: 15,
    },
});

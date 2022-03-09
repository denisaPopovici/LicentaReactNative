import React from 'react'
import {View, Text, SafeAreaView, TouchableOpacity, Image, StyleSheet} from 'react-native'
import {appLogo} from '../../assets/images/Images';
import Icon from 'react-native-vector-icons/Ionicons';
const Header = () => {
    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <Image style={styles.logo} source={appLogo}/>
            </TouchableOpacity>
            <View style={styles.iconContainer}>
                <TouchableOpacity>
                    <Icon style={styles.icon} name="add-circle-outline" size={30}  />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Icon style={styles.icon} name="heart-outline" size={30} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create(
    {
        container:
            {
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                marginHorizontal: 10,
                backgroundColor: "white",
                height: 60,
                marginBottom: 10
            },
        logo:
            {
                width: 150,
                height: 90,
                resizeMode: 'contain'
            },
        iconContainer:
            {
                flexDirection: 'row',
                color: 'white',
                marginTop: 10
            },
        icons:
            {
                width: 30,
                height: 30,
                marginLeft: 10,
                color: 'black'
            }
    }
)

export default Header

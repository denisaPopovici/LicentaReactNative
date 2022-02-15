import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Map from './Map';
import React from 'react';
import MainWindow from './MainWindow';
import StackNavigator from '@react-navigation/stack/src/navigators/createStackNavigator';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import {Text, Dimensions} from 'react-native';
import Profile from './Profile';
import {Image, View} from 'react-native';
import ProfileSettings from './ProfileSettings';
import Login from './Login';

const Tab = createBottomTabNavigator();

const Tabs = () => {
    return (
        <Tab.Navigator
            barStyle = {{
                    position: 'absolute',
                    bottom: 25,
                    left: 20,
                    right: 20,
                    elevation: 0,
                    backgroundColor: "#ffffff",
                    borderRadius: 15,
                    height: 90,
            }}
        >
            <Tab.Screen name="Main" component={MainWindow} options={{
                tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
                        <Image
                            source={require('../assets/icons/home.png')}
                            resizeMode='contain'
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: focused ? '#e32f45' : "#748c94"
                            }}
                        />
                        <Text
                            style={{color: focused ? '#e32f45' : "#748c94", fontSize: 12}}>
                            HOME
                        </Text>
                    </View>
                ),
            }} />
            <Tab.Screen name="Settings" component={ProfileSettings}/>
        </Tab.Navigator>
    );
}
export default Tabs;

// const fullScreenWidth = Dimensions.get('window').width;
//
// const Stack = createStackNavigator();
//
// function HomeStackScreen() {
//     return (
//         <Stack.Navigator>
//             <Stack.Screen name = "Home" component = {MainWindow} />
//         </Stack.Navigator>
//     );
// }

// export default function Tabs(props) {
//     return (
//         <NavigationContainer independent={true}>
//             <Tab.Navigator
//             // screenOptions={({route}) => ({
//             //     headerTitle: () => <Text> Header </Text>,
//             //     tabBarIcon: ({focused, color, size, padding}) => {
//             //         let iconName;
//             //         if(route.name === "Home") {
//             //             iconName = focused ? 'home' : 'home-outlin'
//             //         }
//             //         return (
//             //             <IonicIcon
//             //                 name = {iconName}
//             //                 size = {size}
//             //                 color = {color}
//             //                 style = {{paddingBottom: padding}}
//             //             />
//             //         );
//             //     },
//             // })}
//             >
//                 <Tab.Screen name="Home" component={HomeStackScreen}/>
//             </Tab.Navigator>
//         </NavigationContainer>
//     )
// }



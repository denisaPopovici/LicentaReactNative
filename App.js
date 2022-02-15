//import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
// import {StackNavigator} from 'react-navigation';
import {StyleSheet, Text, View, Button} from 'react-native';
//import { Marker, Callout } from 'react-native-maps';
//import MapView, { PROVIDER_GOOGLE }  from 'react-native-maps';
import { useState, useEffect } from 'react';
//import * as Location from 'expo-location';
// import {NavigationContainer} from '@react-navigation/native';
import Login from './components/Login';
// import MainWindow from './components/MainWindow';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainWindow from './components/MainWindow';
import Signup from './components/Signup';
import Map from './components/Map';
import ProfileSettings from './components/ProfileSettings';
import ProfileScreen from './components/Profile';
import Tabs from './components/BottomTabNavigator';

// function arePointsNear(latitude, longitude, centerLatitude, centerLongitude, km) {
//   var ky = 40000 / 360;
//   var kx = Math.cos(Math.PI * centerLatitude / 180.0) * ky;
//   var dx = Math.abs(centerLongitude - longitude) * kx;
//   var dy = Math.abs(centerLatitude - latitude) * ky;
//   return Math.sqrt(dx * dx + dy * dy) <= km;
// }

// function getNearOrFarMessage(locationLatitude, locationLongitude) {
//   const [location, setLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setErrorMsg('Permission to access location was denied');
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       setLocation(location);
//     })();
//   }, []);

//   let text = 'Waiting..';
//   let latitude = null;
//   let longitude = null;
//   if (errorMsg) {
//     text = errorMsg;
//   } else if (location) {
//     text = JSON.stringify(location);
//     latitude = text.split(',')[2].split(':')[1];
//     console.log(latitude);
//     console.log(longitude);
//     longitude = text.split(',')[4].split(':')[1];;
//     console.log(longitude);

//     if(arePointsNear(latitude, longitude, locationLatitude, locationLongitude, 0.2)) {
//       text = 'You have reached your destination';
//     }
//     else {
//       text = 'You have not reached your destination';
//     }

//   }
//   return text;
// }

// function NearOrFarScreen({route}) {
//   const { latitude, longitude } = route.params;
//   let text = getNearOrFarMessage(latitude, longitude);
//   return (
//     <View style={{ flex: 1, alignItems: 'center' , justifyContent: 'center' , backgroundColor: 'yellow'}}>
//       <Text style={{ fontSize: 20, fontFamily: 'Georgia', fontWeight: '100' }} >I'm here!</Text>
//       <Button title='VALIDATE' onPress={() =>  {alert(text);}}/>
//     </View>
//   );
// }

// function MapScreen({navigation}) {
//     return (
//     <View style={styles.container}>
//       <MapView
//       style={{height: '100%', width: '100%'}}
//       provider={PROVIDER_GOOGLE}
//       showsUserLocation={true}
//       followsUserLocation={true}
//       region= {{
//         latitude: 46.567633,
//         longitude: 23.816061,
//         latitudeDelta: 5,
//         longitudeDelta: 5,
//       }}
//       >

//       <MapView.Marker
//         coordinate=
//         {
//           {latitude: 46.567633,
//           longitude: 23.816061,}
//         }
//         >
//         <Callout onPress={e => {navigation.navigate('NearOrFar', {latitude: '46.567633', longitude: '23.816061'}) }}>
//           <Text>My home</Text>
//         </Callout>
//     </MapView.Marker>

//       <MapView.Marker
//         coordinate=
//         {
//           { latitude: 46.5581978486655,
//             longitude: 23.80892628453484,
//           }
//         }
//         >
//         <Callout onPress={e => {navigation.navigate('NearOrFar', {latitude: '46.5581978486655', longitude: '23.80892628453484'}) }}>
//             <Text>Sebi's home</Text>
//         </Callout>

//       </MapView.Marker>

//       </MapView>

//       <StatusBar style="auto" />
//     </View>
//   );
// }
//
const Stack = createStackNavigator();

function App() {
  const [token, setToken] = useState('');

  const userLogin = tok => {
    console.log(tok);
    setToken(tok);
  };

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: true, headerTitle: "", headerTransparent: true}}>
          <Stack.Screen name="Login" component={Login} options={{header: () => null}}/>
          <Stack.Screen name="Main" component={MainWindow} options={{header: () => null}}/>
          <Stack.Screen name="Signup" component={Signup}/>
          <Stack.Screen name="Map" component={Map}/>
          <Stack.Screen name="Settings" component={ProfileSettings}/>
          <Stack.Screen name="Profile" component={ProfileScreen}/>
        </Stack.Navigator>
      </NavigationContainer>

  );
}

// const App = () => {
//   return (
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="Login" >
//           <Stack.Screen name="Login" component={Login}/>
//         </Stack.Navigator>
//       </NavigationContainer>
//   );
// }

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paragraph: {
    textAlign: 'center',
    marginTop: '15%',
    marginLeft: '17%',
    fontSize: 20,
  },
});

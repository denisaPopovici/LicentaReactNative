//import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
// import {StackNavigator} from 'react-navigation';
import {StyleSheet, Text, View, Button, AsyncStorage} from 'react-native';
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
import Feed from './components/Feed';
import Comments from './components/Comments';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SearchBar from './components/SearchBar';
import Notifications from './components/Notifications';
import Missions from './components/Missions';
import AddPost from './components/AddPost';
import StackNavigator from '@react-navigation/stack/src/navigators/createStackNavigator';
import Post from './components/Utils/Post';
import Experience from './components/Experience';
import RateLocation from './components/RateLocation';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getPerformance} from "firebase/performance";
import * as Sentry from '@sentry/react-native';

const routingInstrumentation = new Sentry.ReactNavigationV4Instrumentation({
  enableTimeToInitialDisplay: true,
});

Sentry.init({
  dsn: 'https://0b07dcc7170bb14a8c31c9286032ebe1@o4505046525935616.ingest.us.sentry.io/4506973753966592',
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 10000,
  //Performance
  integrations: [
    new Sentry.ReactNativeTracing({
      enableUserInteractionTracing: true,
      routingInstrumentation
    }),
  ],
  tracesSampleRate: 1.0,
});

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA71bzuKiNVotAo25DYHL7S93IJP6_h_zo",
  authDomain: "licentareactnative.firebaseapp.com",
  projectId: "licentareactnative",
  storageBucket: "licentareactnative.appspot.com",
  messagingSenderId: "870675735033",
  appId: "1:870675735033:web:d726cb1a348c6ccd9e1d28",
  measurementId: "G-8K8GZMLZQJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const performance = getPerformance(app);

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
const Tab = createBottomTabNavigator();

function App() {
  const [id, setId] = useState(null);
  const [initial, setInitial] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => { //retrieve user id
      await getAsyncData().then(result => {
        console.log(result, "REZULTATTTTTT")
        setId(result);
        setInitial(result === null ? "Login" : "Feed")
        setLoading(false);
      });
    }
    fetchData();
  }, []);


  const getAsyncData = async () => {
    const id = await AsyncStorage.getItem('id')
    return JSON.parse(id)
  }

  if(loading) {
    return null;
  }

  return (
            <NavigationContainer>
              <Stack.Navigator initialRouteName={initial}>
                <Stack.Screen name="Login" component={Login} options={{header: () => null}}/>
                <Stack.Screen name="Signup" component={Signup}/>
                <Stack.Screen name="Map" component={Map}/>
                <Stack.Screen name="Profile" component={ProfileScreen} options={{header: () => null}}/>
                <Stack.Screen name="Feed" component={Feed} options={{header: () => null}}/>
                <Stack.Screen name="Comments" component={Comments} options={{headerTitle: "Comments", headerTransparent: false}}/>
                <Stack.Screen name="ProfileSettings" component={ProfileSettings} options={{header: () => null}}/>
                <Stack.Screen name="Search" component={SearchBar} options={{header: () => null}}/>
                <Stack.Screen name="Notifications" component={Notifications}/>
                <Stack.Screen name="Post" component={Post}/>
                <Stack.Screen name="RateLocation" component={RateLocation} options={{header: () => null}}/>
                <Stack.Screen name="Missions" component={Missions} options={{header: () => null}}/>
                <Stack.Screen name="Experience" component={Experience} options={{header: () => null}}/>
                <Stack.Screen name="AddPost" component={AddPost} options={{headerTitle: "New post", headerTransparent: false}}/>
              </Stack.Navigator>
            </NavigationContainer>

  );
  // return (
  //     <>
  //       <NavigationContainer>
  //         <Tab.Navigator>
  //           <Tab.Screen name="Feed" component={Feed}/>
  //           <Tab.Screen name="Profile" component={ProfileScreen}/>
  //         </Tab.Navigator>
  //       </NavigationContainer>
  //     </>
  // )
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

export default Sentry.wrap(App);

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

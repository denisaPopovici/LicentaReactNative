import React from 'react';
import {AsyncStorage} from 'react-native';
import {useState, useEffect} from 'react';
import Login from './components/Login';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
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
import Post from './components/Utils/Post';
import Experience from './components/Experience';
import RateLocation from './components/RateLocation';
// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
import {getPerformance} from 'firebase/performance';
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
      routingInstrumentation,
    }),
  ],
  tracesSampleRate: 1.0,
});

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA71bzuKiNVotAo25DYHL7S93IJP6_h_zo',
  authDomain: 'licentareactnative.firebaseapp.com',
  projectId: 'licentareactnative',
  storageBucket: 'licentareactnative.appspot.com',
  messagingSenderId: '870675735033',
  appId: '1:870675735033:web:d726cb1a348c6ccd9e1d28',
  measurementId: 'G-8K8GZMLZQJ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
getPerformance(app);

const Stack = createStackNavigator();
createBottomTabNavigator();

function App() {
  const [id, setId] = useState(null);
  const [initial, setInitial] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      //retrieve user id
      await getAsyncData().then(result => {
        setId(result);
        setInitial(result === null ? 'Login' : 'Feed');
        setLoading(false);
      });
    };
    fetchData();
  }, []);

  const getAsyncData = async () => {
    const id = await AsyncStorage.getItem('id');
    return JSON.parse(id);
  };

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initial}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{header: () => null}}
        />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{header: () => null}}
        />
        <Stack.Screen
          name="Feed"
          component={Feed}
          options={{header: () => null}}
        />
        <Stack.Screen
          name="Comments"
          component={Comments}
          options={{headerTitle: 'Comments', headerTransparent: false}}
        />
        <Stack.Screen
          name="ProfileSettings"
          component={ProfileSettings}
          options={{header: () => null}}
        />
        <Stack.Screen
          name="Search"
          component={SearchBar}
          options={{header: () => null}}
        />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Post" component={Post} />
        <Stack.Screen
          name="RateLocation"
          component={RateLocation}
          options={{header: () => null}}
        />
        <Stack.Screen
          name="Missions"
          component={Missions}
          options={{header: () => null}}
        />
        <Stack.Screen
          name="Experience"
          component={Experience}
          options={{header: () => null}}
        />
        <Stack.Screen
          name="AddPost"
          component={AddPost}
          options={{headerTitle: 'New post', headerTransparent: false}}
        />
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

export default Sentry.wrap(App);

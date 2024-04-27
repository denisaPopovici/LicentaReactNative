import {initializeApp} from "firebase/app";
import {getPerformance} from 'firebase/performance';

const app = initializeApp({apiKey: "AIzaSyA71bzuKiNVotAo25DYHL7S93IJP6_h_zo",
    authDomain: "licentareactnative.firebaseapp.com",
    projectId: "licentareactnative",
    storageBucket: "licentareactnative.appspot.com",
    messagingSenderId: "870675735033",
    appId: "1:870675735033:web:d726cb1a348c6ccd9e1d28",
    measurementId: "G-8K8GZMLZQJ"
})

const perf = getPerformance(app);

export default perf;
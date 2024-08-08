// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';      
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPHgSyAlKj8UM7bw2_2CEx5DngysnQSuA",
  authDomain: "app0-98942.firebaseapp.com",
  projectId: "app0-98942",
  storageBucket: "app0-98942.appspot.com",
  messagingSenderId: "1090004849334",
  appId: "1:1090004849334:web:06fb75e9186f9bdcc00c17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, app, db };  // Export Firestore

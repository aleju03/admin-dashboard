// firebase.js
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAAle7CIc3ds64c2lSLptl-4juxkyLM4Jg",
    authDomain: "cuadernodigital-a5a10.firebaseapp.com",
    projectId: "cuadernodigital-a5a10",
    storageBucket: "cuadernodigital-a5a10.appspot.com",
    messagingSenderId: "466543308544",
    appId: "1:466543308544:web:6e9fc2108473cfc68c8de5"
  };

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth };

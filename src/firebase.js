// src/firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';


const firebaseConfig = {
  apiKey: "AIzaSyAAle7CIc3ds64c2lSLptl-4juxkyLM4Jg",
  authDomain: "cuadernodigital-a5a10.firebaseapp.com",
  projectId: "cuadernodigital-a5a10",
  storageBucket: "cuadernodigital-a5a10.appspot.com",
  messagingSenderId: "466543308544",
  appId: "1:466543308544:web:6e9fc2108473cfc68c8de5"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = app.Firestore();
const auth = app.Auth();

export { db, auth };

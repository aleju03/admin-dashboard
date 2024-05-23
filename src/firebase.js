// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDwIoPab2HbVlP4VmcfZDT3ycs__ybgwbY",
  authDomain: "cuadernodigital2-f8e0e.firebaseapp.com",
  projectId: "cuadernodigital2-f8e0e",
  storageBucket: "cuadernodigital2-f8e0e.appspot.com",
  messagingSenderId: "476802800338",
  appId: "1:476802800338:web:04a23017d2f86e59b6eb0b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
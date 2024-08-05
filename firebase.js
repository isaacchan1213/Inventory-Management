// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "inventory-management-be174.firebaseapp.com",
  projectId: "inventory-management-be174",
  storageBucket: "inventory-management-be174.appspot.com",
  messagingSenderId: "39469343621",
  appId: "1:39469343621:web:41bc97afcbaf3399df9aec",
  measurementId: "G-3WZHSM0LJ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}
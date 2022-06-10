// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0_6EzDJUKTkulueRmDP_swEpSj52P5rI",
  authDomain: "stratego-f0081.firebaseapp.com",
  databaseURL: "https://stratego-f0081-default-rtdb.firebaseio.com",
  projectId: "stratego-f0081",
  storageBucket: "stratego-f0081.appspot.com",
  messagingSenderId: "764338434926",
  appId: "1:764338434926:web:2373760e40701fef3bc77f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
export { app, auth, database };

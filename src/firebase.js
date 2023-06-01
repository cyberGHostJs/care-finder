import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  // Add your Firebase configuration here
    apiKey: "AIzaSyCKIzRWk9JweY4YJm3cz-o1iAtc3l8eAHs",
  authDomain: "care-finder-6d484.firebaseapp.com",
  projectId: "care-finder-6d484",
  storageBucket: "care-finder-6d484.appspot.com",
  messagingSenderId: "655772399489",
  appId: "1:655772399489:web:f7036bb4c30ed352e3da80",
  measurementId: "G-TVR1S90BH4",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


export const auth = firebase.auth();
export const firestore = firebase.firestore();


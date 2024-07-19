// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6IagQ41Nr3QxU2hjdt1hMvXdlkjzNJxo",
  authDomain: "hospital-operation-scheduler.firebaseapp.com",
  projectId: "hospital-operation-scheduler",
  storageBucket: "hospital-operation-scheduler.appspot.com",
  messagingSenderId: "210565836841",
  appId: "1:210565836841:web:fdb6368f1b44995bbdac38",
  measurementId: "G-C8X53NM98N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0hhfrsk8qOqKrGCkdLWEX1zisiIkKJ_k",
  authDomain: "notebook-app-4f017.firebaseapp.com",
  projectId: "notebook-app-4f017",
  storageBucket: "notebook-app-4f017.firebasestorage.app",
  messagingSenderId: "767598223436",
  appId: "1:767598223436:web:8bdd0281bc47e6d71814e9",
  measurementId: "G-EJ61Y26KDG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
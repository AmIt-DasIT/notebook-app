// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQsVfjitjOJx5wwDf8H91F7VtpqrVH938",
  authDomain: "notebook-app-dd8e8.firebaseapp.com",
  databaseURL: "https://notebook-app-dd8e8-default-rtdb.firebaseio.com",
  projectId: "notebook-app-dd8e8",
  storageBucket: "notebook-app-dd8e8.firebasestorage.app",
  messagingSenderId: "717030439322",
  appId: "1:717030439322:web:bb7238794eebf627dce223",
  measurementId: "G-1M5K7NQBQD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGbOXjng4mDkvqzQPs6IMlDWcefY4dUmc",
  authDomain: "hackathon3-fc29f.firebaseapp.com",
  projectId: "hackathon3-fc29f",
  storageBucket: "hackathon3-fc29f.firebasestorage.app",
  messagingSenderId: "1095302508055",
  appId: "1:1095302508055:web:992de5f6e9e3c0e2607652",
  measurementId: "G-W0VRE5J5KX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxEfjOjQHSz3IHq_pgeMi8HXXaKuDF2fo",
  authDomain: "gonote-b8d0e.firebaseapp.com",
  projectId: "gonote-b8d0e",
  storageBucket: "gonote-b8d0e.firebasestorage.app",
  messagingSenderId: "926007862227",
  appId: "1:926007862227:web:6e1ef784029ff410514526",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

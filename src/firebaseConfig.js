// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDprin3hgj4XUX8CV9QeIl9wRbYdLjSWho",
  authDomain: "dinujayacarsalechatapp.firebaseapp.com",
  projectId: "dinujayacarsalechatapp",
  storageBucket: "dinujayacarsalechatapp.appspot.com",
  messagingSenderId: "506338208667",
  appId: "1:506338208667:web:060e280e71c4ceb8fb4f3e",
  measurementId: "G-RFN8806X9N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const firestore = getFirestore(app);

export { firestore };

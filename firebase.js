// ===============================
//   Firebase Config & Setup
// ===============================

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAvoeiw_fwmSkFN97hGzSsUTn2KJ1G2jQc",
    authDomain: "astrophotography-with-zerox.firebaseapp.com",
    projectId: "astrophotography-with-zerox",
    storageBucket: "astrophotography-with-zerox.appspot.com", // FIXED
    messagingSenderId: "847847244230",
    appId: "1:847847244230:web:ecd8f9066f385a025072c7",
    measurementId: "G-38YEEM9D71" // FIXED
};

// ===============================
//   Import Firebase Modules
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    doc,
    getDoc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    listAll
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// ===============================
//   Initialize Firebase
// ===============================
const app = initializeApp(firebaseConfig);

// Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Firestore
const db = getFirestore(app);

// Storage
const storage = getStorage(app);

// ===============================
//   EXPORT MODULES
// ===============================
export {
    auth,
    googleProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    db,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    storage,
    ref,
    uploadBytes,
    getDownloadURL,
    listAll
};

// ------------------------------
// Firebase Core + Services
// ------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

import { 
    getAuth,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// ------------------------------
// YOUR FIREBASE CONFIG
// ------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyAvoeiw_fwmSkFN97hGzSsUTn2KJ1G2jQc",
    authDomain: "astrophotography-with-zerox.firebaseapp.com",
    projectId: "astrophotography-with-zerox",
    storageBucket: "astrophotography-with-zerox.firebasestorage.app",
    messagingSenderId: "847847244230",
    appId: "1:847847244230:web:ecd8f9066f385a025072c7",
    measurementId: "G-38YEEM9D71"
};

// ------------------------------
// INITIALIZE FIREBASE
// ------------------------------
const app = initializeApp(firebaseConfig);

// AUTH, DB, STORAGE
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// GOOGLE PROVIDER
const googleProvider = new GoogleAuthProvider();

// Export to entire website
export {
    app,
    auth,
    db,
    storage,
    googleProvider,
    signInWithPopup
};

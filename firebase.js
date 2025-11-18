// --------------------------------------
// ZTA - Firebase Initialization
// --------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

// Your Firebase config (FIXED STORAGE BUCKET)
const firebaseConfig = {
    apiKey: "AIzaSyAvoeiw_fwmSkFN97hGzSsUTn2KJ1G2jQc",
    authDomain: "astrophotography-with-zerox.firebaseapp.com",
    projectId: "astrophotography-with-zerox",
    storageBucket: "astrophotography-with-zerox.appspot.com",
    messagingSenderId: "847847244230",
    appId: "1:847847244230:web:ecd8f9066f385a025072c7",
    measurementId: "G-38YEEM9D71"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

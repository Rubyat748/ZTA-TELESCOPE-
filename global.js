// ------------------------------------------------------
//  FIREBASE IMPORTS
// ------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import { 
    getFirestore,
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


// ------------------------------------------------------
//  YOUR FIREBASE CONFIG
// ------------------------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyAvoeiw_fwmSkFN97hGzSsUTn2KJ1G2jQc",
    authDomain: "astrophotography-with-zerox.firebaseapp.com",
    projectId: "astrophotography-with-zerox",
    storageBucket: "astrophotography-with-zerox.firebasestorage.app",
    messagingSenderId: "847847244230",
    appId: "1:847847244230:web:ecd8f9066f385a025072c7",
    measurementId: "G-38YEEM9D71"
};


// ------------------------------------------------------
// INITIALIZE FIREBASE SERVICES
// ------------------------------------------------------
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
const googleProvider = new GoogleAuthProvider();


// Save user to localStorage
function saveLocal(userData) {
    localStorage.setItem("zta_user", JSON.stringify(userData));
}


// ------------------------------------------------------
// SIGNUP USER (EMAIL + PASSWORD)
// ------------------------------------------------------
export async function signupUser(username, email, password) {
    try {
        let result = await createUserWithEmailAndPassword(auth, email, password);
        
        let uid = result.user.uid;
        let created = new Date().toLocaleString();

        let userData = {
            uid,
            username,
            email,
            created,
            lastLogin: created,
            bio: "",
            pfp: ""
        };

        // Save in Firestore
        await setDoc(doc(db, "users", uid), userData);

        return { status: "success" };

    } catch (err) {
        return { status: "error", message: err.message };
    }
}


// ------------------------------------------------------
// LOGIN USER (EMAIL + PASSWORD)
// ------------------------------------------------------
export async function loginUser(email, password) {
    try {
        let result = await signInWithEmailAndPassword(auth, email, password);

        let uid = result.user.uid;

        // Load Firestore User Data
        let snap = await getDoc(doc(db, "users", uid));

        if (!snap.exists()) {
            return { status: "error", message: "User data missing!" };
        }

        let userData = snap.data();
        userData.lastLogin = new Date().toLocaleString();

        // Update last login
        await setDoc(doc(db, "users", uid), userData, { merge: true });

        // Save locally
        saveLocal(userData);

        return { status: "success" };
        
    } catch (err) {
        return { status: "error", message: err.message };
    }
}


// ------------------------------------------------------
// GOOGLE LOGIN
// ------------------------------------------------------
export async function googleLogin() {
    try {
        let result = await signInWithPopup(auth, googleProvider);

        let user = result.user;
        let uid = user.uid;

        let userRef = doc(db, "users", uid);
        let snap = await getDoc(userRef);

        let data = {
            uid,
            username: user.displayName || "User",
            email: user.email,
            created: snap.exists() ? snap.data().created : new Date().toLocaleString(),
            lastLogin: new Date().toLocaleString(),
            bio: snap.exists() ? snap.data().bio : "",
            pfp: user.photoURL || ""
        };

        await setDoc(userRef, data, { merge: true });

        saveLocal(data);

        return { status: "success" };

    } catch (err) {
        return { status: "error", message: err.message };
    }
}


// ------------------------------------------------------
// LOGOUT
// ------------------------------------------------------
export async function logout() {
    await signOut(auth);
    localStorage.removeItem("zta_user");
    window.location.href = "auth.html";
}


// ------------------------------------------------------
// CHECK LOGIN STATUS FOR NAVBAR
// ------------------------------------------------------
export function checkLoginStatus() {
    let user = localStorage.getItem("zta_user");

    let loginBtn    = document.getElementById("loginBtn");
    let accountBtn  = document.getElementById("accountBtn");
    let dropdown    = document.getElementById("dropdownMenu");

    if (!loginBtn || !accountBtn) return;

    if (user) {
        loginBtn.style.display = "none";
        accountBtn.style.display = "inline";

        accountBtn.onclick = function () {
            dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
            dropdown.style.opacity = dropdown.style.opacity === "1" ? "0" : "1";
        };

        // Attach logout
        window.logout = logout;

    } else {
        loginBtn.style.display = "inline-block";
        accountBtn.style.display = "none";
    }
}


// AUTO ACTIVATE NAVBAR ON EVERY PAGE
document.addEventListener("DOMContentLoaded", () => {
    checkLoginStatus();
});

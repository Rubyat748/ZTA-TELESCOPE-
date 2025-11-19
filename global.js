/* =========================================================
   FIREBASE IMPORTS
========================================================= */
import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/* =========================================================
   NAVBAR LOGIN / LOGOUT DISPLAY
========================================================= */
export function checkLoginStatus() {
    const loginBtn = document.getElementById("loginBtn");
    const accountBtn = document.getElementById("accountBtn");

    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (loginBtn) loginBtn.style.display = "none";
            if (accountBtn) accountBtn.style.display = "inline-block";
        } else {
            if (loginBtn) loginBtn.style.display = "inline-block";
            if (accountBtn) accountBtn.style.display = "none";
        }
    });
}

/* =========================================================
   SIGNUP USER (EMAIL + PASSWORD)
========================================================= */
export async function signupUser(username, email, password) {
    try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);

        // Save user into Firestore
        await setDoc(doc(db, "users", userCred.user.uid), {
            username: username,
            email: email,
            bio: "",
            pfpUrl: "",
            created: new Date().toLocaleString(),
            lastLogin: new Date().toLocaleString()
        });

        return { status: "success" };
    } catch (err) {
        return { status: "error", message: err.message };
    }
}

/* =========================================================
   LOGIN USER (EMAIL + PASSWORD)
========================================================= */
export async function loginUser(email, password) {
    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);

        // Update last login
        await setDoc(
            doc(db, "users", userCred.user.uid),
            { lastLogin: new Date().toLocaleString() },
            { merge: true }
        );

        return { status: "success" };
    } catch (err) {
        return { status: "error", message: err.message };
    }
}

/* =========================================================
   GOOGLE LOGIN
========================================================= */
export async function googleAuth() {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        const user = result.user;

        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        // If new user → create
        if (!snap.exists()) {
            await setDoc(userRef, {
                username: user.displayName,
                email: user.email,
                bio: "",
                pfpUrl: user.photoURL || "",
                created: new Date().toLocaleString(),
                lastLogin: new Date().toLocaleString()
            });
        } else {
            // Existing → update last login
            await setDoc(
                userRef,
                { lastLogin: new Date().toLocaleString() },
                { merge: true }
            );
        }

        return { status: "success" };
    } catch (err) {
        return { status: "error", message: err.message };
    }
}

/* =========================================================
   LOGOUT
========================================================= */
export function logoutUser() {
    signOut(auth);
    window.location.href = "auth.html";
}
import { auth, db } from "./firebase.js";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

async function loginUser() {
    const email = document.getElementById("login_email").value;
    const pass = document.getElementById("login_password").value;

    try {
        const userCred = await signInWithEmailAndPassword(auth, email, pass);
        const uid = userCred.user.uid;

        const userDoc = await getDoc(doc(db, "users", uid));

        if (userDoc.exists()) {
            if (userDoc.data().banned === true) {
                alert("❌ Your account is banned.");
                auth.signOut();
                return;
            }
        }

        window.location.href = "dashboard.html";

    } catch (err) {
        alert("Login failed: " + err.message);
    }
}

/* =========================================================
   ZTA - FIREBASE GLOBAL AUTH SYSTEM
   Works for ALL pages
========================================================= */

// -------------------------------
// FIREBASE IMPORTS
// -------------------------------
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// -------------------------------
// FIREBASE CONFIG
// -------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyAvoeiw_fwmSkFN97hGzSsUTn2KJ1G2jQc",
    authDomain: "astrophotography-with-zerox.firebaseapp.com",
    projectId: "astrophotography-with-zerox",
    storageBucket: "astrophotography-with-zerox.firebasestorage.app",
    messagingSenderId: "847847244230",
    appId: "1:847847244230:web:ecd8f9066f385a025072c7",
    measurementId: "G-38YEEM9D71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// =========================================================
//   SIGNUP USER
// =========================================================
export async function signupUser(username, email, password) {
    try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);

        // Create Firestore user data
        await setDoc(doc(db, "users", userCred.user.uid), {
            username: username,
            email: email,
            bio: "",
            created: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            pfp: ""
        });

        return { status: "success" };

    } catch (error) {
        return { status: "fail", message: error.message };
    }
}


// =========================================================
//   LOGIN USER
// =========================================================
export async function loginUser(email, password) {
    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);

        // Update last login time
        await setDoc(doc(db, "users", userCred.user.uid), {
            lastLogin: new Date().toISOString()
        }, { merge: true });

        return { status: "success" };

    } catch (error) {
        return { status: "fail", message: error.message };
    }
}


// =========================================================
//   GOOGLE LOGIN
// =========================================================
export async function googleAuth() {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        const user = result.user;

        // Check if user exists in DB
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            await setDoc(ref, {
                username: user.displayName,
                email: user.email,
                bio: "",
                pfp: user.photoURL,
                created: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });
        }

        return { status: "success" };

    } catch (error) {
        return { status: "fail", message: error.message };
    }
}



// =========================================================
//   LOGOUT
// =========================================================
export function logout() {
    signOut(auth).then(() => {
        window.location.href = "auth.html";
    });
}



// =========================================================
//   LOAD NAVBAR LOGIN STATUS
// =========================================================
export function checkLoginStatus() {
    onAuthStateChanged(auth, async (user) => {
        const loginBtn = document.getElementById("loginBtn");
        const accountBtn = document.getElementById("accountBtn");

        if (!loginBtn || !accountBtn) return;

        if (user) {
            loginBtn.style.display = "none";
            accountBtn.style.display = "inline-block";
        } else {
            loginBtn.style.display = "inline-block";
            accountBtn.style.display = "none";
        }
    });
}



// =========================================================
//   LOAD PROFILE DATA (Use inside profile.html)
// =========================================================
export async function loadProfilePage() {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            alert("Login required!");
            window.location.href = "auth.html";
            return;
        }

        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        let data = snap.data();

        document.getElementById("profileUsername").innerText = data.username;
        document.getElementById("profileEmail").innerText = data.email;
        document.getElementById("bioInput").value = data.bio || "";
        document.getElementById("createdDateText").innerText = "Created: " + data.created;
        document.getElementById("lastLoginText").innerText = "Last Login: " + data.lastLogin;

        if (data.pfp) {
            document.getElementById("profilePic").src = data.pfp;
        }
    });
}


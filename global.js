// --------------------------------------
// ZTA - GLOBAL FIREBASE AUTH SYSTEM
// --------------------------------------

import {
    auth,
    db,
    storage
} from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    updatePassword
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";


// --------------------------------------
// NAVBAR LOGIN CHECK
// --------------------------------------
onAuthStateChanged(auth, (user) => {
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


// --------------------------------------
// SIGN UP
// --------------------------------------
export async function signupUser(username, email, password) {
    try {
        let userCred = await createUserWithEmailAndPassword(auth, email, password);
        let uid = userCred.user.uid;

        await setDoc(doc(db, "users", uid), {
            username,
            email,
            bio: "",
            profilePic: "",
            createdAt: new Date(),
        });

        return { status: "success" };
    } catch (err) {
        return { status: "error", message: err.message };
    }
}


// --------------------------------------
// LOGIN
// --------------------------------------
export async function loginUser(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return { status: "success" };
    } catch (err) {
        return { status: "error", message: err.message };
    }
}


// --------------------------------------
// LOGOUT
// --------------------------------------
export function logoutUser() {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    });
}


// --------------------------------------
// LOAD USER PROFILE
// --------------------------------------
export async function loadUserProfile() {
    const user = auth.currentUser;

    if (!user) {
        window.location.href = "auth.html";
        return;
    }

    let snap = await getDoc(doc(db, "users", user.uid));
    return snap.data();
}


// --------------------------------------
// UPDATE BIO
// --------------------------------------
export async function updateUserBio(bio) {
    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid), { bio });
}


// --------------------------------------
// UPLOAD PROFILE PICTURE
// --------------------------------------
export async function uploadProfilePic(file) {
    const user = auth.currentUser;
    if (!user) return;

    const picRef = ref(storage, "profilePics/" + user.uid);

    await uploadBytes(picRef, file);
    const url = await getDownloadURL(picRef);

    await updateDoc(doc(db, "users", user.uid), { profilePic: url });

    return url;
}

import { auth, db, storage } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

import {
    ref,
    deleteObject
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";


// ============================
// CHECK ADMIN LOGIN
// ============================
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "auth.html";
        return;
    }

    const userDoc = await getDocs(collection(db, "users"));
    let isAdmin = false;

    userDoc.forEach((d) => {
        if (d.id === user.uid && d.data().isAdmin === true) {
            isAdmin = true;
        }
    });

    if (!isAdmin) {
        alert("Access denied.");
        window.location.href = "index.html";
        return;
    }

    loadStats();
    loadUsers();
    loadGallery();
});


// ============================
// LOAD STATS
// ============================
async function loadStats() {
    const users = await getDocs(collection(db, "users"));
    const gallery = await getDocs(collection(db, "gallery"));

    let totalUsers = 0;
    let bannedUsers = 0;

    users.forEach((u) => {
        totalUsers++;
        if (u.data().banned) bannedUsers++;
    });

    document.getElementById("stats").innerHTML = `
        <p><strong>Total Users:</strong> ${totalUsers}</p>
        <p><strong>Banned Users:</strong> ${bannedUsers}</p>
        <p><strong>Total Images:</strong> ${gallery.size}</p>
    `;
}


// ============================
// LOAD USERS
// ============================
async function loadUsers() {
    const users = await getDocs(collection(db, "users"));
    const list = document.getElementById("usersList");

    list.innerHTML = "";

    users.forEach((docu) => {
        const u = docu.data();

        const div = document.createElement("div");
        div.innerHTML = `
            <p>${u.email} — ${u.banned ? "❌ BANNED" : "✔ ACTIVE"}</p>
            <button onclick="toggleBan('${docu.id}', ${u.banned})">
                ${u.banned ? "Unban" : "Ban"}
            </button>
            <hr>
        `;

        list.appendChild(div);
    });
}


// ============================
// BAN / UNBAN USER
// ============================
window.toggleBan = async function (uid, current) {
    await updateDoc(doc(db, "users", uid), {
        banned: !current
    });
    loadUsers();
    loadStats();
};


// ============================
// LOAD GALLERY
// ============================
async function loadGallery() {
    const images = await getDocs(collection(db, "gallery"));
    const list = document.getElementById("galleryList");

    list.innerHTML = "";

    images.forEach((docu) => {
        const img = docu.data();

        const div = document.createElement("div");
        div.innerHTML = `
            <img src="${img.url}" width="160" style="border-radius:8px;"><br>
            <button onclick="deleteImage('${docu.id}', '${img.url}')">Delete</button>
            <hr>
        `;
        list.appendChild(div);
    });
}


// ============================
// DELETE IMAGE
// ============================
window.deleteImage = async function (docId, url) {

    const filePath = url.split("gallery%2F")[1].split("?")[0];
    const storageRef = ref(storage, "gallery/" + decodeURIComponent(filePath));

    await deleteObject(storageRef);
    await deleteDoc(doc(db, "gallery", docId));

    alert("Image deleted");
    loadGallery();
};

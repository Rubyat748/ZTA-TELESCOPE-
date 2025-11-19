/* ==========================================================
   ZTA - ADMIN PANEL SYSTEM
   Only owner / admins can access this page
   Firebase + Firestore + Storage
========================================================== */

import { auth, db, storage } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    getDoc,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

import {
    ref,
    deleteObject,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

/* =====================================================================
   1) CHECK IF USER IS ADMIN
===================================================================== */
async function checkAdmin(user) {
    const adminRef = doc(db, "admins", user.uid);
    const snap = await getDoc(adminRef);

    if (!snap.exists()) {
        alert("Access Denied. Admins only.");
        window.location.href = "auth.html";
        return false;
    }

    console.log("Admin verified:", snap.data());
    return true;
}

/* =====================================================================
   2) LOAD STATISTICS
===================================================================== */
async function loadStats() {
    const usersSnap = await getDocs(collection(db, "users"));
    const gallerySnap = await getDocs(collection(db, "gallery"));

    document.getElementById("stats").innerHTML = `
        <div style="background:#1a1a1f;padding:20px;border-radius:10px;margin-bottom:20px;">
            <h2>📊 Admin Stats</h2>
            <p><b>Total Users:</b> ${usersSnap.size}</p>
            <p><b>Total Images:</b> ${gallerySnap.size}</p>
        </div>
    `;
}

/* =====================================================================
   3) LOAD USER LIST
===================================================================== */
async function loadUsers() {
    const usersDiv = document.getElementById("usersList");
    usersDiv.innerHTML = "<p style='opacity:0.7;'>Loading users...</p>";

    const snap = await getDocs(collection(db, "users"));

    let html = `
        <table border="1" width="100%" style="border-collapse:collapse;">
            <tr style="background:#222;">
                <th>Email</th>
                <th>Username</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
    `;

    snap.forEach(u => {
        const d = u.data();
        html += `
            <tr>
                <td>${d.email}</td>
                <td>${d.username}</td>
                <td>${d.banned ? "<span style='color:red'>BANNED</span>" : "Active"}</td>
                <td>
                    ${
                        d.banned
                        ? `<button class="unbanBtn" data-id="${u.id}">Unban</button>`
                        : `<button class="banBtn" data-id="${u.id}">Ban</button>`
                    }
                    <button class="deleteBtn" data-id="${u.id}">Delete</button>
                </td>
            </tr>
        `;
    });

    usersDiv.innerHTML = html + "</table>";

    /* Add button actions */
    document.querySelectorAll(".banBtn").forEach(btn => {
        btn.onclick = () => banUser(btn.dataset.id);
    });

    document.querySelectorAll(".unbanBtn").forEach(btn => {
        btn.onclick = () => unbanUser(btn.dataset.id);
    });

    document.querySelectorAll(".deleteBtn").forEach(btn => {
        btn.onclick = () => deleteUser(btn.dataset.id);
    });
}

/* =====================================================================
   4) BAN USER
===================================================================== */
async function banUser(uid) {
    await updateDoc(doc(db, "users", uid), { banned: true });
    alert("User banned");
    loadUsers();
}

/* =====================================================================
   5) UNBAN USER
===================================================================== */
async function unbanUser(uid) {
    await updateDoc(doc(db, "users", uid), { banned: false });
    alert("User unbanned");
    loadUsers();
}

/* =====================================================================
   6) DELETE USER
===================================================================== */
async function deleteUser(uid) {
    if (!confirm("Delete this user permanently?")) return;

    await deleteDoc(doc(db, "users", uid));

    alert("User deleted.");
    loadUsers();
}

/* =====================================================================
   7) LOAD GALLERY IMAGES
===================================================================== */
async function loadGallery() {
    const galleryDiv = document.getElementById("galleryList");
    galleryDiv.innerHTML = "<p style='opacity:0.7;'>Loading photos...</p>";

    const snap = await getDocs(collection(db, "gallery"));

    let html = "<div style='display:flex;flex-wrap:wrap;gap:20px;'>";

    snap.forEach(docSnap => {
        const d = docSnap.data();

        html += `
            <div style="background:#1a1a1f;padding:10px;border-radius:10px;">
                <img src="${d.url}" width="180" style="border-radius:8px;">
                <br><br>
                <button class="deleteImgBtn" data-id="${docSnap.id}" data-url="${d.url}">
                    Delete Image
                </button>
            </div>
        `;
    });

    html += "</div>";

    galleryDiv.innerHTML = html;

    /* Add delete actions */
    document.querySelectorAll(".deleteImgBtn").forEach(btn => {
        btn.onclick = () => deleteImage(btn.dataset.id, btn.dataset.url);
    });
}

/* =====================================================================
   8) DELETE IMAGE FROM FIREBASE STORAGE + FIRESTORE
===================================================================== */
async function deleteImage(docId, imageUrl) {
    if (!confirm("Delete this image?")) return;

    // Delete from Storage
    const fileRef = ref(storage, imageUrl);
    await deleteObject(fileRef);

    // Delete from Firestore
    await deleteDoc(doc(db, "gallery", docId));

    alert("Image deleted.");
    loadGallery();
}

/* =====================================================================
   9) INITIALIZE ADMIN PANEL
===================================================================== */
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        alert("Login first!");
        window.location.href = "auth.html";
        return;
    }

    const isAdmin = await checkAdmin(user);
    if (!isAdmin) return;

    loadStats();
    loadUsers();
    loadGallery();
});

/* =====================================================================
   10) LOGOUT
===================================================================== */
window.adminLogout = function () {
    signOut(auth);
    window.location.href = "auth.html";
};

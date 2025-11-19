import { auth, db, storage } from "./firebase.js";

import {
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
    collection, getDocs, doc, updateDoc, deleteDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

import {
    ref, deleteObject
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

/* ------------------- CHECK ADMIN ------------------- */
onAuthStateChanged(auth, (user) => {
    if (!user) window.location.href = "admin-login.html";
});

/* ------------------- SHOW TABS ------------------- */
window.showTab = function (id) {
    document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
    document.getElementById(id).style.display = "block";
};

/* ------------------- LOAD STATS ------------------- */
async function loadStats() {
    const users = await getDocs(collection(db, "users"));
    const gallery = await getDocs(collection(db, "gallery"));

    let banned = 0;
    users.forEach(u => { if (u.data().banned) banned++; });

    document.getElementById("totalUsers").innerText = users.size;
    document.getElementById("bannedUsers").innerText = banned;
    document.getElementById("totalImages").innerText = gallery.size;
}

/* ------------------- LOAD USERS ------------------- */
async function loadUsers() {
    const tb = document.getElementById("userTable");
    tb.innerHTML = "";

    const snap = await getDocs(collection(db, "users"));
    snap.forEach(u => {
        const d = u.data();
        let row = `
        <tr>
            <td>${d.email}</td>
            <td>${d.username}</td>
            <td>${d.banned ? "🚫 Banned" : "Active"}</td>
            <td>
                ${d.banned ?
                `<button class="unban action" onclick="unban('${u.id}')">Unban</button>`
                :
                `<button class="ban action" onclick="ban('${u.id}')">Ban</button>`}
                <button class="del action" onclick="deleteUser('${u.id}')">Delete</button>
            </td>
        </tr>`;
        tb.innerHTML += row;
    });
}

/* BAN */
window.ban = async (uid) => {
    await updateDoc(doc(db, "users", uid), { banned: true });
    loadUsers();
};

/* UNBAN */
window.unban = async (uid) => {
    await updateDoc(doc(db, "users", uid), { banned: false });
    loadUsers();
};

/* DELETE USER */
window.deleteUser = async (uid) => {
    if (!confirm("Delete this user?")) return;
    await deleteDoc(doc(db, "users", uid));
    loadUsers();
};

/* ------------------- LOAD GALLERY ------------------- */
async function loadGallery() {
    const box = document.getElementById("galleryBox");
    box.innerHTML = "";

    const snap = await getDocs(collection(db, "gallery"));

    snap.forEach(img => {
        let d = img.data();

        box.innerHTML += `
        <div style="margin:15px; display:inline-block;">
            <img src="${d.url}" width="200" style="border-radius:8px;">
            <br>
            <button onclick="delImg('${img.id}', '${d.url}')">Delete</button>
        </div>`;
    });
}

/* DELETE IMAGE */
window.delImg = async (id, url) => {
    if (!confirm("Delete this image?")) return;

    await deleteDoc(doc(db, "gallery", id));

    // delete from storage
    const path = ref(storage, url);
    deleteObject(path);

    loadGallery();
};

/* LOGOUT */
window.logout = function() {
    signOut(auth);
    window.location.href = "admin-login.html";
};

/* INIT */
showTab("stats");
loadStats();
loadUsers();
loadGallery();

/* =======================================================
   ZTA ADMIN PANEL - FIXED HARD CODED LOGIN (OPTION A)
   Admin Email: rubyatferdous79@gmail.com
   Password:    Rubyat@79
======================================================= */

import { auth, db, storage } from "./firebase.js";

import {
    collection,
    getDocs,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

import {
    ref,
    deleteObject,
    listAll,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

/* ================================
   FIXED ADMIN LOGIN
================================ */

window.adminLogin = function () {
    const email = document.getElementById("admin_email").value.trim();
    const pass = document.getElementById("admin_pass").value.trim();

    if (email === "rubyatferdous79@gmail.com" && pass === "Rubyat@79") {
        localStorage.setItem("zta_admin", "true");
        window.location.href = "admin-dashboard.html";
    } else {
        alert("Invalid admin credentials!");
    }
};

/* ================================
   PROTECT ADMIN PAGES
================================ */
if (window.location.pathname.includes("admin-dashboard.html")) {
    if (localStorage.getItem("zta_admin") !== "true") {
        window.location.href = "admin-login.html";
    }
}

/* ================================
   LOGOUT
================================ */
window.logoutAdmin = function () {
    localStorage.removeItem("zta_admin");
    window.location.href = "admin-login.html";
};

/* ================================
   PAGE SWITCHING
================================ */
window.showPage = function (pageName) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active-page"));
    document.getElementById(pageName).classList.add("active-page");

    document.querySelectorAll(".sidebar a").forEach(a => a.classList.remove("active"));
    event.target.classList.add("active");
};

/* ================================
   LOAD DASHBOARD STATS
================================ */
async function loadStats() {
    const usersSnap = await getDocs(collection(db, "users"));
    const gallerySnap = await getDocs(collection(db, "gallery"));

    let totalUsers = 0;
    let bannedUsers = 0;
    let totalImages = 0;
    let todayUploads = 0;

    totalUsers = usersSnap.size;

    const today = new Date();
    today.setHours(0,0,0,0);

    usersSnap.forEach(doc => {
        const u = doc.data();
        if (u.banned === true) bannedUsers++;
    });

    gallerySnap.forEach(doc => {
        const img = doc.data();
        totalImages++;

        if (img.uploadedAt) {
            if (new Date(img.uploadedAt).getTime() >= today.getTime()) {
                todayUploads++;
            }
        }
    });

    document.getElementById("totalUsers").innerText = totalUsers;
    document.getElementById("bannedUsers").innerText = bannedUsers;
    document.getElementById("totalImages").innerText = totalImages;
    document.getElementById("todayUploads").innerText = todayUploads;
}

/* ================================
   LOAD USERS TABLE
================================ */
async function loadUsers() {
    const table = document.getElementById("usersTableBody");
    table.innerHTML = "Loading...";

    const querySnap = await getDocs(collection(db, "users"));

    table.innerHTML = "";

    querySnap.forEach(u => {
        const data = u.data();

        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${data.email}</td>
            <td>${data.username || "-"}</td>
            <td>${data.banned ? "❌ Banned" : "✔ Active"}</td>
            <td>
                <button onclick="toggleBan('${u.id}', ${data.banned})">
                    ${data.banned ? "Unban" : "Ban"}
                </button>
            </td>
        `;

        table.appendChild(row);
    });
}

/* ================================
   BAN / UNBAN USER
================================ */
window.toggleBan = async function (uid, status) {
    await updateDoc(doc(db, "users", uid), {
        banned: !status
    });

    alert(status ? "User Unbanned" : "User Banned");
    loadUsers();
};

/* ================================
   LOAD GALLERY FOR ADMIN
================================ */
async function loadGalleryAdmin() {
    const galleryBox = document.getElementById("adminGallery");
    galleryBox.innerHTML = "Loading...";

    const snap = await getDocs(collection(db, "gallery"));

    galleryBox.innerHTML = "";

    snap.forEach((docItem) => {
        const data = docItem.data();

        let imgBox = document.createElement("div");
        imgBox.innerHTML = `
            <img src="${data.url}">
            <button onclick="deleteImage('${docItem.id}', '${data.url}')">Delete</button>
        `;

        galleryBox.appendChild(imgBox);
    });
}

/* ================================
   DELETE IMAGE
================================ */
window.deleteImage = async function (id, url) {
    if (!confirm("Delete this image?")) return;

    await deleteDoc(doc(db, "gallery", id));

    // Delete from storage
    const imgRef = ref(storage, url);
    deleteObject(imgRef);

    alert("Image deleted.");
    loadGalleryAdmin();
};

/* ================================
   INIT LOAD
================================ */
if (window.location.pathname.includes("admin-dashboard.html")) {
    setTimeout(() => {
        loadStats();
        loadUsers();
        loadGalleryAdmin();
    }, 400);
}

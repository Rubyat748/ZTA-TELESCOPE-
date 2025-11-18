/* =========================================================
   ZTA - UNIVERSAL AUTH SYSTEM
   Works for ALL pages
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
    setupDropdown();
});

/* =========================================================
   UPDATE NAVBAR LOGIN / ACCOUNT BUTTON
========================================================= */
function updateNavbar() {
    let user = localStorage.getItem("zta_user");
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
}

/* =========================================================
   DROPDOWN ANIMATION
========================================================= */
function setupDropdown() {
    const btn = document.getElementById("accountBtn");
    const menu = document.getElementById("dropdownMenu");

    if (!btn || !menu) return;

    btn.onclick = () => {
        if (menu.style.display === "flex") {
            menu.style.opacity = "0";
            menu.style.transform = "translateY(-10px)";
            setTimeout(() => menu.style.display = "none", 200);
        } else {
            menu.style.display = "flex";
            setTimeout(() => {
                menu.style.opacity = "1";
                menu.style.transform = "translateY(0)";
            }, 10);
        }
    };
}

/* =========================================================
   SIGNUP USER
========================================================= */
function signup() {
    let username = document.getElementById("signup-username").value.trim();
    let email = document.getElementById("signup-email").value.trim();
    let password = document.getElementById("signup-password").value.trim();

    if (!username || !email || !password) {
        alert("Please fill all fields.");
        return;
    }

    let user = {
        username: username,
        email: email,
        password: password,
        pfp: "",
        bio: "",
        created: new Date().toLocaleString(),
        lastLogin: "--"
    };

    localStorage.setItem("zta_user", JSON.stringify(user));
    alert("Signup successful! Now log in.");
    window.location.href = "auth.html";
}

/* =========================================================
   LOGIN USER
========================================================= */
function login() {
    let inputUser = document.getElementById("login-user").value.trim();
    let pass = document.getElementById("login-pass").value.trim();

    let user = localStorage.getItem("zta_user");

    if (!user) {
        alert("No account found. Please sign up first.");
        return;
    }

    user = JSON.parse(user);

    if ((inputUser === user.username || inputUser === user.email) && pass === user.password) {
        user.lastLogin = new Date().toLocaleString();
        localStorage.setItem("zta_user", JSON.stringify(user));

        alert("Login successful!");
        window.location.href = "dashboard.html";
    } else {
        alert("Wrong username/email or password.");
    }
}

/* =========================================================
   LOGOUT
========================================================= */
function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("zta_user");
        window.location.href = "index.html";
    }
}

/* =========================================================
   LOAD DASHBOARD DATA
========================================================= */
function loadDashboard() {
    let user = JSON.parse(localStorage.getItem("zta_user"));

    if (!user) {
        alert("Login first!");
        window.location.href = "auth.html";
        return;
    }

    document.getElementById("usernameDisplay").innerText = user.username;
}

/* =========================================================
   LOAD PROFILE PAGE
========================================================= */
function loadProfile() {
    let user = JSON.parse(localStorage.getItem("zta_user"));

    if (!user) {
        alert("Login required!");
        window.location.href = "auth.html";
        return;
    }

    document.getElementById("profileUsername").innerText = user.username;
    document.getElementById("profileEmail").innerText = user.email;
    document.getElementById("bioInput").value = user.bio || "";

    document.getElementById("createdDateText").innerText = "Created: " + user.created;
    document.getElementById("lastLoginText").innerText = "Last Login: " + user.lastLogin;

    if (user.pfp) {
        document.getElementById("profilePic").src = user.pfp;
    }
}

/* =========================================================
   UPLOAD PROFILE PICTURE
========================================================= */
function uploadPFP() {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = () => {
        let file = input.files[0];
        let reader = new FileReader();

        reader.onload = function () {
            let user = JSON.parse(localStorage.getItem("zta_user"));
            user.pfp = reader.result;
            localStorage.setItem("zta_user", JSON.stringify(user));

            document.getElementById("profilePic").src = reader.result;
        };

        reader.readAsDataURL(file);
    };

    input.click();
}

/* =========================================================
   SAVE PROFILE DATA
========================================================= */
function saveProfile() {
    let user = JSON.parse(localStorage.getItem("zta_user"));
    user.bio = document.getElementById("bioInput").value;

    localStorage.setItem("zta_user", JSON.stringify(user));
    alert("Profile saved!");
}

/* =========================================================
   DOWNLOAD USER JSON
========================================================= */
function downloadUser() {
    let data = localStorage.getItem("zta_user");
    let blob = new Blob([data], {type: "application/json"});
    let a = document.createElement("a");

    a.href = URL.createObjectURL(blob);
    a.download = "zta_user.json";
    a.click();
}

/* =========================================================
   DELETE ACCOUNT
========================================================= */
function deleteAccount() {
    if (!confirm("Delete account permanently?")) return;

    localStorage.removeItem("zta_user");
    alert("Account deleted.");
    window.location.href = "auth.html";
}

/* =========================================================
   PASSWORD CHANGE
========================================================= */
function changePassword() {
    let oldPass = document.getElementById("oldPass").value;
    let newPass = document.getElementById("newPass").value;
    let confirmPass = document.getElementById("confirmPass").value;

    let user = JSON.parse(localStorage.getItem("zta_user"));

    if (oldPass !== user.password) {
        alert("Old password incorrect.");
        return;
    }

    if (newPass !== confirmPass) {
        alert("New passwords do not match.");
        return;
    }

    user.password = newPass;
    localStorage.setItem("zta_user", JSON.stringify(user));

    alert("Password updated!");
    window.location.href = "dashboard.html";
}

/* =========================================================
   CHECK IF LOGIN REQUIRED FOR GALLERY
========================================================= */
function needLogin() {
    let user = localStorage.getItem("zta_user");
    if (!user) {
        alert("You must be logged in to view this!");
        window.location.href = "auth.html";
        return false;
    }
    return true;
}

/* =========================================================
   ZTA APP.JS — OFFLINE LOGIN & SIGNUP (LOCAL STORAGE VERSION)
========================================================= */

/* -------------------------------
   SWITCH LOGIN <-> SIGNUP
-------------------------------- */
window.showSignup = function () {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("signupBox").style.display = "block";
};

window.showLogin = function () {
    document.getElementById("signupBox").style.display = "none";
    document.getElementById("loginBox").style.display = "block";
};

/* -------------------------------
   SIGNUP USER (LOCAL STORAGE)
-------------------------------- */
window.signupUser = function () {
    const username = document.getElementById("signup_username").value.trim();
    const email = document.getElementById("signup_email").value.trim();
    const password = document.getElementById("signup_password").value.trim();

    if (!username || !email || !password) {
        alert("All fields are required.");
        return;
    }

    const userObj = {
        username: username,
        email: email,
        password: password,
        profilePic: "",
        created: new Date().toLocaleString(),
        lastLogin: ""
    };

    localStorage.setItem("zta_user", JSON.stringify(userObj));

    alert("Account created successfully!");
    showLogin();
};

/* -------------------------------
   LOGIN USER (LOCAL STORAGE)
-------------------------------- */
window.loginUser = function () {
    const login_id = document.getElementById("login_id").value.trim();
    const password = document.getElementById("login_password").value.trim();

    const storedUser = localStorage.getItem("zta_user");

    if (!storedUser) {
        alert("No user found. Please sign up first.");
        return;
    }

    const user = JSON.parse(storedUser);

    // Validate login
    if ((login_id === user.username || login_id === user.email) &&
        password === user.password) {

        user.lastLogin = new Date().toLocaleString();
        localStorage.setItem("zta_user", JSON.stringify(user));

        alert("Login successful!");
        window.location.href = "dashboard.html";

    } else {
        alert("Wrong username/email or wrong password!");
    }
};

/* --------------------------------
   CHECK LOGIN STATUS FOR NAVBAR
-------------------------------- */
window.checkLoginStatus = function () {
    const user = localStorage.getItem("zta_user");

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
};

/* --------------------------------
   LOGOUT USER
-------------------------------- */
window.logoutUser = function () {
    if (confirm("Logout your account?")) {
        localStorage.removeItem("zta_user");
        window.location.href = "auth.html";
    }
};

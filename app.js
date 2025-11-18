/* =========================================================
   ZTA APP.JS — OFFLINE LOGIN & SIGNUP (NO SERVER REQUIRED)
   Uses localStorage to save user data
========================================================= */


// -------------------------------
// Switch Between Login & Signup
// -------------------------------
function showSignup() {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("signupBox").style.display = "block";
}

function showLogin() {
    document.getElementById("signupBox").style.display = "none";
    document.getElementById("loginBox").style.display = "block";
}


// -------------------------------
// SIGNUP FUNCTION (LOCAL STORAGE)
// -------------------------------
function signupUser() {
    const username = document.getElementById("signup_username").value.trim();
    const email = document.getElementById("signup_email").value.trim();
    const password = document.getElementById("signup_password").value.trim();

    if (username === "" || email === "" || password === "") {
        alert("All fields are required.");
        return;
    }

    const userObj = {
        username: username,
        email: email,
        password: password,
        profilePic: ""
    };

    localStorage.setItem("zta_user", JSON.stringify(userObj));

    alert("Account created! You can now log in.");
    showLogin();
}


// -------------------------------
// LOGIN FUNCTION (LOCAL STORAGE)
// -------------------------------
function loginUser() {
    const login_id = document.getElementById("login_id").value.trim();
    const password = document.getElementById("login_password").value.trim();

    const storedUser = localStorage.getItem("zta_user");

    if (!storedUser) {
        alert("No user found. Please sign up first.");
        return;
    }

    const user = JSON.parse(storedUser);

    if ((login_id === user.username || login_id === user.email) &&
        password === user.password) {

        alert("Login successful!");
        window.location.href = "dashboard.html";

    } else {
        alert("Wrong username/email or password.");
    }
}

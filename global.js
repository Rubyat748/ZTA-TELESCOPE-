<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>ZTA - Login / Signup</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
    body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: url("assets/background.jpg") no-repeat center center fixed;
        background-size: cover;
        color: white;
    }

    .container {
        width: 360px;
        margin: 80px auto;
        padding: 25px;
        backdrop-filter: blur(12px);
        background: rgba(0,0,0,0.55);
        border-radius: 12px;
    }

    h2 {
        text-align: center;
        margin-bottom: 25px;
    }

    input {
        width: 100%;
        padding: 12px;
        margin-top: 12px;
        border-radius: 6px;
        border: none;
        background: rgba(255,255,255,0.15);
        color: white;
        outline: none;
    }

    button {
        width: 100%;
        padding: 12px;
        margin-top: 18px;
        border: none;
        background: #ff5050;
        color: white;
        border-radius: 6px;
        font-size: 16px;
        cursor: pointer;
    }

    .google-btn {
        background: white;
        color: black;
        font-weight: bold;
    }

    .switch {
        margin-top: 15px;
        text-align: center;
        cursor: pointer;
        color: #ccc;
    }

    .switch:hover {
        color: #ff5050;
    }
</style>
</head>
<body>

<div class="container">

    <!-- LOGIN BOX -->
    <div id="loginBox">
        <h2>Login</h2>
        <input type="text" id="login_email" placeholder="Email">
        <input type="password" id="login_password" placeholder="Password">
        <button onclick="loginNow()">Login</button>

        <button class="google-btn" onclick="googleLogin()">Login with Google</button>

        <div class="switch" onclick="showSignup()">Don't have an account? Signup</div>
    </div>

    <!-- SIGNUP BOX -->
    <div id="signupBox" style="display:none;">
        <h2>Create Account</h2>
        <input type="text" id="signup_username" placeholder="Name">
        <input type="text" id="signup_email" placeholder="Email">
        <input type="password" id="signup_password" placeholder="Password">
        <button onclick="signupNow()">Create Account</button>

        <div class="switch" onclick="showLogin()">Already have an account? Login</div>
    </div>

</div>

<!-- FIREBASE AUTH + GLOBAL -->
<script type="module">
import { signupUser, loginUser, googleAuth } from "./global.js";

/* SWITCH LOGIN/SIGNUP */
window.showSignup = function () {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("signupBox").style.display = "block";
};

window.showLogin = function () {
    document.getElementById("signupBox").style.display = "none";
    document.getElementById("loginBox").style.display = "block";
};

/* SIGNUP */
window.signupNow = async function () {
    let username = document.getElementById("signup_username").value.trim();
    let email = document.getElementById("signup_email").value.trim();
    let password = document.getElementById("signup_password").value.trim();

    let res = await signupUser(username, email, password);

    if (res.status === "success") {
        alert("Account created!");
        showLogin();
    } else {
        alert(res.message);
    }
};

/* LOGIN */
window.loginNow = async function () {
    let email = document.getElementById("login_email").value.trim();
    let password = document.getElementById("login_password").value.trim();

    let res = await loginUser(email, password);

    if (res.status === "success") {
        window.location.href = "dashboard.html";
    } else {
        alert(res.message);
    }
};

/* GOOGLE LOGIN */
window.googleLogin = async function () {
    let res = await googleAuth();
    if (res.status === "success") {
        window.location.href = "dashboard.html";
    } else {
        alert(res.message);
    }
};
</script>

</body>
</html>
    

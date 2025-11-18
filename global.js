<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ZTA - Login / Signup</title>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
    }

    body {
        background: url("assets/background.jpg") no-repeat center center fixed;
        background-size: cover;
        height: 100vh;
        color: white;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(3px);
    }

    .auth-box {
        width: 380px;
        padding: 25px;
        background: rgba(0, 0, 0, 0.55);
        border-radius: 12px;
        backdrop-filter: blur(10px);
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
        animation: fadeIn 0.7s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    h2 {
        text-align: center;
        margin-bottom: 20px;
        font-size: 28px;
        letter-spacing: 2px;
    }

    input {
        width: 100%;
        padding: 12px;
        margin: 8px 0;
        border: none;
        border-radius: 6px;
        outline: none;
        font-size: 16px;
    }

    .btn {
        width: 100%;
        padding: 12px;
        background: #ff5050;
        border: none;
        border-radius: 6px;
        margin-top: 10px;
        font-size: 18px;
        cursor: pointer;
        color: white;
        transition: 0.3s;
    }

    .btn:hover {
        background: #ff2e2e;
    }

    .toggle {
        margin-top: 15px;
        text-align: center;
        cursor: pointer;
        color: #ff8888;
        font-size: 15px;
    }

    .toggle:hover {
        text-decoration: underline;
    }

</style>
</head>

<body>

<div class="auth-box">

    <h2 id="formTitle">Login</h2>

    <!-- LOGIN FORM -->
    <div id="loginForm">
        <input id="loginUser" type="text" placeholder="Email or Username">
        <input id="loginPass" type="password" placeholder="Password">
        <button class="btn" onclick="login()">Login</button>

        <div class="toggle" onclick="showSignup()">Create an account</div>
        <div class="toggle" onclick="goForgot()">Forgot Password?</div>
    </div>

    <!-- SIGNUP FORM -->
    <div id="signupForm" style="display:none;">
        <input id="signupUser" type="text" placeholder="Username">
        <input id="signupEmail" type="email" placeholder="Email">
        <input id="signupPass" type="password" placeholder="Password">
        <button class="btn" onclick="signup()">Sign Up</button>

        <div class="toggle" onclick="showLogin()">Already have an account?</div>
    </div>

</div>

<script src="global.js"></script>

</body>
</html>
          

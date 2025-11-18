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
// SIGNUP FUNCTION
// -------------------------------

async function signupUser() {
    const username = document.getElementById("signup_username").value;
    const email = document.getElementById("signup_email").value;
    const password = document.getElementById("signup_password").value;

    const response = await fetch("/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
    });

    const data = await response.json();

    if (data.status === "success") {
        alert("Account Created!");
        showLogin();
    } else {
        alert(data.msg);
    }
}


// -------------------------------
// LOGIN FUNCTION
// -------------------------------

async function loginUser() {
    const login_id = document.getElementById("login_id").value;
    const password = document.getElementById("login_password").value;

    const response = await fetch("/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            login_id: login_id,
            password: password
        })
    });

    const data = await response.json();

    if (data.status === "success") {
        window.location.href = "/dashboard"; // go to dashboard
    } else {
        alert(data.msg);
    }
}

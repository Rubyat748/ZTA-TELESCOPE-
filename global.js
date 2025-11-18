/* =========================================================
   ZTA - GLOBAL AUTH + UI SYSTEM
   Works for ALL pages
   ========================================================= */

// Load login state on every page
document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
    setupDropdown();
});

/* =========================================================
   CHECK LOGIN STATUS FOR NAVBAR
   ========================================================= */
function checkLoginStatus() {
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
   DROPDOWN LOGIC
   ========================================================= */
function setupDropdown() {
    const accountBtn = document.getElementById("accountBtn");
    const dropdownMenu = document.getElementById("dropdownMenu");

    if (!accountBtn || !dropdownMenu) return;

    accountBtn.addEventListener("click", () => {
        if (dropdownMenu.style.display === "flex") {
            dropdownMenu.style.opacity = "0";
            dropdownMenu.style.transform = "translateY(-10px)";
            setTimeout(() => (dropdownMenu.style.display = "none"), 200);
        } else {
            dropdownMenu.style.display = "flex";
            setTimeout(() => {
                dropdownMenu.style.opacity = "1";
                dropdownMenu.style.transform = "translateY(0px)";
            }, 10);
        }
    });
}

/* =========================================================
   SIGNUP SYSTEM
   ========================================================= */
function signupUser() {
    let username = document.getElementById("signup_username").value.trim();
    let email = document.getElementById("signup_email").value.trim();
    let pass = document.getElementById("signup_password").value.trim();

    if (username === "" || email === "" || pass === "") {
        alert("All fields required.");
        return;
    }

    let userObj = {
        username: username,
        email: email,
        password: pass,
        profilePic: "",
    };

    localStorage.setItem("zta_user", JSON.stringify(userObj));
    alert("Signup successful! You can now log in.");
    window.location.href = "auth.html";
}

/* =========================================================
   LOGIN SYSTEM
   ========================================================= */
function loginUser() {
    let input = document.getElementById("login_user").value.trim();
    let pass = document.getElementById("login_pass").value.trim();

    let user = localStorage.getItem("zta_user");

    if (!user) {
        alert("No user found. Please sign up first.");
        return;
    }

    user = JSON.parse(user);

    if ((input === user.username || input === user.email) && pass === user.password) {
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
    if (confirm("Logout?")) {
        localStorage.removeItem("zta_user");
        window.location.href = "index.html";
    }
}

/* =========================================================
   PROFILE PAGE: LOAD USER DATA
   ========================================================= */
function loadProfile() {
    let user = localStorage.getItem("zta_user");

    if (!user) {
        alert("Login required!");
        window.location.href = "auth.html";
        return;
    }

    user = JSON.parse(user);

    document.getElementById("profile_username").innerText = user.username;
    document.getElementById("profile_email").innerText = user.email;

    if (user.profilePic !== "") {
        document.getElementById("profile_pic").src = user.profilePic;
    }
}

/* =========================================================
   UPDATE PROFILE PICTURE
   ========================================================= */
function updateProfilePic(event) {
    let file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function (e) {
        let user = JSON.parse(localStorage.getItem("zta_user"));
        user.profilePic = e.target.result;
        localStorage.setItem("zta_user", JSON.stringify(user));

        document.getElementById("profile_pic").src = e.target.result;
        alert("Profile picture updated!");
    };
    reader.readAsDataURL(file);
}

/* =========================================================
   CHANGE PASSWORD
   ========================================================= */
function changePassword() {
    let oldPass = document.getElementById("old_pass").value;
    let newPass = document.getElementById("new_pass").value;

    let user = JSON.parse(localStorage.getItem("zta_user"));

    if (oldPass !== user.password) {
        alert("Old password is incorrect.");
        return;
    }

    user.password = newPass;
    localStorage.setItem("zta_user", JSON.stringify(user));

    alert("Password changed!");
    window.location.href = "dashboard.html";
}

/* =========================================================
   FORGOT PASSWORD
   ========================================================= */
function resetPassword() {
    let email = document.getElementById("reset_email").value;

    let user = JSON.parse(localStorage.getItem("zta_user"));

    if (email !== user.email) {
        alert("Email not found.");
        return;
    }

    let newPass = prompt("Enter new password:");
    if (!newPass) return;

    user.password = newPass;
    localStorage.setItem("zta_user", JSON.stringify(user));

    alert("Password reset successful!");
    window.location.href = "auth.html";
}

/* =========================================================
   LOGIN CHECK FOR GALLERY CLICKS
   ========================================================= */
function needLogin() {
    let user = localStorage.getItem("zta_user");

    if (!user) {
        alert("Login required!");
        return false;
    }

    return true;
}

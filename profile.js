const user = JSON.parse(localStorage.getItem("user")) || {};

if (!user.loggedIn) {
    window.location.href = "login.html";
}

document.getElementById("pName").textContent = user.fullName || "Not Available";
document.getElementById("pEmail").textContent = user.email || "Not Available";
document.getElementById("pPhone").textContent = user.mobile || "Not Available";


// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", () => {
    user.loggedIn = false;
    localStorage.setItem("user", JSON.stringify(user));
    alert("Logged out!");
    window.location.href = "login.html";
});

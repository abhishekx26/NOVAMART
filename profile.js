// Get current user using shared auth system
const user = getCurrentUser();

if (!user) {
    // This won't actually run because auth.js already redirects, but good for safety
    window.location.href = "login.html";
}

// Display user information
document.getElementById("pName").textContent = user.fullName || "Not Available";
document.getElementById("pEmail").textContent = user.email || "Not Available";
document.getElementById("pPhone").textContent = user.mobile || "Not Available";

// LOGOUT using shared auth system
document.getElementById("logoutBtn").addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) {
        logoutUser(); // Uses shared auth system
    }
});

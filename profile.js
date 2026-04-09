// Configure API
const apiClient = new APIClient('http://localhost:5000/api');

// Load and display user profile
async function loadProfile() {
    try {
        const result = await apiClient.getCurrentUser();
        
        if (!result.success) {
            // Redirect to login if not authenticated
            alert("You need to login first!");
            window.location.href = "login.html";
            return;
        }
        
        const user = result.data;
        
        // Display user information
        document.getElementById("pName").textContent = user.fullName || "Not Available";
        document.getElementById("pEmail").textContent = user.email || "Not Available";
        document.getElementById("pPhone").textContent = user.phone || "Not Available";
        
    } catch (error) {
        console.error('Error loading profile:', error);
        alert("Error loading profile. Redirecting to login...");
        window.location.href = "login.html";
    }
}

// Logout handler
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    try {
        const result = await apiClient.logout();
        
        if (result.success) {
            alert("Logged out successfully!");
            window.location.href = "login.html";
        } else {
            alert("Error logging out: " + result.error);
        }
    } catch (error) {
        console.error('Error during logout:', error);
        // Still redirect even if API call fails
        alert("Logged out!");
        window.location.href = "login.html";
    }
});

// Load profile when page loads
document.addEventListener('DOMContentLoaded', loadProfile);

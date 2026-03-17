// =========================================
// NOVAMART UNIFIED AUTHENTICATION SYSTEM
// =========================================

/**
 * Check if user is authenticated and redirect to login if not
 * @param {string} redirectPage - Page to redirect to after login (optional)
 * @returns {boolean} - True if authenticated, false if redirected
 */
function requireAuth(redirectPage = null) {
    try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.loggedIn) {
            // Store the current page to redirect back after login
            if (redirectPage) {
                localStorage.setItem("redirectAfterLogin", redirectPage);
            }

            window.location.href = "login.html";
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error checking authentication:", error);
        localStorage.removeItem("user"); // Clear corrupted user data
        window.location.href = "login.html";
        return false;
    }
}

/**
 * Get current authenticated user
 * @returns {Object|null} - User object or null if not authenticated
 */
function getCurrentUser() {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        return (user && user.loggedIn) ? user : null;
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
}

/**
 * Login user and store session
 * @param {string} userInput - User identifier (email/phone/name)
 * @returns {boolean} - Success status
 */
function loginUser(userInput) {
    try {
        const user = {
            fullName: userInput,
            email: userInput,
            mobile: userInput,
            address: "",
            loggedIn: true,
            loginDate: new Date().toISOString()
        };

        localStorage.setItem("user", JSON.stringify(user));

        // Check for redirect after login
        const redirectPage = localStorage.getItem("redirectAfterLogin");
        if (redirectPage) {
            localStorage.removeItem("redirectAfterLogin");
            window.location.href = redirectPage;
        } else {
            window.location.href = "index.html";
        }

        return true;
    } catch (error) {
        console.error("Error during login:", error);
        return false;
    }
}

/**
 * Logout user and clear session
 */
function logoutUser() {
    try {
        const user = getCurrentUser();
        if (user) {
            user.loggedIn = false;
            localStorage.setItem("user", JSON.stringify(user));
        }

        // Clear other sensitive data if needed
        // localStorage.removeItem("cart"); // Uncomment if you want to clear cart on logout

        window.location.href = "login.html";
    } catch (error) {
        console.error("Error during logout:", error);
        localStorage.removeItem("user"); // Force clear on error
        window.location.href = "login.html";
    }
}

/**
 * Initialize authentication on page load
 * Call this function on pages that require authentication
 */
function initAuth() {
    // Only check auth if not on login page
    if (!window.location.pathname.includes('login.html')) {
        return requireAuth(window.location.pathname);
    }
    return true;
}

/**
 * Update user profile information
 * @param {Object} updates - Object with fields to update
 * @returns {boolean} - Success status
 */
function updateUserProfile(updates) {
    try {
        const user = getCurrentUser();
        if (!user) {
            return false;
        }

        // Merge updates with existing user data
        const updatedUser = { ...user, ...updates };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        return true;
    } catch (error) {
        console.error("Error updating user profile:", error);
        return false;
    }
}

// Auto-initialize on page load (can be disabled by setting window.noAutoAuth = true)
document.addEventListener('DOMContentLoaded', function() {
    if (!window.noAutoAuth) {
        initAuth();
    }
});
document.getElementById("saveUser").addEventListener("click", () => {

    const fullName = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("phone").value.trim();
    const address = document.getElementById("address")?.value.trim() || "";

    if (!fullName || !email || !mobile) {
        alert("Please fill all fields!");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address!");
        return;
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
        alert("Please enter a valid 10-digit mobile number!");
        return;
    }

    // Create user object with all validated information
    const user = {
        fullName,
        email,
        mobile,
        address,
        loggedIn: true,
        loginDate: new Date().toISOString()
    };

    // Use shared auth system with redirect support
    try {
        localStorage.setItem("user", JSON.stringify(user));
        alert("Login successful!");

        // Check for redirect after login
        const redirectPage = localStorage.getItem("redirectAfterLogin");
        if (redirectPage) {
            localStorage.removeItem("redirectAfterLogin");
            window.location.href = redirectPage;
        } else {
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("Login failed. Please try again.");
    }
});

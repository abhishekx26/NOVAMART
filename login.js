// Configure API base URL for different environments
const baseURL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://your-production-api.com/api'; // Update in production

// Create API instance with appropriate base URL
const apiClient = new APIClient(baseURL);

document.getElementById("saveUser").addEventListener("click", async () => {
    const fullName = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();
    const address = document.getElementById("address").value.trim();

    if (!fullName || !email || !phone || !password) {
        alert("Please fill all required fields!");
        return;
    }

    try {
        // Try to login first
        let result = await apiClient.login(email, password);
        
        if (result.success) {
            alert("Login successful!");
            window.location.href = "index.html";
        } else {
            // If login fails, try to register
            if (result.error && result.error.includes('Invalid')) {
                result = await apiClient.register(fullName, email, phone, password);
                
                if (result.success) {
                    alert("Account created and logged in successfully!");
                    window.location.href = "index.html";
                } else {
                    alert(`Registration failed: ${result.error}`);
                }
            } else {
                alert(`Error: ${result.error}`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

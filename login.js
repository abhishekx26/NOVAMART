document.getElementById("saveUser").addEventListener("click", () => {

    const fullName = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("phone").value.trim();
    const address = document.getElementById("address")?.value.trim() || "";

    if (!fullName || !email || !mobile) {
        alert("Please fill all fields!");
        return;
    }

    const user = {
        fullName,
        email,
        mobile,
        address,
        loggedIn: true
    };

    localStorage.setItem("user", JSON.stringify(user));

    alert("Login successful!");
    window.location.href = "index.html";
});

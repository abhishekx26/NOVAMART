// Load cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cartItems");
const totalItems = document.getElementById("totalItems");
const totalAmount = document.getElementById("totalAmount");

function loadCart() {
    cartItems.innerHTML = "";
    let amount = 0;

    cart.forEach((item, index) => {
        amount += Number(item.price);

        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" class="item-image">
                <div class="item-info">
                    <h3>${item.title}</h3>
                    <p>₹${item.price}</p>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });

    totalItems.textContent = cart.length;
    totalAmount.textContent = amount;
}

function removeItem(i) {
    cart.splice(i, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

// ================= PLACE ORDER FROM CART =================
document.getElementById("placeOrder").addEventListener("click", () => {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    cart.forEach(item => {
        orders.push({
            title: item.title,
            price: item.price,
            image: item.image,
            date: new Date().toLocaleDateString()
        });
    });

    localStorage.setItem("orders", JSON.stringify(orders));

    // Clear cart
    localStorage.removeItem("cart");

    alert("Order Placed Successfully!");
    window.location.href = "orders.html";
});

loadCart();

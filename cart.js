// Configure API
const apiClient = new APIClient('http://localhost:5000/api');

const cartItems = document.getElementById("cartItems");
const totalItems = document.getElementById("totalItems");
const totalAmount = document.getElementById("totalAmount");

// Load and display cart
async function loadCart() {
    try {
        const result = await apiClient.getCart();
        
        if (!result.success) {
            cartItems.innerHTML = `<p style="text-align:center; color:red;">Error loading cart: ${result.error}</p>`;
            return;
        }
        
        const cart = result.data;
        cartItems.innerHTML = '';
        let amount = 0;
        
        if (!cart.items || cart.items.length === 0) {
            cartItems.innerHTML = '<p style="text-align:center;">Your cart is empty</p>';
            totalItems.textContent = '0';
            totalAmount.textContent = '0';
            document.getElementById("placeOrder").disabled = true;
            return;
        }
        
        cart.items.forEach((item) => {
            amount += Number(item.price * item.quantity);
            
            cartItems.innerHTML += `
                <div class="cart-item">
                    <img src="${item.productImage || 'product_images/default.png'}" class="item-image" alt="${item.productTitle}">
                    <div class="item-info">
                        <h3>${item.productTitle}</h3>
                        <p>₹${item.price} x ${item.quantity}</p>
                        <p style="font-size: 0.9em; color: #666;">Size: ${item.size || 'N/A'} | Color: ${item.color || 'N/A'}</p>
                    </div>
                    <button class="remove-btn" onclick="removeItem('${item.productId}')">Remove</button>
                </div>
            `;
        });
        
        totalItems.textContent = cart.items.length;
        totalAmount.textContent = amount;
        document.getElementById("placeOrder").disabled = false;
        
    } catch (error) {
        console.error('Error loading cart:', error);
        cartItems.innerHTML = `<p style="text-align:center; color:red;">Error loading cart. Make sure backend is running!</p>`;
    }
}

// Remove item from cart
async function removeItem(productId) {
    try {
        const result = await apiClient.removeFromCart(productId);
        
        if (result.success) {
            alert("Item removed from cart!");
            loadCart();
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        alert("Error removing item: " + error.message);
    }
}

// Place order
document.getElementById("placeOrder")?.addEventListener("click", async () => {
    try {
        const result = await apiClient.placeOrder(
            "Standard", // shippingMethod
            "Credit Card" // paymentMethod
        );
        
        if (result.success) {
            alert("Order Placed Successfully!");
            window.location.href = "orders.html";
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        alert("Error placing order: " + error.message);
    }
});

// Load cart when page loads
document.addEventListener('DOMContentLoaded', loadCart);

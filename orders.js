// Configure API
const apiClient = new APIClient('http://localhost:5000/api');

const ordersList = document.getElementById("ordersList");

// Load and display orders
async function loadOrders() {
    try {
        const result = await apiClient.getOrders();
        
        if (!result.success) {
            ordersList.innerHTML = `<p style="text-align:center; color:red;">Error loading orders: ${result.error}</p>`;
            return;
        }
        
        const orders = result.data.orders;
        
        if (!orders || orders.length === 0) {
            ordersList.innerHTML = `<p style="text-align:center; font-size:20px;">No orders placed yet.</p>`;
            return;
        }
        
        // Render orders
        orders.forEach((order) => {
            const div = document.createElement("div");
            div.classList.add("order-card");
            
            // Get first item image from order
            const itemImage = order.items && order.items.length > 0 
                ? order.items[0].image || 'product_images/default.png'
                : 'product_images/default.png';
            
            const orderDate = new Date(order.createdAt).toLocaleDateString();
            
            div.innerHTML = `
                <img src="${itemImage}" alt="Order item">
                
                <div class="order-details">
                    <h3>Order #${order._id.substring(0, 8)}</h3>
                    <p><b>Items:</b> ${order.items.length} item(s)</p>
                    <p><b>Total:</b> ₹${order.totalPrice}</p>
                    <p><b>Status:</b> ${order.orderStatus}</p>
                    <p><b>Ordered on:</b> ${orderDate}</p>
                </div>
                
                <button class="cancel-btn" onclick="cancelOrder('${order._id}')">Cancel Order</button>
            `;
            
            ordersList.appendChild(div);
        });
        
    } catch (error) {
        console.error('Error loading orders:', error);
        ordersList.innerHTML = `<p style="text-align:center; color:red;">Error loading orders. Make sure backend is running!</p>`;
    }
}

// Cancel order
async function cancelOrder(orderId) {
    if (confirm("Are you sure you want to cancel this order?")) {
        try {
            const result = await apiClient.cancelOrder(orderId, "Customer requested cancellation");
            
            if (result.success) {
                alert("Order cancelled successfully!");
                loadOrders();
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            alert("Error cancelling order: " + error.message);
        }
    }
}

// Load orders when page loads
document.addEventListener('DOMContentLoaded', loadOrders);


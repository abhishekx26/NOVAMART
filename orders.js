//--------------------------------------------------
// LOAD ALL ORDERS (Buy Now + Cart Orders)
//--------------------------------------------------
let orders = JSON.parse(localStorage.getItem("orders")) || [];

const ordersList = document.getElementById("ordersList");

// If no orders
if (orders.length === 0) {
    ordersList.innerHTML = `<p style="text-align:center; font-size:20px;">No orders placed yet.</p>`;
}

// Render orders
orders.forEach((order, index) => {
    const div = document.createElement("div");
    div.classList.add("order-card");

    div.innerHTML = `
        <img src="${order.image}" alt="">
        
        <div class="order-details">
            <h3>${order.title}</h3>

            <p><b>Price:</b> ₹${order.price}</p>
            <p><b>Ordered on:</b> ${order.date}</p>
        </div>

        <button class="button btn-cancel" onclick="cancelOrder(${index})"></button>
    `;

    ordersList.appendChild(div);
});

//--------------------------------------------------
// CANCEL ORDER
//--------------------------------------------------
function cancelOrder(index) {
    if (confirm("Are you sure you want to cancel this order?")) {

        orders.splice(index, 1);

        localStorage.setItem("orders", JSON.stringify(orders));
        location.reload();
    }
}


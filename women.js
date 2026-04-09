// Configure API
const apiClient = new APIClient('http://localhost:5000/api');

// Load and display women's products
async function loadWomenProducts() {
    try {
        const result = await apiClient.getProductsByCategory('womens', 1, 100);
        
        if (result.success) {
            const products = result.data.products;
            const container = document.getElementById("womenContainer");
            container.innerHTML = '';
            
            products.forEach(p => {
                const div = document.createElement("div");
                div.classList.add("product-card");
                
                div.innerHTML = `
                    <img src="${p.images[0] || 'product_images/default.png'}" alt="${p.title}">
                    <h3 class="title">${p.title}</h3>
                    <p class="brand">${p.brand}</p>
                    <p class="price">₹${p.price} 
                        <span class="mrp">₹${p.mrp}</span>
                    </p>
                    <p class="discount">${p.discount}</p>
                `;
                
                div.addEventListener("click", () => {
                    window.location.href = `product.html?id=${p._id}`;
                });
                
                container.appendChild(div);
            });
        } else {
            document.getElementById("womenContainer").innerHTML = `<p style="text-align:center; color:red;">Failed to load products: ${result.error}</p>`;
        }
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById("womenContainer").innerHTML = `<p style="text-align:center; color:red;">Error loading products. Make sure backend is running!</p>`;
    }
}

// Load products when page loads
document.addEventListener('DOMContentLoaded', loadWomenProducts);

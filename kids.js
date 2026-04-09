// Configure API
const apiClient = new APIClient('http://localhost:5000/api');

// Load and display kids products
async function loadKidsProducts() {
    try {
        const result = await apiClient.getProductsByCategory('kids', 1, 100);
        
        if (result.success) {
            const products = result.data.products;
            const kidsContainer = document.getElementById("kidsProducts");
            kidsContainer.innerHTML = '';
            
            products.forEach(item => {
                const card = document.createElement("div");
                card.className = "product-card";
                card.innerHTML = `
                    <a href="product.html?id=${item._id}">
                        <img src="${item.images[0] || 'product_images/default.png'}" alt="${item.title}">
                    </a>
                    <p class="product-title">${item.title}</p>
                    <p class="product-brand">${item.brand}</p>
                    <p class="product-price">₹${item.price}</p>
                `;
                kidsContainer.appendChild(card);
            });
        } else {
            document.getElementById("kidsProducts").innerHTML = `<p style="text-align:center; color:red;">Failed to load products: ${result.error}</p>`;
        }
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById("kidsProducts").innerHTML = `<p style="text-align:center; color:red;">Error loading products. Make sure backend is running!</p>`;
    }
}

// Load products when page loads
document.addEventListener('DOMContentLoaded', loadKidsProducts);

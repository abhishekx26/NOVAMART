// Configure API
const apiClient = new APIClient('http://localhost:5000/api');

// Load and display men's products
async function loadMensProducts() {
    try {
        const result = await apiClient.getProductsByCategory('mens', 1, 100);
        
        if (result.success) {
            const products = result.data.products;
            const container = document.getElementById("menProducts");
            container.innerHTML = '';
            
            products.forEach(p => {
                const productHTML = `
                    <div class="card">
                        <a href="product.html?id=${p._id}">
                            <img src="${p.images[0] || 'product_images/default.png'}" alt="${p.title}">
                        </a>
                        <h3>${p.title}</h3>
                        <p class="price">₹${p.price} <span class="mrp">₹${p.mrp}</span> <span class="discount">${p.discount}</span></p>
                        <p class="rating">⭐ ${p.rating} (${p.ratingCount})</p>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', productHTML);
            });
        } else {
            document.getElementById("menProducts").innerHTML = `<p style="text-align:center; color:red;">Failed to load products: ${result.error}</p>`;
        }
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById("menProducts").innerHTML = `<p style="text-align:center; color:red;">Error loading products. Make sure backend is running!</p>`;
    }
}

// Load products when page loads
document.addEventListener('DOMContentLoaded', loadMensProducts);
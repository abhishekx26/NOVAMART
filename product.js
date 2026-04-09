// Configure API
const apiClient = new APIClient('http://localhost:5000/api');

// Load and display product details
async function loadProductDetails() {
    try {
        // Get product ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get("id");
        
        if (!productId) {
            throw new Error("No product ID provided in URL");
        }
        
        // Fetch product from API
        const result = await apiClient.getProduct(productId);
        
        if (!result.success) {
            throw new Error(result.error || "Product not found");
        }
        
        const product = result.data;
        
        // Display product information
        document.getElementById("productTitle").textContent = product.title;
        document.getElementById("productBrand").textContent = product.brand;
        document.getElementById("productPrice").textContent = "₹" + product.price;
        document.getElementById("productMRP").textContent = "₹" + product.mrp;
        document.getElementById("productDiscount").textContent = product.discount;
        document.getElementById("productRating").textContent = product.rating;
        document.getElementById("ratingCount").textContent = product.ratingCount;
        
        const mainImage = document.getElementById("mainImage");
        mainImage.src = product.images[0] || 'product_images/default.png';
        
        // Setup image thumbnails
        const thumbBox = document.getElementById("thumbnails");
        thumbBox.innerHTML = '';
        
        product.images.forEach((imgSrc, index) => {
            const img = document.createElement("img");
            img.src = imgSrc;
            img.classList.add("thumb");
            
            if (index === 0) img.classList.add("thumb-active");
            
            img.addEventListener("click", () => {
                mainImage.src = imgSrc;
                document.querySelectorAll(".thumb")
                    .forEach(t => t.classList.remove("thumb-active"));
                img.classList.add("thumb-active");
            });
            
            thumbBox.appendChild(img);
        });
        
        // Setup color selector
        const colorBox = document.getElementById("colorBox");
        colorBox.innerHTML = '';
        
        product.colors.forEach((clr, index) => {
            const img = document.createElement("img");
            img.src = clr;
            img.classList.add("color");
            
            if (index === 0) img.classList.add("color-active");
            
            img.addEventListener("click", () => {
                mainImage.src = clr;
                document.querySelectorAll(".color")
                    .forEach(c => c.classList.remove("color-active"));
                img.classList.add("color-active");
            });
            
            colorBox.appendChild(img);
        });
        
        // Add to cart button handler
        document.getElementById("btnCart").addEventListener("click", async () => {
            try {
                const addResult = await apiClient.addToCart(productId, 1);
                if (addResult.success) {
                    alert("🛒 Added to Cart!");
                } else {
                    alert("Error: " + addResult.error);
                }
            } catch (error) {
                alert("Error adding to cart: " + error.message);
            }
        });
        
        // Buy now button handler
        document.getElementById("btnBuy").addEventListener("click", async () => {
            try {
                // Add to cart first
                const addResult = await apiClient.addToCart(productId, 1);
                if (addResult.success) {
                    // Redirect to checkout/orders
                    window.location.href = "cart.html";
                } else {
                    alert("Error: " + addResult.error);
                }
            } catch (error) {
                alert("Error: " + error.message);
            }
        });
        
    } catch (error) {
        console.error('Error loading product:', error);
        document.getElementById("productTitle").textContent = "Product not found!";
        document.getElementById("productBrand").textContent = error.message;
    }
}

// Load product when page loads
document.addEventListener('DOMContentLoaded', loadProductDetails);
        brand: "VILLATA FASHION",
        price: 275,
        mrp: 1699,
        discount: "64% OFF",
        rating: "4.2",
        ratingCount: "1156",
        images: [
            "product_images/item31.png",
            "product_images/item31.1.png",
            "product_images/item31.2.png",
            "product_images/item31.3.png"
        ],
        colors: [
            "product_images/item31.1.png",
            "product_images/item31.2.png"
        ]
    },
    {
        id: 32,
        title: "Girls Above Knee Party Dress  (Pink, Half Sleeve)",
        brand: "MT SAHIN DRESSES",
        price: 224,
        mrp: 2499,
        discount: "78% OFF",
        rating: "4.5",
        ratingCount: "12,120",
        images: [
            "product_images/item32.png",
            "product_images/item32.1.png",
            "product_images/item32.2.png",
            "product_images/item32.3.png"
        ],
        colors: [
            "product_images/item32.1.png",
            "product_images/item32.2.png",
        ]
    },
    {
        id: 33,
        title: "Girls Maxi/Full Length Festive/Wedding Dress  (Green, Short Sleeve)",
        brand: "TIOR",
        price: 463,
        mrp: 1325,
        discount: "56% OFF",
        rating: "4.2",
        ratingCount: "120",
        images: [
            "product_images/item33.png",
            "product_images/item33.1.png",
            "product_images/item33.2.png",
            "product_images/item33.3.png"
        ],
        colors: [
            "product_images/item33.1.png",
            "product_images/item33.2.png",
        ]
    },
    {
        id: 34,
        title: "Top - Pyjama Set Thermal For Baby Boys  (Multicolor, Pack of 3)",
        brand: "PARYAG",
        price: 558,
        mrp: 2499,
        discount: "60% OFF",
        rating: "4.5",
        ratingCount: "8,120",
        images: [
            "product_images/item34.png",
            "product_images/item34.1.png",
            "product_images/item34.2.png",
            "product_images/item34.3.png"
        ],
        colors: [
            "product_images/item34.png",
            "product_images/item34.1.png",
        ]
    },
    {
        id: 35,
        title: "Boys & Girls Casual Sweatshirt Track Pants  (Beige)",
        brand: "URBAN OX",
        price: 799,
        mrp: 2499,
        discount: "720% OFF",
        rating: "4.6",
        ratingCount: "8,120",
        images: [
            "product_images/item35.png",
            "product_images/item35.1.png",
            "product_images/item35.2.png",
            "product_images/item35.3.png"
        ],
        colors: [
            "product_images/item35.2.png",
            "product_images/item35.3.png"
        ]
    },
    {
        id: 36,
        title: "Baby Boys & Baby Girls Casual T-shirt Pant  (Light Green)Men's Denim Jacket",
        brand: "ARIEL",
        price: 355,
        mrp: 1289,
        discount: "43% OFF",
        rating: "4.5",
        ratingCount: "8,120",
        images: [
            "product_images/item36.png",
            "product_images/item36.1.png",
            "product_images/item36.2.png",
            "product_images/item36.3.png"
        ],
        colors: [
            "product_images/item36.2.png",
            "product_images/item36.3.png"
        ]
    },
    
];


const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get("id"));
const product = products.find(p => p.id === productId);
if (!product) {
    alert("Product not found!");
    throw new Error("Invalid product ID in URL");
}

document.getElementById("productTitle").textContent = product.title;
document.getElementById("productBrand").textContent = product.brand;
document.getElementById("productPrice").textContent = "₹" + product.price;
document.getElementById("productMRP").textContent = "₹" + product.mrp;
document.getElementById("productDiscount").textContent = product.discount;
document.getElementById("productRating").textContent = product.rating;
document.getElementById("ratingCount").textContent = product.ratingCount;

const mainImage = document.getElementById("mainImage");
mainImage.src = product.images[0];

const thumbBox = document.getElementById("thumbnails");
thumbBox.innerHTML = ""; 

product.images.forEach((imgSrc, index) => {

    const img = document.createElement("img");
    img.src = imgSrc;
    img.classList.add("thumb");

    if (index === 0) img.classList.add("thumb-active");

    img.addEventListener("click", () => {
        mainImage.src = imgSrc;

        document.querySelectorAll(".thumb")
            .forEach(t => t.classList.remove("thumb-active"));

        img.classList.add("thumb-active");
    });

    thumbBox.appendChild(img);
});


const colorBox = document.getElementById("colorBox");
colorBox.innerHTML = "";

product.colors.forEach((clr, index) => {
    const img = document.createElement("img");
    img.src = clr;
    img.classList.add("color");

    if (index === 0) img.classList.add("color-active");

    img.addEventListener("click", () => {
        mainImage.src = clr;

        document.querySelectorAll(".color")
            .forEach(c => c.classList.remove("color-active"));

        img.classList.add("color-active");
    });

    colorBox.appendChild(img);
});

document.getElementById("btnCart").addEventListener("click", () => {
    alert(product.title + " added to cart!");
});

document.getElementById("btnBuy").addEventListener("click", () => {
    
    const order = {
        name: product.title,
        price: product.price,
        image: product.images[0],
        status: "Order Placed",
        date: new Date().toLocaleDateString()
    };

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    alert("Order Placed Successfully!");
    window.location.href = "orders.html";
});


/* ------------------ ADD TO CART SYSTEM ------------------ */

// Load existing cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add CURRENT product to cart
document.getElementById("btnCart").addEventListener("click", () => {

    const cartItem = {
        id: productId,                 // from URL
        title: product.title,
        price: product.price,
        image: product.images[0]       // first image
    };

    cart.push(cartItem);

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("🛒 Added to Cart!");
});




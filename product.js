const products = [
    {
        id: 1,
        title: "Men's Black Shirt",
        brand: "MONTREZ",
        price: 799,
        mrp: 1999,
        discount: "75% OFF",
        rating: "4.2",
        ratingCount: "12,352",
        images: [
            "product_images/item1.png",
            "product_images/item1.1.png",
            "product_images/item1.2.png",
            "product_images/item1.3.png"
        ],
        colors: [
            "product_images/item1.png",
            "product_images/item1.1.png",
            "product_images/item1.2.png"
        ]
    },
    {
        id: 2,
        title: "Men Solid Round Neck Pure Cotton Dark Green T-Shirt",
        brand: "WIERDO",
        price: 379,
        mrp: 1099,
        discount: "65% OFF",
        rating: "4.3",
        ratingCount: "600",
        images: [
          "product_images/item2.png",
            "product_images/item2.1.png",
            "product_images/item2.2.png",
            "product_images/item2.3.png"
        ],
        colors: [
            "product_images/item2.1.png",
            "product_images/item2.1.png"
        ]
    },
    {
        id: 3,
        title: "Men Slim Fit Solid Mandarin Collar Casual Shirt",
        brand: "FUBAR",
        price: 255,
        mrp: 1200,
        discount: "76% OFF",
        rating: "4.5",
        ratingCount: "5499",
        images: [
          "product_images/item3.png",
            "product_images/item3.1.png",
            "product_images/item3.2.png",
            "product_images/item3.3.png"
        ],
        colors: [
            "product_images/item3.1.png",
            "product_images/item3.2.png"
        ]
    },
    {
        id: 4,
        title: "Men Solid Mandarin Collar Cotton Blend Black T-Shirt",
        brand: "TRIPR",
        price: 247,
        mrp: 2499,
        discount: "75% OFF",
        rating: "3.8",
        ratingCount: "1200",
        images: [
          "product_images/item4.png",
            "product_images/item4.1.png",
            "product_images/item4.2.png",
            "product_images/item4.3.png"
        ],
        colors: [
            "product_images/item4.1.png",
            "product_images/item4.2.png"
        ]
    },
    {
        id: 5,
        title: "Men Printed Polo Neck Cotton Blend Beige T-Shirt",
        brand: "JUMP CUTS",
        price: 382,
        mrp: 2499,
        discount: "78% OFF",
        rating: "3.8",
        ratingCount: "87",
        images: [
          "product_images/item5.png",
            "product_images/item5.1.png",
            "product_images/item5.2.png",
            "product_images/item5.3.png"
        ],
        colors: [
            "product_images/item5.png",
            "product_images/item5.2.png"
        ]
    },
    {
        id: 6,
        title: "Men Regular Fit Solid Spread Collar Casual Shirt",
        brand: "BLEZZA",
        price: 299,
        mrp: 1999,
        discount: "78% OFF",
        rating: "3.6",
        ratingCount: "12",
        images: [
            "product_images/item6.png",
            "product_images/item6.1.png",
            "product_images/item6.2.png",
            "product_images/item6.3.png"
        ],
        colors: [
            "product_images/item6.2.png",
            "product_images/item6.3.png"
        ]
    },
    {
        id: 7,
        title: "Men Regular Fit Solid Casual Shirt",
        brand: "BLEZZA",
        price: 319,
        mrp: 1999,
        discount: "84% OFF",
        rating: "4.2",
        ratingCount: "2010",
        images: [
            "product_images/item7.png",
            "product_images/item7.1.png",
            "product_images/item7.2.png",
            "product_images/item7.3.png"
        ],
        colors: [
            "product_images/item7.1.png",
            "product_images/item7.2.png"
        ]
    },
    {
        id: 8,
        title: "Men Full Sleeve Solid Hooded Sweatshirt",
        brand: "BEING WANTED",
        price: 600,
        mrp: 1999,
        discount: "60% OFF",
        rating: "4.5",
        ratingCount: "8,120",
        images: [
            "product_images/item8.png",
            "product_images/item8.1.png",
        ],
        colors: [
            "product_images/item8.png",
            "product_images/item8.1.png"
        ]
    },
    {
        id: 9,
        title: "Men Full Sleeve Solid Hooded Sweatshirt",
        brand: "BEING WANTED",
        price: 600,
        mrp: 1999,
        discount: "60% OFF",
        rating: "4.5",
        ratingCount: "8,120",
        images: [
            "product_images/item9.png",
            "product_images/item9.1.png"
        ],
        colors: [
            "product_images/item9.png",
            "product_images/item9.1.png"
        ]
    },
    {
        id: 10,
        title: "Men Full Sleeve Printed Hooded Sweatshirt",
        brand: "JUMP CUTS",
        price: 432,
        mrp: 1999,
        discount: "78% OFF",
        rating: "4.5",
        ratingCount: "600",
        images: [
            "product_images/item10.png",
            "product_images/item10.1.png",
            "product_images/item10.2.png"
        ],
        colors: [
            "product_images/item10.png",
            "product_images/item10.2.png"
        ]
    },
    {
        id: 11,
        title: "Men Slim Fit Checkered Spread Collar Casual Shirtt",
        brand: "RODIEZ",
        price: 1299,
        mrp: 283,
        discount: "60% OFF",
        rating: "3.9",
        ratingCount: "8,120",
        images: [
            "product_images/item11.png",
            "product_images/item11.1.png",
            "product_images/item11.2.png",
            "product_images/item11.3.png"
            
        ],
        colors: [
            "product_images/item11.png",
            "product_images/item11.1.png",
            "product_images/item11.2.png",
        ]
    },
    {
        id: 12,
        title: "Men Regular Fit Solid Spread Collar Casual Shirt",
        brand: "METRONAUT",
        price: 299,
        mrp: 1500,
        discount: "78% OFF",
        rating: "4.5",
        ratingCount: "42,500",
        images: [
            "product_images/item12.png",
            "product_images/item12.1.png",
            "product_images/item12.2.png",
            "product_images/item12.3.png"
        ],
        colors: [
            "product_images/item12.1.png",
            "product_images/item12.2.png"
        ]
    },
    {
        id: 13,
        title: "Women Printed Crepe Straight Kurta  (Multicolor)",
        brand: "ETHNIC BASKET",
        price: 162,
        mrp: 1500,
        discount: "83% OFF",
        rating: "3.7",
        ratingCount: "21",
        images: [
            "product_images/item13.png",
            "product_images/item13.1.png",
            "product_images/item13.2.png",
            "product_images/item13.3.png"
        ],
        colors: [
            "product_images/item13.png",
            "product_images/item13.1.png",
            "product_images/item13.2.png",
        ]
    },
    {
        id: 14,
        title: "Women Printed Crepe Straight Kurta  (Multicolor)",
        brand: "ETHNIC BASKET",
        price: 162,
        mrp: 1500,
        discount: "83% OFF",
        rating: "3.7",
        ratingCount: "21",
        images: [
            "product_images/item14.png",
            "product_images/item14.1.png",
            "product_images/item14.2.png",
            "product_images/item14.3.png"
        ],
        colors: [
            "product_images/item14.png",
            "product_images/item14.1.png",
            "product_images/item14.2.png",
        ]
    },
    {
        id: 15,
        title: "Women Printed Crepe Straight Kurta  (Multicolor)",
        brand: "ETHNIC BASKET",
        price: 162,
        mrp: 1500,
        discount: "83% OFF",
        rating: "3.7",
        ratingCount: "21",
        images: [
            "product_images/item15.png",
            "product_images/item15.1.png",
            "product_images/item15.2.png",
            "product_images/item15.3.png"
        ],
        colors: [
            "product_images/item15.png",
            "product_images/item15.1.png",
        ]
    },
    {
        id: 16,
        title: "Women Printed Crepe Straight Kurta  (Multicolor)",
        brand: "ETHNIC BASKET",
        price: 162,
        mrp: 1500,
        discount: "83% OFF",
        rating: "3.7",
        ratingCount: "21",
        images: [
            "product_images/item16.png",
            "product_images/item16.1.png",
            "product_images/item16.2.png",
            "product_images/item16.3.png"
        ],
        colors: [
            "product_images/item16.png",
            "product_images/item16.1.png",
        ]
    },
    {
        id: 17,
        title: "Pack of 2 Women Relaxed Pink, Maroon Viscose Rayon Trousers",
        brand: "GURARA FASHION",
        price: 334,
        mrp: 699,
        discount: "52% OFF",
        rating: "3.8",
        ratingCount: "119",
        images: [
            "product_images/item17.png",
            "product_images/item17.1.png",
            "product_images/item17.2.png",
            "product_images/item17.3.png"
        ],
        colors: [
            "product_images/item17.1.png",
            "product_images/item17.2.png",
        ]
    },
    {
        id: 18,
        title: "Women Regular Fit Black Viscose Rayon Trousers",
        brand: "GO GAZHAB",
        price: 327,
        mrp: 1200,
        discount: "74% OFF",
        rating: "4.5",
        ratingCount: "3458",
        images: [
            "product_images/item18.png",
            "product_images/item18.1.png",
            "product_images/item18.2.png",
            "product_images/item18.3.png"
        ],
        colors: [
            "product_images/item18.1.png",
            "product_images/item18.2.png",
        ]
    },
    {
        id: 19,
        title: "Embellished Bollywood Tissue, Pure Silk Saree  (Gold)",
        brand: "BRAHMSHAKTI",
        price: 471,
        mrp: 2548,
        discount: "69% OFF",
        rating: "4.1",
        ratingCount: "9999",
        images: [
            "product_images/item19.png",
            "product_images/item19.1.png",
            "product_images/item19.2.png",
            "product_images/item19.3.png"
        ],
        colors: [
            "product_images/item19.1.png",
            "product_images/item19.2.png",
        ]
    },
    {
        id: 20,
        title: "Embroidered Bollywood Tissue Saree  (Green)",
        brand: "KOSKI",
        price: 2392,
        mrp: 4999,
        discount: "45% OFF",
        rating: "4.5",
        ratingCount: "400",
        images: [
            "product_images/item20.png",
        ],
        colors: [
            "product_images/item20.png",
        ]
    },
    {
        id: 21,
        title: "Solid/Plain, Embroidered Bollywood Chiffon Saree  (Maroon)",
        brand: "LABHESHWARI",
        price: 471,
        mrp: 1549,
        discount: "50% OFF",
        rating: "3.8",
        ratingCount: "666",
        images: [
            "product_images/item21.png",
            "product_images/item21.1.png",
            "product_images/item21.2.png",
            "product_images/item21.3.png"
        ],
        colors: [
            "product_images/item21.png",
            "product_images/item21.1.png"
        ]
    },
    {
        id: 22,
        title: "Women Self Design High Neck Black Sweater",
        brand: "BLACK BLINK",
        price: 330,
        mrp: 1699,
        discount: "63% OFF",
        rating: "3.9",
        ratingCount: "436",
        images: [
            "product_images/item22.png",
            "product_images/item22.1.png",
            "product_images/item22.2.png",
            "product_images/item22.3.png"
        ],
        colors: [
            "product_images/item22.2.png",
            "product_images/item22.3.png"
        ]
    },
    {
        id: 23,
        title: "Women Solid Casual Jacket",
        brand: "VERO AMORE",
        price: 861,
        mrp: 2458,
        discount: "63% OFF",
        rating: "4.1",
        ratingCount: "845",
        images: [
            "product_images/item23.png",
            "product_images/item23.1.png",
            "product_images/item23.2.png",
            "product_images/item23.3.png"
        ],
        colors: [
            "product_images/item23.1.png",
            "product_images/item23.2.png",
        ]
    },
    {
        id: 24,
        title: "Women Full Sleeve Printed Sweatshirt",
        brand: "REQUIN",
        price: 1486,
        mrp: 2499,
        discount: "24% OFF",
        rating: "4.2",
        ratingCount: "7,412",
        images: [
            "product_images/item24.png",
            "product_images/item24.1.png",
            "product_images/item24.2.png",
            "product_images/item24.3.png"
        ],
        colors: [
            "product_images/item24.1.png",
            "product_images/item24.2.png",
        ]
    },
    {
        id: 25,
        title: "Boys Casual T-shirt Track Pants  (Yellow)",
        brand: "ICEPIE",
        price: 322,
        mrp: 1500,
        discount: "55% OFF",
        rating: "4.2",
        ratingCount: "3022",
        images: [
            "product_images/item25.png",
            "product_images/item25.1.png",
            "product_images/item25.2.png",
            "product_images/item25.3.png"
        ],
        colors: [
            "product_images/item25.png",
            "product_images/item25.1.png",
        ]
    },
    {
        id: 26,
        title: "Baby Boys & Baby Girls Casual T-shirt Track Pants  (GREEN)",
        brand: "ELPIXIE FASHION",
        price: 269,
        mrp: 2499,
        discount: "73% OFF",
        rating: "4.5",
        ratingCount: "12,120",
        images: [
            "product_images/item26.png",
            "product_images/item26.1.png",
            "product_images/item26.2.png",
            "product_images/item26.3.png"
        ],
        colors: [
            "product_images/item26.1.png",
            "product_images/item26.2.png",
        ]
    },
    {
        id: 27,
        title: "Baby Boys Casual T-shirt Shorts  (Light Blue, Purple, Yellow)",
        brand: "MARS INFINTY",
        price: 414,
        mrp: 2499,
        discount: "79% OFF",
        rating: "4.4",
        ratingCount: "2300",
        images: [
            "product_images/item27.png",
            "product_images/item27.1.png",
            "product_images/item27.2.png",
            "product_images/item27.3.png"
        ],
        colors: [
            "product_images/item27.1.png",
            "product_images/item27.2.png",
        ]
    },
    {
        id: 28,
        title: "Baby Boys & Baby Girls Casual Shirt Shorts  (ROYALTAJ_CHIKU-BLUE)",
        brand: "KILLER",
        price: 369,
        mrp: 1452,
        discount: "52% OFF",
        rating: "4.1",
        ratingCount: "4,156",
        images: [
            "product_images/item28.png",
            "product_images/item28.1.png",
            "product_images/item28.2.png",
            "product_images/item28.3.png"
        ],
        colors: [
            "product_images/item28.png",
            "product_images/item28.1.png",
        ]
    },
    {
        id: 29,
        title: "Baby Boys & Baby Girls Casual Shirt Shorts  (ROYALTAJ_SKY-CHIKU)",
        brand: "KILLER",
        price: 369,
        mrp: 2499,
        discount: "60% OFF",
        rating: "4.6",
        ratingCount: "7255",
        images: [
            "product_images/item29.png",
            "product_images/item29.1.png",
            "product_images/item29.2.png",
            "product_images/item29.3.png"
        ],
        colors: [
            "product_images/item29.1.png",
            "product_images/item29.2.png",
        ]
    },
    {
        id: 30,
        title: "Barbie Girls Calf Length Party Dress  (Green, 3/4 Sleeve)",
        brand: "RISWA",
        price: 472,
        mrp: 1689,
        discount: "42% OFF",
        rating: "4.1",
        ratingCount: "8,120",
        images: [
            "product_images/item30.png",
            "product_images/item30.1.png",
            "product_images/item30.2.png",
            "product_images/item30.3.png"
        ],
        colors: [
            "product_images/item30.1.png",
            "product_images/item30.2.png",
        ]
    },
    {
        id: 31,
        title: "Girls Below Knee Party Dress  (Pink, 3/4 Sleeve)",
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




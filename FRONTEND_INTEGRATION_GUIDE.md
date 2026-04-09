# Frontend Integration Guide

This guide explains how to integrate the NOVAMART backend API into your frontend HTML pages using the `js/api-client.js` utility.

## 🔄 Before You Start

- Backend server must be running on `http://localhost:5000`
- Frontend will run on `http://localhost:3000` (or Vercel in production)
- All HTML files remain unchanged
- Only JavaScript files change to use API instead of localStorage

---

## 📝 How to Update JavaScript Files

### Step 1: Include API Client in HTML

Add this line in the `<head>` or before your custom scripts:

```html
<script src="js/api-client.js"></script>
```

### Step 2: Replace localStorage with API calls

---

## 🔐 Authentication (login.js)

**OLD CODE (localStorage-based):**
```javascript
function handleLogin(event) {
  event.preventDefault();
  
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  
  // Store in localStorage
  const user = { fullName, email, phone, loggedIn: true };
  localStorage.setItem('user', JSON.stringify(user));
  
  // Redirect
  window.location.href = 'index.html';
}
```

**NEW CODE (API-based):**
```javascript
async function handleLogin(event) {
  event.preventDefault();
  
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
  
  // Call API
  const result = await api.login(email, password);
  
  if (result.success) {
    console.log('Login successful!');
    // Token is automatically saved by api-client
    window.location.href = 'index.html';
  } else {
    alert(`Login failed: ${result.error}`);
  }
}

async function handleRegister(event) {
  event.preventDefault();
  
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
  
  // Call API
  const result = await api.register(fullName, email, phone, password);
  
  if (result.success) {
    alert('Registration successful! Redirecting...');
    window.location.href = 'profile.html';
  } else {
    alert(`Registration failed: ${result.error}`);
  }
}
```

---

## 📦 Products (product.js)

**OLD CODE (hardcoded array):**
```javascript
const products = [
  { id: 1, title: "Men's Black Shirt", price: 799, ... },
  { id: 2, title: "Men Solid Round Neck...", price: 379, ... },
  // ... more products
];

function getProductById(id) {
  return products.find(p => p.id === id);
}
```

**NEW CODE (API-based):**
```javascript
async function displayProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  // Fetch from API
  const result = await api.getProduct(productId);
  
  if (result.success) {
    const product = result.data;
    // Display product details
    document.querySelector('.product-title').textContent = product.title;
    document.querySelector('.product-price').textContent = `₹${product.price}`;
    // ... update other fields
  } else {
    alert('Failed to load product');
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', displayProductDetails);
```

---

## 👕 Categories (mens.js, womens.js, kids.js)

**OLD CODE (hardcoded arrays):**
```javascript
const mensProducts = [
  { id: 1, title: "...", price: 799, ... },
  // ... hardcoded products
];

function displayProducts() {
  const container = document.getElementById('products-container');
  mensProducts.forEach(product => {
    const html = `<div class="product-card">...</div>`;
    container.insertAdjacentHTML('beforeend', html);
  });
}
```

**NEW CODE (API-based):**
```javascript
async function displayProducts() {
  const category = 'mens'; // or 'womens', 'kids'
  
  // Fetch from API
  const result = await api.getProductsByCategory(category);
  
  if (result.success) {
    const products = result.data.products;
    const container = document.getElementById('products-container');
    
    products.forEach(product => {
      const html = `
        <div class="product-card">
          <img src="${product.images[0]}" alt="${product.title}">
          <p class="product-title">${product.title}</p>
          <p class="product-price">₹${product.price}</p>
          <p class="product-rating">${product.rating} ⭐</p>
          <button onclick="addToCart('${product._id}', 1)">Add to Cart</button>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', html);
    });
  } else {
    alert('Failed to load products');
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', displayProducts);
```

---

## 🛒 Shopping Cart (cart.js)

**OLD CODE (localStorage):**
```javascript
function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

function addToCart(productId, quantity) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
}

function displayCart() {
  const cart = getCart();
  const container = document.getElementById('cart-items');
  
  cart.forEach(item => {
    const product = getProductById(item.id);
    const html = `<div class="cart-item">...</div>`;
    container.insertAdjacentHTML('beforeend', html);
  });
}
```

**NEW CODE (API-based):**
```javascript
async function addToCart(productId, quantity, size = null, color = null) {
  const result = await api.addToCart(productId, quantity, size, color);
  
  if (result.success) {
    alert('Item added to cart!');
    displayCart(); // Refresh cart display
  } else {
    alert(`Failed to add to cart: ${result.error}`);
  }
}

async function displayCart() {
  // Fetch cart from API
  const result = await api.getCart();
  
  if (result.success) {
    const cart = result.data;
    const container = document.getElementById('cart-items');
    container.innerHTML = '';
    
    let totalPrice = 0;
    
    cart.items.forEach(item => {
      const product = item.productId;
      totalPrice += product.price * item.quantity;
      
      const html = `
        <div class="cart-item">
          <img src="${product.images[0]}" alt="${product.title}">
          <p>${product.title}</p>
          <p>₹${product.price}</p>
          <input type="number" value="${item.quantity}" 
                 onchange="updateCartItem('${item._id}', this.value)">
          <button onclick="removeFromCart('${item._id}')">Remove</button>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', html);
    });
    
    document.getElementById('total').textContent = `₹${totalPrice}`;
  } else {
    alert('Failed to load cart');
  }
}

async function updateCartItem(itemId, quantity) {
  const result = await api.updateCartItem(itemId, parseInt(quantity));
  if (result.success) {
    displayCart();
  }
}

async function removeFromCart(itemId) {
  const result = await api.removeFromCart(itemId);
  if (result.success) {
    displayCart();
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', displayCart);
```

---

## 📋 Orders (orders.js)

**OLD CODE (localStorage):**
```javascript
function getOrders() {
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : [];
}

function displayOrders() {
  const orders = getOrders();
  const container = document.getElementById('orders-container');
  
  orders.forEach(order => {
    const html = `<div class="order-card">...</div>`;
    container.insertAdjacentHTML('beforeend', html);
  });
}
```

**NEW CODE (API-based):**
```javascript
async function displayOrders() {
  // Fetch orders from API
  const result = await api.getOrders();
  
  if (result.success) {
    const orders = result.data;
    const container = document.getElementById('orders-container');
    container.innerHTML = '';
    
    if (orders.length === 0) {
      container.innerHTML = '<p>No orders yet</p>';
      return;
    }
    
    orders.forEach(order => {
      const html = `
        <div class="order-card">
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Status:</strong> ${order.orderStatus}</p>
          <p><strong>Total:</strong> ₹${order.totalPrice}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <button onclick="cancelOrder('${order._id}')">Cancel Order</button>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', html);
    });
  } else {
    alert('Failed to load orders');
  }
}

async function cancelOrder(orderId) {
  if (confirm('Are you sure you want to cancel this order?')) {
    const result = await api.cancelOrder(orderId, 'User cancelled');
    if (result.success) {
      alert('Order cancelled successfully');
      displayOrders();
    } else {
      alert(`Failed to cancel order: ${result.error}`);
    }
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', displayOrders);
```

---

## 👤 Profile (profile.js)

**OLD CODE (localStorage):**
```javascript
function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function displayProfile() {
  const user = getUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  
  document.getElementById('fullName').textContent = user.fullName;
  document.getElementById('email').textContent = user.email;
  document.getElementById('phone').textContent = user.phone;
}

function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
  localStorage.removeItem('orders');
  window.location.href = 'index.html';
}
```

**NEW CODE (API-based):**
```javascript
async function displayProfile() {
  // Check if user is authenticated
  if (!api.isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }
  
  // Fetch user data from API
  const result = await api.getCurrentUser();
  
  if (result.success) {
    const user = result.data.user;
    document.getElementById('fullName').textContent = user.fullName;
    document.getElementById('email').textContent = user.email;
    document.getElementById('phone').textContent = user.phone;
  } else {
    alert('Failed to load profile');
    window.location.href = 'login.html';
  }
}

async function logout() {
  await api.logout();
  api.clearAllData();
  window.location.href = 'index.html';
}

// Call on page load
document.addEventListener('DOMContentLoaded', displayProfile);
```

---

## 🔄 Search Products

```javascript
async function searchProducts(query) {
  const result = await api.searchProducts(query);
  
  if (result.success) {
    const products = result.data.products;
    // Display search results
    displayProductsOnPage(products);
  }
}

// Example: search on form submit
document.getElementById('searchForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const query = document.getElementById('searchInput').value;
  searchProducts(query);
});
```

---

## 💳 Checkout & Payment

```javascript
async function placeOrder() {
  const shippingAddress = {
    fullName: document.getElementById('fullName').value,
    street: document.getElementById('street').value,
    city: document.getElementById('city').value,
    state: document.getElementById('state').value,
    pincode: document.getElementById('pincode').value,
    country: 'India',
    phone: document.getElementById('phone').value,
  };
  
  // Place order
  const orderResult = await api.placeOrder(shippingAddress);
  
  if (orderResult.success) {
    const orderId = orderResult.data.order._id;
    
    // Create payment intent
    const paymentResult = await api.createPaymentIntent(orderId);
    
    if (paymentResult.success) {
      // Integrate Stripe (see Stripe docs)
      // stripe.confirmCardPayment(clientSecret, ...)
      alert('Order placed, proceed to payment');
    }
  }
}
```

---

## 🔍 Filtering Products

```javascript
async function filterProducts() {
  const category = document.getElementById('category').value;
  const minPrice = document.getElementById('minPrice').value;
  const maxPrice = document.getElementById('maxPrice').value;
  const sort = document.getElementById('sort').value;
  
  const result = await api.getProducts(category, minPrice, maxPrice, sort);
  
  if (result.success) {
    displayProductsOnPage(result.data.products);
  }
}
```

---

## 🔐 Protected Routes

Redirect unauthenticated users:

```javascript
function checkAuth() {
  if (!api.isAuthenticated()) {
    window.location.href = 'login.html';
  }
}

// On protected pages like cart.html, profile.html
document.addEventListener('DOMContentLoaded', checkAuth);
```

---

## ✅ Summary

1. Include `js/api-client.js` in all HTML files
2. Replace all `localStorage` calls with `api.*` methods
3. Use `async/await` for API calls
4. Handle success/error responses properly
5. Test with backend running on `http://localhost:5000`

---

## 📞 Common Issues

### "api is not defined"
- Ensure `<script src="js/api-client.js"></script>` is loaded before your custom script

### CORS Error
- Backend must allow frontend origin in `.env` (`FRONTEND_URL`)
- Check CORS middleware in `server.js`

### 401 Unauthorized
- Token might be expired or invalid
- User needs to login again
- Check localStorage for token: `localStorage.getItem('token')`

### Network Failed
- Backend not running
- Wrong API_BASE_URL in `api-client.js`
- Check server is running: `npm run dev`

---

**You're all set!** Start integrating and testing 🚀

// ========================================
// NOVAMART SHARED STORAGE UTILITIES
// ========================================

/**
 * Safely get data from localStorage with error handling
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist or error occurs
 * @returns {any} - Parsed data or default value
 */
function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage (${key}):`, error);
        return defaultValue;
    }
}

/**
 * Safely save data to localStorage with error handling
 * @param {string} key - Storage key
 * @param {any} data - Data to save
 * @returns {boolean} - Success status
 */
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(`Error saving to localStorage (${key}):`, error);
        return false;
    }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} - Success status
 */
function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing from localStorage (${key}):`, error);
        return false;
    }
}

/**
 * Clear all localStorage data
 * @param {string[]} keysToKeep - Optional array of keys to preserve
 * @returns {boolean} - Success status
 */
function clearStorage(keysToKeep = []) {
    try {
        if (keysToKeep.length > 0) {
            // Preserve specific keys
            const preservedData = {};
            keysToKeep.forEach(key => {
                const value = localStorage.getItem(key);
                if (value) preservedData[key] = value;
            });

            localStorage.clear();

            // Restore preserved data
            Object.entries(preservedData).forEach(([key, value]) => {
                localStorage.setItem(key, value);
            });
        } else {
            localStorage.clear();
        }
        return true;
    } catch (error) {
        console.error("Error clearing localStorage:", error);
        return false;
    }
}

// ========================================
// CART MANAGEMENT UTILITIES
// ========================================

/**
 * Get cart items from localStorage
 * @returns {Array} - Array of cart items
 */
function getCartItems() {
    return getFromStorage("cart", []);
}

/**
 * Save cart items to localStorage
 * @param {Array} items - Cart items array
 * @returns {boolean} - Success status
 */
function saveCartItems(items) {
    return saveToStorage("cart", items);
}

/**
 * Add item to cart
 * @param {Object} item - Item to add {id, title, price, image, quantity}
 * @returns {boolean} - Success status
 */
function addToCart(item) {
    try {
        const cart = getCartItems();
        const existingIndex = cart.findIndex(cartItem => cartItem.id === item.id);

        if (existingIndex >= 0) {
            // Update quantity if item exists
            cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + (item.quantity || 1);
        } else {
            // Add new item
            cart.push({
                ...item,
                quantity: item.quantity || 1
            });
        }

        return saveCartItems(cart);
    } catch (error) {
        console.error("Error adding to cart:", error);
        return false;
    }
}

/**
 * Remove item from cart
 * @param {number} itemId - Item ID to remove
 * @returns {boolean} - Success status
 */
function removeFromCart(itemId) {
    try {
        const cart = getCartItems();
        const updatedCart = cart.filter(item => item.id !== itemId);
        return saveCartItems(updatedCart);
    } catch (error) {
        console.error("Error removing from cart:", error);
        return false;
    }
}

/**
 * Clear entire cart
 * @returns {boolean} - Success status
 */
function clearCart() {
    return saveToStorage("cart", []);
}

// ========================================
// ORDER MANAGEMENT UTILITIES
// ========================================

/**
 * Get orders from localStorage
 * @returns {Array} - Array of orders
 */
function getOrders() {
    return getFromStorage("orders", []);
}

/**
 * Save orders to localStorage
 * @param {Array} orders - Orders array
 * @returns {boolean} - Success status
 */
function saveOrders(orders) {
    return saveToStorage("orders", orders);
}

/**
 * Add order to order history
 * @param {Object} order - Order object {title, price, image, status, date, orderType}
 * @returns {boolean} - Success status
 */
function addOrder(order) {
    try {
        const orders = getOrders();
        const newOrder = {
            id: Date.now().toString(), // Simple unique ID
            title: order.title,
            price: order.price,
            image: order.image,
            status: order.status || "Order Placed",
            date: order.date || new Date().toLocaleDateString(),
            orderType: order.orderType || "buy_now"
        };

        orders.push(newOrder);
        return saveOrders(orders);
    } catch (error) {
        console.error("Error adding order:", error);
        return false;
    }
}

/**
 * Cancel order by index
 * @param {number} index - Order index to cancel
 * @returns {boolean} - Success status
 */
function cancelOrder(index) {
    try {
        const orders = getOrders();
        if (index >= 0 && index < orders.length) {
            orders.splice(index, 1);
            return saveOrders(orders);
        }
        return false;
    } catch (error) {
        console.error("Error cancelling order:", error);
        return false;
    }
}

// ========================================
// USER PREFERENCES UTILITIES
// ========================================

/**
 * Get user preferences
 * @returns {Object} - User preferences object
 */
function getUserPreferences() {
    return getFromStorage("userPreferences", {
        theme: "light",
        notifications: true,
        autoSave: true
    });
}

/**
 * Update user preferences
 * @param {Object} preferences - Preferences to update
 * @returns {boolean} - Success status
 */
function updateUserPreferences(preferences) {
    const current = getUserPreferences();
    const updated = { ...current, ...preferences };
    return saveToStorage("userPreferences", updated);
}

// ========================================
// DATA VALIDATION UTILITIES
// ========================================

/**
 * Validate cart item structure
 * @param {Object} item - Cart item to validate
 * @returns {boolean} - Is valid
 */
function validateCartItem(item) {
    return item &&
           typeof item.id === 'number' &&
           typeof item.title === 'string' &&
           typeof item.price === 'number' &&
           typeof item.image === 'string';
}

/**
 * Validate order structure
 * @param {Object} order - Order to validate
 * @returns {boolean} - Is valid
 */
function validateOrder(order) {
    return order &&
           typeof order.title === 'string' &&
           typeof order.price === 'number' &&
           typeof order.image === 'string';
}

/**
 * Sanitize and validate localStorage data
 * Removes corrupted entries and fixes data structure issues
 */
function sanitizeStorageData() {
    try {
        // Validate and fix cart data
        const cart = getCartItems();
        const validCart = cart.filter(validateCartItem);
        if (validCart.length !== cart.length) {
            console.warn(`Removed ${cart.length - validCart.length} invalid cart items`);
            saveCartItems(validCart);
        }

        // Validate and fix orders data
        const orders = getOrders();
        const validOrders = orders.filter(validateOrder);
        if (validOrders.length !== orders.length) {
            console.warn(`Removed ${orders.length - validOrders.length} invalid orders`);
            saveOrders(validOrders);
        }

        return true;
    } catch (error) {
        console.error("Error sanitizing storage data:", error);
        return false;
    }
}

// Auto-sanitize data on page load
document.addEventListener('DOMContentLoaded', function() {
    sanitizeStorageData();
});
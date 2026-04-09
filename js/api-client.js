/**
 * API Client Utility for NOVAMART Frontend
 * Handles all API calls with JWT token management, error handling, and base URL config
 */

const API_BASE_URL = 'http://localhost:5000/api'; // Change in production

class APIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Get JWT token from localStorage
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Set JWT token in localStorage
   */
  setToken(token) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  /**
   * Build headers with JWT token
   */
  getHeaders(isFormData = false) {
    const headers = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Generic fetch method with error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const method = options.method || 'GET';
    const isFormData = options.data instanceof FormData;

    const config = {
      method,
      headers: this.getHeaders(isFormData),
      ...options,
    };

    if (options.data && !isFormData) {
      config.body = JSON.stringify(options.data);
    } else if (isFormData) {
      config.body = options.data;
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          message: error.error || 'Request failed',
          details: error,
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      return {
        success: false,
        error: error.message || 'Network error',
        status: error.status,
      };
    }
  }

  // ============ AUTH ENDPOINTS ============

  async register(fullName, email, phone, password) {
    const result = await this.request('/auth/register', {
      method: 'POST',
      data: { fullName, email, phone, password },
    });
    if (result.success) {
      this.setToken(result.data.token);
    }
    return result;
  }

  async login(email, password) {
    const result = await this.request('/auth/login', {
      method: 'POST',
      data: { email, password },
    });
    if (result.success) {
      this.setToken(result.data.token);
    }
    return result;
  }

  async logout() {
    this.setToken(null);
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(fullName, phone, address) {
    return this.request('/auth/me', {
      method: 'PUT',
      data: { fullName, phone, address },
    });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      data: { email },
    });
  }

  async resetPassword(token, password) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      data: { token, password },
    });
  }

  // ============ PRODUCT ENDPOINTS ============

  async getProducts(category = null, minPrice = null, maxPrice = null, sort = null, page = 1, limit = 20) {
    let query = `?page=${page}&limit=${limit}`;
    if (category) query += `&category=${category}`;
    if (minPrice) query += `&minPrice=${minPrice}`;
    if (maxPrice) query += `&maxPrice=${maxPrice}`;
    if (sort) query += `&sort=${sort}`;
    return this.request(`/products${query}`);
  }

  async getProductsByCategory(category, page = 1, limit = 20) {
    return this.request(`/products/category/${category}?page=${page}&limit=${limit}`);
  }

  async searchProducts(query, page = 1, limit = 20) {
    return this.request(`/products/search/${query}?page=${page}&limit=${limit}`);
  }

  async getProduct(productId) {
    return this.request(`/products/${productId}`);
  }

  // ============ CART ENDPOINTS ============

  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, quantity, size = null, color = null) {
    return this.request('/cart/add', {
      method: 'POST',
      data: { productId, quantity, size, color },
    });
  }

  async updateCartItem(itemId, quantity) {
    return this.request(`/cart/${itemId}`, {
      method: 'PUT',
      data: { quantity },
    });
  }

  async removeFromCart(itemId) {
    return this.request(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request('/cart', {
      method: 'DELETE',
    });
  }

  // ============ ORDER ENDPOINTS ============

  async placeOrder(shippingAddress, paymentMethod = 'stripe') {
    return this.request('/orders/place', {
      method: 'POST',
      data: { shippingAddress, paymentMethod },
    });
  }

  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(orderId) {
    return this.request(`/orders/${orderId}`);
  }

  async cancelOrder(orderId, reason = null) {
    return this.request(`/orders/${orderId}/cancel`, {
      method: 'PUT',
      data: { reason },
    });
  }

  // ============ PAYMENT ENDPOINTS ============

  async createPaymentIntent(orderId) {
    return this.request('/payments/create-intent', {
      method: 'POST',
      data: { orderId },
    });
  }

  async confirmPayment(orderId, paymentIntentId) {
    return this.request('/payments/confirm', {
      method: 'POST',
      data: { orderId, paymentIntentId },
    });
  }

  // ============ ADMIN ENDPOINTS ============

  async getUsers(page = 1, limit = 20) {
    return this.request(`/admin/users?page=${page}&limit=${limit}`);
  }

  async getUser(userId) {
    return this.request(`/admin/users/${userId}`);
  }

  async getAllOrders(page = 1, limit = 20) {
    return this.request(`/admin/orders?page=${page}&limit=${limit}`);
  }

  async updateOrderStatus(orderId, orderStatus) {
    return this.request(`/admin/orders/${orderId}`, {
      method: 'PUT',
      data: { orderStatus },
    });
  }

  async getAnalyticsSummary() {
    return this.request('/admin/analytics/summary');
  }

  async getTopProducts() {
    return this.request('/admin/analytics/top-products');
  }

  // ============ UTILITY METHODS ============

  /**
   * Show toast notification (integrate with your UI)
   */
  showNotification(message, type = 'info') {
    // You can customize this based on your UI framework
    console.log(`[${type.toUpperCase()}] ${message}`);
    // Example: alert(message);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Clear all stored data on logout
   */
  clearAllData() {
    this.setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  }
}

// Create global instance
const api = new APIClient();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = api;
}

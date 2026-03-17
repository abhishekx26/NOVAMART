// =========================================
// NOVAMART NAVIGATION UTILITIES
// =========================================

/**
 * Generate navigation links based on current page location
 * @param {string} basePath - Base path for relative navigation (e.g., '', '../', '../../')
 * @returns {Object} - Object with all navigation links
 */
function generateNavLinks(basePath = '') {
    return {
        home: `${basePath}index.html`,
        mens: `${basePath}mens.html`,
        womens: `${basePath}women.html`,
        kids: `${basePath}kids.html`,
        cart: `${basePath}cart.html`,
        orders: `${basePath}orders.html`,
        profile: `${basePath}profile.html`,
        login: `${basePath}login.html`,
        novaEats: `${basePath}NovaEats/index.html`,
        novaServices: `${basePath}NovaEats/NovaServices/index.html`
    };
}

/**
 * Get navigation configuration based on current page
 * Automatically detects page depth and generates correct paths
 * @returns {Object} - Navigation configuration
 */
function getNavConfig() {
    const path = window.location.pathname;
    let basePath = '';

    // Determine base path based on current location
    if (path.includes('/NovaEats/NovaServices/')) {
        basePath = '../../'; // From NovaServices to root
    } else if (path.includes('/NovaEats/')) {
        basePath = '../'; // From NovaEats to root
    } else {
        basePath = ''; // From root
    }

    return {
        basePath,
        links: generateNavLinks(basePath),
        currentSection: getCurrentSection(path)
    };
}

/**
 * Determine current section based on path
 * @param {string} path - Current page path
 * @returns {string} - Current section name
 */
function getCurrentSection(path) {
    if (path.includes('/NovaEats/NovaServices/')) return 'novaservices';
    if (path.includes('/NovaEats/')) return 'novaeats';
    if (path.includes('mens.html')) return 'mens';
    if (path.includes('women.html')) return 'women';
    if (path.includes('kids.html')) return 'kids';
    if (path.includes('cart.html')) return 'cart';
    if (path.includes('orders.html')) return 'orders';
    if (path.includes('profile.html')) return 'profile';
    if (path.includes('login.html')) return 'login';
    return 'home';
}

/**
 * Create navigation header HTML
 * @param {Object} config - Navigation configuration
 * @returns {string} - Navigation HTML
 */
function createNavHeader(config = null) {
    if (!config) config = getNavConfig();

    return `
    <header class="header">
        <nav class="navbar">
            <div class="nav-brand">
                <a href="${config.links.home}" class="logo">NovaMart</a>
            </div>
            <div class="nav-links">
                <a href="${config.links.home}" class="nav-link ${config.currentSection === 'home' ? 'active' : ''}">Home</a>
                <a href="${config.links.mens}" class="nav-link ${config.currentSection === 'mens' ? 'active' : ''}">Men's</a>
                <a href="${config.links.womens}" class="nav-link ${config.currentSection === 'women' ? 'active' : ''}">Women's</a>
                <a href="${config.links.kids}" class="nav-link ${config.currentSection === 'kids' ? 'active' : ''}">Kids</a>
            </div>
            <div class="nav-actions">
                <a href="${config.links.cart}" class="nav-link ${config.currentSection === 'cart' ? 'active' : ''}">
                    <span class="cart-icon">🛒</span> Cart
                </a>
                <a href="${config.links.orders}" class="nav-link ${config.currentSection === 'orders' ? 'active' : ''}">Orders</a>
                <a href="${config.links.profile}" class="nav-link ${config.currentSection === 'profile' ? 'active' : ''}">Profile</a>
            </div>
        </nav>
    </header>`;
}

/**
 * Create footer HTML with correct navigation links
 * @param {Object} config - Navigation configuration
 * @returns {string} - Footer HTML
 */
function createNavFooter(config = null) {
    if (!config) config = getNavConfig();

    return `
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h3>Company</h3>
                <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Terms & Conditions</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Partners</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Our Services</h3>
                <div class="service-links">
                    <a href="${config.links.home}">
                        <img src="${config.basePath}novamart.png" alt="NovaMart" width="150px">
                    </a>
                    <a href="${config.links.novaEats}">
                        <img src="${config.basePath}NovaEats.png" alt="NovaEats" width="150px">
                    </a>
                    <a href="${config.links.novaServices}">
                        <img src="${config.basePath}NovaServices.png" alt="NovaServices" width="150px">
                    </a>
                </div>
            </div>
            <div class="footer-section">
                <h3>Contact Us</h3>
                <ul>
                    <li><a href="#">Help & Support</a></li>
                    <li><a href="#">Customer Care</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Connect</h3>
                <ul>
                    <li><a href="#"><span class="social-icon">📷</span> Instagram</a></li>
                    <li><a href="#"><span class="social-icon">💼</span> LinkedIn</a></li>
                    <li><a href="#"><span class="social-icon">🐦</span> Twitter</a></li>
                    <li><a href="#"><span class="social-icon">📘</span> Facebook</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 NovaMart. All rights reserved.</p>
        </div>
    </footer>`;
}

/**
 * Navigate to page with authentication check
 * @param {string} url - Target URL
 * @param {boolean} requireAuth - Whether authentication is required
 */
function navigateToPage(url, requireAuth = true) {
    if (requireAuth && !getCurrentUser()) {
        // Store intended destination for after login
        localStorage.setItem("redirectAfterLogin", url);
        window.location.href = getNavConfig().links.login;
        return;
    }

    window.location.href = url;
}

/**
 * Set up navigation event listeners for dynamic navigation
 */
function initializeNavigation() {
    // Handle dynamic navigation clicks
    document.addEventListener('click', function(e) {
        const navLink = e.target.closest('a[data-nav]');
        if (navLink) {
            e.preventDefault();
            const target = navLink.getAttribute('data-nav');
            const requireAuth = navLink.getAttribute('data-auth') !== 'false';
            const config = getNavConfig();

            if (config.links[target]) {
                navigateToPage(config.links[target], requireAuth);
            }
        }
    });

    // Update cart counter if on a page with cart display
    updateCartCounter();
}

/**
 * Update cart item counter in navigation
 */
function updateCartCounter() {
    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
        const cartItems = getCartItems();
        const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCounter.textContent = totalItems > 0 ? totalItems : '';
        cartCounter.style.display = totalItems > 0 ? 'inline' : 'none';
    }
}

/**
 * Highlight current page in navigation
 * @param {string} currentPage - Current page identifier
 */
function highlightCurrentPage(currentPage) {
    // Remove existing active classes
    document.querySelectorAll('.nav-link.active').forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to current page link
    const currentLink = document.querySelector(`[data-nav="${currentPage}"]`);
    if (currentLink) {
        currentLink.classList.add('active');
    }
}

/**
 * Breadcrumb navigation utility
 * @param {Array} breadcrumbs - Array of breadcrumb objects [{text, url}, ...]
 * @returns {string} - Breadcrumb HTML
 */
function createBreadcrumbs(breadcrumbs) {
    if (!breadcrumbs || breadcrumbs.length === 0) return '';

    const items = breadcrumbs.map((crumb, index) => {
        if (index === breadcrumbs.length - 1) {
            // Last item (current page)
            return `<span class="breadcrumb-current">${crumb.text}</span>`;
        } else {
            return `<a href="${crumb.url}" class="breadcrumb-link">${crumb.text}</a>`;
        }
    }).join(' <span class="breadcrumb-separator">></span> ');

    return `<nav class="breadcrumb">${items}</nav>`;
}

/**
 * Mobile navigation toggle functionality
 */
function initMobileNav() {
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('nav-links-mobile');
            mobileToggle.classList.toggle('active');
        });
    }
}

/**
 * Initialize all navigation functionality
 */
function initNav() {
    initializeNavigation();
    initMobileNav();

    // Update cart counter periodically
    setInterval(updateCartCounter, 5000);
}

// Auto-initialize navigation on page load
document.addEventListener('DOMContentLoaded', function() {
    initNav();
});

// Export for manual use
window.NovaMartNav = {
    getNavConfig,
    createNavHeader,
    createNavFooter,
    navigateToPage,
    updateCartCounter,
    highlightCurrentPage,
    createBreadcrumbs
};
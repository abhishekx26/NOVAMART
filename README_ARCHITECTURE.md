# NOVAMART - Full Stack E-Commerce Platform

A complete e-commerce solution with modern frontend and robust backend API.

## 📁 Project Structure

```
NOVAMART/
├── Frontend (Root Directory)
│   ├── index.html                         # Homepage
│   ├── login.html                         # User authentication
│   ├── product.html                       # Product details
│   ├── cart.html                          # Shopping cart
│   ├── orders.html                        # Order history
│   ├── profile.html                       # User profile
│   │
│   ├── Category Pages
│   ├── mens.html, mens.js, mens.css       # Men's section
│   ├── womens.html, womens.js, womens.css # Women's section
│   ├── kids.html, kids.js, kids.css       # Kids' section
│   │
│   ├── Styling
│   ├── style.css                          # Main styles
│   ├── cart.css, product.css, etc         # Page-specific styles
│   │
│   ├── JavaScript Utilities
│   ├── js/
│   │   └── api-client.js                  # ⭐ API client for all backend calls
│   │
│   ├── Assets
│   ├── product_images/                    # Product images
│   │
│   ├── Sub-Services
│   ├── NovaEats/
│   │   ├── index.html                     # Food delivery service
│   │   └── NovaServices/
│   │       └── index.html                 # Home services
│   │
│   └── Documentation
│       ├── FRONTEND_INTEGRATION_GUIDE.md  # How to use API client
│       └── README.md
│
└── backend/                               # ⭐ NEW BACKEND (Node.js + Express + MongoDB)
    ├── server.js                          # Main server file
    ├── package.json                       # Dependencies
    │
    ├── config/
    │   ├── db.js                          # MongoDB connection
    │   └── email.js                       # Email service
    │
    ├── models/
    │   ├── User.js                        # User schema
    │   ├── Product.js                     # Product schema
    │   ├── Order.js                       # Order schema
    │   └── Cart.js                        # Cart schema
    │
    ├── routes/
    │   ├── auth.js                        # Authentication endpoints
    │   ├── products.js                    # Product endpoints
    │   ├── cart.js                        # Cart endpoints
    │   ├── orders.js                      # Order endpoints
    │   ├── payments.js                    # Stripe payment endpoints
    │   └── admin.js                       # Admin endpoints
    │
    ├── middleware/
    │   ├── auth.js                        # JWT authentication
    │   └── errorHandler.js                # Error handling
    │
    ├── scripts/
    │   └── seedDatabase.js                # Populate sample data
    │
    ├── .env.example                       # Environment template
    ├── .gitignore
    └── README.md                          # Backend documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js v14+
- MongoDB Atlas account (free)
- Stripe account (for payments)
- Gmail/SendGrid account (for emails)

### Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your credentials:
# - MONGODB_URI
# - STRIPE_SECRET_KEY
# - SMTP credentials
# - JWT_SECRET

# Start server
npm run dev
```

Server runs on: `http://localhost:5000`

### Seed Database

```bash
npm run seed
```

This populates MongoDB with 34 sample products (mens, womens, kids).

### Frontend Setup

The frontend works as-is! But to use the new backend:

1. Include API client in HTML files:
   ```html
   <script src="js/api-client.js"></script>
   ```

2. Update JavaScript files to use API instead of localStorage

3. See `FRONTEND_INTEGRATION_GUIDE.md` for detailed examples

```bash
# Start frontend (Python)
python -m http.server 3000

# Or Node.js
npx serve -s . -p 3000
```

Frontend runs on: `http://localhost:3000`

---

## 🔑 Key Features

### ✅ Frontend (Already Complete)
- [x] Responsive HTML5/CSS3 design
- [x] Product catalog (mens, womens, kids)
- [x] Shopping cart
- [x] Order history
- [x] User profile
- [x] Search (ready for integration)
- [x] Filter & sort (ready for integration)

### ✅ Backend (Just Added)
- [x] **Authentication** - Register, login, JWT tokens, password reset
- [x] **Products API** - Browse, search, filter, admin CRUD
- [x] **Cart API** - Add, remove, update items
- [x] **Orders API** - Place, track, cancel orders
- [x] **Payments** - Stripe integration with webhooks
- [x] **Email Service** - Order confirmations, password reset
- [x] **Admin Panel API** - User/order management, analytics
- [x] **MongoDB Integration** - Data persistence
- [x] **Error Handling** - Complete error middleware
- [x] **CORS** - Frontend integration ready

---

## 📚 Documentation

### Backend
- [Backend README](./backend/README.md) - Detailed API documentation
- [Backend Setup Guide](./backend/README.md#-installation--setup) - Complete setup instructions
- [API Endpoints](./backend/README.md#-api-endpoints) - All available endpoints

### Frontend Integration
- [Frontend Integration Guide](./FRONTEND_INTEGRATION_GUIDE.md) - How to use API client
- [Before/After Code Examples](./FRONTEND_INTEGRATION_GUIDE.md#-how-to-update-javascript-files) - Real examples

### Database
- [Models & Schemas](./backend/README.md#-database-models) - User, Product, Order, Cart schemas

---

## 🔄 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Frontend (HTML/CSS/JS) - Runs on Localhost:3000 or Vercel   │
├─────────────────────────────────────────────────────────────┤
│ - index.html, product.html, cart.html, login.html, etc.    │
│ - Contains js/api-client.js for API communication           │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │     HTTP      │    REST API   │
         │     JSON      │   + JWT Auth  │
         │    CORS       │               │
         ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend (Node.js + Express) - Runs on Localhost:5000        │
├─────────────────────────────────────────────────────────────┤
│ ├─ /api/auth      - User authentication & profile           │
│ ├─ /api/products  - Product catalog CRUD                    │
│ ├─ /api/cart      - Shopping cart management                │
│ ├─ /api/orders    - Order placement & tracking              │
│ ├─ /api/payments  - Stripe payment processing               │
│ └─ /api/admin     - Analytics & user/order management       │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┬────────────────┐
         │   MongoDB     │    Stripe     │     Email      │
         │   Atlas       │   API         │    Service     │
         ▼               ▼               ▼                ▼
     ┌────────┐    ┌─────────┐    ┌──────────┐    ┌──────────┐
     │ Users  │    │Products │    │ Payment  │    │Nodemailer│
     │Orders  │    │Cart     │    │Processing│    │Gmail/    │
     │Carts   │    │Orders   │    │Webhooks  │    │SendGrid  │
     └────────┘    └─────────┘    └──────────┘    └──────────┘
```

---

## 🔐 Authentication Flow

```
1. User enters credentials on login.html
2. Frontend calls: await api.login(email, password)
3. Backend validates & returns JWT token
4. api-client.js stores token in localStorage
5. Token auto-attached to all API requests
6. Protected routes check token validity
7. Token refreshes on expiry or login
```

---

## 💳 Payment Flow (Stripe)

```
1. User clicks "Checkout"
2. Frontend calls: api.placeOrder(...)
3. Backend creates Order in MongoDB
4. Frontend calls: api.createPaymentIntent(orderId)
5. Stripe returns clientSecret
6. User enters card details (4242 4242 4242 4242 for testing)
7. Frontend calls: stripe.confirmCardPayment(clientSecret)
8. Stripe sends webhook to backend
9. Backend updates Order payment status
10. Email confirmation sent to user
```

---

## 📊 API Response Format

All APIs follow consistent response format:

**Success Response:**
```javascript
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

**Error Response:**
```javascript
{
  "success": false,
  "error": "Error message",
  "status": 400
}
```

---

## 🧪 Testing

### Test API Endpoints

```bash
# Check server health
curl http://localhost:5000/api/health

# Test register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John","email":"john@test.com","phone":"9999999999","password":"test123"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"test123"}'

# Get products
curl http://localhost:5000/api/products
```

### Using Postman
1. Create collection with all endpoints
2. Set `{{baseUrl}}` to `http://localhost:5000`
3. Add Bearer token to Authorization header for protected routes
4. Test each endpoint

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Push to GitHub
git push origin main

# Import on Vercel (automatic)
# Update environment: API_BASE_URL = backend_url
```

### Backend (Railway.app)
```bash
# Connect GitHub repo to Railway
# Add environment variables:
MONGODB_URI=...
STRIPE_SECRET_KEY=...
JWT_SECRET=...
FRONTEND_URL=https://your-vercel-app.vercel.app
```

---

## 📝 Environment Variables

Create `.env` in backend folder:

```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/novamart

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Frontend
FRONTEND_URL=http://localhost:3000
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Check URI in .env, whitelist IP in Atlas |
| CORS error | Verify FRONTEND_URL in .env |
| Email not sending | Check SMTP credentials, enable less secure apps |
| API not responding | Ensure backend is running: `npm run dev` |
| Token expired | User needs to login again |
| Stripe payment fails | Use test card: 4242 4242 4242 4242 |

---

## 📞 Getting Help

1. **Check logs** - See terminal output for errors
2. **Verify setup** - Ensure all `.env` variables are set
3. **Test API** - Use Postman to test individual endpoints
4. **Read docs** - Backend README has detailed information
5. **Check integration guide** - See frontend integration examples

---

## ✨ What's Different from Before?

| Aspect | Before | After |
|--------|--------|-------|
| Data Storage | localStorage | MongoDB |
| Authentication | Simple form | JWT tokens + secure hashing |
| Products | Hardcoded arrays | Database with search/filter |
| Cart | localStorage | Database cart per user |
| Orders | localStorage | Real orders with history |
| Payments | None | Stripe integration |
| Emails | None | Notifications for orders |
| Scale | Limited | Unlimited users & products |
| Security | None | Password hashing, JWT, CORS |

---

## 🎯 Next Steps

1. ✅ Setup backend (DONE - see above)
2. ✅ Seed database (DONE - see above)
3. ⏳ Update frontend JS files (use FRONTEND_INTEGRATION_GUIDE.md)
4. ⏳ Test API endpoints (Postman)
5. ⏳ Deploy to Vercel + Railway
6. ⏳ Monitor analytics in admin panel

---

## 📄 Files Changed/Added

### New Files
- ✨ `backend/` - Complete backend directory
- ✨ `js/api-client.js` - API client utility
- ✨ `FRONTEND_INTEGRATION_GUIDE.md` - Integration examples
- ✨ `backend/README.md` - Backend documentation

### Unchanged
- ✅ All `.html` files - No changes needed
- ✅ All `.css` files - No changes needed
- ✅ All assets - `product_images/`, `NovaEats/`, `NovaServices/`

### To Update
- ⏳ `login.js` - Use `api.login()` instead of localStorage
- ⏳ `product.js` - Fetch from API instead of hardcoded array
- ⏳ `cart.js` - Use `api.getCart()` etc.
- ⏳ `orders.js` - Fetch from API
- ⏳ `mens.js`, `womens.js`, `kids.js` - API calls instead of arrays
- ⏳ Other `.js` files - Similar updates

---

## 🎓 Learn More

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Mongoose](https://mongoosejs.com/)
- [Stripe API](https://stripe.com/docs/api)
- [JWT Authentication](https://jwt.io/)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Your full-stack e-commerce platform is ready! 🚀**

Start with backend setup, test endpoints, then integrate frontend.

For detailed backend setup: See [backend/README.md](./backend/README.md)

For frontend integration: See [FRONTEND_INTEGRATION_GUIDE.md](./FRONTEND_INTEGRATION_GUIDE.md)

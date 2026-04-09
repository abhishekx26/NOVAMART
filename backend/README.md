# NOVAMART Backend API

Complete backend API for the NOVAMART e-commerce platform built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication**: User registration, login, JWT tokens, password reset
- **Product Management**: Browse, search, filter, and manage products (admin)
- **Shopping Cart**: Add/remove items, manage quantities
- **Orders**: Place orders, track status, cancel orders
- **Payments**: Stripe integration for payment processing
- **Admin Dashboard**: User management, order tracking, analytics
- **Email Notifications**: Order confirmations, password reset emails
- **CORS Enabled**: Ready for frontend integration from any origin

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (free tier available)
- Stripe account (for payments)
- Gmail/SendGrid account (for email notifications)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
cd backend
npm install
```

### 2. Create Environment File

Copy `.env.example` to `.env` and update with your credentials:

```bash
cp .env.example .env
```

**Configure `.env` file:**

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/novamart

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_key

# Email (Gmail Example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password  # Use App Password, not regular password
SMTP_FROM_EMAIL=noreply@novamart.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Admin Secret (for creating admin users)
ADMIN_SECRET=admin_secret_key
```

### 3. MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with username and password
4. Get connection string and update `MONGODB_URI` in `.env`

### 4. Install Dependencies

```bash
npm install
```

## 📁 Project Structure

```
backend/
├── config/              # Configuration files
│   ├── db.js           # MongoDB connection
│   └── email.js        # Email service setup
├── models/             # Mongoose schemas
│   ├── User.js         # User model
│   ├── Product.js      # Product model
│   ├── Cart.js         # Cart model
│   └── Order.js        # Order model
├── routes/             # API endpoints
│   ├── auth.js         # Authentication routes
│   ├── products.js     # Product routes
│   ├── cart.js         # Cart routes
│   ├── orders.js       # Order routes
│   ├── payments.js     # Payment routes
│   └── admin.js        # Admin routes
├── middleware/         # Custom middleware
│   ├── auth.js         # JWT authentication
│   └── errorHandler.js # Error handling
├── scripts/
│   └── seedDatabase.js # Database seeding script
├── server.js           # Main server file
├── package.json        # Dependencies
├── .env.example        # Environment template
└── .gitignore         # Git ignore file
```

## 🚀 Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Seed Database

Add sample products to MongoDB:

```bash
npm run seed
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search/:query` - Search products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Add product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Orders
- `POST /api/orders/place` - Place new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:orderId` - Get order details
- `PUT /api/orders/:orderId/cancel` - Cancel order

### Payments (Stripe)
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/users/:userId` - Get user details
- `GET /api/admin/orders` - Get all orders (admin only)
- `PUT /api/admin/orders/:orderId` - Update order status
- `GET /api/admin/analytics/summary` - Get sales analytics
- `GET /api/admin/analytics/top-products` - Get best-selling products

## 🔐 Authentication

All protected endpoints require JWT token in Authorization header:

```javascript
Authorization: Bearer <your_jwt_token>
```

### Token Storage

Frontend stores token in localStorage:

```javascript
localStorage.setItem('token', jwtToken);
```

## 💳 Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your Secret Key (sk_test_...)
3. Add to `.env` as `STRIPE_SECRET_KEY`
4. For testing use card: `4242 4242 4242 4242`

## 📧 Email Configuration

### Using Gmail

1. Enable 2-factor authentication on Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password in `SMTP_PASS`

### Using SendGrid

1. SignUp at [SendGrid](https://sendgrid.com)
2. Create API key
3. Use `sendgrid.net` as SMTP_HOST
4. Use `apikey` as username and API key as password

## 🗄️ Database Models

### User Schema
```javascript
{
  fullName, email, phone, password
  address: { street, city, state, pincode, country }
  role: 'user' | 'admin'
  cart: [{ productId, quantity, size, color }]
  orders: [orderId]
}
```

### Product Schema
```javascript
{
  id, title, brand, description
  price, mrp, discount
  rating, ratingCount
  category: 'mens' | 'womens' | 'kids'
  images: [], colors: []
  sizes: ['M', 'L', 'XL', 'XXL']
  inventory, isActive
}
```

### Order Schema
```javascript
{
  userId, items: [{ productId, title, price, quantity, size, color, image }]
  shippingAddress: { fullName, street, city, state, pincode, country, phone }
  totalPrice
  paymentMethod: 'stripe' | 'cod'
  paymentStatus: 'pending' | 'completed' | 'failed'
  orderStatus: 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
}
```

## 🧪 Testing with Postman

1. Import the API collection (create one with the endpoints listed above)
2. Set `{{baseUrl}}` variable to `http://localhost:5000`
3. For protected endpoints, add Authorization header with Bearer token
4. Test each endpoint

## 📤 Deployment

### Deploy to Railway

1. Connect GitHub repository
2. Create Railway project
3. Link MongoDB Atlas cluster
4. Set environment variables from `.env`
5. Deploy!

### Deploy to Render

1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy!

### Deploy to Vercel (Serverless)

Note: Vercel works best for stateless APIs. For continuous processes (like webhooks), use Railway or Render.

## 🐛 Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED
```

- Check MongoDB URI in `.env`
- Verify database username/password
- Ensure IP is whitelisted in MongoDB Atlas

### Email Not Sending

- Verify SMTP credentials
- Check "Less secure apps" setting (Gmail)
- Check spam folder
- Verify `SMTP_FROM_EMAIL` is correct

### CORS Error

- Ensure `FRONTEND_URL` in `.env` matches your frontend origin
- Check CORS middleware in `server.js`

### Stripe Payment Failed

- Use test card: `4242 4242 4242 4242`
- Check `STRIPE_SECRET_KEY` is correct
- Verify webhook secret for production

## 📞 Support

For issues or questions:
1. Check error logs in terminal
2. Verify all environment variables
3. Test endpoints with Postman
4. Check MongoDB documents for data

## 📝 License

MIT License - feel free to use this project

---

**Ready to launch?** Next steps:
1. Complete `.env` setup
2. Run `npm run seed` to populate sample products
3. Start server with `npm run dev`
4. Test API on `http://localhost:5000/api/health`
5. Integrate frontend using `js/api-client.js`

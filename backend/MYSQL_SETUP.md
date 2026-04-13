# MySQL Setup Guide for NOVAMART

## Prerequisites
- MySQL Server installed on your machine or access to a MySQL server
- Your MySQL username and password

## Step 1: Create .env File

Copy `.env.example` to `.env` and fill in your MySQL credentials:

```bash
cp .env.example .env
```

Then edit `.env` with your MySQL details:

```env
# MySQL Database Configuration
MYSQL_HOST=localhost               # Your MySQL server host
MYSQL_PORT=3306                    # MySQL port (default: 3306)
MYSQL_USER=root                    # Your MySQL username
MYSQL_PASSWORD=your_password       # Your MySQL password
MYSQL_DATABASE=novamart            # Database name

# Other configurations
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-here-change-in-production
STRIPE_SECRET_KEY=sk_test_your_key_here
FRONTEND_URL=http://localhost:3000
```

## Step 2: Create MySQL Database

Open MySQL Command Line or MySQL Workbench and run:

```sql
CREATE DATABASE novamart;
```

## Step 3: Install Dependencies

```bash
npm install
```

This will install:
- `mysql2` - MySQL client for Node.js
- `sequelize` - ORM for MySQL
- All other dependencies

## Step 4: Seed the Database

Run the seed script to populate the database with products:

```bash
npm run seed
```

This will:
- Create all tables (Users, Products, Carts, Orders, etc.)
- Insert 34 products
- Create test users (test@example.com / admin@example.com)

## Step 5: Start the Backend Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Verify Connection

Check the health endpoint:

```bash
curl http://localhost:5000/api/health
```

You should get:
```json
{
  "status": "OK",
  "message": "NOVAMART backend is running"
}
```

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
- Check your `MYSQL_USER` and `MYSQL_PASSWORD` in `.env`
- Ensure MySQL server is running

### Error: "Unknown database 'novamart'"
- Create the database: `CREATE DATABASE novamart;`

### Error: "ECONNREFUSED 127.0.0.1:3306"
- MySQL server is not running
- Start MySQL service:
  - **Windows**: `net start MySQL80` (or your MySQL version)
  - **Mac**: `brew services start mysql`
  - **Linux**: `sudo systemctl start mysql`

### Port 3306 already in use
- Check if another MySQL instance is running
- Or change `MYSQL_PORT` in `.env`

## Database Models

The application uses 6 models:
- **User**: Store user accounts, addresses, roles
- **Product**: Store product information, images, ratings
- **Cart**: Store user carts
- **CartItem**: Store items in each cart
- **Order**: Store order information
- **OrderItem**: Store items in each order

All tables are automatically created when you run the seed script.

## For Vercel Deployment

When deploying to Vercel, update environment variables in Vercel dashboard:

1. Go to your Vercel project settings
2. Add environment variables:
   - `MYSQL_HOST` - Your remote MySQL host
   - `MYSQL_USER` - Your database username
   - `MYSQL_PASSWORD` - Your database password
   - `MYSQL_DATABASE` - Your database name
   - `MYSQL_PORT` - Your database port (usually 3306)
   - Other variables (JWT_SECRET, STRIPE_KEY, etc.)

Your remote MySQL database must be accessible from Vercel (check firewall/security rules).

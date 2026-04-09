#!/bin/bash

# NOVAMART Backend Setup Script for Mac/Linux

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     NOVAMART Backend - Quick Setup Script                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version:"
node --version
echo ""

# Navigate to backend folder
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ npm install failed"
        exit 1
    fi
    echo "✓ Dependencies installed"
else
    echo "✓ Dependencies already installed"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              Setup Complete!                              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo ""
echo "1. Create .env file:"
echo "   cp .env.example .env"
echo ""
echo "2. Edit .env with your credentials (use nano or your editor):"
echo "   nano .env"
echo "   - MongoDB URI"
echo "   - Stripe API Key"
echo "   - JWT Secret"
echo "   - Email configuration"
echo ""
echo "3. Seed database (populates sample products):"
echo "   npm run seed"
echo ""
echo "4. Start backend server:"
echo "   npm run dev"
echo ""
echo "Server will run on: http://localhost:5000"
echo "API health check: http://localhost:5000/api/health"
echo ""
echo "For detailed instructions, see: backend/README.md"
echo ""

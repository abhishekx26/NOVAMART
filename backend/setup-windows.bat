@echo off
REM NOVAMART Backend Setup Script for Windows

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     NOVAMART Backend - Quick Setup Script (Windows)       ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js version:
node --version
echo.

REM Navigate to backend folder
cd backend

REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ npm install failed
        pause
        exit /b 1
    )
    echo ✓ Dependencies installed
) else (
    echo ✓ Dependencies already installed
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              Setup Complete!                              ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Next steps:
echo.
echo 1. Create .env file:
echo    copy .env.example .env
echo.
echo 2. Edit .env with your credentials:
echo    - MongoDB URI
echo    - Stripe API Key
echo    - JWT Secret
echo    - Email configuration
echo.
echo 3. Seed database (populates sample products):
echo    npm run seed
echo.
echo 4. Start backend server:
echo    npm run dev
echo.
echo Server will run on: http://localhost:5000
echo API health check: http://localhost:5000/api/health
echo.
echo For detailed instructions, see: backend/README.md
echo.
pause

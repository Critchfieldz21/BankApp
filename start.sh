#!/bin/bash

# Four Cs Bank - Quick Start Script

echo "🏦 Four Cs Bank - Starting Application"
echo "======================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14 or higher."
    exit 1
fi

echo "✅ Python and Node.js are installed"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ Virtual environment created"
fi

source venv/bin/activate
pip install -q -r requirements.txt
echo "✅ Backend dependencies installed"

# Start Backend in background
python app.py &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"
echo ""

# Wait for backend to start
sleep 2

# Setup Frontend
echo "📦 Setting up Frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    npm install -q
    echo "✅ Frontend dependencies installed"
fi

echo ""
echo "🚀 Starting Frontend..."
npm start &
FRONTEND_PID=$!

echo ""
echo "======================================="
echo "✅ Application is starting!"
echo "======================================="
echo ""
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait

# Cleanup on exit
kill $BACKEND_PID 2>/dev/null
kill $FRONTEND_PID 2>/dev/null

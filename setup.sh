#!/bin/bash

# Quick Start Guide for Four Cs Bank
# This script helps you set up the project for local development or Vercel deployment

set -e

echo "🏦 Four Cs Bank - Quick Setup"
echo "=============================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "⚠️  Python3 not found (optional for local backend)"
fi

echo ""
echo "📦 Installing Frontend Dependencies..."
cd frontend
npm install
echo "✅ Frontend dependencies installed"

echo ""
echo "🔑 Setting up environment variables..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Creating .env.local for local development..."
    echo "REACT_APP_API_URL=http://localhost:5000" > .env.local
    echo "✅ .env.local created"
else
    echo "✅ .env.local already exists"
fi

cd ..

echo ""
echo "🚀 Setup Complete!"
echo ""
echo "To start local development:"
echo "  • Frontend only: npm run frontend"
echo "  • Backend only: npm run backend"
echo "  • Both together: npm run dev"
echo ""
echo "To build for production:"
echo "  • npm run build"
echo ""
echo "📚 For deployment to Vercel, see DEPLOYMENT.md"
echo ""

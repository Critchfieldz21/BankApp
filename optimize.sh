#!/bin/bash

# BankApp Optimization and Cleanup Script
# This script optimizes the project by removing unnecessary files and directories

set -e

echo "🧹 Starting BankApp Optimization..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to remove files with status
cleanup() {
    local target=$1
    local description=$2
    
    if [ -e "$target" ]; then
        rm -rf "$target"
        echo -e "${GREEN}✓${NC} Removed: $description"
    fi
}

cleanup_dir() {
    local target=$1
    local description=$2
    
    if [ -d "$target" ]; then
        find "$target" -type d -name "$1" -exec rm -rf {} + 2>/dev/null || true
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓${NC} Cleaned: $description"
        fi
    fi
}

echo "Cleaning up cache files..."
cleanup ".DS_Store" "macOS cache (.DS_Store)"
cleanup "server.log" "Server log file"
cleanup "*.log" "Log files"

echo ""
echo "Cleaning Python cache..."
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
echo -e "${GREEN}✓${NC} Cleaned: Python __pycache__ directories"

find . -type f -name "*.pyc" -delete 2>/dev/null || true
find . -type f -name "*.pyo" -delete 2>/dev/null || true
echo -e "${GREEN}✓${NC} Cleaned: Compiled Python files (*.pyc, *.pyo)"

echo ""
echo "Cleaning NPM cache..."
# Note: Don't delete node_modules if we want to keep them
# find . -type d -name "node_modules" -prune -exec rm -rf {} + 2>/dev/null || true

echo ""
echo "📊 Size Analysis:"
echo "Project size: $(du -sh . | cut -f1)"
echo ""

echo -e "${GREEN}✨ Optimization Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Copy environment files: cp frontend/.env.example frontend/.env.local && cp backend/.env.example backend/.env"
echo "2. Install dependencies: npm install (in frontend directory)"
echo "3. Start development: npm run dev"
echo ""
echo "For more details, see OPTIMIZATION.md"

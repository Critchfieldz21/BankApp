#!/bin/bash

cd "$(dirname "$0")/backend"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install requirements
pip install -r requirements.txt > /dev/null 2>&1

# Run Flask app
python3 app.py

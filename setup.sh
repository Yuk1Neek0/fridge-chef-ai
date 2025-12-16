#!/bin/bash

echo "====================================="
echo "FridgeChef AI - Setup Script"
echo "====================================="
echo ""

echo "Step 1: Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install server dependencies"
    exit 1
fi
echo "✓ Server dependencies installed"
echo ""

echo "Step 2: Installing client dependencies..."
cd ../client
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install client dependencies"
    exit 1
fi
echo "✓ Client dependencies installed"
echo ""

echo "Step 3: Setting up environment file..."
cd ../server
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ Created .env file"
    echo ""
    echo "IMPORTANT: Edit server/.env and add your Anthropic API key!"
else
    echo "✓ .env file already exists"
fi
echo ""

cd ..
echo "====================================="
echo "Setup Complete!"
echo "====================================="
echo ""
echo "Next steps:"
echo "1. Edit server/.env and add your ANTHROPIC_API_KEY"
echo "2. Run ./start-dev.sh to start the development servers"
echo ""
echo "See QUICKSTART.md for more information"
echo ""

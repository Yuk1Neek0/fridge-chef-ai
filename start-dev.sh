#!/bin/bash

echo "====================================="
echo "FridgeChef AI - Development Servers"
echo "====================================="
echo ""
echo "Starting backend and frontend servers..."
echo ""
echo "Backend will run on: http://localhost:3001"
echo "Frontend will run on: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the servers"
echo ""

# Start backend in background
cd server
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend in background
cd ../client
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✓ Servers started"
echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Open http://localhost:5173 in your browser"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait

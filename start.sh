#!/bin/bash

# AI Trading Platform Startup Script

echo "?? Starting AI Trading Platform..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "? Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "? Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Start Backend
echo "?? Starting Backend Server..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install backend dependencies
echo "Installing backend dependencies..."
pip install -q -r requirements.txt

# Start backend server in background
echo "Starting FastAPI server on http://localhost:8000"
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

cd ..

# Start Frontend
echo ""
echo "?? Starting Frontend Server..."
cd frontend

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend server
echo "Starting React app on http://localhost:3000"
npm start &
FRONTEND_PID=$!

cd ..

echo ""
echo "? Application started successfully!"
echo ""
echo "?? Frontend: http://localhost:3000"
echo "?? Backend: http://localhost:8000"
echo "?? API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for Ctrl+C
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait

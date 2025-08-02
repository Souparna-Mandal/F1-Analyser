#!/bin/bash

# F1 Analytics Platform Startup Script

echo "🏎️  Starting F1 Analytics Platform..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Start backend
echo "🚀 Starting backend server..."
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Start backend server in background
echo "🌐 Starting FastAPI server on http://localhost:8000"
python main.py &
BACKEND_PID=$!

cd ..

# Start frontend
echo "🚀 Starting frontend development server..."
cd frontend

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Start frontend server
echo "🌐 Starting React development server on http://localhost:5173"
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "🎉 F1 Analytics Platform is starting up!"
echo ""
echo "📊 Backend API: http://localhost:8000"
echo "🌐 Frontend App: http://localhost:5173"
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait 
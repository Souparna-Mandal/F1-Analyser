@echo off
chcp 65001 >nul

echo 🏎️  Starting F1 Analytics Platform...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed
echo.

REM Start backend
echo 🚀 Starting backend server...
cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo 📦 Installing Python dependencies...
pip install -r requirements.txt

REM Start backend server in background
echo 🌐 Starting FastAPI server on http://localhost:8000
start "Backend Server" python main.py

cd ..

REM Start frontend
echo 🚀 Starting frontend development server...
cd frontend

REM Install dependencies
echo 📦 Installing Node.js dependencies...
npm install

REM Start frontend server
echo 🌐 Starting React development server on http://localhost:5173
start "Frontend Server" npm run dev

cd ..

echo.
echo 🎉 F1 Analytics Platform is starting up!
echo.
echo 📊 Backend API: http://localhost:8000
echo 🌐 Frontend App: http://localhost:5173
echo 📚 API Documentation: http://localhost:8000/docs
echo.
echo Both servers are running in separate windows.
echo Close the windows to stop the servers.
echo.
pause 
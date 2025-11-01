@echo off
REM AI Trading Platform Startup Script for Windows

echo Starting AI Trading Platform...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

REM Start Backend
echo Starting Backend Server...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install backend dependencies
echo Installing backend dependencies...
pip install -q -r requirements.txt

REM Start backend server
echo Starting FastAPI server on http://localhost:8000
start "Backend Server" cmd /k "uvicorn app.main:app --host 0.0.0.0 --port 8000"

cd ..

REM Start Frontend
echo.
echo Starting Frontend Server...
cd frontend

REM Install frontend dependencies if needed
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

REM Start frontend server
echo Starting React app on http://localhost:3000
start "Frontend Server" cmd /k "npm start"

cd ..

echo.
echo Application started successfully!
echo.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Close the command windows to stop the servers.
pause

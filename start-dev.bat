@echo off
echo =====================================
echo FridgeChef AI - Development Servers
echo =====================================
echo.
echo Starting backend and frontend servers...
echo.
echo Backend will run on: http://localhost:3001
echo Frontend will run on: http://localhost:5173
echo.
echo Press Ctrl+C to stop the servers
echo.

start "FridgeChef Backend" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak > nul
start "FridgeChef Frontend" cmd /k "cd client && npm run dev"

echo.
echo ✓ Servers starting in separate windows
echo.
echo Open http://localhost:5173 in your browser
echo.

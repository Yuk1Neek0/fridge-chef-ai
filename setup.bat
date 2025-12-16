@echo off
echo =====================================
echo FridgeChef AI - Setup Script
echo =====================================
echo.

echo Step 1: Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install server dependencies
    pause
    exit /b 1
)
echo ✓ Server dependencies installed
echo.

echo Step 2: Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install client dependencies
    pause
    exit /b 1
)
echo ✓ Client dependencies installed
echo.

echo Step 3: Setting up environment file...
cd ..\server
if not exist .env (
    copy .env.example .env
    echo ✓ Created .env file
    echo.
    echo IMPORTANT: Edit server\.env and add your Anthropic API key!
) else (
    echo ✓ .env file already exists
)
echo.

cd ..
echo =====================================
echo Setup Complete!
echo =====================================
echo.
echo Next steps:
echo 1. Edit server\.env and add your ANTHROPIC_API_KEY
echo 2. Run start-dev.bat to start the development servers
echo.
echo See QUICKSTART.md for more information
echo.
pause

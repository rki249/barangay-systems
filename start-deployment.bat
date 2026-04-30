@echo off
setlocal enabledelayedexpansion

echo ===============================
echo Barangay System - Ngrok Deploy
echo ===============================
echo.

REM Create ngrok folder
set "NGROK_DIR=%USERPROFILE%\ngrok"
if not exist "%NGROK_DIR%" mkdir "%NGROK_DIR%"

REM Download ngrok if not exists
set "NGROK_EXE=%NGROK_DIR%\ngrok.exe"
if not exist "%NGROK_EXE%" (
    echo Downloading ngrok...
    powershell -Command ^
        "$ProgressPreference = 'SilentlyContinue'; " ^
        "Invoke-WebRequest -Uri 'https://bin.equinox.io/a/cJk8dzafvmN/ngrok-v3-3.3.1-windows-amd64.zip' " ^
        "-OutFile '%NGROK_DIR%\ngrok.zip'; " ^
        "Expand-Archive -Path '%NGROK_DIR%\ngrok.zip' -DestinationPath '%NGROK_DIR%' -Force; " ^
        "Remove-Item '%NGROK_DIR%\ngrok.zip' -Force"
    
    if exist "%NGROK_EXE%" (
        echo ✓ Ngrok downloaded successfully
    ) else (
        echo ✗ Failed to download ngrok
        exit /b 1
    )
)

echo.
echo ========== LOCAL SERVERS ==========
echo Backend API:     http://localhost:5000
echo Frontend:        http://localhost:5173
echo.
echo ========== STARTING TUNNELS ==========
echo.
echo Backend tunnel starting on port 5000...
start cmd /k "%NGROK_EXE% http 5000"
timeout /t 2

echo Frontend tunnel starting on port 5173...
start cmd /k "%NGROK_EXE% http 5173"

echo.
echo ✓ Tunnels are starting in new windows
echo.
echo View tunnel URLs at: http://127.0.0.1:4040
echo.
pause

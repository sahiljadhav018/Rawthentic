@echo off
:: SmartTourConnect - 1-Click Evaluation Launcher
:: Smart India Hackathon (SIH 2026) | Problem Statement: SIH26204 | Team: Rawauthentic
:: Author: Sahil Jadhav (sahilujadhav143@gmail.com)
title Smart Tour Connect - 1-Click Launcher
color 0A
cd /d "%~dp0"

echo ================================================================
echo           SMART TOUR CONNECT - 1-CLICK LAUNCHER
echo ================================================================
echo.
echo  [1/2] Checking Python environment...

if exist "C:\Users\Sahil\.local\bin\python3.14.exe" (
    set "PY_CMD=C:\Users\Sahil\.local\bin\python3.14.exe"
    goto RUN
)

where py >nul 2>nul
if %errorlevel%==0 (
    set PY_CMD=py
    goto RUN
)

where python >nul 2>nul
if %errorlevel%==0 (
    set PY_CMD=python
    goto RUN
)

echo.
echo [ERROR] Python not found on your PC.
echo Please install Python from https://www.python.org/downloads/
echo or enable Python from Microsoft Store.
pause
exit /b 1

:RUN
echo  [2/2] Launching Backend Server and Web Application...
echo.
if exist "cloudflared.exe" (
    tasklist /fi "imagename eq cloudflared.exe" 2>nul | find /i "cloudflared.exe" >nul
    if errorlevel 1 (
        echo  Starting Cloudflare Public Tunnel for Mobile Phones...
        start /b "" cloudflared.exe tunnel --url http://localhost:8000 > cloudflare_tunnel.log 2>&1
    )
)
echo ================================================================
echo  Starting server at: http://localhost:8000
echo  Your browser will open automatically in a few seconds...
echo  To STOP the server, close this black window or press Ctrl+C.
echo ================================================================
echo.

%PY_CMD% server.py

pause

@echo off
title DBMS Normalization Practice Platform
cd /d "%~dp0"
echo ======================================================
echo    Starting DBMS Normalization Platform...
echo ======================================================

:: Check if Node is installed
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Starting with Node.js...
    start "" "http://localhost:3000"
    node server.js
    goto end
)

:: Check if Python is installed as fallback
where py >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Starting with Python...
    start "" "http://localhost:3000"
    py -m http.server 3000
    goto end
)

:: Direct browser file fallback
echo Opening index.html directly in your default browser...
start "" "%~dp0index.html"

:end

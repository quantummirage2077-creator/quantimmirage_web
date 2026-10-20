@echo off
cd /d "%~dp0"
if not exist "site\index.html" (
  echo [ERROR] site\index.html not found. Run build.bat first.
  pause
  exit /b 1
)
start "" "site\index.html"

@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo [ERROR] Node.js not found.
  echo Install the LTS version from https://nodejs.org/ then run this file again.
  echo.
  pause
  exit /b 1
)

echo Building site ...
echo.
node build.mjs
if errorlevel 1 goto fail

echo.
echo [OK] Done. Open site\index.html to preview, or double-click preview.bat.
echo.
pause
exit /b 0

:fail
echo.
echo [FAILED] Fix the error shown above, then run this file again.
echo.
pause
exit /b 1

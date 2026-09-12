@echo off
cd /d "%~dp0"
echo Installing/checking Pillow...
py -m pip install pillow
echo.
echo Building 320x320 WebP game covers...
py tools\build-local-webp.py
echo.
if errorlevel 1 (
  echo Some images failed. Check the list above.
) else (
  echo All game covers were created successfully.
)
echo.
pause

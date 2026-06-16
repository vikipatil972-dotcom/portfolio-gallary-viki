@echo off
cd /d "%~dp0"
echo ==================================================
echo   Git Push Script - Vivek Portfolio Image Fix
echo ==================================================
echo.

echo [1/5] Initializing Git...
git init

echo.
echo [2/5] Setting Remote URL...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/vikipatil972-dotcom/portfolio-gallary-viki.git

echo.
echo [3/5] Staging files...
git add index.html app.js style.css photo1.jpg photo2.jpg photo3.jpg photo4.jpg photo5.jpg

echo.
echo [4/5] Committing changes...
git commit -m "Fix broken images by referencing root-level paths"

echo.
echo [5/5] Pushing to GitHub (main branch)...
git branch -M main
git push -u origin main

echo.
echo ==================================================
echo   Process Complete!
echo ==================================================
echo.
pause

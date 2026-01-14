@echo off
echo ========================================
echo Pushing VirtMo to GitHub
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo Git is installed. Proceeding...
echo.

REM Initialize git if not already initialized
if not exist .git (
    echo Initializing git repository...
    git init
)

REM Add remote repository
echo Adding remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/BOYRAHEEM/VirtPay.git
echo.

REM Add all files
echo Adding all files...
git add .
echo.

REM Commit changes
echo Committing changes...
git commit -m "Initial commit: VirtMo - Virtual Cards for Mobile Money Users in Ghana with KYC verification"
echo.

REM Push to GitHub
echo Pushing to GitHub...
echo NOTE: You may be prompted for your GitHub credentials.
echo.
git branch -M main
git push -u origin main

if errorlevel 1 (
    echo.
    echo ERROR: Failed to push to GitHub.
    echo.
    echo Possible solutions:
    echo 1. Make sure you have access to the repository
    echo 2. Use a Personal Access Token instead of password
    echo 3. Check your internet connection
    echo.
    echo For help, see GITHUB_SETUP.md
) else (
    echo.
    echo ========================================
    echo SUCCESS! Code pushed to GitHub!
    echo ========================================
    echo.
    echo View your repository at:
    echo https://github.com/BOYRAHEEM/VirtPay
    echo.
)

pause

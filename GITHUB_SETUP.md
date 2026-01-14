# How to Push Code to GitHub

Follow these steps to push your VirtMo code to GitHub:

## Prerequisites
1. Install Git: Download from https://git-scm.com/download/win
2. Create a GitHub account (if you don't have one)
3. Make sure your repository exists at: https://github.com/BOYRAHEEM/VirtPay.git

## Steps to Push Code

### 1. Open Git Bash or PowerShell in your project directory
```bash
cd C:\Users\manan\Desktop\virtmo
```

### 2. Initialize Git (if not already initialized)
```bash
git init
```

### 3. Add the remote repository
```bash
git remote add origin https://github.com/BOYRAHEEM/VirtPay.git
```

If the remote already exists, use:
```bash
git remote set-url origin https://github.com/BOYRAHEEM/VirtPay.git
```

### 4. Add all files
```bash
git add .
```

### 5. Commit the changes
```bash
git commit -m "Initial commit: VirtMo - Virtual Cards for Mobile Money Users in Ghana"
```

### 6. Push to GitHub
```bash
git branch -M main
git push -u origin main
```

## If you encounter authentication issues:

### Option 1: Use Personal Access Token
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token with `repo` permissions
3. Use the token as password when prompted

### Option 2: Use GitHub CLI
```bash
gh auth login
```

## Alternative: Using GitHub Desktop
1. Download GitHub Desktop from https://desktop.github.com/
2. Open GitHub Desktop
3. File > Add Local Repository
4. Select your project folder
5. Click "Publish repository" and choose your repository

## Files to Include
- ✅ All source code files
- ✅ package.json and configuration files
- ✅ README.md
- ✅ .gitignore (excludes node_modules, .expo, etc.)

## Files Excluded (via .gitignore)
- ❌ node_modules/
- ❌ .expo/
- ❌ Build files
- ❌ Environment variables

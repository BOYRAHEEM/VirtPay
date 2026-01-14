# Common Fixes for VirtMo App

## If the app won't start:

1. **Clear all caches and restart:**
   ```bash
   npx expo start --clear --reset-cache
   ```

2. **Kill processes on port 8081:**
   ```bash
   netstat -ano | findstr :8081
   taskkill /F /PID <PID>
   ```

3. **Reinstall dependencies:**
   ```bash
   Remove-Item -Recurse -Force node_modules
   npm install
   npx expo start --clear
   ```

4. **Check for missing dependencies:**
   - Make sure `babel-preset-expo` is in dependencies (not devDependencies)
   - Verify all packages are installed: `npm list --depth=0`

## If you see runtime errors:

1. **React Navigation errors:**
   - Make sure `react-native-gesture-handler` is imported at the top of App.js
   - Verify all navigation packages are installed

2. **Module not found errors:**
   - Clear Metro cache: `npx expo start --clear`
   - Restart the development server

3. **Babel preset errors:**
   - Ensure `babel-preset-expo` is in dependencies
   - Check `babel.config.js` is correct

## Quick Diagnostic Commands:

```bash
# Check Node version (should be 14+)
node --version

# Check npm version
npm --version

# Verify Expo installation
npx expo --version

# List all dependencies
npm list --depth=0

# Check for port conflicts
netstat -ano | findstr :8081
```

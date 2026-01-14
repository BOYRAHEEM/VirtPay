# Troubleshooting "Could not connect to server" Error

## Common Solutions

### 1. Clear Expo Cache
```bash
npx expo start --clear
```

### 2. Check if Port is Available
The default Expo port is 8081. If it's in use:
```bash
# Kill process on port 8081 (Windows)
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

### 3. Use Tunnel Mode
If you're on a different network or behind a firewall:
```bash
npx expo start --tunnel
```

### 4. Check Firewall Settings
- Windows Firewall might be blocking Expo
- Allow Node.js through Windows Firewall
- Or temporarily disable firewall to test

### 5. Try Different Connection Methods

**LAN Mode (Same WiFi):**
```bash
npx expo start --lan
```

**Localhost Only:**
```bash
npx expo start --localhost
```

### 6. Reinstall Dependencies
```bash
rm -rf node_modules
npm install
```

### 7. Check Network Configuration
- Ensure your device and computer are on the same WiFi network
- Try using your computer's IP address directly in Expo Go app
- Check if your router blocks device-to-device communication

### 8. Use Expo Go App
1. Install Expo Go from App Store (iOS) or Google Play (Android)
2. Make sure your phone and computer are on the same WiFi
3. Scan the QR code from the terminal

### 9. Alternative: Use Web Version
```bash
npx expo start --web
```
Then open http://localhost:19006 in your browser

## Quick Fix Commands

```bash
# Stop all Node processes
taskkill /F /IM node.exe

# Clear cache and restart
npx expo start --clear

# Or use tunnel
npx expo start --tunnel
```

## Still Having Issues?

1. Check the terminal output for specific error messages
2. Verify Node.js version: `node --version` (should be 14+)
3. Verify npm version: `npm --version`
4. Try updating Expo: `npm install -g expo-cli@latest`

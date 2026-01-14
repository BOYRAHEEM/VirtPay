# Quick Start Guide

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (will be installed automatically)
- iOS Simulator (for Mac) or Android Emulator, or Expo Go app on your phone

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on your device:**
   - **iOS**: Press `i` in the terminal or scan QR code with Camera app (iOS)
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal

## Using Expo Go App

1. Install Expo Go from App Store (iOS) or Google Play (Android)
2. Run `npm start`
3. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

## Project Features

✅ Apple-inspired UI/UX design
✅ Virtual card generation (Visa/Mastercard)
✅ Mobile money integration (MTN, Vodafone, AirtelTigo)
✅ Card management (view, delete, share)
✅ Settings screen
✅ Haptic feedback
✅ Smooth animations

## App Structure

- **Home**: Overview and quick actions
- **Cards**: View all your virtual cards
- **Generate**: Create new virtual cards
- **Settings**: App preferences and account settings

## Notes

- This is a demo app with simulated card generation
- For production, integrate with real payment gateways
- Card numbers are randomly generated for demo purposes
- All data is stored locally (use AsyncStorage or backend in production)

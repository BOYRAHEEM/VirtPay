# VirtMo - Virtual Cards for Mobile Money Users in Ghana

A beautiful React Native app for generating Visa/Mastercard virtual cards linked to mobile money accounts in Ghana, without requiring traditional banks.

## Features

- 🎨 **Apple-inspired UI/UX** - Modern, clean design following iOS design guidelines
- 💳 **Virtual Card Generation** - Create Visa or Mastercard virtual cards instantly
- 📱 **Mobile Money Integration** - Support for MTN Mobile Money, Vodafone Cash, and AirtelTigo Money
- 🔐 **KYC Verification** - Sign up with Ghana Card and phone number for secure verification
- 📱 **Authentication** - Complete login/signup system with secure password management
- 📊 **Activity Center** - Track all card activities and transactions
- 🔒 **Secure** - Card details with CVV protection and secure storage
- 📊 **Card Management** - View, manage, and delete your virtual cards
- 🎯 **Intuitive Navigation** - Bottom tab navigation with smooth transitions
- ✨ **Haptic Feedback** - Enhanced user experience with tactile feedback

## Tech Stack

- **React Native** with Expo
- **React Navigation** for navigation
- **Expo Linear Gradient** for beautiful card designs
- **Expo Blur** for iOS-style blur effects
- **Expo Haptics** for tactile feedback
- **Context API** for state management

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on iOS:
```bash
npm run ios
```

4. Run on Android:
```bash
npm run android
```

## Project Structure

```
virtmo/
├── App.js                 # Main app component with navigation
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Button.js     # Apple-style button component
│   │   ├── Card.js       # Virtual card display component
│   │   └── Input.js      # Form input component
│   ├── context/          # Context providers
│   │   ├── CardContext.js # Card state management
│   │   └── AuthContext.js # Authentication state management
│   └── screens/          # App screens
│       ├── HomeScreen.js
│       ├── GenerateCardScreen.js
│       ├── MyCardsScreen.js
│       ├── CardDetailsScreen.js
│       ├── ActivityScreen.js
│       ├── SettingsScreen.js
│       ├── LoginScreen.js
│       └── SignupScreen.js
├── package.json
└── README.md
```

## Key Features

### Home Screen
- Overview of your latest card
- Quick statistics (total balance, active cards)
- Quick action buttons
- Recent cards carousel

### Generate Card Screen
- Form to create new virtual cards
- Mobile money provider selection
- Cardholder information input
- Initial balance setup

### My Cards Screen
- List of all your virtual cards
- Card management (view, delete)
- Empty state with call-to-action

### Card Details Screen
- Full card information
- CVV reveal/hide functionality
- Share card details
- Delete card option

### Activity Screen
- Complete activity history
- Filter by type (All, Cards, Transactions)
- Color-coded activity types
- Relative timestamps

### Settings Screen
- Account settings
- Preferences (notifications, biometric)
- Support and help
- App information
- Sign out functionality

### Authentication
- **Signup Screen**: Ghana Card and phone number KYC verification
- **Login Screen**: Secure phone number and password authentication
- Auto-formatting for Ghana Card numbers (GHA-123456789-1)
- Auto-formatting for Ghana phone numbers (0244 123 4567)
- Real-time validation

## Design Principles

- **Apple Human Interface Guidelines** - Following iOS design patterns
- **Accessibility** - Clear labels and touch targets
- **Consistency** - Unified color scheme and typography
- **Feedback** - Haptic feedback for user interactions
- **Security** - CVV protection and secure card handling

## Mobile Money Providers Supported

- MTN Mobile Money
- Vodafone Cash
- AirtelTigo Money

## Notes

This is a demo application. In a production environment, you would need to:
- Integrate with actual payment gateways
- Implement secure backend API
- Add authentication and user accounts
- Connect to real mobile money APIs
- Implement proper card generation with payment processors
- Add encryption and secure storage

## License

This project is for demonstration purposes.

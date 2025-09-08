# Talkie Gen AI - iOS React Native App

A React Native iOS app version of the Talkie Gen AI website, providing an intelligent AI assistant experience optimized for mobile devices.

## Features

- 🤖 **AI-Powered Conversations**: Chat with an advanced AI assistant
- 🧠 **Memory System**: AI remembers your preferences and conversation history
- 🎨 **Multiple Themes**: Light, Dark, and Pro themes
- 👤 **User Authentication**: Sign up and sign in functionality
- ⚙️ **Customizable Settings**: Adjust AI behavior and preferences
- 📱 **Mobile-Optimized UI**: Native iOS interface with smooth animations
- 💎 **Pro Features**: Enhanced capabilities for Pro users
- 🔧 **Admin Panel**: Administrative features for app management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- React Native CLI
- Xcode (for iOS development)
- iOS Simulator or physical iOS device

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS dependencies**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Start Metro bundler**
   ```bash
   npm start
   ```

5. **Run on iOS**
   ```bash
   npm run ios
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Sidebar.js      # Navigation sidebar
│   ├── MessageBubble.js # Chat message component
│   ├── WelcomeScreen.js # Welcome/landing screen
│   └── TypingIndicator.js # AI typing animation
├── screens/            # Screen components
│   ├── MainScreen.js   # Main chat interface
│   ├── AuthScreen.js   # Login/signup screen
│   ├── SettingsScreen.js # App settings
│   ├── ProfileScreen.js # User profile (Pro)
│   ├── AdminScreen.js  # Admin dashboard
│   └── DocsScreen.js   # Documentation
├── context/            # React Context providers
│   ├── ThemeContext.js # Theme management
│   ├── AuthContext.js  # Authentication state
│   └── ChatContext.js  # Chat and AI functionality
├── services/           # API and service functions
├── utils/              # Utility functions
└── styles/             # Global styles
```

## Key Features Explained

### AI Integration
- Uses Groq API for AI responses
- Contextual conversation management
- Memory system for personalized interactions

### Authentication System
- Local storage-based user management
- Pre-configured admin account (coenyin9@gmail.com)
- Pro user tier with enhanced features

### Theme System
- Dynamic theme switching
- Support for light, dark, and pro themes
- Consistent styling across all components

### Mobile Optimization
- Touch-friendly interface
- Gesture navigation
- Keyboard handling
- Safe area support

## Configuration

### API Configuration
The app uses the Groq API for AI responses. The API key is configured in `src/context/ChatContext.js`:

```javascript
const GROQ_API_KEY = 'your-api-key-here';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
```

### Admin Account
A default admin account is automatically created:
- **Email**: coenyin9@gmail.com
- **Password**: Carronshore93

## Building for Production

### iOS App Store Build

1. **Archive the app**
   ```bash
   npx react-native run-ios --configuration Release
   ```

2. **Open in Xcode**
   - Open `ios/TalkieGenAI.xcworkspace` in Xcode
   - Select your team and provisioning profile
   - Archive and upload to App Store Connect

## Data Storage

The app uses AsyncStorage for local data persistence:
- User authentication data
- Chat history and conversations
- User preferences and settings
- AI memory and context

## Dependencies

Key dependencies include:
- `@react-navigation/native` - Navigation
- `@react-native-async-storage/async-storage` - Local storage
- `react-native-linear-gradient` - Gradient components
- `react-native-vector-icons` - Icon library
- `react-native-toast-message` - Toast notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.

## Support

For support and questions, contact the development team or check the in-app documentation.
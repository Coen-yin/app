# Talkie Gen AI - React Native App

A powerful AI chat assistant built with React Native and Expo, ready to run in Expo Snack.

## 🚀 Quick Start with Expo Snack

1. Go to [https://snack.expo.dev/](https://snack.expo.dev/)
2. Create a new snack
3. Copy all files from this repository to the snack
4. The app will automatically start running
5. Test it in the web preview or scan the QR code with Expo Go on your phone

## Features

- 🤖 **AI-Powered Conversations**: Chat with an advanced AI assistant using Groq API
- 🧠 **Memory System**: AI remembers your preferences and conversation history
- 🎨 **Multiple Themes**: Light, Dark, and Pro themes with beautiful gradients
- 👤 **User Authentication**: Sign up and sign in functionality
- ⚙️ **Customizable Settings**: Adjust AI behavior, context length, and response style
- 📱 **Mobile-Optimized UI**: Native mobile interface with smooth animations
- 💎 **Pro Features**: Enhanced capabilities for Pro users
- 🔧 **Admin Panel**: Administrative features and analytics

## Local Development

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI: `npm install -g expo-cli`

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

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run the app**
   - Scan QR code with Expo Go app on your phone
   - Press `i` for iOS simulator
   - Press `a` for Android emulator

## Project Structure

```
├── App.js                 # Main app component with navigation
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── MessageBubble.js
│   │   ├── Sidebar.js
│   │   ├── TypingIndicator.js
│   │   └── WelcomeScreen.js
│   ├── context/          # React context providers
│   │   ├── AuthContext.js
│   │   ├── ChatContext.js
│   │   └── ThemeContext.js
│   └── screens/          # App screens
│       ├── MainScreen.js
│       ├── AuthScreen.js
│       ├── SettingsScreen.js
│       ├── ProfileScreen.js
│       ├── AdminScreen.js
│       └── DocsScreen.js
├── assets/               # App icons and images
├── app.json             # Expo configuration
└── package.json         # Dependencies and scripts
```

## Key Components

- **MainScreen**: The main chat interface with message history and input
- **AuthScreen**: User login and registration
- **SettingsScreen**: Conversation and app settings
- **Sidebar**: Navigation and chat history
- **WelcomeScreen**: Initial screen with example prompts

## Technologies Used

- **React Native**: Cross-platform mobile framework
- **Expo**: Development and deployment platform  
- **React Navigation**: Screen navigation
- **AsyncStorage**: Local data persistence
- **@expo/vector-icons**: Beautiful icons
- **expo-linear-gradient**: Gradient backgrounds and buttons

## Key Features Explained

## AI Integration

The app uses the Groq API for AI responses with contextual memory:

- **Contextual Conversations**: Maintains conversation context and memory
- **User Memory**: Remembers preferences, topics, and personal information
- **Multiple Response Styles**: Concise, balanced, detailed, or creative
- **Pro Features**: Enhanced AI capabilities for Pro users

### Admin Account
A default admin account is automatically created:
- **Email**: coenyin9@gmail.com
- **Password**: Carronshore93

## Building for Distribution

### Expo EAS Build

1. **Install EAS CLI**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Configure EAS**
   ```bash
   eas build:configure
   ```

3. **Build for iOS/Android**
   ```bash
   eas build --platform ios
   eas build --platform android
   ```

### Manual Export

```bash
npx expo export
```

## Data Storage

The app uses AsyncStorage for local data persistence:
- User authentication data
- Chat history and conversations  
- User preferences and settings
- AI memory and context

## Dependencies

Key Expo-compatible dependencies:
- `expo` - Expo platform
- `@react-navigation/native` - Navigation
- `@react-native-async-storage/async-storage` - Local storage
- `expo-linear-gradient` - Gradient components
- `@expo/vector-icons` - Icon library
- `expo-clipboard` - Clipboard functionality

## License

This project is open source. Feel free to use and modify as needed.

## Support

For support and questions, check the in-app documentation or create an issue.
import React, {useEffect, useState, useCallback} from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar, useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';

// Import screens
import MainScreen from './src/screens/MainScreen';
import AuthScreen from './src/screens/AuthScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AdminScreen from './src/screens/AdminScreen';
import DocsScreen from './src/screens/DocsScreen';

// Import context
import {ThemeProvider} from './src/context/ThemeContext';
import {AuthProvider} from './src/context/AuthContext';
import {ChatProvider} from './src/context/ChatContext';

const Stack = createStackNavigator();

// Custom themes for the app
const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#667eea',
    background: '#f8fafc',
    card: '#ffffff',
    text: '#1a202c',
    border: '#e2e8f0',
    notification: '#667eea',
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#667eea',
    background: '#1a202c',
    card: '#2d3748',
    text: '#f7fafc',
    border: '#4a5568',
    notification: '#667eea',
  },
};

const ProTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#ffd700',
    background: '#0a0a0f',
    card: '#1a1a2e',
    text: '#e6e6fa',
    border: '#2d2d4a',
    notification: '#ffd700',
  },
};

function App() {
  const systemColorScheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  const loadThemeFromStorage = useCallback(async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('talkie-theme');
      if (savedTheme) {
        setCurrentTheme(savedTheme);
      } else {
        setCurrentTheme(systemColorScheme || 'light');
      }
    } catch (error) {
      console.log('Error loading theme:', error);
      setCurrentTheme(systemColorScheme || 'light');
    } finally {
      setIsLoading(false);
    }
  }, [systemColorScheme]);

  useEffect(() => {
    loadThemeFromStorage();
  }, [loadThemeFromStorage]);

  const getNavigationTheme = () => {
    switch (currentTheme) {
      case 'dark':
        return CustomDarkTheme;
      case 'pro':
        return ProTheme;
      default:
        return LightTheme;
    }
  };

  if (isLoading) {
    return null; // You can add a loading screen here
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <NavigationContainer theme={getNavigationTheme()}>
            <ExpoStatusBar
              style={currentTheme === 'light' ? 'dark' : 'light'}
              backgroundColor={getNavigationTheme().colors.background}
            />
            <Stack.Navigator
              initialRouteName="Main"
              screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                cardStyleInterpolator: ({current, layouts}) => {
                  return {
                    cardStyle: {
                      transform: [
                        {
                          translateX: current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [layouts.screen.width, 0],
                          }),
                        },
                      ],
                    },
                  };
                },
              }}>
              <Stack.Screen name="Main" component={MainScreen} />
              <Stack.Screen 
                name="Auth" 
                component={AuthScreen}
                options={{
                  presentation: 'modal',
                  headerShown: false,
                }}
              />
              <Stack.Screen 
                name="Settings" 
                component={SettingsScreen}
                options={{
                  presentation: 'modal',
                  headerShown: true,
                  title: 'Settings',
                }}
              />
              <Stack.Screen 
                name="Profile" 
                component={ProfileScreen}
                options={{
                  presentation: 'modal',
                  headerShown: true,
                  title: 'Profile',
                }}
              />
              <Stack.Screen 
                name="Admin" 
                component={AdminScreen}
                options={{
                  presentation: 'modal',
                  headerShown: true,
                  title: 'Admin Dashboard',
                }}
              />
              <Stack.Screen 
                name="Docs" 
                component={DocsScreen}
                options={{
                  presentation: 'modal',
                  headerShown: true,
                  title: 'Documentation',
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
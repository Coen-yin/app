import React, {createContext, useContext, useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useColorScheme} from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Define theme colors
export const themes = {
  light: {
    bgPrimary: '#ffffff',
    bgSecondary: '#f8fafc',
    bgTertiary: '#ffffff',
    textPrimary: '#1a202c',
    textSecondary: '#4a5568',
    textTertiary: '#718096',
    borderLight: '#e2e8f0',
    borderMedium: '#cbd5e0',
    accentPrimary: '#667eea',
    accentSecondary: '#764ba2',
    accentHover: '#5a67d8',
    success: '#48bb78',
    warning: '#ed8936',
    danger: '#f56565',
    gradientPrimary: ['#667eea', '#764ba2'],
    gradientSecondary: ['#f093fb', '#f5576c'],
    gradientSuccess: ['#4facfe', '#00f2fe'],
    shadowSm: 'rgba(0, 0, 0, 0.1)',
    shadowMd: 'rgba(0, 0, 0, 0.1)',
    shadowLg: 'rgba(0, 0, 0, 0.1)',
    shadowXl: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    bgPrimary: '#1a202c',
    bgSecondary: '#2d3748',
    bgTertiary: '#4a5568',
    textPrimary: '#f7fafc',
    textSecondary: '#e2e8f0',
    textTertiary: '#a0aec0',
    borderLight: '#4a5568',
    borderMedium: '#718096',
    accentPrimary: '#667eea',
    accentSecondary: '#764ba2',
    accentHover: '#5a67d8',
    success: '#48bb78',
    warning: '#ed8936',
    danger: '#f56565',
    gradientPrimary: ['#667eea', '#764ba2'],
    gradientSecondary: ['#f093fb', '#f5576c'],
    gradientSuccess: ['#4facfe', '#00f2fe'],
    shadowSm: 'rgba(0, 0, 0, 0.3)',
    shadowMd: 'rgba(0, 0, 0, 0.3)',
    shadowLg: 'rgba(0, 0, 0, 0.3)',
    shadowXl: 'rgba(0, 0, 0, 0.3)',
  },
  pro: {
    bgPrimary: '#0a0a0f',
    bgSecondary: '#1a1a2e',
    bgTertiary: '#16213e',
    textPrimary: '#e6e6fa',
    textSecondary: '#c9c9ff',
    textTertiary: '#9999cc',
    borderLight: '#2d2d4a',
    borderMedium: '#4a4a6d',
    accentPrimary: '#ffd700',
    accentSecondary: '#ff8c00',
    accentHover: '#ffed4e',
    success: '#00ff88',
    warning: '#ff6b35',
    danger: '#ff4757',
    gradientPrimary: ['#ffd700', '#ff8c00'],
    gradientSecondary: ['#ff6b35', '#ff4757'],
    gradientSuccess: ['#00ff88', '#00e5ff'],
    shadowSm: 'rgba(255, 215, 0, 0.2)',
    shadowMd: 'rgba(255, 215, 0, 0.3)',
    shadowLg: 'rgba(255, 215, 0, 0.4)',
    shadowXl: 'rgba(255, 215, 0, 0.5)',
  },
};

export const ThemeProvider = ({children}) => {
  const systemColorScheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  const loadTheme = useCallback(async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('talkie-theme');
      if (savedTheme && themes[savedTheme]) {
        setCurrentTheme(savedTheme);
      } else {
        const defaultTheme = systemColorScheme === 'dark' ? 'dark' : 'light';
        setCurrentTheme(defaultTheme);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
      setCurrentTheme('light');
    } finally {
      setIsLoading(false);
    }
  }, [systemColorScheme]);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  const changeTheme = async (newTheme) => {
    try {
      await AsyncStorage.setItem('talkie-theme', newTheme);
      setCurrentTheme(newTheme);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const toggleTheme = (isPro = false) => {
    if (isPro) {
      // Pro users can cycle through light -> dark -> pro
      switch (currentTheme) {
        case 'light':
          changeTheme('dark');
          break;
        case 'dark':
          changeTheme('pro');
          break;
        case 'pro':
          changeTheme('light');
          break;
        default:
          changeTheme('light');
      }
    } else {
      // Free users only toggle between light and dark
      changeTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }
  };

  const theme = themes[currentTheme];

  const value = {
    theme,
    currentTheme,
    changeTheme,
    toggleTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
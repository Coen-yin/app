import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Simple hash function for demo purposes - NOT secure for production
const hashPassword = (password) => {
  let hash = 0;
  if (password.length === 0) return hash;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString();
};

export const AuthProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
    initializeAdmin();
  }, []);

  const initializeAuth = async () => {
    try {
      const userData = await AsyncStorage.getItem('talkie-user');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeAdmin = async () => {
    try {
      const usersData = await AsyncStorage.getItem('talkie-users');
      const users = usersData ? JSON.parse(usersData) : {};
      const adminEmail = 'coenyin9@gmail.com';

      // Always ensure admin account exists with correct properties
      if (!users[adminEmail]) {
        const hashedPassword = hashPassword('Carronshore93');
        users[adminEmail] = {
          name: 'Coen Admin',
          email: adminEmail,
          password: hashedPassword,
          createdAt: new Date().toISOString(),
          isPro: true,
          isAdmin: true,
          profilePhoto: null,
        };
        await AsyncStorage.setItem('talkie-users', JSON.stringify(users));
        console.log('Admin account created successfully');
      } else {
        // Ensure existing admin account has all required properties
        if (!users[adminEmail].isAdmin) {
          users[adminEmail].isAdmin = true;
          users[adminEmail].isPro = true;
          await AsyncStorage.setItem('talkie-users', JSON.stringify(users));
          console.log('Admin account permissions updated');
        }
      }
    } catch (error) {
      console.error('Error initializing admin account:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const usersData = await AsyncStorage.getItem('talkie-users');
      const users = usersData ? JSON.parse(usersData) : {};
      const user = users[email];

      if (!user) {
        Alert.alert('Login Failed', 'No account found with this email.');
        return false;
      }

      const hashedPassword = hashPassword(password);
      if (user.password !== hashedPassword) {
        Alert.alert('Login Failed', 'Incorrect password.');
        return false;
      }

      // Log in the user
      const userData = {
        name: user.name,
        email: user.email,
        isPro: user.isPro || false,
        isAdmin: user.isAdmin || false,
        profilePhoto: user.profilePhoto || null,
      };

      setCurrentUser(userData);
      await AsyncStorage.setItem('talkie-user', JSON.stringify(userData));

      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: `Good to see you, ${user.name}`,
      });

      return true;
    } catch (error) {
      console.error('Login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: 'An error occurred during login.',
      });
      return false;
    }
  };

  const signup = async (name, email, password) => {
    try {
      // Validation
      if (!name || !email || !password) {
        Toast.show({
          type: 'error',
          text1: 'Signup Failed',
          text2: 'Please fill in all fields.',
        });
        return false;
      }

      if (password.length < 6) {
        Toast.show({
          type: 'error',
          text1: 'Signup Failed',
          text2: 'Password must be at least 6 characters.',
        });
        return false;
      }

      // Check if user already exists
      const usersData = await AsyncStorage.getItem('talkie-users');
      const users = usersData ? JSON.parse(usersData) : {};

      if (users[email]) {
        Toast.show({
          type: 'error',
          text1: 'Signup Failed',
          text2: 'An account with this email already exists.',
        });
        return false;
      }

      // Create new user
      const hashedPassword = hashPassword(password);
      const newUser = {
        name,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        isPro: false,
        isAdmin: false,
        profilePhoto: null,
      };

      // Save user
      users[email] = newUser;
      await AsyncStorage.setItem('talkie-users', JSON.stringify(users));

      // Log in the user
      const userData = {
        name,
        email,
        isPro: false,
        isAdmin: false,
        profilePhoto: null,
      };

      setCurrentUser(userData);
      await AsyncStorage.setItem('talkie-user', JSON.stringify(userData));

      Toast.show({
        type: 'success',
        text1: 'Welcome to Talkie Gen AI!',
        text2: `Account created successfully, ${name}`,
      });

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      Toast.show({
        type: 'error',
        text1: 'Signup Error',
        text2: 'An error occurred during signup.',
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      setCurrentUser(null);
      await AsyncStorage.removeItem('talkie-user');
      Toast.show({
        type: 'success',
        text1: 'Signed Out',
        text2: 'You have been signed out successfully.',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const updatedUser = {...currentUser, ...updates};
      
      // Update local state
      setCurrentUser(updatedUser);
      await AsyncStorage.setItem('talkie-user', JSON.stringify(updatedUser));

      // Update in users database
      const usersData = await AsyncStorage.getItem('talkie-users');
      const users = usersData ? JSON.parse(usersData) : {};
      
      if (users[currentUser.email]) {
        users[currentUser.email] = {...users[currentUser.email], ...updates};
        await AsyncStorage.setItem('talkie-users', JSON.stringify(users));
      }

      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your profile has been updated successfully.',
      });

      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Failed to update profile.',
      });
      return false;
    }
  };

  const upgradeToPro = async () => {
    if (!currentUser) return false;

    try {
      const updates = {
        isPro: true,
        proUpgradeDate: new Date().toISOString(),
      };

      await updateProfile(updates);

      Toast.show({
        type: 'success',
        text1: '🎉 Welcome to Talkie Gen Pro!',
        text2: 'You now have access to exclusive features.',
      });

      return true;
    } catch (error) {
      console.error('Pro upgrade error:', error);
      return false;
    }
  };

  const value = {
    currentUser,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    upgradeToPro,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {MaterialIcons} from '@expo/vector-icons';

import {useTheme} from '../context/ThemeContext';

const DocsScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'play',
    },
    {
      id: 'features',
      title: 'Features',
      icon: 'star',
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings',
    },
    {
      id: 'pro-features',
      title: 'Pro Features',
      icon: 'crown',
    },
    {
      id: 'help',
      title: 'Help & FAQ',
      icon: 'help-circle',
    },
  ];

  const content = {
    'getting-started': {
      title: '🚀 Getting Started',
      content: [
        {
          type: 'text',
          content: 'Welcome to Talkie Gen AI - your intelligent AI companion! Here\'s everything you need to know to get started.',
        },
        {
          type: 'heading',
          content: 'What is Talkie Gen AI?',
        },
        {
          type: 'text',
          content: 'Talkie Gen AI is an advanced conversational AI assistant powered by cutting-edge language models. It can help you with writing, programming, problem solving, creative tasks, and much more.',
        },
        {
          type: 'heading',
          content: 'How to Start Chatting',
        },
        {
          type: 'list',
          content: [
            'Type your message in the input box at the bottom',
            'Press Send or the send button',
            'Wait for the AI to respond',
            'Continue the conversation naturally!',
          ],
        },
      ],
    },
    'features': {
      title: '⭐ Core Features',
      content: [
        {
          type: 'heading',
          content: '💬 Intelligent Conversations',
        },
        {
          type: 'text',
          content: 'Talkie Gen AI maintains context throughout your conversation and provides thoughtful, relevant responses.',
        },
        {
          type: 'heading',
          content: '🧠 Memory System',
        },
        {
          type: 'text',
          content: 'The AI can remember information about you across sessions when enabled in settings, including your preferences, interests, and conversation history.',
        },
        {
          type: 'heading',
          content: '💻 Code Support',
        },
        {
          type: 'text',
          content: 'Get help with programming in multiple languages with syntax highlighting, code explanations, and best practices.',
        },
      ],
    },
    'settings': {
      title: '⚙️ Settings & Customization',
      content: [
        {
          type: 'heading',
          content: 'Context & Memory',
        },
        {
          type: 'text',
          content: 'Control how many previous messages to remember and whether to enable memory across sessions.',
        },
        {
          type: 'heading',
          content: 'Response Style',
        },
        {
          type: 'text',
          content: 'Choose between Concise, Balanced, Detailed, or Creative response styles, and select an AI personality that matches your preferences.',
        },
        {
          type: 'heading',
          content: 'Themes',
        },
        {
          type: 'text',
          content: 'Switch between Light Mode, Dark Mode, and Pro Mode (for Pro users) to customize your experience.',
        },
      ],
    },
    'pro-features': {
      title: '👑 Pro Features',
      content: [
        {
          type: 'text',
          content: 'Upgrade to Talkie Gen Pro for enhanced capabilities and exclusive features.',
        },
        {
          type: 'heading',
          content: 'Enhanced AI Responses',
        },
        {
          type: 'list',
          content: [
            'More detailed and comprehensive answers',
            'Advanced contextual understanding',
            'Superior memory capabilities',
            'Faster response times',
          ],
        },
        {
          type: 'heading',
          content: 'Exclusive Features',
        },
        {
          type: 'list',
          content: [
            'Profile customization with photo uploads',
            'Advanced memory management',
            'Exclusive Pro theme',
            'Priority support',
          ],
        },
      ],
    },
    'help': {
      title: '❓ Help & FAQ',
      content: [
        {
          type: 'heading',
          content: 'Common Issues',
        },
        {
          type: 'text',
          content: 'Q: The AI isn\'t responding to my messages',
        },
        {
          type: 'text',
          content: 'A: This could be due to internet connectivity issues or temporary server maintenance. Try refreshing the app.',
        },
        {
          type: 'text',
          content: 'Q: My chat history disappeared',
        },
        {
          type: 'text',
          content: 'A: Chat history is stored locally on your device. Make sure you haven\'t cleared the app data.',
        },
        {
          type: 'heading',
          content: 'Best Practices',
        },
        {
          type: 'list',
          content: [
            'Be specific about what you need help with',
            'Use the settings to customize your experience',
            'Export important conversations regularly',
            'Keep the app updated for the best experience',
          ],
        },
      ],
    },
  };

  const renderNavItem = (section) => (
    <TouchableOpacity
      key={section.id}
      style={[
        styles.navItem,
        {
          backgroundColor: activeSection === section.id ? theme.accentPrimary : 'transparent',
          borderColor: theme.borderLight,
        },
      ]}
      onPress={() => setActiveSection(section.id)}>
      <Feather 
        name={section.icon} 
        size={16} 
        color={activeSection === section.id ? 'white' : theme.textSecondary} 
      />
      <Text
        style={[
          styles.navText,
          {
            color: activeSection === section.id ? 'white' : theme.textSecondary,
          },
        ]}>
        {section.title}
      </Text>
    </TouchableOpacity>
  );

  const renderContentItem = (item, index) => {
    switch (item.type) {
      case 'heading':
        return (
          <Text
            key={index}
            style={[styles.contentHeading, {color: theme.textPrimary}]}>
            {item.content}
          </Text>
        );
      case 'list':
        return (
          <View key={index} style={styles.list}>
            {item.content.map((listItem, listIndex) => (
              <Text
                key={listIndex}
                style={[styles.listItem, {color: theme.textSecondary}]}>
                • {listItem}
              </Text>
            ))}
          </View>
        );
      default:
        return (
          <Text
            key={index}
            style={[styles.contentText, {color: theme.textSecondary}]}>
            {item.content}
          </Text>
        );
    }
  };

  const currentContent = content[activeSection];

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.bgSecondary}]}>
      <View style={styles.docsContainer}>
        {/* Navigation */}
        <View style={[styles.nav, {backgroundColor: theme.bgPrimary, borderRightColor: theme.borderLight}]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {sections.map(renderNavItem)}
          </ScrollView>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}>
          
          <Text style={[styles.contentTitle, {color: theme.textPrimary}]}>
            {currentContent.title}
          </Text>
          
          {currentContent.content.map(renderContentItem)}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  docsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  nav: {
    width: 140,
    borderRightWidth: 1,
    padding: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  contentHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  list: {
    marginBottom: 16,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 4,
    marginLeft: 8,
  },
});

export default DocsScreen;
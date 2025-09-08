import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {useTheme} from '../context/ThemeContext';

const WelcomeScreen = ({onSendPrompt}) => {
  const {theme} = useTheme();

  const examplePrompts = [
    {
      id: 1,
      icon: 'atom',
      title: 'Science & Tech',
      description: 'Explain quantum computing',
      prompt: 'Explain quantum computing in simple terms',
      iconLibrary: 'MaterialIcons',
    },
    {
      id: 2,
      icon: 'code',
      title: 'Programming',
      description: 'Help with coding',
      prompt: 'Write a Python function to find prime numbers',
      iconLibrary: 'Feather',
    },
    {
      id: 3,
      icon: 'airplane',
      title: 'Travel Planning',
      description: 'Plan a trip to Tokyo',
      prompt: 'Create a 7-day itinerary for visiting Tokyo',
      iconLibrary: 'MaterialIcons',
    },
    {
      id: 4,
      icon: 'edit-3',
      title: 'Creative Writing',
      description: 'Write a story',
      prompt: 'Write a creative short story about time travel',
      iconLibrary: 'Feather',
    },
  ];

  const renderIcon = (iconName, library) => {
    if (library === 'MaterialIcons') {
      return <MaterialIcons name={iconName} size={24} color="white" />;
    }
    return <Icon name={iconName} size={24} color="white" />;
  };

  const renderPromptCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.promptCard, {backgroundColor: theme.bgPrimary, borderColor: theme.borderLight}]}
      onPress={() => onSendPrompt(item.prompt)}
      activeOpacity={0.8}>
      <LinearGradient
        colors={theme.gradientPrimary}
        style={styles.cardIcon}>
        {renderIcon(item.icon, item.iconLibrary)}
      </LinearGradient>
      
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, {color: theme.textPrimary}]}>
          {item.title}
        </Text>
        <Text style={[styles.cardDescription, {color: theme.textSecondary}]}>
          {item.description}
        </Text>
      </View>
      
      <Icon name="arrow-right" size={16} color={theme.textTertiary} />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      <View style={styles.welcomeContent}>
        {/* Logo and Animation */}
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={theme.gradientPrimary}
            style={styles.welcomeLogo}>
            <Text style={styles.logoText}>T</Text>
          </LinearGradient>
        </View>

        {/* Welcome Text */}
        <Text style={[styles.welcomeTitle, {color: theme.textPrimary}]}>
          Welcome to{' '}
          <LinearGradient
            colors={theme.gradientPrimary}
            style={styles.gradientTextContainer}>
            <Text style={styles.gradientText}>Talkie Gen AI</Text>
          </LinearGradient>
        </Text>

        <Text style={[styles.welcomeSubtitle, {color: theme.textSecondary}]}>
          Your intelligent AI companion, ready to assist with anything you need. Let's start a conversation!
        </Text>

        {/* Example Prompts */}
        <View style={styles.promptsContainer}>
          <Text style={[styles.promptsTitle, {color: theme.textPrimary}]}>
            Try these examples:
          </Text>
          
          <View style={styles.promptsGrid}>
            {examplePrompts.map(renderPromptCard)}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  welcomeContent: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 32,
  },
  welcomeLogo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '800',
    color: 'white',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  gradientTextContainer: {
    borderRadius: 4,
  },
  gradientText: {
    fontSize: 32,
    fontWeight: '800',
    color: 'transparent',
    // Note: React Native doesn't support text gradients directly
    // This would need a third-party library or custom implementation
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
    paddingHorizontal: 16,
  },
  promptsContainer: {
    width: '100%',
  },
  promptsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  promptsGrid: {
    gap: 16,
  },
  promptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 2,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
});

export default WelcomeScreen;
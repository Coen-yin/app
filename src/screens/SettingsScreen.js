import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import {useTheme} from '../context/ThemeContext';
import {useChat} from '../context/ChatContext';

const SettingsScreen = ({navigation}) => {
  const {theme} = useTheme();
  const {conversationSettings, updateConversationSettings, clearUserMemory} = useChat();

  const settingsSections = [
    {
      title: 'Context & Memory',
      items: [
        {
          label: 'Context Length',
          value: `${conversationSettings.contextLength} messages`,
          type: 'select',
        },
        {
          label: 'Memory Across Sessions',
          value: conversationSettings.enableMemory,
          type: 'toggle',
        },
      ],
    },
    {
      title: 'Response Style',
      items: [
        {
          label: 'Response Style',
          value: conversationSettings.responseStyle,
          type: 'select',
        },
        {
          label: 'AI Personality',
          value: conversationSettings.personalityMode,
          type: 'select',
        },
      ],
    },
    {
      title: 'Conversation Features',
      items: [
        {
          label: 'Show Follow-up Questions',
          value: conversationSettings.enableFollowUps,
          type: 'toggle',
        },
        {
          label: 'Remember User Preferences',
          value: conversationSettings.rememberPreferences,
          type: 'toggle',
        },
      ],
    },
  ];

  const renderSettingItem = (item) => (
    <TouchableOpacity
      key={item.label}
      style={[styles.settingItem, {borderBottomColor: theme.borderLight}]}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingLabel, {color: theme.textPrimary}]}>
          {item.label}
        </Text>
        <Text style={[styles.settingValue, {color: theme.textSecondary}]}>
          {typeof item.value === 'boolean' ? (item.value ? 'Enabled' : 'Disabled') : item.value}
        </Text>
      </View>
      <Icon name="chevron-right" size={16} color={theme.textTertiary} />
    </TouchableOpacity>
  );

  const renderSection = (section) => (
    <View key={section.title} style={styles.section}>
      <Text style={[styles.sectionTitle, {color: theme.textPrimary}]}>
        {section.title}
      </Text>
      <View style={[styles.sectionContent, {backgroundColor: theme.bgPrimary, borderColor: theme.borderLight}]}>
        {section.items.map(renderSettingItem)}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.bgSecondary}]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {settingsSections.map(renderSection)}

        {/* Memory Management */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.textPrimary}]}>
            Memory Management
          </Text>
          <View style={[styles.sectionContent, {backgroundColor: theme.bgPrimary, borderColor: theme.borderLight}]}>
            <TouchableOpacity
              style={[styles.actionButton, {backgroundColor: theme.danger}]}
              onPress={clearUserMemory}>
              <Icon name="trash-2" size={16} color="white" />
              <Text style={styles.actionButtonText}>Clear Memory</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionContent: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingValue: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SettingsScreen;
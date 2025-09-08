import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import {useTheme} from '../context/ThemeContext';
import {useAuth} from '../context/AuthContext';

const ProfileScreen = ({navigation}) => {
  const {theme} = useTheme();
  const {currentUser, updateProfile} = useAuth();

  if (!currentUser || !currentUser.isPro) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.bgSecondary}]}>
        <View style={styles.centered}>
          <Icon name="crown" size={48} color={theme.textTertiary} />
          <Text style={[styles.title, {color: theme.textPrimary}]}>
            Pro Feature
          </Text>
          <Text style={[styles.subtitle, {color: theme.textSecondary}]}>
            Profile customization is available for Pro users only.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.bgSecondary}]}>
      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, {backgroundColor: theme.accentPrimary}]}>
            <Text style={styles.avatarText}>
              {currentUser.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          
          <Text style={[styles.name, {color: theme.textPrimary}]}>
            {currentUser.name}
          </Text>
          
          <Text style={[styles.email, {color: theme.textSecondary}]}>
            {currentUser.email}
          </Text>
          
          {currentUser.isPro && (
            <View style={[styles.badge, {backgroundColor: theme.accentPrimary}]}>
              <Icon name="crown" size={12} color="white" />
              <Text style={styles.badgeText}>Pro</Text>
            </View>
          )}
        </View>

        <View style={styles.options}>
          <TouchableOpacity
            style={[styles.option, {backgroundColor: theme.bgPrimary, borderColor: theme.borderLight}]}>
            <Icon name="edit-3" size={20} color={theme.textSecondary} />
            <Text style={[styles.optionText, {color: theme.textPrimary}]}>
              Edit Profile
            </Text>
            <Icon name="chevron-right" size={16} color={theme.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, {backgroundColor: theme.bgPrimary, borderColor: theme.borderLight}]}>
            <Icon name="camera" size={20} color={theme.textSecondary} />
            <Text style={[styles.optionText, {color: theme.textPrimary}]}>
              Change Photo
            </Text>
            <Icon name="chevron-right" size={16} color={theme.textTertiary} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  options: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
});

export default ProfileScreen;
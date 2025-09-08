import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Feather} from '@expo/vector-icons';

import {useTheme} from '../context/ThemeContext';
import {useAuth} from '../context/AuthContext';

const AdminScreen = ({navigation}) => {
  const {theme} = useTheme();
  const {currentUser} = useAuth();

  if (!currentUser || !currentUser.isAdmin) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.bgSecondary}]}>
        <View style={styles.centered}>
          <Feather name="shield-off" size={48} color={theme.textTertiary} />
          <Text style={[styles.title, {color: theme.textPrimary}]}>
            Access Denied
          </Text>
          <Text style={[styles.subtitle, {color: theme.textSecondary}]}>
            You don't have permission to access the admin panel.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const statsData = [
    {
      icon: 'users',
      label: 'Total Visits',
      value: '1,234',
      color: theme.accentPrimary,
    },
    {
      icon: 'user-check',
      label: 'Unique Visitors',
      value: '892',
      color: theme.success,
    },
    {
      icon: 'calendar',
      label: "Today's Visits",
      value: '45',
      color: theme.warning,
    },
    {
      icon: 'user-plus',
      label: 'Registered Users',
      value: '156',
      color: theme.danger,
    },
  ];

  const renderStatCard = (stat) => (
    <View
      key={stat.label}
      style={[styles.statCard, {backgroundColor: theme.bgPrimary, borderColor: theme.borderLight}]}>
      <View style={[styles.statIcon, {backgroundColor: `${stat.color}20`}]}>
        <Feather name={stat.icon} size={20} color={stat.color} />
      </View>
      <View style={styles.statInfo}>
        <Text style={[styles.statValue, {color: theme.textPrimary}]}>
          {stat.value}
        </Text>
        <Text style={[styles.statLabel, {color: theme.textSecondary}]}>
          {stat.label}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.bgSecondary}]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <Text style={[styles.sectionTitle, {color: theme.textPrimary}]}>
          Dashboard Overview
        </Text>

        <View style={styles.statsGrid}>
          {statsData.map(renderStatCard)}
        </View>

        <Text style={[styles.sectionTitle, {color: theme.textPrimary}]}>
          Recent Activity
        </Text>

        <View style={[styles.activityCard, {backgroundColor: theme.bgPrimary, borderColor: theme.borderLight}]}>
          <View style={styles.activityHeader}>
            <Feather name="activity" size={20} color={theme.textSecondary} />
            <Text style={[styles.activityTitle, {color: theme.textPrimary}]}>
              No recent activity
            </Text>
          </View>
          <Text style={[styles.activityDescription, {color: theme.textSecondary}]}>
            Activity logs will appear here when users interact with the app.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, {color: theme.textPrimary}]}>
          System Information
        </Text>

        <View style={[styles.systemCard, {backgroundColor: theme.bgPrimary, borderColor: theme.borderLight}]}>
          <View style={styles.systemItem}>
            <Text style={[styles.systemLabel, {color: theme.textSecondary}]}>
              AI Model:
            </Text>
            <Text style={[styles.systemValue, {color: theme.textPrimary}]}>
              OpenAI GPT-OSS-120B
            </Text>
          </View>
          
          <View style={styles.systemItem}>
            <Text style={[styles.systemLabel, {color: theme.textSecondary}]}>
              Data Storage:
            </Text>
            <Text style={[styles.systemValue, {color: theme.textPrimary}]}>
              AsyncStorage (Local)
            </Text>
          </View>
          
          <View style={styles.systemItem}>
            <Text style={[styles.systemLabel, {color: theme.textSecondary}]}>
              Platform:
            </Text>
            <Text style={[styles.systemValue, {color: theme.textPrimary}]}>
              React Native iOS
            </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  activityCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  activityDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  systemCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  systemItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  systemLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  systemValue: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
});

export default AdminScreen;
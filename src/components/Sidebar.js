import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {useTheme} from '../context/ThemeContext';
import {useAuth} from '../context/AuthContext';
import {useChat} from '../context/ChatContext';

const Sidebar = ({visible, onClose, onNewChat, navigation}) => {
  const {theme, currentTheme, toggleTheme} = useTheme();
  const {currentUser, logout} = useAuth();
  const {chats, currentChatId, loadChat, deleteChat, clearAllChats} = useChat();
  
  const [showUserMenu, setShowUserMenu] = useState(false);

  const chatList = Object.values(chats).sort((a, b) => b.timestamp - a.timestamp);

  const handleChatPress = (chatId) => {
    loadChat(chatId);
    onClose();
  };

  const handleDeleteChat = (chatId, chatTitle) => {
    Alert.alert(
      'Delete Conversation',
      `Are you sure you want to delete "${chatTitle}"? This action cannot be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteChat(chatId),
        },
      ]
    );
  };

  const handleClearAllChats = () => {
    Alert.alert(
      'Clear All Conversations',
      'Are you sure you want to delete all conversations? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearAllChats();
            onClose();
          },
        },
      ]
    );
  };

  const handleAuthAction = (action) => {
    setShowUserMenu(false);
    onClose();
    
    if (action === 'login' || action === 'signup') {
      navigation.navigate('Auth', {initialMode: action});
    } else if (action === 'logout') {
      logout();
    } else if (action === 'profile') {
      navigation.navigate('Profile');
    } else if (action === 'admin') {
      navigation.navigate('Admin');
    } else if (action === 'settings') {
      navigation.navigate('Settings');
    }
  };

  const getThemeIcon = () => {
    switch (currentTheme) {
      case 'dark':
        return currentUser?.isPro ? 'crown' : 'sun';
      case 'pro':
        return 'sun';
      default:
        return 'moon';
    }
  };

  const getThemeLabel = () => {
    switch (currentTheme) {
      case 'dark':
        return currentUser?.isPro ? 'Pro mode' : 'Light mode';
      case 'pro':
        return 'Light mode';
      default:
        return 'Dark mode';
    }
  };

  const renderChatItem = ({item}) => {
    const isActive = item.id === currentChatId;
    
    return (
      <TouchableOpacity
        style={[
          styles.chatItem,
          {backgroundColor: isActive ? theme.bgSecondary : 'transparent'},
          isActive && {borderLeftColor: theme.accentPrimary},
        ]}
        onPress={() => handleChatPress(item.id)}
        onLongPress={() => handleDeleteChat(item.id, item.title)}>
        <Text 
          style={[
            styles.chatTitle,
            {color: isActive ? theme.textPrimary : theme.textSecondary},
          ]}
          numberOfLines={1}>
          {item.title}
        </Text>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteChat(item.id, item.title)}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Icon name="trash-2" size={14} color={theme.textTertiary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderUserMenu = () => (
    <View style={[styles.userDropdown, {backgroundColor: theme.bgPrimary, borderColor: theme.borderLight}]}>
      {!currentUser ? (
        <>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => handleAuthAction('login')}>
            <Icon name="log-in" size={16} color={theme.textPrimary} />
            <Text style={[styles.dropdownText, {color: theme.textPrimary}]}>Sign In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => handleAuthAction('signup')}>
            <Icon name="user-plus" size={16} color={theme.textPrimary} />
            <Text style={[styles.dropdownText, {color: theme.textPrimary}]}>Sign Up</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {currentUser.isPro && (
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleAuthAction('profile')}>
              <Icon name="user" size={16} color={theme.textPrimary} />
              <Text style={[styles.dropdownText, {color: theme.textPrimary}]}>Profile</Text>
            </TouchableOpacity>
          )}
          
          {currentUser.isAdmin && (
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleAuthAction('admin')}>
              <Icon name="shield" size={16} color={theme.textPrimary} />
              <Text style={[styles.dropdownText, {color: theme.textPrimary}]}>Admin Panel</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => handleAuthAction('logout')}>
            <Icon name="log-out" size={16} color={theme.textPrimary} />
            <Text style={[styles.dropdownText, {color: theme.textPrimary}]}>Sign Out</Text>
          </TouchableOpacity>
        </>
      )}
      
      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={() => {
          toggleTheme(currentUser?.isPro);
          setShowUserMenu(false);
        }}>
        <Icon name={getThemeIcon()} size={16} color={theme.textPrimary} />
        <Text style={[styles.dropdownText, {color: theme.textPrimary}]}>{getThemeLabel()}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={() => handleAuthAction('settings')}>
        <Icon name="settings" size={16} color={theme.textPrimary} />
        <Text style={[styles.dropdownText, {color: theme.textPrimary}]}>Settings</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={handleClearAllChats}>
        <Icon name="trash" size={16} color={theme.danger} />
        <Text style={[styles.dropdownText, {color: theme.danger}]}>Clear all</Text>
      </TouchableOpacity>
    </View>
  );

  if (!visible) return null;

  return (
    <View style={[styles.container, {backgroundColor: theme.bgPrimary}]}>
      {/* Header */}
      <LinearGradient
        colors={theme.gradientPrimary}
        style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <View style={[styles.logo, {backgroundColor: 'rgba(255, 255, 255, 0.2)'}]}>
              <Text style={styles.logoText}>T</Text>
            </View>
          </View>
          <View style={styles.brandInfo}>
            <Text style={styles.brandName}>Talkie Gen</Text>
            <Text style={styles.brandSubtitle}>AI Assistant</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.newChatButton}
          onPress={onNewChat}>
          <Icon name="plus" size={16} color="white" />
          <Text style={styles.newChatText}>New Chat</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Chat History */}
      <View style={styles.chatHistory}>
        {chatList.length === 0 ? (
          <View style={styles.emptyChatHistory}>
            <Text style={[styles.emptyChatText, {color: theme.textTertiary}]}>
              No conversations yet
            </Text>
          </View>
        ) : (
          <FlatList
            data={chatList}
            keyExtractor={item => item.id}
            renderItem={renderChatItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Footer */}
      <View style={[styles.footer, {borderTopColor: theme.borderLight}]}>
        <TouchableOpacity
          style={[styles.userMenu, {backgroundColor: theme.bgSecondary}]}
          onPress={() => setShowUserMenu(!showUserMenu)}>
          <View style={[styles.userAvatar, {backgroundColor: theme.accentPrimary}]}>
            <Text style={styles.avatarText}>
              {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'G'}
            </Text>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={[styles.username, {color: theme.textPrimary}]}>
              {currentUser ? (
                <>
                  {currentUser.name}
                  {currentUser.isPro && (
                    <Text style={styles.proBadge}> Pro</Text>
                  )}
                  {currentUser.isAdmin && (
                    <Text style={styles.adminBadge}> Admin</Text>
                  )}
                </>
              ) : (
                'Guest'
              )}
            </Text>
            <Text style={[styles.userStatus, {color: currentUser ? theme.success : theme.textTertiary}]}>
              {currentUser ? (currentUser.isAdmin ? 'Administrator' : 'Online') : 'Not signed in'}
            </Text>
          </View>
          
          <Icon 
            name={showUserMenu ? "chevron-down" : "chevron-up"} 
            size={16} 
            color={theme.textSecondary} 
          />
        </TouchableOpacity>
        
        {showUserMenu && renderUserMenu()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  header: {
    padding: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  brandInfo: {
    flex: 1,
  },
  brandName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  brandSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  newChatText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  chatHistory: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyChatHistory: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyChatText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 3,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  chatTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
    opacity: 0.7,
  },
  footer: {
    borderTopWidth: 1,
    padding: 16,
    position: 'relative',
  },
  userMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
  },
  proBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffd700',
    textTransform: 'uppercase',
  },
  adminBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ff4757',
    textTransform: 'uppercase',
  },
  userStatus: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  userDropdown: {
    position: 'absolute',
    bottom: '100%',
    left: 16,
    right: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  dropdownText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Sidebar;
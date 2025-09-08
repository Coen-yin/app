import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';

import {useTheme} from '../context/ThemeContext';

const MessageBubble = ({message, isUser, showAvatar, currentUser}) => {
  const {theme} = useTheme();
  const [showActions, setShowActions] = useState(false);

  const handleCopyMessage = () => {
    Clipboard.setString(message.content);
    Toast.show({
      type: 'success',
      text1: 'Copied!',
      text2: 'Message copied to clipboard',
    });
    setShowActions(false);
  };

  const handleLongPress = () => {
    setShowActions(!showActions);
  };

  const formatMessageContent = (content) => {
    // Simple text formatting - in a real app you'd want more sophisticated markdown parsing
    return content
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown for now
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown for now
      .replace(/`([^`]+)`/g, '$1'); // Remove inline code markdown for now
  };

  const renderAvatar = () => {
    if (isUser) {
      return (
        <View style={[styles.avatar, styles.userAvatar, {backgroundColor: theme.accentPrimary}]}>
          <Text style={styles.avatarText}>
            {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={[styles.avatar, styles.aiAvatar, {backgroundColor: theme.bgPrimary, borderColor: theme.borderLight}]}>
          <Text style={[styles.avatarText, {color: theme.accentPrimary}]}>T</Text>
        </View>
      );
    }
  };

  const renderMessageActions = () => {
    if (!showActions) return null;

    return (
      <View style={[styles.actionsContainer, {backgroundColor: theme.bgPrimary, borderColor: theme.borderLight}]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCopyMessage}>
          <Icon name="copy" size={14} color={theme.textSecondary} />
          <Text style={[styles.actionText, {color: theme.textSecondary}]}>Copy</Text>
        </TouchableOpacity>
        
        {!isUser && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // TODO: Implement regenerate functionality
              setShowActions(false);
            }}>
            <Icon name="refresh-cw" size={14} color={theme.textSecondary} />
            <Text style={[styles.actionText, {color: theme.textSecondary}]}>Regenerate</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      <View style={[styles.messageRow, isUser ? styles.userMessageRow : styles.aiMessageRow]}>
        {!isUser && showAvatar && renderAvatar()}
        
        <TouchableOpacity
          style={[
            styles.messageContent,
            isUser ? styles.userMessage : styles.aiMessage,
            isUser && {backgroundColor: 'transparent'},
          ]}
          onLongPress={handleLongPress}
          activeOpacity={0.8}>
          {isUser ? (
            <LinearGradient
              colors={theme.gradientPrimary}
              style={styles.userMessageGradient}>
              <Text style={[styles.messageText, styles.userMessageText]}>
                {formatMessageContent(message.content)}
              </Text>
            </LinearGradient>
          ) : (
            <View style={[styles.aiMessageContent, {backgroundColor: theme.bgPrimary, borderColor: theme.borderLight}]}>
              <Text style={[styles.messageText, {color: theme.textPrimary}]}>
                {formatMessageContent(message.content)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        
        {isUser && showAvatar && renderAvatar()}
      </View>
      
      {renderMessageActions()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  aiContainer: {
    alignItems: 'flex-start',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  userMessageRow: {
    flexDirection: 'row-reverse',
  },
  aiMessageRow: {
    flexDirection: 'row',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  userAvatar: {
    // User avatar styles handled by backgroundColor prop
  },
  aiAvatar: {
    borderWidth: 1,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  messageContent: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  userMessage: {
    marginLeft: 32,
  },
  aiMessage: {
    marginRight: 32,
  },
  userMessageGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  aiMessageContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  userMessageText: {
    color: 'white',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    padding: 4,
    alignSelf: 'flex-start',
    marginLeft: 40,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default MessageBubble;
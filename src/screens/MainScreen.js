import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

import {useTheme} from '../context/ThemeContext';
import {useAuth} from '../context/AuthContext';
import {useChat} from '../context/ChatContext';

import Sidebar from '../components/Sidebar';
import MessageBubble from '../components/MessageBubble';
import WelcomeScreen from '../components/WelcomeScreen';
import TypingIndicator from '../components/TypingIndicator';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const MainScreen = ({navigation}) => {
  const {theme, currentTheme} = useTheme();
  const {currentUser} = useAuth();
  const {
    chats,
    currentChatId,
    isGenerating,
    startNewChat,
    addMessage,
    getAIResponse,
  } = useChat();

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  const sidebarAnim = useRef(new Animated.Value(-SCREEN_WIDTH * 0.8)).current;

  const currentChat = currentChatId ? chats[currentChatId] : null;
  const messages = currentChat ? currentChat.messages : [];

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 100);
    }
  }, [messages.length]);

  const toggleSidebar = () => {
    const toValue = sidebarVisible ? -SCREEN_WIDTH * 0.8 : 0;
    setSidebarVisible(!sidebarVisible);
    
    Animated.timing(sidebarAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    if (sidebarVisible) {
      Animated.timing(sidebarAnim, {
        toValue: -SCREEN_WIDTH * 0.8,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setSidebarVisible(false);
      });
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isGenerating) return;

    const message = inputText.trim();
    setInputText('');
    setInputHeight(40);

    // Create new chat if none exists
    if (!currentChatId) {
      startNewChat();
    }

    // Add user message
    addMessage('user', message);

    try {
      // Get AI response
      const response = await getAIResponse(message);
      addMessage('assistant', response);
    } catch (error) {
      console.error('Error getting AI response:', error);
      addMessage('assistant', `I apologize, but I encountered an error: ${error.message}. Please try again.`);
    }
  };

  const handleNewChat = () => {
    startNewChat();
    closeSidebar();
  };

  const handleInputChange = (text) => {
    setInputText(text);
  };

  const handleContentSizeChange = (event) => {
    const height = Math.min(Math.max(40, event.nativeEvent.contentSize.height), 120);
    setInputHeight(height);
  };

  const renderMessage = ({item, index}) => (
    <MessageBubble
      message={item}
      isUser={item.role === 'user'}
      showAvatar={true}
      currentUser={currentUser}
    />
  );

  const renderHeader = () => (
    <View style={[styles.header, {backgroundColor: theme.bgPrimary, borderBottomColor: theme.borderLight}]}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={toggleSidebar}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
        <Icon name="menu" size={24} color={theme.textSecondary} />
      </TouchableOpacity>
      
      <View style={styles.headerTitle}>
        <Text style={[styles.headerTitleText, {color: theme.textPrimary}]}>
          Talkie Gen AI
        </Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, {backgroundColor: theme.success}]} />
          <Text style={[styles.statusText, {color: theme.success}]}>
            Ready to help
          </Text>
        </View>
      </View>

      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('Docs')}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Icon name="book" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('Settings')}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Icon name="settings" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderInputArea = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <View style={[styles.inputContainer, {backgroundColor: theme.bgPrimary, borderTopColor: theme.borderLight}]}>
        <View style={[styles.inputWrapper, {backgroundColor: theme.bgSecondary, borderColor: theme.borderLight}]}>
          <TextInput
            ref={inputRef}
            style={[
              styles.textInput,
              {
                color: theme.textPrimary,
                height: inputHeight,
              },
            ]}
            value={inputText}
            onChangeText={handleInputChange}
            onContentSizeChange={handleContentSizeChange}
            placeholder="Message Talkie Gen AI..."
            placeholderTextColor={theme.textTertiary}
            multiline
            maxLength={4000}
            scrollEnabled={inputHeight >= 120}
          />
          
          <View style={styles.inputActions}>
            <TouchableOpacity
              style={styles.actionButton}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon name="paperclip" size={20} color={theme.textTertiary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon name="mic" size={20} color={theme.textTertiary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                !inputText.trim() || isGenerating ? styles.sendButtonDisabled : null,
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || isGenerating}
              hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}>
              <LinearGradient
                colors={theme.gradientPrimary}
                style={styles.sendButtonGradient}>
                <MaterialIcons 
                  name="send" 
                  size={20} 
                  color="white" 
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.inputFooter}>
          <Text style={[styles.disclaimer, {color: theme.textTertiary}]}>
            Talkie Gen AI can make mistakes. Consider checking important information.
          </Text>
          <Text style={[styles.wordCount, {color: theme.textTertiary}]}>
            {inputText.length}/4000
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.bgSecondary}]}>
      {renderHeader()}
      
      <View style={styles.contentContainer}>
        {messages.length === 0 ? (
          <WelcomeScreen onSendPrompt={(prompt) => {
            setInputText(prompt);
            setTimeout(() => handleSendMessage(), 100);
          }} />
        ) : (
          <>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item, index) => `${item.timestamp}-${index}`}
              renderItem={renderMessage}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({animated: true})}
            />
            
            {isGenerating && <TypingIndicator />}
          </>
        )}
      </View>

      {renderInputArea()}

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebarContainer,
          {
            transform: [{translateX: sidebarAnim}],
          },
        ]}>
        <Sidebar
          visible={sidebarVisible}
          onClose={closeSidebar}
          onNewChat={handleNewChat}
          navigation={navigation}
        />
      </Animated.View>

      {/* Sidebar Overlay */}
      {sidebarVisible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeSidebar}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    elevation: 2,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '700',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: 1,
    elevation: 8,
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputWrapper: {
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    minHeight: 64,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 120,
    textAlignVertical: 'top',
    paddingTop: Platform.OS === 'ios' ? 0 : 8,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionButton: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  sendButton: {
    marginLeft: 4,
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  disclaimer: {
    fontSize: 12,
    flex: 1,
    marginRight: 12,
  },
  wordCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.8,
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
});

export default MainScreen;
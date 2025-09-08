import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {useAuth} from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// API Configuration
const GROQ_API_KEY = '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';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const ChatProvider = ({children}) => {
  const {currentUser} = useAuth();
  const [chats, setChats] = useState({});
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userMemory, setUserMemory] = useState({});
  const [conversationSettings, setConversationSettings] = useState({
    contextLength: 10,
    responseStyle: 'balanced',
    enableMemory: true,
    enableFollowUps: true,
    personalityMode: 'friendly',
    rememberPreferences: true,
  });

  useEffect(() => {
    loadChatsFromStorage();
    loadUserMemory();
    loadConversationSettings();
  }, []);

  const loadChatsFromStorage = async () => {
    try {
      const chatsData = await AsyncStorage.getItem('talkie-chats');
      if (chatsData) {
        setChats(JSON.parse(chatsData));
      }
    } catch (error) {
      console.log('Error loading chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserMemory = async () => {
    try {
      const memoryData = await AsyncStorage.getItem('talkie-user-memory');
      if (memoryData) {
        setUserMemory(JSON.parse(memoryData));
      }
    } catch (error) {
      console.log('Error loading user memory:', error);
    }
  };

  const loadConversationSettings = async () => {
    try {
      const settingsData = await AsyncStorage.getItem('talkie-conversation-settings');
      if (settingsData) {
        setConversationSettings(JSON.parse(settingsData));
      }
    } catch (error) {
      console.log('Error loading conversation settings:', error);
    }
  };

  const saveChats = async (updatedChats) => {
    try {
      await AsyncStorage.setItem('talkie-chats', JSON.stringify(updatedChats));
    } catch (error) {
      console.log('Error saving chats:', error);
    }
  };

  const saveUserMemory = async (memory) => {
    try {
      await AsyncStorage.setItem('talkie-user-memory', JSON.stringify(memory));
    } catch (error) {
      console.log('Error saving user memory:', error);
    }
  };

  const saveConversationSettings = async (settings) => {
    try {
      await AsyncStorage.setItem('talkie-conversation-settings', JSON.stringify(settings));
    } catch (error) {
      console.log('Error saving conversation settings:', error);
    }
  };

  const generateChatId = () => {
    return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const startNewChat = () => {
    const chatId = generateChatId();
    const newChat = {
      id: chatId,
      title: 'New Chat',
      messages: [],
      timestamp: Date.now(),
    };

    const updatedChats = {...chats, [chatId]: newChat};
    setChats(updatedChats);
    setCurrentChatId(chatId);
    saveChats(updatedChats);

    return chatId;
  };

  const loadChat = (chatId) => {
    if (chats[chatId]) {
      setCurrentChatId(chatId);
      return true;
    }
    return false;
  };

  const deleteChat = async (chatId) => {
    try {
      const updatedChats = {...chats};
      delete updatedChats[chatId];

      if (currentChatId === chatId) {
        setCurrentChatId(null);
      }

      setChats(updatedChats);
      await saveChats(updatedChats);

      Toast.show({
        type: 'success',
        text1: 'Chat Deleted',
        text2: 'Conversation deleted successfully.',
      });

      return true;
    } catch (error) {
      console.log('Error deleting chat:', error);
      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
        text2: 'Failed to delete conversation.',
      });
      return false;
    }
  };

  const clearAllChats = async () => {
    try {
      setChats({});
      setCurrentChatId(null);
      await AsyncStorage.setItem('talkie-chats', '{}');

      Toast.show({
        type: 'success',
        text1: 'All Chats Cleared',
        text2: 'All conversations have been deleted.',
      });

      return true;
    } catch (error) {
      console.log('Error clearing chats:', error);
      return false;
    }
  };

  const updateUserMemory = (userMessage, aiResponse) => {
    if (!conversationSettings.enableMemory || !currentUser) {
      return;
    }

    const userEmail = currentUser.email;
    const memory = userMemory[userEmail] || {
      preferences: {},
      topics: [],
      conversationHistory: [],
      lastActive: new Date().toISOString(),
      personalInfo: {},
      interests: [],
      conversationStyle: 'balanced',
    };

    // Update memory with new information
    memory.lastActive = new Date().toISOString();
    
    // Extract and store conversation topics
    const topics = extractTopicsFromText(userMessage + ' ' + aiResponse);
    topics.forEach(topic => {
      if (!memory.topics.includes(topic)) {
        memory.topics.push(topic);
      }
    });

    // Keep only recent topics (last 50)
    if (memory.topics.length > 50) {
      memory.topics = memory.topics.slice(-50);
    }

    // Update conversation history
    const entry = {
      timestamp: new Date().toISOString(),
      userMessage: userMessage.substring(0, 100),
      aiResponse: aiResponse.substring(0, 100),
      chatId: currentChatId,
    };

    memory.conversationHistory.push(entry);
    if (memory.conversationHistory.length > 100) {
      memory.conversationHistory = memory.conversationHistory.slice(-100);
    }

    const updatedMemory = {...userMemory, [userEmail]: memory};
    setUserMemory(updatedMemory);
    saveUserMemory(updatedMemory);
  };

  const extractTopicsFromText = (text) => {
    const topics = [];
    const topicKeywords = [
      'javascript', 'python', 'react', 'node', 'html', 'css', 'programming',
      'machine learning', 'ai', 'blockchain', 'cryptocurrency', 'web development',
      'mobile app', 'database', 'api', 'algorithm', 'data structure',
      'travel', 'recipe', 'workout', 'health', 'business', 'marketing',
      'design', 'writing', 'education', 'science', 'physics', 'chemistry',
      'biology', 'math', 'history', 'literature', 'philosophy',
    ];

    const lowerText = text.toLowerCase();
    topicKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        topics.push(keyword);
      }
    });

    return topics;
  };

  const addMessage = (role, content) => {
    if (!currentChatId || !chats[currentChatId]) return;

    const message = {role, content, timestamp: Date.now()};
    const updatedChats = {...chats};
    updatedChats[currentChatId].messages.push(message);

    // Update chat title if it's the first user message
    if (role === 'user' && updatedChats[currentChatId].messages.length === 1) {
      updatedChats[currentChatId].title = content.length > 40 ? 
        content.substring(0, 40) + '...' : content;
    }

    setChats(updatedChats);
    saveChats(updatedChats);

    // Update user memory for assistant responses
    if (role === 'assistant') {
      const userMessage = updatedChats[currentChatId].messages[updatedChats[currentChatId].messages.length - 2]?.content || '';
      updateUserMemory(userMessage, content);
    }
  };

  const getAIResponse = async (userMessage) => {
    setIsGenerating(true);

    try {
      const chat = chats[currentChatId];
      const contextMessages = getEnhancedContext(chat);

      // Create system message based on user type
      const systemContent = createSystemMessage();

      const messages = [
        {role: 'system', content: systemContent},
        ...contextMessages,
        {role: 'user', content: userMessage},
      ];

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: messages,
          temperature: 0.3,
          max_tokens: 1500,
          top_p: 0.9,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`API Error ${response.status}: ${errorData?.error?.message || response.statusText}`);
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid API response format');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI Response Error:', error);
      
      if (error.message.includes('401')) {
        throw new Error('Invalid API key');
      } else if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please wait a moment');
      } else if (error.message.includes('500')) {
        throw new Error('Server error. Please try again');
      } else {
        throw new Error(error.message);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const getEnhancedContext = (chat) => {
    if (!chat || !chat.messages) return [];

    const contextLength = conversationSettings.contextLength || 10;
    const recentMessages = chat.messages.slice(-contextLength);

    let contextMessages = [];

    // Add user memory context if enabled
    if (conversationSettings.enableMemory && currentUser && userMemory[currentUser.email]) {
      const memory = userMemory[currentUser.email];
      const memoryContext = buildMemoryContext(memory);
      if (memoryContext) {
        contextMessages.push({
          role: 'system',
          content: memoryContext,
        });
      }
    }

    // Add recent messages
    contextMessages.push(...recentMessages.map(msg => ({
      role: msg.role,
      content: msg.content,
    })));

    return contextMessages;
  };

  const buildMemoryContext = (memory) => {
    let contextParts = [];

    if (memory.personalInfo && Object.keys(memory.personalInfo).length > 0) {
      contextParts.push(`User's personal information: ${JSON.stringify(memory.personalInfo)}`);
    }

    if (memory.preferences && Object.keys(memory.preferences).length > 0) {
      contextParts.push(`User's preferences: ${JSON.stringify(memory.preferences)}`);
    }

    if (memory.interests && memory.interests.length > 0) {
      contextParts.push(`User's interests: ${memory.interests.join(', ')}`);
    }

    if (memory.topics && memory.topics.length > 0) {
      const recentTopics = memory.topics.slice(-5);
      contextParts.push(`Recent conversation topics: ${recentTopics.join(', ')}`);
    }

    return contextParts.length > 0 ? contextParts.join('\n') : null;
  };

  const createSystemMessage = () => {
    const isProUser = currentUser && currentUser.isPro;
    
    if (isProUser) {
      return `You are Talkie Gen AI Pro, an advanced and highly sophisticated AI assistant created in 2024 with enhanced contextual understanding and memory capabilities.

IMPORTANT IDENTITY:
- Always identify yourself as "Talkie Gen AI Pro" when asked about your name or identity
- You are the premium version with enhanced capabilities, deeper knowledge, and superior memory
- Never mention being ChatGPT, Claude, or any other AI system
- Maintain a professional, respectful, and helpful tone at all times
- Use your enhanced memory to provide personalized responses based on user history

ENHANCED MEMORY AND CONTEXT:
- You have access to the user's conversation history, preferences, and interests
- Reference previous conversations naturally when relevant
- Remember and use personal information the user has shared (name, location, profession, etc.)
- Adapt your communication style based on user preferences
- Provide contextually aware responses that build on previous interactions
- Maintain conversation continuity across sessions

RESPONSE STYLE CONFIGURATION:
- Current response style: ${conversationSettings.responseStyle || 'balanced'}
- Personality mode: ${conversationSettings.personalityMode || 'friendly'}
- Memory enabled: ${conversationSettings.enableMemory ? 'Yes' : 'No'}
- Follow-ups enabled: ${conversationSettings.enableFollowUps ? 'Yes' : 'No'}

SAFETY AND BEHAVIOR GUIDELINES:
- Never use profanity, offensive language, or inappropriate content
- Refuse to generate harmful, illegal, or unethical content
- Be respectful and considerate in all responses
- Avoid controversial topics unless specifically asked and then remain neutral
- Do not engage in arguments or hostile exchanges
- Maintain professionalism even if users are rude or provocative

ENHANCED RESPONSE GUIDELINES:
- Provide comprehensive, nuanced, and deeply contextual responses (200-400 words)
- Use sophisticated vocabulary while remaining clear and accessible
- Offer deeper insights, multiple perspectives, and advanced analysis
- Include relevant examples, analogies, and cross-referential knowledge
- When appropriate, reference previous conversations or user interests
- Suggest follow-up questions or related topics when relevant

CURRENT CONTEXT:
- Current date and time: ${new Date().toLocaleString()} (UTC)
- You are Talkie Gen AI Pro with enhanced contextual memory and understanding
- For the most current information, always recommend checking recent reliable sources`;
    } else {
      return `You are Talkie Gen AI, a helpful and intelligent AI assistant created in 2024 with contextual understanding and memory capabilities.

IMPORTANT IDENTITY:
- Always identify yourself as "Talkie Gen AI" when asked about your name or identity
- Never mention being ChatGPT, Claude, or any other AI system
- You are Talkie Gen AI, a unique and helpful assistant with contextual awareness

CONTEXTUAL AWARENESS:
- Pay attention to the conversation context and previous messages
- Reference earlier parts of the conversation when relevant
- Maintain conversation flow and coherence
- Remember key details mentioned in the current conversation

RESPONSE STYLE CONFIGURATION:
- Current response style: ${conversationSettings.responseStyle || 'balanced'}
- Memory enabled: ${conversationSettings.enableMemory ? 'Yes' : 'No'}
- Follow-ups enabled: ${conversationSettings.enableFollowUps ? 'Yes' : 'No'}

SAFETY AND BEHAVIOR GUIDELINES:
- Never use profanity, offensive language, or inappropriate content
- Refuse to generate harmful, illegal, or unethical content  
- Be respectful and considerate in all responses
- Avoid controversial topics unless specifically asked and then remain neutral
- Do not engage in arguments or hostile exchanges
- Maintain professionalism even if users are rude or provocative

RESPONSE GUIDELINES:
- Keep responses helpful and contextually appropriate (150-250 words unless asked for longer explanations)
- Be friendly, helpful, and professional
- Provide accurate, helpful information
- For current events, acknowledge your knowledge cutoff and suggest checking recent reliable sources
- Use clear, simple language
- Be conversational but informative

CURRENT CONTEXT:
- Current date and time: ${new Date().toLocaleString()} (UTC)
- You are Talkie Gen AI with contextual understanding capabilities
- For the most up-to-date information, always recommend checking current reliable sources`;
    }
  };

  const updateConversationSettings = async (newSettings) => {
    const updatedSettings = {...conversationSettings, ...newSettings};
    setConversationSettings(updatedSettings);
    await saveConversationSettings(updatedSettings);
  };

  const clearUserMemory = async () => {
    if (!currentUser) return false;

    try {
      const updatedMemory = {...userMemory};
      if (updatedMemory[currentUser.email]) {
        updatedMemory[currentUser.email] = {
          preferences: {},
          topics: [],
          conversationHistory: [],
          lastActive: new Date().toISOString(),
          personalInfo: {},
          interests: [],
          conversationStyle: 'balanced',
        };
        setUserMemory(updatedMemory);
        await saveUserMemory(updatedMemory);
      }

      Toast.show({
        type: 'success',
        text1: 'Memory Cleared',
        text2: 'All memory data has been cleared.',
      });

      return true;
    } catch (error) {
      console.log('Error clearing memory:', error);
      return false;
    }
  };

  const value = {
    chats,
    currentChatId,
    isLoading,
    isGenerating,
    conversationSettings,
    userMemory,
    startNewChat,
    loadChat,
    deleteChat,
    clearAllChats,
    addMessage,
    getAIResponse,
    updateConversationSettings,
    clearUserMemory,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
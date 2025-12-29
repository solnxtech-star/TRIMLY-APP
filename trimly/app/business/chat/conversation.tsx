import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';

const ChatConversation = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  // Define custom colors based on theme
  const colorScheme = useColorScheme();
  const receivedBubbleColor = colorScheme === 'dark' ? '#263238' : '#E8F5E9'; // Light mint green for received
  const sentBubbleColor = colorScheme === 'dark' ? '#455A64' : '#F0F0F0'; // Light gray for sent
  const borderColor = colorScheme === 'dark' ? '#374151' : '#E0E0E0';
  const secondaryTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#666666';
  
  const [inputText, setInputText] = useState('');
  
  // Mock data for messages
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: 'Can I reschedule my appointment for tomorrow?', 
      isSent: false, // received
      timestamp: '10:23 AM'
    },
    { 
      id: 2, 
      text: 'Yes you can..', 
      isSent: true, // sent
      timestamp: '10:25 AM'
    },
    { 
      id: 3, 
      text: 'Alright next week Thursday then.', 
      isSent: false, // received
      timestamp: '10:26 AM'
    },
  ]);
  
  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputText,
        isSent: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundColor }]}>      
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/business/chat')}>
          <Ionicons name="chevron-back" size={24} color={textColor} />
        </TouchableOpacity>
          
        <Text style={[styles.headerTitle, { color: textColor }]}>Chat</Text>
          
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search-outline" size={24} color={textColor} />
        </TouchableOpacity>
      </View>
  
      {/* Chat Area */}
      <ScrollView 
        style={[styles.chatArea, { backgroundColor: backgroundColor }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatContent}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((message) => (
          <View 
            key={message.id} 
            style={[
              styles.messageBubble, 
              message.isSent ? styles.sentBubble : styles.receivedBubble,
              { backgroundColor: message.isSent ? sentBubbleColor : receivedBubbleColor }
            ]}
          >
            <Text style={[styles.messageText, { color: textColor }]}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>
        
      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.textInput, { backgroundColor: colorScheme === 'dark' ? '#374151' : '#F0F0F0', color: textColor }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor={secondaryTextColor}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color="#2E7D32" />
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginLeft: -44, // Account for back button width
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  chatContent: {
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    position: 'relative',
  },
  receivedBubble: {
    alignSelf: 'flex-end',
    marginRight: 16,
  },
  sentBubble: {
    alignSelf: 'flex-start',
    marginLeft: 16,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  textInput: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatConversation;
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';

const Chat = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  // Define custom colors based on theme
  const colorScheme = useColorScheme();
  const cardBackgroundColor = colorScheme === 'dark' ? '#1F2937' : '#FFFFFF';
  const borderColor = colorScheme === 'dark' ? '#374151' : '#E5E5E5';
  const secondaryTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#666666';
  const tertiaryTextColor = colorScheme === 'dark' ? '#D1D5DB' : '#888888';
  
  // Mock data for conversations
  const conversations = [
    { 
      id: 1, 
      name: 'Micheal Brown', 
      message: 'Can I reschedule my appointment for tomorrow?', 
      time: '10:23 AM',
      isOnline: true,
      isActive: true
    },
    { 
      id: 2, 
      name: 'David Williams', 
      message: 'Thanks for the great haircut!', 
      time: 'Yesterday',
      isOnline: true,
      isActive: false
    },
    { 
      id: 3, 
      name: 'Robert Brown', 
      message: 'Looking forward to my appointment on Friday', 
      time: 'Yesterday',
      isOnline: true,
      isActive: false
    },
    { 
      id: 4, 
      name: 'David Williams', 
      message: 'Do yo have any openings this weekend?', 
      time: 'Monday',
      isOnline: true,
      isActive: false
    },
    { 
      id: 5, 
      name: 'Robert Brown', 
      message: 'Thanks for the great haircut!', 
      time: 'Yesterday',
      isOnline: true,
      isActive: false
    },
    { 
      id: 6, 
      name: 'David Williams', 
      message: 'Thanks for the great haircut!', 
      time: 'Yesterday',
      isOnline: true,
      isActive: false
    },
    { 
      id: 7, 
      name: 'David Williams', 
      message: 'Do yo have any openings this weekend?', 
      time: 'Yesterday',
      isOnline: true,
      isActive: false
    },
  ];
  
  const handleConversationPress = (id: number) => {
    router.push(`/business/chat/conversation`);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundColor }]}>      
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Chat</Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={secondaryTextColor} style={styles.searchIcon} />
        <Text style={[styles.searchPlaceholder, { color: tertiaryTextColor }]}>Search conversations....</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {conversations.map((conversation) => (
          <TouchableOpacity 
            key={conversation.id} 
            style={[
              styles.conversationCard, 
              { 
                backgroundColor: cardBackgroundColor, 
                borderColor: conversation.isActive ? '#2E7D32' : borderColor
              },
              conversation.isActive && styles.activeConversation
            ]} 
            onPress={() => handleConversationPress(conversation.id)}
          >
            {/* Left Section - Profile Photo */}
            <View style={styles.profileSection}>
              <View style={styles.profilePhotoPlaceholder}>
                <Ionicons name="person-circle" size={56} color={secondaryTextColor} />
              </View>
              {conversation.isOnline && (
                <View style={styles.onlineIndicator} />
              )}
            </View>
            
            {/* Center Section - Message Content */}
            <View style={styles.messageContentSection}>
              <Text style={[styles.contactName, { color: textColor }]}>{conversation.name}</Text>
              <Text style={[styles.messagePreview, { color: secondaryTextColor }]} numberOfLines={1}>
                {conversation.message}
              </Text>
            </View>
            
            {/* Right Section - Timestamp */}
            <View style={styles.timestampSection}>
              <Text style={[styles.timestamp, { color: tertiaryTextColor }]}>{conversation.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80, // Extra padding to account for bottom navigation
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    height: 50,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchPlaceholder: {
    fontSize: 15,
    flex: 1,
  },
  conversationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeConversation: {
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  profileSection: {
    marginRight: 16,
    position: 'relative',
  },
  profilePhotoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  messageContentSection: {
    flex: 1,
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  messagePreview: {
    fontSize: 12,
  },
  timestampSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  timestamp: {
    fontSize: 13,
    paddingBottom: 20
  },
});

export default Chat
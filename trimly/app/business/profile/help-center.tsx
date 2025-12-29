import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';

const HelpCenter = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  // Define custom colors based on theme
  const colorScheme = useColorScheme();
  const cardBackgroundColor = colorScheme === 'dark' ? '#1F2937' : '#FFFFFF';
  const borderColor = colorScheme === 'dark' ? '#374151' : '#E0E0E0';
  const secondaryTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#666666';
    
  // Help center topics
  const helpTopics = [
    { id: 1, title: 'Getting Started', icon: 'help-circle-outline' },
    { id: 2, title: 'Managing Appointments', icon: 'calendar-outline' },
    { id: 3, title: 'Payment & Pricing', icon: 'card-outline' },
    { id: 4, title: 'Profile & Settings', icon: 'person-outline' },
    { id: 5, title: 'Troubleshooting', icon: 'warning-outline' },
    { id: 6, title: 'Contact Support', icon: 'mail-outline' },
  ];
    
  const handleTopicPress = (id: number) => {
    console.log('Help topic pressed:', id);
  };
    
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundColor }]}>      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/business/profile')}>
            <Ionicons name="chevron-back" size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>Help Center</Text>
        </View>
          
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={secondaryTextColor} style={styles.searchIcon} />
          <Text style={[styles.searchPlaceholder, { color: secondaryTextColor }]}>Search help topics...</Text>
        </View>
          
        <View style={styles.topicsContainer}>
          {helpTopics.map((topic) => (
            <TouchableOpacity 
              key={topic.id} 
              style={[styles.topicItem, { backgroundColor: cardBackgroundColor, borderColor: borderColor }]}
              onPress={() => handleTopicPress(topic.id)}
            >
              <View style={styles.topicContent}>
                <Ionicons name={topic.icon as any} size={24} color="#2E7D32" style={styles.topicIcon} />
                <Text style={[styles.topicTitle, { color: textColor }]}>{topic.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={secondaryTextColor} />
            </TouchableOpacity>
          ))}
        </View>
          
        <View style={styles.contactContainer}>
          <Text style={[styles.contactTitle, { color: textColor }]}>Need more help?</Text>
          <Text style={[styles.contactSubtitle, { color: secondaryTextColor }]}>Our support team is here for you</Text>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5', // Light theme default
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    height: 50,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchPlaceholder: {
    fontSize: 15,
    flex: 1,
  },
  topicsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  topicItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicIcon: {
    marginRight: 12,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  contactContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
      borderTopColor: '#F0F0F0', // Light theme default
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contactSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    width: '100%',
      alignItems: 'center',
    marginBottom: 30
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HelpCenter;
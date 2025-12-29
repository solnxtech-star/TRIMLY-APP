import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';

const PrivacyPolicy = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  // Define custom colors based on theme
  const colorScheme = useColorScheme();
  const cardBackgroundColor = colorScheme === 'dark' ? '#1F2937' : '#FFFFFF';
  const borderColor = colorScheme === 'dark' ? '#374151' : '#E0E0E0';
  const secondaryTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#666666';
    
  // Privacy policy content sections
  const policySections = [
    {
      id: 1,
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us, such as when you create an account, use our services, or communicate with us.'
    },
    {
      id: 2,
      title: 'How We Use Your Information',
      content: 'We use information we collect to provide, maintain, and improve our services, as well as to communicate with you.'
    },
    {
      id: 3,
      title: 'Data Protection',
      content: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
    },
    {
      id: 4,
      title: 'Your Rights',
      content: 'You have the right to access, update, or delete your personal information at any time.'
    },
    {
      id: 5,
      title: 'Changes to This Policy',
      content: 'We may update this privacy policy from time to time. You will be notified of any changes through the app.'
    }
  ];
    
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundColor }]}>      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/business/profile')}>
            <Ionicons name="chevron-back" size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>Privacy Policy</Text>
        </View>
          
        <View style={styles.policyContainer}>
          {policySections.map((section) => (
            <View key={section.id} style={[styles.sectionContainer, { backgroundColor: cardBackgroundColor, borderColor: borderColor }]}>            
              <Text style={[styles.sectionTitle, { color: textColor }]}>{section.title}</Text>
              <Text style={[styles.sectionContent, { color: secondaryTextColor }]}>{section.content}</Text>
            </View>
          ))}
        </View>
          
        <View style={styles.lastUpdatedContainer}>
          <Text style={[styles.lastUpdatedText, { color: secondaryTextColor }]}>Last updated: January 1, 2024</Text>
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 20,
  },
  policyContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 22,
  },
  lastUpdatedContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  lastUpdatedText: {
    fontSize: 12,
  },
});

export default PrivacyPolicy;
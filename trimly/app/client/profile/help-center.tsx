import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Collapsible } from '@/components/ui/collapsible';

export default function HelpCenterScreen() {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact'>('faq');

  // FAQ data
  const faqData = [
    { question: "What is Trimly", answer: "Trimly is.................................................." },
    { question: "How to cancel appointment booking", answer: "" },
    { question: "How to see saved salon", answer: "" },
    { question: "How to check Pre-booked Appointment", answer: "" },
    { question: "How to check transaction", answer: "" },
    { question: "How to check nearby salon", answer: "" },
    { question: "How to add review", answer: "" },
  ];

  // Contact data
  const contactData = [
    { icon: "phone", label: "Customer Service" },
    { icon: "whatsapp", label: "Whatsapp" },
    { icon: "globe", label: "Website" },
    { icon: "facebook", label: "Facebook" },
    { icon: "twitter", label: "Twitter" },
    { icon: "instagram", label: "Instagram" },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <ThemedText style={styles.header}>Help Center</ThemedText>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={20} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#8E8E93"
          />
        </View>
        
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'faq' && styles.activeTab]}
            onPress={() => setActiveTab('faq')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'faq' && styles.activeTabText]}>
              FAQ
            </ThemedText>
            {activeTab === 'faq' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'contact' && styles.activeTab]}
            onPress={() => setActiveTab('contact')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'contact' && styles.activeTabText]}>
              Contact Us
            </ThemedText>
            {activeTab === 'contact' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        </View>
        
        {/* Content */}
        {activeTab === 'faq' ? (
          <View style={styles.contentContainer}>
            {faqData.map((item, index) => (
              <Collapsible 
                key={index} 
                title={item.question} 
                subtitle={item.answer}
                icon="chevron.down"
              />
            ))}
          </View>
        ) : (
          <View style={styles.contentContainer}>
            {contactData.map((item, index) => (
              <TouchableOpacity key={index} style={styles.contactItem}>
                <View style={styles.contactIconContainer}>
                  <IconSymbol name={item.icon} size={20} color="#2D8659" />
                </View>
                <ThemedText style={styles.contactLabel}>{item.label}</ThemedText>
                <IconSymbol name="chevron.right" size={20} color="#8E8E93" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 17,
    color: '#000000',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    // No additional styling needed
  },
  tabText: {
    fontSize: 17,
    color: '#8E8E93',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000000',
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 3,
    backgroundColor: '#2D8659',
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 10,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactLabel: {
    flex: 1,
    fontSize: 17,
    color: '#000000',
  },
});
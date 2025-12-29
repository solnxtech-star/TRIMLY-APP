import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Collapsible } from '@/components/ui/collapsible';
import { useThemeColor } from '@/hooks/use-theme-color';
import { FontSizes } from '@/constants/theme';

export default function HelpCenterScreen() {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact'>('faq');

  // Get theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'icon');
  const inputBackgroundColor = useThemeColor({ light: '#F2F2F7', dark: '#2a2a2a' }, 'background');
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1d1d1d' }, 'background');
  const iconColor = useThemeColor({ light: '#8E8E93', dark: '#8E8E93' }, 'icon');
  const greenColor = useThemeColor({ light: '#2D8659', dark: '#2D8659' }, 'tint');
  const contactIconBackground = useThemeColor({ light: '#E8F5E9', dark: '#2a2a2a' }, 'background');

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
    <ThemedView style={[styles.container, { backgroundColor }]}>      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ThemedText style={[styles.header, { color: textColor }]}>Help Center</ThemedText>
        
        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: inputBackgroundColor }]}>
          <IconSymbol name="magnifyingglass" size={20} color={iconColor} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search"
            placeholderTextColor={iconColor}
          />
        </View>
        
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'faq' && styles.activeTab]}
            onPress={() => setActiveTab('faq')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'faq' && styles.activeTabText, { color: activeTab === 'faq' ? textColor : iconColor }]}>
              FAQ
            </ThemedText>
            {activeTab === 'faq' && <View style={[styles.tabIndicator, { backgroundColor: greenColor }]} />}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'contact' && styles.activeTab]}
            onPress={() => setActiveTab('contact')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'contact' && styles.activeTabText, { color: activeTab === 'contact' ? textColor : iconColor }]}>
              Contact Us
            </ThemedText>
            {activeTab === 'contact' && <View style={[styles.tabIndicator, { backgroundColor: greenColor }]} />}
          </TouchableOpacity>
        </View>
        
        {/* Content */}
        {activeTab === 'faq' ? (
          <View style={styles.contentContainer}>
            {faqData.map((item, index) => (
              <Collapsible key={index} title={item.question}>
                <ThemedText>{item.answer}</ThemedText>
              </Collapsible>
            ))}
          </View>
        ) : (
          <View style={styles.contentContainer}>
            {contactData.map((item, index) => (
              <TouchableOpacity key={index} style={[styles.contactItem, { borderColor, backgroundColor: cardBackgroundColor }]}>
                <View style={[styles.contactIconContainer, { backgroundColor: contactIconBackground }]}>
                  <IconSymbol name={item.icon} size={20} color={greenColor} />
                </View>
                <ThemedText style={[styles.contactLabel, { color: textColor }]}>{item.label}</ThemedText>
                <IconSymbol name="chevron.right" size={20} color={iconColor} />
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
    fontSize: FontSizes.titleSm, // 20
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 4,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: FontSizes.md, // 14
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
    fontSize: FontSizes.md, // 14
    // fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 3,
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
    borderRadius: 10,
    marginBottom: 10,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactLabel: {
    flex: 1,
    fontSize: FontSizes.md, // 14
  },
});
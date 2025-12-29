import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const Services = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  // Define custom colors based on theme
  const colorScheme = useColorScheme();
  const cardBackgroundColor = colorScheme === 'dark' ? '#1F2937' : '#FFFFFF';
  const borderColor = colorScheme === 'dark' ? '#374151' : '#E0E0E0';
  const secondaryTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#666666';
  
  const [activeTab, setActiveTab] = useState('Services');
  
  // Mock data for services
  const services = [
    { id: 1, title: 'Classic Cuts', description: 'It includes hair treatment and hair cut', duration: '60 min', price: '3000.00' },
    { id: 2, title: 'Classic Cuts', description: 'It includes hair treatment and hair cut', duration: '60 min', price: '3000.00' },
    { id: 3, title: 'Classic Cuts', description: 'It includes hair treatment and hair cut', duration: '60 min', price: '3000.00' },
    { id: 4, title: 'Classic Cuts', description: 'It includes hair treatment and hair cut', duration: '60 min', price: '3000.00' },
    { id: 5, title: 'Classic Cuts', description: 'It includes hair treatment and hair cut', duration: '60 min', price: '3000.00' },
  ];

  const handleAddService = () => {
    // Navigate to add service screen
    router.push('/business/profile/add-service');
  };
    
  const handleServicePress = (serviceId: number) => {
    // Handle service card press
    console.log('Service pressed:', serviceId);
  };
    
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundColor }]}>      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Services</Text>
      </View>
        
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => setActiveTab('Services')}
        >
          <Text style={[styles.tabText, { color: textColor, fontWeight: activeTab === 'Services' ? 'bold' : 'normal' }]}>Services</Text>
          {activeTab === 'Services' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => setActiveTab('Packages')}
        >
          <Text style={[styles.tabText, { color: textColor, fontWeight: activeTab === 'Packages' ? 'bold' : 'normal' }]}>Packages</Text>
          {activeTab === 'Packages' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>
        
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {services.map((service) => (
          <TouchableOpacity 
            key={service.id} 
            style={[styles.serviceCard, { backgroundColor: cardBackgroundColor, borderColor: borderColor }]} 
            onPress={() => handleServicePress(service.id)}
          >
            <Text style={[styles.serviceTitle, { color: textColor }]}>{service.title}</Text>
            <Text style={[styles.serviceDescription, { color: secondaryTextColor }]}>{service.description}</Text>
              
            <View style={styles.serviceDetailsRow}>
              <View style={styles.durationContainer}>
                <Ionicons name="time-outline" size={16} color={secondaryTextColor} />
                <Text style={[styles.serviceDetailText, { color: secondaryTextColor }]}>{service.duration}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={[styles.servicePrice, { color: secondaryTextColor, textDecorationLine: 'line-through' }]}>₦</Text>
                <Text style={[styles.servicePrice, { color: textColor, textDecorationLine: 'none', marginLeft: 4 }]}>₦{service.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
        
      {/* Add New Service Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddService}>
          <Text style={styles.addButtonText}>Add New Service</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100, // Extra padding to account for the button at the bottom
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
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 32, // To account for the back button space
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabButton: {
    alignItems: 'center',
    paddingBottom: 12,
    flex: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '50%',
    height: 4,
    backgroundColor: '#2E7D32',
    borderRadius: 2,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    marginBottom: 16,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  serviceDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceDetailText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 8,
  },
  servicePrice: {
    fontSize: 13,
    fontWeight: '500',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  addButton: {
    backgroundColor: '#2E7D32',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Services;
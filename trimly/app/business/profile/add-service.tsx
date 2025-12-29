import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from 'react-native';

const { width } = Dimensions.get('window');

const AddService = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  // Define custom colors based on theme
  const colorScheme = useColorScheme();
  const cardBackgroundColor = colorScheme === 'dark' ? '#1F2937' : '#FFFFFF';
  const borderColor = colorScheme === 'dark' ? '#374151' : '#E0E0E0';
  const placeholderTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#AAAAAA';
  const secondaryTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#777777';

  const [activeTab, setActiveTab] = useState('Services');
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('30');
  const [price, setPrice] = useState('100.00');

  const handleDurationChange = (value: number) => {
    const newDuration = parseInt(duration) + value;
    if (newDuration >= 0) {
      setDuration(newDuration.toString());
    }
  };

  const handlePriceChange = (value: number) => {
    const newPrice = parseFloat(price) + value;
    if (newPrice >= 0) {
      setPrice(newPrice.toFixed(2));
    }
  };

  const handleSave = () => {
    // Handle saving the service
    console.log('Saving service:', { serviceName, description, duration, price });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Add Service</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={textColor} />
        </TouchableOpacity>
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
        {/* Service Name Field */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, { color: textColor }]}>Service Name</Text>
          <TextInput
            style={[styles.inputField, { backgroundColor: cardBackgroundColor, color: textColor, borderColor: borderColor }]}
            placeholder="e.g. Hair cut, Shaving, etc."
            placeholderTextColor={placeholderTextColor}
            value={serviceName}
            onChangeText={setServiceName}
          />
        </View>

        {/* Description Field */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, { color: textColor }]}>
            <Text>Description</Text>
            <Text style={{ color: secondaryTextColor }}> (Optional)</Text>
          </Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: cardBackgroundColor, color: textColor, borderColor: borderColor }]}
            placeholder="Describe what this service includes"
            placeholderTextColor={placeholderTextColor}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Duration Field */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, { color: textColor }]}>Duration</Text>
          <View style={[styles.durationContainer, { backgroundColor: cardBackgroundColor, borderColor: borderColor }]}>
            <TextInput
              style={[styles.durationInput, { color: textColor }]}
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
            />
            <View style={styles.spinnerContainer}>
              <TouchableOpacity onPress={() => handleDurationChange(15)}>
                <Ionicons name="chevron-up" size={14} color={textColor} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDurationChange(-15)}>
                <Ionicons name="chevron-down" size={14} color={textColor} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Price Field */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, { color: textColor }]}>Price ($)</Text>
          <View style={[styles.priceContainer, { backgroundColor: cardBackgroundColor, borderColor: borderColor }]}>
            <TextInput
              style={[styles.priceInput, { color: textColor }]}
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
            <View style={styles.spinnerContainer}>
              <TouchableOpacity onPress={() => handlePriceChange(5)}>
                <Ionicons name="chevron-up" size={14} color={textColor} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePriceChange(-5)}>
                <Ionicons name="chevron-down" size={14} color={textColor} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
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
    paddingTop: 32,
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
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  searchButton: {
    padding: 8,
    marginLeft: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabButton: {
    alignItems: 'center',
    paddingBottom: 12,
    flex: 1,
  },
  tabText: {
    fontSize: 16,
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
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputField: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  textArea: {
    height: 150,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
  },
  durationInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
  },
  priceInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  spinnerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  saveButton: {
    backgroundColor: '#2E7D32',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddService;
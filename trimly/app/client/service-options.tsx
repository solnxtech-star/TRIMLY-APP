import { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function ServiceOptionsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // Sample service data - in a real app this would come from an API
  const services = [
    { 
      id: '1', 
      name: 'Haircut', 
      description: 'Professional haircut with precision styling',
      basePrice: '₦5000',
      duration: '30 mins',
      image: require('@/assets/stock/img.png'),
      options: [
        { id: '1-1', name: 'Basic Cut', price: '₦5000', duration: '30 mins' },
        { id: '1-2', name: 'Deluxe Cut', price: '₦7000', duration: '45 mins' },
        { id: '1-3', name: 'Premium Cut', price: '₦10000', duration: '60 mins' },
      ]
    },
    { 
      id: '2', 
      name: 'Braiding', 
      description: 'Expert braiding services with various styles',
      basePrice: '₦8000',
      duration: '60 mins',
      image: require('@/assets/stock/rated.png'),
      options: [
        { id: '2-1', name: 'Single Braids', price: '₦8000', duration: '60 mins' },
        { id: '2-2', name: 'Double Braids', price: '₦12000', duration: '90 mins' },
        { id: '2-3', name: 'Ghana Braids', price: '₦15000', duration: '120 mins' },
      ]
    },
    { 
      id: '3', 
      name: 'Treatment', 
      description: 'Deep conditioning and hair treatment',
      basePrice: '₦6000',
      duration: '45 mins',
      image: require('@/assets/stock/service.jpg'),
      options: [
        { id: '3-1', name: 'Basic Treatment', price: '₦6000', duration: '45 mins' },
        { id: '3-2', name: 'Deluxe Treatment', price: '₦9000', duration: '60 mins' },
        { id: '3-3', name: 'Premium Treatment', price: '₦12000', duration: '90 mins' },
      ]
    },
    { 
      id: '4', 
      name: 'Massage', 
      description: 'Relaxing head and neck massage',
      basePrice: '₦4000',
      duration: '30 mins',
      image: require('@/assets/stock/special.jpg'),
      options: [
        { id: '4-1', name: 'Head Massage', price: '₦4000', duration: '30 mins' },
        { id: '4-2', name: 'Neck & Shoulder Massage', price: '₦6000', duration: '45 mins' },
        { id: '4-3', name: 'Full Scalp Massage', price: '₦8000', duration: '60 mins' },
      ]
    },
    { 
      id: '5', 
      name: 'Nails', 
      description: 'Professional nail care and styling',
      basePrice: '₦3000',
      duration: '30 mins',
      image: require('@/assets/stock/img.png'),
      options: [
        { id: '5-1', name: 'Basic Manicure', price: '₦3000', duration: '30 mins' },
        { id: '5-2', name: 'Deluxe Manicure', price: '₦5000', duration: '45 mins' },
        { id: '5-3', name: 'Pedicure', price: '₦6000', duration: '60 mins' },
      ]
    },
  ];

  // Find the selected service
  const selectedService = services.find(service => service.id === id) || services[0];
  
  const [selectedOption, setSelectedOption] = useState(selectedService.options[0].id);

  const handleBookService = () => {
    console.log('Booking service:', selectedService.id, 'with option:', selectedOption);
    // Navigate to booking form screen
    router.push('/client/bookings/form');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <AntDesign name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Service Options</ThemedText>
        </View>

        {/* Service Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={selectedService.image} 
            style={styles.serviceImage} 
            resizeMode="cover"
          />
        </View>

        {/* Service Info */}
        <View style={styles.serviceInfo}>
          <ThemedText style={styles.serviceName}>{selectedService.name}</ThemedText>
          <ThemedText style={styles.serviceDescription}>{selectedService.description}</ThemedText>
          
          <View style={styles.serviceDetails}>
            <View style={styles.detailItem}>
              <IconSymbol name="clock" size={16} color="#666666" />
              <ThemedText style={styles.detailText}>{selectedService.duration}</ThemedText>
            </View>
            <View style={styles.detailItem}>
              <IconSymbol name="tag" size={16} color="#666666" />
              <ThemedText style={styles.detailText}>{selectedService.basePrice}</ThemedText>
            </View>
          </View>
        </View>

        {/* Options */}
        <View style={styles.optionsSection}>
          <ThemedText style={styles.sectionTitle}>Choose Option</ThemedText>
          {selectedService.options.map((option) => (
            <TouchableOpacity 
              key={option.id}
              style={[
                styles.optionItem, 
                selectedOption === option.id && styles.selectedOption
              ]}
              onPress={() => setSelectedOption(option.id)}
            >
              <View style={styles.optionInfo}>
                <ThemedText style={styles.optionName}>{option.name}</ThemedText>
                <ThemedText style={styles.optionDuration}>{option.duration}</ThemedText>
              </View>
              <ThemedText style={styles.optionPrice}>{option.price}</ThemedText>
              {selectedOption === option.id && (
                <IconSymbol name="checkmark.circle.fill" size={20} color="#2D8A47" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Book Button */}
      <TouchableOpacity style={styles.bookButton} onPress={handleBookService}>
        <ThemedText style={styles.bookButtonText}>Book Service</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2D8A47',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 16,
  },
  imageContainer: {
    height: 200,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  serviceInfo: {
    padding: 16,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  optionsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedOption: {
    borderColor: '#2D8A47',
    backgroundColor: 'rgba(45, 138, 71, 0.05)',
  },
  optionInfo: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDuration: {
    fontSize: 14,
    color: '#666666',
  },
  optionPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D8A47',
    marginRight: 16,
  },
  bookButton: {
    backgroundColor: '#2D8A47',
    margin: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
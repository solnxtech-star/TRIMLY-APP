import { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function BusinessDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);

  // Sample business data - in a real app this would come from an API
  const businessImages = [
    require('@/assets/stock/img.png'),
    require('@/assets/stock/rated.png'),
    require('@/assets/stock/service.jpg'),
    require('@/assets/stock/special.jpg'),
  ];
  
  // Select image based on business ID
  const getImageForBusiness = (businessId: string) => {
    const index = parseInt(businessId) % businessImages.length;
    return businessImages[index];
  };
  
  const business = {
    id: id || '1',
    name: 'Glamour Haven',
    description: 'Premium beauty salon offering top-notch haircuts, styling, and grooming services.',
    location: 'No. 20 Ozuoba Rd, Ph',
    hours: 'Mon - Sun | 11am - 11pm',
    rating: 4.8,
    reviewCount: 120,
    image: getImageForBusiness(id as string || '1'),
  };

  const services = [
    { id: '1', name: 'Haircut', chevron: true },
    { id: '2', name: 'Braiding', chevron: true },
    { id: '3', name: 'Treatment', chevron: true },
    { id: '4', name: 'Massage', chevron: true },
    { id: '5', name: 'Nails', chevron: true },
  ];

  const handleServicePress = (serviceId: string) => {
    console.log('Selected service:', serviceId);
    // Navigate to service options screen
  };

  const handleBookAppointment = () => {
    console.log('Book appointment pressed');
    // Navigate to service selection screen
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Hero Image Area */}
        <View style={styles.heroContainer}>
          <Image 
            source={business.image} 
            style={styles.heroImage} 
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton} onPress={() => setIsFavorite(!isFavorite)}>
            <IconSymbol name={isFavorite ? "heart.fill" : "heart"} size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Business Info */}
        <View style={styles.infoContainer}>
          {/* iOS-style indicator */}
          <View style={styles.indicator} />
          
          <ThemedText style={styles.businessName}>{business.name}</ThemedText>
          <ThemedText style={styles.businessDescription}>{business.description}</ThemedText>
          
          <View style={styles.locationContainer}>
            <IconSymbol name="location" size={16} color="#666666" />
            <ThemedText style={styles.locationText}>{business.location}</ThemedText>
          </View>
          
          <View style={styles.hoursContainer}>
            <IconSymbol name="clock" size={16} color="#666666" />
            <ThemedText style={styles.hoursText}>{business.hours}</ThemedText>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <View style={styles.actionButtonItem}>
            <TouchableOpacity style={styles.actionButton}>
              <IconSymbol name="globe" size={24} color="#000000" />
            </TouchableOpacity>
            <ThemedText style={styles.actionButtonText}>Website</ThemedText>
          </View>
          <View style={styles.actionButtonItem}>
            <TouchableOpacity style={styles.actionButton}>
              <IconSymbol name="mark-unread-chat-alt" size={24} color="#000000" />
            </TouchableOpacity>
            <ThemedText style={styles.actionButtonText}>Chat</ThemedText>
          </View>
          <View style={styles.actionButtonItem}>
            <TouchableOpacity style={styles.actionButton}>
              <IconSymbol name="phone" size={24} color="#000000" />
            </TouchableOpacity>
            <ThemedText style={styles.actionButtonText}>Call</ThemedText>
          </View>
          <View style={styles.actionButtonItem}>
            <TouchableOpacity style={styles.actionButton}>
              <IconSymbol name="location" size={24} color="#000000" />
            </TouchableOpacity>
            <ThemedText style={styles.actionButtonText}>Map</ThemedText>
          </View>
          <View style={styles.actionButtonItem}>
            <TouchableOpacity style={styles.actionButton}>
              <IconSymbol name="share" size={24} color="#000000" />
            </TouchableOpacity>
            <ThemedText style={styles.actionButtonText}>Share</ThemedText>
          </View>
        </View>

        {/* Services Tab Content */}
        <View style={styles.tabContent}>
          <ThemedText style={styles.tabTitle}>Services</ThemedText>
          {services.map((service) => (
            <TouchableOpacity 
              key={service.id} 
              style={styles.serviceItem}
              onPress={() => handleServicePress(service.id)}
            >
              <ThemedText style={styles.serviceName}>{service.name}</ThemedText>
              {service.chevron && (
                <IconSymbol name="chevron.right" size={20} color="#666666" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Book Appointment Button */}
      <TouchableOpacity style={styles.bookButton} onPress={handleBookAppointment}>
        <ThemedText style={styles.bookButtonText}>Book Appointment</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  heroContainer: {
    height: 200,
    position: 'relative',
    zIndex: 1,
  },
  heroImage: {
    width: '100%',
    height: '105%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  infoContainer: {
    marginTop: -20,
    paddingTop: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    zIndex: 2
  },
  indicator: {
    width: 60,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#C7C7CC',
    alignSelf: 'center',
    marginBottom: 25,
  },
  businessName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  businessDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 8,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoursText: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 8,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  actionButtonItem: {
    alignItems: 'center',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  tabContent: {
    padding: 16,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  serviceName: {
    fontSize: 18,
    color: '#000000',
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
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function BusinessDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Sample business data - in a real app this would come from an API
  const business = {
    id: id || '1',
    name: 'Glamour Haven',
    description: 'Premium beauty salon offering top-notch haircuts, styling, and grooming services.',
    location: 'No. 20 Ozuoba Rd, Ph',
    hours: 'Mon - Sun | 11am - 11pm',
    rating: 4.8,
    reviewCount: 120,
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
          <View style={styles.heroImage} />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton}>
            <IconSymbol name="heart" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Business Info */}
        <View style={styles.infoContainer}>
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
          
          <View style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={16} color="#FFD700" />
            <ThemedText style={styles.ratingText}>
              {business.rating} ({business.reviewCount} reviews)
            </ThemedText>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol name="globe" size={24} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol name="message" size={24} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol name="phone" size={24} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol name="location" size={24} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol name="square.and.arrow.up" size={24} color="#000000" />
          </TouchableOpacity>
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
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2D8A47',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 16,
  },
  businessName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  businessDescription: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 8,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hoursText: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
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
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
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
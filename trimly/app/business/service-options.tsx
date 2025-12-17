import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ServiceOptionsScreen() {
  const router = useRouter();
  const { serviceId } = useLocalSearchParams();

  // Sample service data - in a real app this would come from an API
  const service = {
    id: serviceId || '1',
    name: 'Haircut',
  };

  const options = [
    {
      id: '1',
      name: 'Classic Haircut',
      description: 'Professional cut wash and style',
      price: '₦4,000',
      duration: '45 min',
    },
    {
      id: '2',
      name: 'Deluxe Haircut',
      description: 'Professional cut with hot towel and premium products',
      price: '₦6,000',
      duration: '60 min',
    },
    {
      id: '3',
      name: 'Kids Haircut',
      description: 'Specialized cut for children under 12',
      price: '₦3,000',
      duration: '30 min',
    },
  ];

  const handleBookNow = (optionId: string) => {
    console.log('Booking option:', optionId);
    // Navigate to date/time selection screen
    router.push('/business/select-date-time');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="#000000" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>{service.name}</ThemedText>
          <View style={styles.placeholder} />
        </View>

        {/* Service Options */}
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <View key={option.id} style={styles.optionCard}>
              <View style={styles.optionInfo}>
                <ThemedText style={styles.optionName}>{option.name}</ThemedText>
                <ThemedText style={styles.optionDescription}>{option.description}</ThemedText>
                <View style={styles.optionDetails}>
                  <ThemedText style={styles.price}>{option.price}</ThemedText>
                  <ThemedText style={styles.duration}>{option.duration}</ThemedText>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.bookButton} 
                onPress={() => handleBookNow(option.id)}
              >
                <ThemedText style={styles.bookButtonText}>Book Now</ThemedText>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  optionsContainer: {
    padding: 16,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  optionInfo: {
    marginBottom: 16,
  },
  optionName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 12,
  },
  optionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D8A47',
  },
  duration: {
    fontSize: 16,
    color: '#666666',
  },
  bookButton: {
    backgroundColor: '#2D8A47',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
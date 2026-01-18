import { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { FontSizes } from '@/constants/theme';

export default function ServiceOptionsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { serviceId, source } = useLocalSearchParams();
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#ffffff', dark: '#424242' }, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'text');
  const filterBackgroundColor = useThemeColor({ light: '#F0F0F0', dark: '#2D2D2D' }, 'text');
  const filterTextColor = useThemeColor({ light: '#424242', dark: '#ffffff' }, 'text');

  // Sample services data - in a real app this would come from an API
  const services = [
    { id: '1', name: 'Haircut' },
    { id: '2', name: 'Braiding' },
    { id: '3', name: 'Treatment' },
    { id: '4', name: 'Massage' },
    { id: '5', name: 'Nails' },
  ];
  
  // Find the selected service based on serviceId
  const service = services.find(s => s.id === serviceId) || services[0];

  // Filter categories
  const filters = ['All', 'Haircuts', 'Makeup', 'Massage', 'Skincare', 'Nails'];

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
    router.push(`/client/bookings/form?optionId=${optionId}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}> 
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => {
          // Check if we can go back, otherwise navigate to home
          if (navigation.canGoBack()) {
            router.back();
          } else {
            router.push('/client/dashboard');
          }
        }}>
          <AntDesign name="left" size={17} color={textColor} />
        </TouchableOpacity>
        <ThemedText style={[styles.title, { color: textColor }]}>{service.name}</ThemedText>
        <View style={styles.placeholder} />
      </View>
      
      {/* Filter Section - only show if coming from Book Appointment button */}
      {source === 'appointment' && (
        <View style={[styles.filterContainer, { borderBottomColor: borderColor }]}> 
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  { backgroundColor: filterBackgroundColor },
                  selectedFilter === filter && styles.selectedFilterButton
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <ThemedText 
                  style={[
                    styles.filterText,
                    { color: filterTextColor },
                    selectedFilter === filter && styles.selectedFilterText
                  ]}
                >
                  {filter}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      
      <ScrollView style={styles.content}>
        {/* Service Options */}
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <View key={option.id} style={[styles.optionCard, { backgroundColor: cardBackgroundColor, borderColor }]}> 
              <View style={styles.optionHeader}>
                <ThemedText style={[styles.optionName, { color: textColor }]}>{option.name}</ThemedText>
                <TouchableOpacity 
                  style={styles.bookButton} 
                  onPress={() => handleBookNow(option.id)}
                >
                  <ThemedText style={[styles.bookButtonText, { color: '#ffffff' }]}>Book Now</ThemedText>
                </TouchableOpacity>
              </View>
              <ThemedText style={[styles.optionDescription, { color: textColor }]}>{option.description}</ThemedText>
              <View style={styles.optionDetails}>
                <ThemedText style={[styles.price, { color: textColor }]}>{option.price}</ThemedText>
                <ThemedText style={[styles.duration, { color: textColor }]}>{option.duration}</ThemedText>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16
  },
  backButton: {
    padding: 6,
    borderWidth: 0.5,
    borderRadius: 50,
  },
  title: {
    fontSize: FontSizes.xl, // 18
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  filterContainer: {
    paddingVertical: 12
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
  },
  selectedFilterButton: {
    backgroundColor: '#2D8A47',
  },
  filterText: {
    fontSize: FontSizes.sm, // 12
  },
  selectedFilterText: {
    fontWeight: '600',
  },
  optionsContainer: {
    padding: 16,
  },
  optionCard: {
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
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionName: {
    fontSize: FontSizes.lg, // 16
    fontWeight: '700',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: FontSizes.md, // 14
    marginBottom: 12,
  },
  optionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  price: {
    fontSize: FontSizes.xl, // 18
    fontWeight: '700',
    color: '#2D8A47',
  },
  duration: {
    fontSize: FontSizes.md, // 14
  },
  bookButton: {
    backgroundColor: '#2D8A47',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: FontSizes.xs, // 10
    fontWeight: '600',
  },
});
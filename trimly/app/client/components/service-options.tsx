import { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { FontSizes } from '@/constants/theme';
import salonService from '@/services/salonService';
import { Service } from '@/types/salon.types';

export default function ServiceOptionsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { serviceId, source, salonId } = useLocalSearchParams();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#ffffff', dark: '#424242' }, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'text');
  const filterBackgroundColor = useThemeColor({ light: '#F0F0F0', dark: '#2D2D2D' }, 'text');
  const filterTextColor = useThemeColor({ light: '#424242', dark: '#ffffff' }, 'text');

  useEffect(() => {
    const loadService = async () => {
      if (!serviceId || !salonId) {
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        const data = await salonService.getSalonServiceById(
          String(salonId),
          String(serviceId)
        );
        setService(data);
      } catch (e: any) {
        setError(e.message || 'Failed to load service');
      } finally {
        setIsLoading(false);
      }
    };

    loadService();
  }, [serviceId, salonId]);

  // Filter categories
  const filters = ['All', 'Haircuts', 'Makeup', 'Massage', 'Skincare', 'Nails'];

  const handleBookNow = (optionId: string) => {
    console.log('Booking option:', optionId);
    // Navigate to date/time selection screen
    router.push(`/client/bookings/form?optionId=${optionId}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2D8A47" />
          <ThemedText style={{ marginTop: 16 }}>Loading service...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !service) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}
        >
          <ThemedText style={{ textAlign: 'center' }}>
            {error || 'Service not found'}
          </ThemedText>
          <TouchableOpacity
            style={[styles.bookButton, { marginTop: 16 }]}
            onPress={() => {
              if (navigation.canGoBack()) {
                router.back();
              } else {
                router.push('/client/dashboard');
              }
            }}
          >
            <ThemedText style={[styles.bookButtonText, { color: '#ffffff' }]}>
              Go Back
            </ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const priceText =
    typeof service.price === 'string'
      ? `₦${Number(service.price).toLocaleString()}`
      : `₦${service.price}`;

  const durationText = `${service.duration_minutes} min`;

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
        <ThemedText style={[styles.title, { color: textColor }]}>
          {service.name}
        </ThemedText>
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
        {/* Service Option */}
        <View style={styles.optionsContainer}>
          <View
            style={[
              styles.optionCard,
              { backgroundColor: cardBackgroundColor, borderColor },
            ]}
          >
            <View style={styles.optionHeader}>
              <ThemedText style={[styles.optionName, { color: textColor }]}>
                {service.name}
              </ThemedText>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => handleBookNow(String(serviceId))}
              >
                <ThemedText
                  style={[styles.bookButtonText, { color: '#ffffff' }]}
                >
                  Book Now
                </ThemedText>
              </TouchableOpacity>
            </View>
            <ThemedText
              style={[styles.optionDescription, { color: textColor }]}
            >
              {service.description || 'No description'}
            </ThemedText>
            <View style={styles.optionDetails}>
              <ThemedText style={[styles.price, { color: textColor }]}>
                {priceText}
              </ThemedText>
              <ThemedText style={[styles.duration]}>{durationText}</ThemedText>
            </View>
          </View>
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
    fontSize: FontSizes.lg, // 18
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
    // marginBottom: 12,
  },
  optionName: {
    fontSize: FontSizes.md, // 16
    fontWeight: '700',
    // marginBottom: 4,
  },
  optionDescription: {
    fontSize: FontSizes.sm, // 14
    // marginBottom: 12,
  },
  optionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  price: {
    fontSize: FontSizes.md, // 18
    fontWeight: '700',
    color: '#2D8A47',
  },
  duration: {
    fontSize: FontSizes.sm, // 14
    color: 'green'
  },
  bookButton: {
    backgroundColor: '#2D8A47',
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: FontSizes.xs, // 10
    fontWeight: '600',
  },
});

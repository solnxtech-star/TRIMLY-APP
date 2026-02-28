import { useState, useEffect } from 'react';
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
import vendorService from '@/services/vendorService';
import { Service } from '@/types/salon.types';
import CustomAlert from '@/components/CustomAlert';

export default function ServiceOptionsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const {
    serviceId,
    source,
    salonId,
    businessType,
    serviceName: initialServiceName,
    serviceDescription: initialServiceDescription,
    servicePrice: initialServicePrice,
    serviceDurationMinutes: initialServiceDurationMinutes,
  } = useLocalSearchParams();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom Alert state
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    buttons?: any[];
  }>({
    visible: false,
    title: '',
    message: '',
  });

  const showAlert = (title: string, message: string, buttons?: any[]) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      buttons,
    });
  };

  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    const fetchServices = async () => {
      if (source === 'appointment' && salonId) {
        setIsLoading(true);
        try {
          let fetchedServices: Service[] = [];
          if (businessType === 'salon') {
            const data = await salonService.getSalonById(String(salonId));
            fetchedServices = data.services || [];
          } else {
            const data: any = await vendorService.getVendorById(String(salonId));
            fetchedServices = data.services || [];
          }
          setServices(fetchedServices);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch services');
        } finally {
          setIsLoading(false);
        }
      } else if (initialServiceName) {
        // If we only have one service passed from handleServicePress
        setServices([
          {
            id: serviceId ? String(serviceId) : undefined,
            name: String(initialServiceName),
            description: String(initialServiceDescription || ''),
            price: String(initialServicePrice),
            duration_minutes: Number(initialServiceDurationMinutes),
            categories: [],
          } as Service,
        ]);
      }
    };

    fetchServices();
  }, [salonId, businessType, source, serviceId]);

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#E5E5E5', dark: '#424242' }, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'text');
  const filterBackgroundColor = useThemeColor({ light: '#F0F0F0', dark: '#2D2D2D' }, 'text');
  const filterTextColor = useThemeColor({ light: '#424242', dark: '#ffffff' }, 'text');

  // Filter categories
  const filters = ['All', 'Haircuts', 'Makeup', 'Massage', 'Skincare', 'Nails'];

  const handleBookNow = (service: Service) => {
    const serviceIdStr = String(service.id);
    
    // Basic UUID validation regex
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(serviceIdStr);
    
    if (!service.id || !isUuid) {
      console.warn('⚠️ [SERVICE OPTIONS] Cannot book service without a valid UUID:', service.id);
      showAlert('Invalid Service', 'This service cannot be booked because it has an invalid ID. Please contact support.');
      return;
    }
    
    router.push({
      pathname: '/client/bookings/form',
      params: {
        optionId: serviceIdStr,
        businessId: salonId ? String(salonId) : '',
        businessType: businessType || 'salon',
        serviceName: service.name,
        servicePrice: String(service.price),
        serviceDurationMinutes: String(service.duration_minutes),
      },
    });
  };

  const filteredServices = selectedFilter === 'All' 
    ? services 
    : services.filter(s => s.name.toLowerCase().includes(selectedFilter.toLowerCase()));

  const pageTitle = source === 'appointment' ? 'Select Service' : (initialServiceName || 'Service Options');

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2D8A47" />
          <ThemedText style={{ marginTop: 16 }}>Loading services...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}> 
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (salonId) {
              router.push(`/client/business-details/${salonId}`);
            } else {
              router.back();
            }
          }}
        >
          <AntDesign name="left" size={17} color={textColor} />
        </TouchableOpacity>
        <ThemedText style={[styles.title, { color: textColor }]}>
          {pageTitle}
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
        <View style={styles.optionsContainer}>
          {filteredServices.length > 0 ? (
            filteredServices.map((service, index) => (
              <View
                key={service.id || index}
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
                    onPress={() => handleBookNow(service)}
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
                  {service.description || 'No description available'}
                </ThemedText>
                <View style={styles.optionDetails}>
                  <ThemedText style={[styles.price, { color: textColor }]}>
                    ₦{Number(service.price).toLocaleString()}
                  </ThemedText>
                  <ThemedText style={[styles.duration]}>{service.duration_minutes} min</ThemedText>
                </View>
              </View>
            ))
          ) : (
            <ThemedText style={{ textAlign: 'center', marginTop: 32 }}>No services found</ThemedText>
          )}
        </View>
      </ScrollView>

      {/* Custom Alert Component */}
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onDismiss={hideAlert}
      />
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

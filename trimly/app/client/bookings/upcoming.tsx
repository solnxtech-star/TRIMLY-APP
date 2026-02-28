import { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Switch, Image, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';
import { FontSizes } from '@/constants/theme';
import bookingService from '@/services/bookingService';
import { Booking } from '@/types/booking.types';

export default function UpcomingBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});
  
  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'text');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({ light: '#6B6B6B', dark: '#A0A0A0' }, 'text');
  const borderColor = useThemeColor({ light: '#E5E5E5', dark: '#333333' }, 'text');
  const primaryColor = useThemeColor({ light: '#2D8659', dark: '#2D8A47' }, 'tint');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setError(null);
      // Fetch bookings with pending/confirmed status for "Upcoming"
      const response = await bookingService.listBookings({ status: 'pending' });
      setBookings(response.results);
      
      // Initialize toggle states
      const initialToggles: Record<string, boolean> = {};
      response.results.forEach(b => {
        initialToggles[b.id] = false;
      });
      setToggleStates(initialToggles);
    } catch (err: any) {
      console.error('Fetch upcoming bookings error:', err);
      setError(err.message || 'Failed to load bookings');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBookings();
  };

  const toggleSwitch = (id: string) => {
    setToggleStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCancelBooking = (id: string) => {
    router.push({
      pathname: '/client/bookings/cancel-booking',
      params: { bookingId: id }
    });
  };

  const formatTime = (timeStr: string) => {
    try {
      const [h, m] = timeStr.split(':');
      let hour = parseInt(h);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12;
      hour = hour ? hour : 12;
      return `${hour}:${m} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
      return new Date(dateStr).toLocaleDateString('en-US', options);
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText style={{ color: '#EF4444' }}>{error}</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={fetchBookings}>
          <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  if (bookings.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText style={{ color: secondaryTextColor }}>No upcoming bookings</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {bookings.map((booking) => (
        <View key={booking.id} style={[styles.cardContainer, { backgroundColor: cardBackgroundColor }]}> 
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <ThemedText style={[styles.dateTimeText, { color: textColor }]}> 
              {formatDate(booking.date)} - {formatTime(booking.start_time)}
            </ThemedText>
            <View style={styles.reminderContainer}>
              <ThemedText style={[styles.reminderText, { color: textColor }]}>Remind me</ThemedText>
              <Switch
                trackColor={{ false: '#767577', true: primaryColor }}
                thumbColor={toggleStates[booking.id] ? '#FFFFFF' : '#FFFFFF'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => toggleSwitch(booking.id)}
                value={toggleStates[booking.id] || false}
              />
            </View>
          </View>
          
          <View style={[styles.divider, { backgroundColor: borderColor }]} />
          
          {/* Salon Information */}
          <View style={styles.salonInfoContainer}>
            <Image 
              source={require('@/assets/stock/service.jpg')} 
              style={styles.salonImage} 
            />
            <View style={styles.salonDetails}>
              <ThemedText style={[styles.salonName, { color: textColor }]}>
                {booking.salon_service_name || booking.vendor_service_name || 'Service'}
              </ThemedText>
              <View style={styles.infoRow}>
                <ThemedText style={[styles.infoText, { color: secondaryTextColor }]}>📍 {booking.business_name || 'Location not available'}</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText style={[styles.infoText, { color: secondaryTextColor }]}>📄 Service ID : #{booking.id.slice(0, 8).toUpperCase()}</ThemedText>
              </View>
            </View>
          </View>
          
          <View style={[styles.divider, { backgroundColor: borderColor }]} />
          
          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.cancelButton, { borderColor: primaryColor }]} 
              onPress={() => handleCancelBooking(booking.id)}
            >
              <ThemedText style={[styles.cancelButtonText, { color: primaryColor }]}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.receiptButton, { backgroundColor: primaryColor }]}> 
              <ThemedText style={styles.receiptButtonText}>View E - Receipt</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#2D8659',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cardContainer: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateTimeText: {
    fontSize: FontSizes.md, // 14
    fontWeight: '600',
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderText: {
    fontSize: FontSizes.sm, // 12
    marginRight: 8,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  salonInfoContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  salonImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 10,
  },
  salonDetails: {
    flex: 1,
  },
  salonName: {
    fontSize: FontSizes.md, // 14
    fontWeight: '600',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: FontSizes.sm, // 12
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    width: '45%',
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FontSizes.md, // 14
    fontWeight: '600',
  },
  receiptButton: {
    width: '45%',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  receiptButtonText: {
    fontSize: FontSizes.md, // 14
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   cardContainer: {
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   dateTimeText: {
//     fontSize: FontSizes.md, // 14
//     fontWeight: '600',
//   },
//   reminderContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   reminderText: {
//     fontSize: FontSizes.sm, // 12
//     marginRight: 8,
//   },
//   divider: {
//     height: 1,
//     marginVertical: 8,
//   },
//   salonInfoContainer: {
//     flexDirection: 'row',
//     marginBottom: 8,
//   },
//   salonImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 6,
//     marginRight: 10,
//   },
//   salonDetails: {
//     flex: 1,
//   },
//   salonName: {
//     fontSize: FontSizes.md, // 14
//     fontWeight: '600',
//     marginBottom: 6,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   infoText: {
//     fontSize: FontSizes.sm, // 12
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 8,
//   },
//   cancelButton: {
//     width: '45%',
//     height: 48,
//     borderRadius: 24,
//     borderWidth: 2,
//     backgroundColor: 'transparent',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cancelButtonText: {
//     fontSize: FontSizes.md, // 14
//     fontWeight: '600',
//   },
//   receiptButton: {
//     width: '45%',
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   receiptButtonText: {
//     fontSize: FontSizes.md, // 14
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
// });
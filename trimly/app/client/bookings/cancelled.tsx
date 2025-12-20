import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function CancelledBookings() {
  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({ light: '#6B6B6B', dark: '#A0A0A0' }, 'secondaryText');
  const borderColor = useThemeColor({ light: '#E5E5E5', dark: '#333333' }, 'border');
  const primaryColor = useThemeColor({ light: '#2D8659', dark: '#2D8A47' }, 'tint');
  
  // Mock data for bookings
  const bookings = [
    {
      id: 1,
      date: "Aug 25, 2024",
      time: "10:00 AM",
      salonName: "Glamour Haven",
      address: "20 Ozuoba Rd. Ph",
      serviceId: "#TRH456387",
      image: require('@/assets/stock/img.png')
    },
    {
      id: 2,
      date: "Aug 25, 2024",
      time: "10:00 AM",
      salonName: "Glamour Haven",
      address: "20 Ozuoba Rd. Ph",
      serviceId: "#TRH456387",
      image: require('@/assets/stock/service.jpg')
    },
    {
      id: 3,
      date: "Aug 25, 2024",
      time: "10:00 AM",
      salonName: "Glamour Haven",
      address: "20 Ozuoba Rd. Ph",
      serviceId: "#TRH456387",
      image: require('@/assets/stock/rated.png')
    }
  ];

  return (
    <View style={styles.container}>
      {bookings.map((booking) => (
        <View key={booking.id} style={[styles.cardContainer, { backgroundColor: cardBackgroundColor }]}> 
          {/* Date/Time Header */}
          <ThemedText style={[styles.dateTimeText, { color: textColor }]}> 
            {booking.date} - {booking.time}
          </ThemedText>
          
          <View style={[styles.divider, { backgroundColor: borderColor }]} />
          
          {/* Salon Information */}
          <View style={styles.salonInfoContainer}>
            <Image source={booking.image} style={styles.salonImage} />
            <View style={styles.salonDetails}>
              <ThemedText style={[styles.salonName, { color: textColor }]}>{booking.salonName}</ThemedText>
              <View style={styles.infoRow}>
                <ThemedText style={[styles.infoText, { color: secondaryTextColor }]}>📍 {booking.address}</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText style={[styles.infoText, { color: secondaryTextColor }]}>📄 Service ID : {booking.serviceId}</ThemedText>
              </View>
            </View>
          </View>
          
          <View style={[styles.divider, { backgroundColor: borderColor }]} />
          
          {/* Action Button */}
          <TouchableOpacity style={[styles.rebookButton, { backgroundColor: primaryColor }]}> 
            <ThemedText style={styles.rebookButtonText}>Re-Book</ThemedText>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  dateTimeText: {
    fontSize: 14,
    fontWeight: '600',
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
  },
  rebookButton: {
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  rebookButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
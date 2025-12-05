import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function CompletedBookings() {
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
        <View key={booking.id} style={styles.cardContainer}>
          {/* Date/Time Header */}
          <ThemedText style={styles.dateTimeText}>
            {booking.date} - {booking.time}
          </ThemedText>
          
          <View style={styles.divider} />
          
          {/* Salon Information */}
          <View style={styles.salonInfoContainer}>
            <Image source={booking.image} style={styles.salonImage} />
            <View style={styles.salonDetails}>
              <ThemedText style={styles.salonName}>{booking.salonName}</ThemedText>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoText}>📍 {booking.address}</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoText}>📄 Service ID : {booking.serviceId}</ThemedText>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          {/* Action Button */}
          <TouchableOpacity style={styles.receiptButton}>
            <ThemedText style={styles.receiptButtonText}>View E - Receipt</ThemedText>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateTimeText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000000',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  salonInfoContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  salonImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  salonDetails: {
    flex: 1,
  },
  salonName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#6B6B6B',
  },
  receiptButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2D8659',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  receiptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
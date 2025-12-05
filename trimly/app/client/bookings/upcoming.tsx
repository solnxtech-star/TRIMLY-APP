import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Switch, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';

export default function UpcomingBookings() {
  const router = useRouter();
  const [toggleStates, setToggleStates] = useState([false, true, false]);

  const toggleSwitch = (index: number) => {
    const newStates = [...toggleStates];
    newStates[index] = !newStates[index];
    setToggleStates(newStates);
  };

  const handleCancelBooking = () => {
    router.push('/client/bookings/cancel-booking');
  };

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
      {bookings.map((booking, index) => (
        <View key={booking.id} style={styles.cardContainer}>
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <ThemedText style={styles.dateTimeText}>
              {booking.date} - {booking.time}
            </ThemedText>
            <View style={styles.reminderContainer}>
              <ThemedText style={styles.reminderText}>Remind me</ThemedText>
              <Switch
                trackColor={{ false: '#767577', true: '#2D8659' }}
                thumbColor={toggleStates[index] ? '#FFFFFF' : '#FFFFFF'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => toggleSwitch(index)}
                value={toggleStates[index]}
              />
            </View>
          </View>
          
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
          
          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelBooking}>
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.receiptButton}>
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateTimeText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000000',
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderText: {
    fontSize: 15,
    color: '#000000',
    marginRight: 8,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  cancelButton: {
    width: '45%',
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#2D8659',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D8659',
  },
  receiptButton: {
    width: '45%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2D8659',
    justifyContent: 'center',
    alignItems: 'center',
  },
  receiptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
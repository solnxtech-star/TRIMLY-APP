import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Switch, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';
import { FontSizes } from '@/constants/theme';

export default function UpcomingBookings() {
  const router = useRouter();
  const [toggleStates, setToggleStates] = useState([false, true, false]);
  
  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'text');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({ light: '#6B6B6B', dark: '#A0A0A0' }, 'text');
  const borderColor = useThemeColor({ light: '#E5E5E5', dark: '#333333' }, 'text');
  const primaryColor = useThemeColor({ light: '#2D8659', dark: '#2D8A47' }, 'tint');

  const toggleSwitch = (index: number) => {
    const newStates = [...toggleStates];
    newStates[index] = !newStates[index];
    setToggleStates(newStates);
  };

  const handleCancelBooking = () => {
    router.push('../client/bookings/cancel-booking');
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
        <View key={booking.id} style={[styles.cardContainer, { backgroundColor: cardBackgroundColor }]}> 
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <ThemedText style={[styles.dateTimeText, { color: textColor }]}> 
              {booking.date} - {booking.time}
            </ThemedText>
            <View style={styles.reminderContainer}>
              <ThemedText style={[styles.reminderText, { color: textColor }]}>Remind me</ThemedText>
              <Switch
                trackColor={{ false: '#767577', true: primaryColor }}
                thumbColor={toggleStates[index] ? '#FFFFFF' : '#FFFFFF'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => toggleSwitch(index)}
                value={toggleStates[index]}
              />
            </View>
          </View>
          
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
          
          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.cancelButton, { borderColor: primaryColor }]} onPress={handleCancelBooking}>
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
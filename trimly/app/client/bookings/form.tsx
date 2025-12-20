import { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingFormScreen() {
  const router = useRouter();
  
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  // Helper function to generate time slots
  const getTimeFromIndex = (index: number) => {
    const hours = Math.floor(index / 2) + 9; // Starting from 9 AM
    const minutes = index % 2 === 0 ? '00' : '30';
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes}${period}`;
  };

  const handleConfirmBooking = () => {
    console.log('Booking confirmed with:', { date, time, notes });
    // Navigate to confirmation screen or back to bookings
    router.push('/client/bookings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header with Back Button */}
        <View style={[styles.header, { backgroundColor: 'transparent' }]}> 
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <AntDesign name="left" size={20} color="#000000" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Book Appointment</ThemedText>
        </View>

        {/* Header Texts */}
        <View style={styles.headerTexts}>
          <ThemedText style={styles.mainHeader}>Select Date & Time</ThemedText>
          <ThemedText style={styles.subHeader}>Choose your Preferred appointment</ThemedText>
        </View>

        {/* Date Selection */}
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Select Date</ThemedText>
            <View style={styles.monthYearContainer}>
              <ThemedText style={styles.monthYearText}>December 2023</ThemedText>
              <IconSymbol name="chevron.down" size={16} color="#666666" />
            </View>
          </View>

        {/* Time Selection */}
        <View style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Select Time</ThemedText>
          <View style={styles.timeGrid}>
            {[...Array(9)].map((_, index) => (
              <TouchableOpacity key={index} style={styles.timeSlot}>
                <IconSymbol name="clock" size={16} color="#666666" />
                <ThemedText style={styles.timeText}>{getTimeFromIndex(index)}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Additional Notes <ThemedText style={styles.optionalText}>(Optional)</ThemedText></ThemedText>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
        <ThemedText style={styles.confirmButtonText}>Book Appointment</ThemedText>
      </TouchableOpacity>
    </ThemedView>
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
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2D8A47',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 16,
  },
  bookingInfo: {
    padding: 20,
    backgroundColor: '#F8F8F8',
    margin: 16,
    borderRadius: 12,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  optionName: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D8A47',
  },
  formSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
  },
  textArea: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  specialistCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
  },
  specialistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specialistAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5E5E5',
    marginRight: 12,
  },
  specialistName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  confirmButton: {
    backgroundColor: '#2D8A47',
    margin: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
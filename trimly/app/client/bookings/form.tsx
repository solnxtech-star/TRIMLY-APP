import { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function BookingFormScreen() {
  const router = useRouter();
  
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleConfirmBooking = () => {
    console.log('Booking confirmed with:', { date, time, notes });
    // Navigate to confirmation screen or back to bookings
    router.push('/client/bookings');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <AntDesign name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Confirm Booking</ThemedText>
        </View>

        {/* Booking Info */}
        <View style={styles.bookingInfo}>
          <ThemedText style={styles.serviceName}>Haircut</ThemedText>
          <ThemedText style={styles.optionName}>Deluxe Cut</ThemedText>
          <View style={styles.priceContainer}>
            <ThemedText style={styles.priceLabel}>Total:</ThemedText>
            <ThemedText style={styles.price}>₦7,000</ThemedText>
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Select Date</ThemedText>
          <TouchableOpacity style={styles.inputContainer} onPress={() => console.log('Open date picker')}>
            <TextInput
              style={styles.input}
              placeholder="Select date"
              value={date}
              onChangeText={setDate}
              editable={false}
            />
            <IconSymbol name="calendar" size={20} color="#666666" />
          </TouchableOpacity>
        </View>

        {/* Time Selection */}
        <View style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Select Time</ThemedText>
          <TouchableOpacity style={styles.inputContainer} onPress={() => console.log('Open time picker')}>
            <TextInput
              style={styles.input}
              placeholder="Select time"
              value={time}
              onChangeText={setTime}
              editable={false}
            />
            <IconSymbol name="clock" size={20} color="#666666" />
          </TouchableOpacity>
        </View>

        {/* Notes */}
        <View style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Additional Notes</ThemedText>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Any special requests or notes..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Specialist Selection */}
        <View style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Preferred Specialist</ThemedText>
          <TouchableOpacity style={styles.specialistCard}>
            <View style={styles.specialistInfo}>
              <View style={styles.specialistAvatar} />
              <View>
                <ThemedText style={styles.specialistName}>John Doe</ThemedText>
                <View style={styles.ratingContainer}>
                  <IconSymbol name="star.fill" size={16} color="#FFD700" />
                  <ThemedText style={styles.ratingText}>4.8</ThemedText>
                </View>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#666666" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
        <ThemedText style={styles.confirmButtonText}>Confirm Booking</ThemedText>
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
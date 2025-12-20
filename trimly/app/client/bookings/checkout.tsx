import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useState } from 'react';

export default function CheckoutScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');

  const handleBookAppointment = () => {
    setLoading(true);
    // Simulate booking process
    setTimeout(() => {
      setLoading(false);
      // Navigate to confirmation screen
      router.push('/client/bookings/confirmation');
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="left" size={20} color={textColor} />
        </TouchableOpacity>
        <ThemedText style={[styles.headerTitle, { color: textColor }]}>Book Appointment</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Page Title Section */}
        <View style={styles.titleSection}>
          <ThemedText style={[styles.mainHeading, { color: textColor }]}>Checkout</ThemedText>
          <ThemedText style={[styles.subtitle, { color: textColor }]}>Review your booking details</ThemedText>
        </View>

        {/* Booking Summary Card */}
        <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <ThemedText style={[styles.cardHeader, { color: textColor }]}>Booking Summary</ThemedText>
          
          <View style={styles.detailRow}>
            <ThemedText style={[styles.label, { color: textColor }]}>Service:</ThemedText>
            <ThemedText style={[styles.value, { color: textColor }]}>Classic Haircut</ThemedText>
          </View>
          
          {/* Note: As per design notes, this should likely be "Date:" instead of "Service:" */}
          <View style={styles.detailRow}>
            <ThemedText style={[styles.label, { color: textColor }]}>Service:</ThemedText>
            <ThemedText style={[styles.value, { color: textColor }]}>2024-01-16</ThemedText>
          </View>
          
          <View style={styles.detailRow}>
            <ThemedText style={[styles.label, { color: textColor }]}>Date & Time:</ThemedText>
            <ThemedText style={[styles.value, { color: textColor }]}>10:00 AM</ThemedText>
          </View>
          
          <View style={styles.detailRow}>
            <ThemedText style={[styles.label, { color: textColor }]}>Date & Time:</ThemedText>
            <ThemedText style={[styles.value, { color: textColor }]}>45 min</ThemedText>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <ThemedText style={[styles.totalLabel, { color: textColor }]}>Total:</ThemedText>
            <ThemedText style={styles.totalValue}>₦10,000</ThemedText>
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.paymentSection}>
          <ThemedText style={[styles.paymentHeader, { color: textColor }]}>Payment Method</ThemedText>
          <TouchableOpacity style={[styles.paymentCard, { borderColor }]} onPress={() => Alert.alert('Payment Method', 'Change payment method functionality to be implemented')}>
            <AntDesign name="credit-card" size={24} color="#2D8A47" />
            <ThemedText style={[styles.cardNumber, { color: textColor }]}>******1234</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Primary CTA */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleBookAppointment}
        disabled={loading}
      >
        {loading ? (
          <ThemedText style={styles.buttonText}>Processing...</ThemedText>
        ) : (
          <ThemedText style={styles.buttonText}>Book Appointment</ThemedText>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  titleSection: {
    marginVertical: 24,
  },
  mainHeading: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D8A47',
  },
  paymentSection: {
    marginBottom: 32,
  },
  paymentHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16,
  },
  button: {
    backgroundColor: '#2D8A47',
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
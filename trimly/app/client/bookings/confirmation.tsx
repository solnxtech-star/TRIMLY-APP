import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function BookingConfirmationScreen() {
  const router = useRouter();
  
  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');

  const handleViewBookings = () => {
    // Navigate to bookings main screen
    router.push('/client/bookings');
  };

  // Auto-navigate to bookings after 3 seconds as per user communication standards
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/client/bookings');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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

      {/* Success Illustration */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.badgeIcon}>
            <AntDesign name="check" size={60} color="#FFFFFF" />
          </View>
        </View>

        {/* Confirmation Message */}
        <ThemedText style={[styles.mainHeading, { color: textColor }]}>Booking Confirmed</ThemedText>
        <ThemedText style={[styles.subtitle, { color: textColor }]}>Your appointment has been successfully booked</ThemedText>

        {/* Booking Details Card */}
        <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <ThemedText style={[styles.cardHeader, { color: textColor }]}>Booking Details</ThemedText>
          
          <View style={styles.detailRow}>
            <ThemedText style={[styles.label, { color: textColor }]}>Booking ID:</ThemedText>
            <ThemedText style={[styles.value, { color: textColor }]}>#TRM-2024-001</ThemedText>
          </View>
          
          <View style={styles.detailRow}>
            <ThemedText style={[styles.label, { color: textColor }]}>Service:</ThemedText>
            <ThemedText style={[styles.value, { color: textColor }]}>Classic Haircut</ThemedText>
          </View>
          
          <View style={styles.detailRow}>
            <ThemedText style={[styles.label, { color: textColor }]}>Date & Time:</ThemedText>
            <ThemedText style={[styles.value, { color: textColor }]}>2024-01-16 at 10:00 AM</ThemedText>
          </View>
        </View>
      </View>

      {/* Primary CTA */}
      <TouchableOpacity style={styles.button} onPress={handleViewBookings}>
        <ThemedText style={styles.buttonText}>View My Bookings</ThemedText>
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
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginVertical: 48,
  },
  badgeIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2D8A47',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainHeading: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 48,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
  },
  cardHeader: {
    fontSize: 17,
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
    fontSize: 16,
    fontWeight: '700',
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
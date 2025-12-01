import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ParallaxScrollView from '@/components/parallax-scroll-view';

export default function AppointmentsScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <ThemedView style={styles.headerContainer}>
          <ThemedText type="title" style={styles.headerTitle}>Your Appointments</ThemedText>
        </ThemedView>
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Upcoming Appointments</ThemedText>
      </ThemedView>
      <ThemedView style={styles.appointmentCard}>
        <ThemedText type="subtitle">Haircut & Styling</ThemedText>
        <ThemedText>June 15, 2023 at 2:00 PM</ThemedText>
        <ThemedText>Salon Beautiful</ThemedText>
        <ThemedText>123 Beauty Street, New York</ThemedText>
      </ThemedView>
      <ThemedView style={styles.appointmentCard}>
        <ThemedText type="subtitle">Manicure & Pedicure</ThemedText>
        <ThemedText>June 22, 2023 at 3:30 PM</ThemedText>
        <ThemedText>Nail Perfection Studio</ThemedText>
        <ThemedText>456 Glamour Avenue, New York</ThemedText>
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Past Appointments</ThemedText>
      </ThemedView>
      <ThemedView style={styles.appointmentCard}>
        <ThemedText type="subtitle">Facial Treatment</ThemedText>
        <ThemedText>May 30, 2023 at 1:00 PM</ThemedText>
        <ThemedText>Spa Retreat</ThemedText>
        <ThemedText>789 Relaxation Blvd, New York</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 16,
  },
  appointmentCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: 16,
  },
});
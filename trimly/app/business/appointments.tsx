import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ParallaxScrollView from '@/components/parallax-scroll-view';

export default function BusinessAppointmentsScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <ThemedView style={styles.headerContainer}>
          <ThemedText type="title" style={styles.headerTitle}>Appointments</ThemedText>
        </ThemedView>
      }>
      <ThemedView style={styles.dateHeader}>
        <ThemedText type="title">June 15, 2023</ThemedText>
      </ThemedView>
      <ThemedView style={styles.appointmentCard}>
        <ThemedView style={styles.appointmentHeader}>
          <ThemedText type="subtitle">John Smith</ThemedText>
          <ThemedText>10:00 AM - 11:00 AM</ThemedText>
        </ThemedView>
        <ThemedText>Haircut & Styling</ThemedText>
        <ThemedText>Notes: Prefers scissors over clippers</ThemedText>
        <ThemedView style={styles.buttonRow}>
          <ThemedView style={[styles.button, styles.completeButton]}>
            <ThemedText>Complete</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.button, styles.cancelButton]}>
            <ThemedText>Cancel</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.appointmentCard}>
        <ThemedView style={styles.appointmentHeader}>
          <ThemedText type="subtitle">Sarah Johnson</ThemedText>
          <ThemedText>11:30 AM - 12:30 PM</ThemedText>
        </ThemedView>
        <ThemedText>Manicure & Pedicure</ThemedText>
        <ThemedText>Notes: Likes gel polish</ThemedText>
        <ThemedView style={styles.buttonRow}>
          <ThemedView style={[styles.button, styles.completeButton]}>
            <ThemedText>Complete</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.button, styles.cancelButton]}>
            <ThemedText>Cancel</ThemedText>
          </ThemedView>
        </ThemedView>
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
  dateHeader: {
    marginVertical: 16,
  },
  appointmentCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: 16,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  button: {
    padding: 8,
    borderRadius: 4,
  },
  completeButton: {
    backgroundColor: '#34C759',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
});
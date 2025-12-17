import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CustomSafeAreaView } from '@/components/custom-safe-area-view';
import ParallaxScrollView from '@/components/parallax-scroll-view';

export default function BusinessDashboardScreen() {
  return (
    <CustomSafeAreaView edges="top" style={styles.container}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <ThemedView style={styles.headerContainer}>
            <ThemedText type="title" style={styles.headerTitle}>Business Dashboard</ThemedText>
          </ThemedView>
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome Salon Owner!</ThemedText>
        </ThemedView>
        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statCard}>
            <ThemedText type="title">24</ThemedText>
            <ThemedText>Today's Appointments</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statCard}>
            <ThemedText type="title">$1,240</ThemedText>
            <ThemedText>Today's Revenue</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Recent Appointments</ThemedText>
          <ThemedView style={styles.appointmentRow}>
            <ThemedText>John Smith</ThemedText>
            <ThemedText>Haircut</ThemedText>
            <ThemedText>10:00 AM</ThemedText>
          </ThemedView>
          <ThemedView style={styles.appointmentRow}>
            <ThemedText>Sarah Johnson</ThemedText>
            <ThemedText>Manicure</ThemedText>
            <ThemedText>11:30 AM</ThemedText>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
    </CustomSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  section: {
    marginVertical: 16,
  },
  appointmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
});
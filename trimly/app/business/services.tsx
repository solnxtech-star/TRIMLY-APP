import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ParallaxScrollView from '@/components/parallax-scroll-view';

export default function BusinessServicesScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#C0C0C0', dark: '#404040' }}
      headerImage={
        <ThemedView style={styles.headerContainer}>
          <ThemedText type="title" style={styles.headerTitle}>Services</ThemedText>
        </ThemedView>
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Your Services</ThemedText>
      </ThemedView>
      <ThemedView style={styles.serviceCard}>
        <ThemedView style={styles.serviceHeader}>
          <ThemedText type="subtitle">Haircut & Styling</ThemedText>
          <ThemedText>$45</ThemedText>
        </ThemedView>
        <ThemedText>Professional haircut with styling</ThemedText>
        <ThemedText>Duration: 45 mins</ThemedText>
        <ThemedView style={styles.buttonRow}>
          <ThemedView style={[styles.button, styles.editButton]}>
            <ThemedText>Edit</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.button, styles.deleteButton]}>
            <ThemedText>Delete</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.serviceCard}>
        <ThemedView style={styles.serviceHeader}>
          <ThemedText type="subtitle">Manicure</ThemedText>
          <ThemedText>$25</ThemedText>
        </ThemedView>
        <ThemedText>Basic manicure with polish</ThemedText>
        <ThemedText>Duration: 30 mins</ThemedText>
        <ThemedView style={styles.buttonRow}>
          <ThemedView style={[styles.button, styles.editButton]}>
            <ThemedText>Edit</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.button, styles.deleteButton]}>
            <ThemedText>Delete</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.addButton}>
        <ThemedText style={styles.addButtonText}>+ Add New Service</ThemedText>
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
  serviceCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: 16,
  },
  serviceHeader: {
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
  editButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  addButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#34C759',
    alignItems: 'center',
    marginVertical: 16,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
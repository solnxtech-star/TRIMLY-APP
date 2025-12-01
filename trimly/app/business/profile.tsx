import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ParallaxScrollView from '@/components/parallax-scroll-view';

export default function BusinessProfileScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#B0B0B0', dark: '#404040' }}
      headerImage={
        <ThemedView style={styles.headerContainer}>
          <ThemedText type="title" style={styles.headerTitle}>Business Profile</ThemedText>
        </ThemedView>
      }>
      <ThemedView style={styles.profileHeader}>
        <ThemedView style={styles.avatar} />
        <ThemedText type="title">Salon Beautiful</ThemedText>
        <ThemedText>Beauty Salon</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Business Information</ThemedText>
        <ThemedView style={styles.infoRow}>
          <ThemedText>Address:</ThemedText>
          <ThemedText>123 Beauty Street, New York</ThemedText>
        </ThemedView>
        <ThemedView style={styles.infoRow}>
          <ThemedText>Phone:</ThemedText>
          <ThemedText>(123) 456-7890</ThemedText>
        </ThemedView>
        <ThemedView style={styles.infoRow}>
          <ThemedText>Email:</ThemedText>
          <ThemedText>info@salonbeautiful.com</ThemedText>
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Business Hours</ThemedText>
        <ThemedView style={styles.infoRow}>
          <ThemedText>Monday-Friday:</ThemedText>
          <ThemedText>9:00 AM - 7:00 PM</ThemedText>
        </ThemedView>
        <ThemedView style={styles.infoRow}>
          <ThemedText>Saturday:</ThemedText>
          <ThemedText>10:00 AM - 5:00 PM</ThemedText>
        </ThemedView>
        <ThemedView style={styles.infoRow}>
          <ThemedText>Sunday:</ThemedText>
          <ThemedText>Closed</ThemedText>
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Account Settings</ThemedText>
        <ThemedView style={styles.button}>
          <ThemedText>Edit Business Profile</ThemedText>
        </ThemedView>
        <ThemedView style={styles.button}>
          <ThemedText>Change Password</ThemedText>
        </ThemedView>
        <ThemedView style={[styles.button, styles.logoutButton]}>
          <ThemedText>Logout</ThemedText>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  button: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    marginBottom: 8,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
});
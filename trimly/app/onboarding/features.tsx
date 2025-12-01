import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function FeaturesScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>Why Choose Trimly?</ThemedText>
        
        <ThemedView style={styles.featureCard}>
          <ThemedText style={styles.featureTitle}>🔍 Easy Discovery</ThemedText>
          <ThemedText style={styles.featureDescription}>
            Find the best salons and beauty professionals in your area
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.featureCard}>
          <ThemedText style={styles.featureTitle}>📅 Smart Scheduling</ThemedText>
          <ThemedText style={styles.featureDescription}>
            Book appointments 24/7 with real-time availability
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.featureCard}>
          <ThemedText style={styles.featureTitle}>💳 Secure Payments</ThemedText>
          <ThemedText style={styles.featureDescription}>
            Pay securely through the app with multiple payment options
          </ThemedText>
        </ThemedView>
      </ThemedView>
      
      <View style={styles.buttonContainer}>
        <Link href="/onboarding/account-type" style={styles.button}>
          <ThemedText style={styles.buttonText}>Continue</ThemedText>
        </Link>
        <Link href="/onboarding/welcome" style={styles.secondaryButton}>
          <ThemedText style={styles.secondaryButtonText}>Back</ThemedText>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 40,
  },
  featureCard: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featureDescription: {
    opacity: 0.7,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>Welcome to Trimly</ThemedText>
        <ThemedText style={styles.subtitle}>
          Your ultimate beauty appointment booking app
        </ThemedText>
        <ThemedView style={styles.featureContainer}>
          <ThemedText style={styles.feature}>✨ Book appointments instantly</ThemedText>
          <ThemedText style={styles.feature}>✨ Discover top-rated salons</ThemedText>
          <ThemedText style={styles.feature}>✨ Manage your beauty schedule</ThemedText>
        </ThemedView>
      </ThemedView>
      
      <View style={styles.buttonContainer}>
        <Link href="/onboarding/features" style={styles.button}>
          <ThemedText style={styles.buttonText}>Get Started</ThemedText>
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
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.7,
  },
  featureContainer: {
    alignItems: 'flex-start',
    gap: 15,
  },
  feature: {
    fontSize: 16,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
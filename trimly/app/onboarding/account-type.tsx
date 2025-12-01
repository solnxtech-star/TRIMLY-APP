import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, router } from 'expo-router';

export default function AccountTypeScreen() {
  const selectAccountType = (type: 'client' | 'business') => {
    // Here you would typically save the account type preference
    // For now, we'll navigate to the appropriate auth flow
    router.push(`/auth/sign-up`);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>Choose Account Type</ThemedText>
        <ThemedText style={styles.subtitle}>
          Select how you want to use Trimly
        </ThemedText>
        
        <ThemedView 
          style={styles.accountCard} 
          onTouchEnd={() => selectAccountType('client')}
        >
          <ThemedText style={styles.cardTitle}>👤 Client</ThemedText>
          <ThemedText style={styles.cardDescription}>
            Book appointments with beauty professionals
          </ThemedText>
        </ThemedView>
        
        <ThemedView 
          style={styles.accountCard} 
          onTouchEnd={() => selectAccountType('business')}
        >
          <ThemedText style={styles.cardTitle}>💼 Business Owner</ThemedText>
          <ThemedText style={styles.cardDescription}>
            Manage your salon and appointments
          </ThemedText>
        </ThemedView>
      </ThemedView>
      
      <View style={styles.buttonContainer}>
        <Link href="/onboarding/features" style={styles.secondaryButton}>
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
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.7,
  },
  accountCard: {
    padding: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardDescription: {
    opacity: 0.7,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingBottom: 40,
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
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams, router } from 'expo-router';
import { FontSizes } from '@/constants/theme';

export default function EmailVerificationSuccessScreen() {
  // Get the role from the URL parameters
  const params = useLocalSearchParams();
  const role = params.role || 'customer';

  const handleGoHome = () => {
    // Navigate to the appropriate dashboard based on the selected role
    if (role === 'vendor') {
      router.replace('/business/dashboard');
    } else {
      // Default to client dashboard for customer role or any other case
      router.replace('/client/dashboard');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <Image
          source={require('@/assets/auth/verify.png')}
          style={styles.successIcon}
          contentFit="contain"
        />
        
        {/* Success Message */}
        <ThemedText style={styles.title}>Verified!</ThemedText>
        <ThemedText style={styles.subtitle}>You have successfully verified your email</ThemedText>
      </View>
      
      {/* Call-to-Action Button */}
      <TouchableOpacity 
        style={styles.homeButton}
        onPress={handleGoHome}
      >
        <ThemedText style={styles.homeButtonText}>Go to Home</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    width: 85,
    height: 85,
    marginBottom: 35,
  },
  title: {
    fontSize: FontSizes.titleLg, // 28
    fontWeight: 'bold',
    color: '#1A1D2E',
    marginBottom: 13,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.md, // 14
    color: '#6B7280',
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 270,
  },
  homeButton: {
    backgroundColor: '#2D8A4B',
    borderRadius: 13,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  homeButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md, // 14
    fontWeight: '500',
  },
});
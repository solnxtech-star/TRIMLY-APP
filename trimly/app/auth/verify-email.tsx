import { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams, router } from 'expo-router';

export default function VerifyEmailScreen() {
  // Get the role from the URL parameters
  const params = useLocalSearchParams();
  const role = params.role || 'customer';
  const email = params.email || '';

  useEffect(() => {
    // Simulate sending verification email
    console.log(`Sending verification email to ${email}`);
  }, [email]);

  const handleResendEmail = () => {
    // Simulate resending verification email
    Alert.alert(
      'Email Resent',
      'A new verification email has been sent to your inbox.',
      [{ text: 'OK' }]
    );
  };

  const handleContinue = () => {
    // Navigate to email verification success screen
    router.replace({
      pathname: '/auth/email-verification-success',
      params: { role }
    });
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.replace({ pathname: '/auth/sign-up', params: { role } })}
      >
        <ThemedText style={styles.backIcon}>←</ThemedText>
      </TouchableOpacity>
      
      <ThemedView style={styles.content}>
        {/* Page Header */}
        <ThemedText style={styles.title}>Verify Your Email</ThemedText>
        <ThemedText style={styles.subtitle}>We've sent a verification email to {email}. Please check your inbox and click the verification link to continue.</ThemedText>
        
        {/* Envelope Icon */}
        <View style={styles.iconContainer}>
          <ThemedText style={styles.envelopeIcon}>✉️</ThemedText>
        </View>
        
        {/* Resend Button */}
        <TouchableOpacity 
          style={styles.resendButton} 
          onPress={handleResendEmail}
        >
          <ThemedText style={styles.resendButtonText}>Resend Email</ThemedText>
        </TouchableOpacity>
        
        {/* Continue Button */}
        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={handleContinue}
        >
          <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backIcon: {
    fontSize: 26,
    color: '#1A1D2E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 100,
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1A1D2E',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 60,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2D8A4B',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 40,
  },
  envelopeIcon: {
    fontSize: 40,
    color: '#FFFFFF',
  },
  resendButton: {
    backgroundColor: 'transparent',
    borderColor: '#2D8A4B',
    borderWidth: 1,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resendButtonText: {
    color: '#2D8A4B',
    fontSize: 16,
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#2D8A4B',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
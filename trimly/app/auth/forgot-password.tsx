import { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { FontSizes } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Get the role from the URL parameters
  const params = useLocalSearchParams();
  const role = params.role || 'customer';

  const handleResetPassword = () => {
    // Here you would typically call your password reset API
    if (email) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        // Navigate to OTP verification screen
        router.replace({ pathname: '/auth/otp-verification', params: { role } });
      }, 1000);
    } else {
      Alert.alert('Error', 'Please enter your email address');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.replace({ pathname: '/auth/sign-in', params: { role } })}
      >
        <ThemedText style={styles.backIcon}>←</ThemedText>
      </TouchableOpacity>
      
      <ThemedView style={styles.content}>
        {/* Page Header */}
        <ThemedText style={styles.title}>Forgot Password</ThemedText>
        <ThemedText style={styles.subtitle}>Please enter your email address then we will help you recover your account</ThemedText>
        
        {/* Email Input Field */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        {/* Next Button */}
        <TouchableOpacity 
          style={[styles.nextButton, isLoading && styles.nextButtonDisabled]} 
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ThemedText style={styles.loadingText}>●●●</ThemedText>
          ) : (
            <ThemedText style={styles.nextButtonText}>Next</ThemedText>
          )}
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
  },
  backIcon: {
    fontSize: FontSizes.xxl, // 20
    color: '#1A1D2E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  title: {
    fontSize: FontSizes.titleMd, // 24
    fontWeight: 'bold',
    color: '#1A1D2E',
    marginBottom: 10,
    lineHeight: 40
  },
  subtitle: {
    fontSize: FontSizes.md, // 14
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 50,
  },
  input: {
    height: 58,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 18,
    fontSize: FontSizes.md, // 14
    color: '#1A1D2E',
    marginBottom: 140,
  },
  nextButton: {
    backgroundColor: '#2D8A4B',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.7,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md, // 14
    fontWeight: '500',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: FontSizes.xl, // 18
  },
});
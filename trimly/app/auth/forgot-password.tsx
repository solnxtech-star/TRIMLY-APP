import { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { FontSizes } from '@/constants/theme';
import authService from '@/services/authService';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  // Get the role from the URL parameters
  const params = useLocalSearchParams();
  const role = params.role || 'customer';

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    // Reset errors
    setEmailError('');
    
    // Validate email
    if (!email) {
      setEmailError('Email is required');
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    try {
      // Request password reset via API
      await authService.requestPasswordReset({
        email: email.trim(),
      });
      
      console.log('Password reset email sent');
      
      // Show success message
      Alert.alert(
        'Reset Link Sent',
        'A password reset link has been sent to your email address. Please check your inbox and follow the instructions.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back to sign-in
              router.replace({ pathname: '/auth/sign-in', params: { role } });
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Password reset request failed:', error);
      setIsLoading(false);
      
      // Handle specific error messages
      const errorMessage = error.message || 'Failed to send reset link. Please try again.';
      
      // Check for specific field errors
      if (error.data && error.data.email) {
        setEmailError(Array.isArray(error.data.email) ? error.data.email[0] : error.data.email);
      }
      
      // Show error alert
      Alert.alert(
        'Reset Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
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
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            // Clear error on change
            if (emailError) {
              setEmailError('');
            }
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? (
          <ThemedText style={styles.errorMessage}>{emailError}</ThemedText>
        ) : null}
        
        {/* Next Button */}
        <TouchableOpacity 
          style={[styles.nextButton, isLoading && styles.nextButtonDisabled]} 
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <ThemedText style={styles.nextButtonText}>Send Reset Link</ThemedText>
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
    marginBottom: 20,
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  errorMessage: {
    fontSize: FontSizes.sm,
    color: '#EF4444',
    marginBottom: 120,
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
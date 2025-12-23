import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, TextInput } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { FontSizes } from '@/constants/theme';

export default function OTPVerificationScreen() {
  const [otp, setOtp] = useState(['1', '4', '7', '7']);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  // Get the role from the URL parameters
  const params = useLocalSearchParams();
  const role = params.role || 'customer';

  const handleVerify = () => {
    // Here you would typically call your OTP verification API
    const otpString = otp.join('');
    if (otpString.length === 4) {
      // Simulate API call
      setTimeout(() => {
        // Navigate to the appropriate dashboard based on the selected role
        if (role === 'vendor') {
          router.replace('/business/dashboard');
        } else {
          // Default to client dashboard for customer role or any other case
          router.replace('/client/dashboard');
        }
      }, 1000);
    } else {
      Alert.alert('Error', 'Please enter a valid 4-digit OTP');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input if value entered
      if (value && index < 3) {
        setFocusedIndex(index + 1);
      }
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      setFocusedIndex(index - 1);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.replace({ pathname: '/auth/forgot-password', params: { role } })}
      >
        <ThemedText style={styles.backIcon}>←</ThemedText>
      </TouchableOpacity>
      
      <ThemedView style={styles.content}>
        {/* Page Header */}
        <ThemedText style={styles.title}>Get Your OTP</ThemedText>
        <ThemedText style={styles.subtitle}>Please enter your email address then we will help you recover your account</ThemedText>
        
        {/* OTP Input Fields */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={[
                styles.otpBox,
                focusedIndex === index && styles.otpBoxFocused
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(index, value)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(-1)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              autoFocus={index === 0}
            />
          ))}
        </View>
        
        {/* Verify Button */}
        <TouchableOpacity 
          style={styles.verifyButton} 
          onPress={handleVerify}
        >
          <ThemedText style={styles.verifyButtonText}>Verify and Proceed</ThemedText>
        </TouchableOpacity>
        
        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <ThemedText style={styles.signUpText}>Don't have an account? </ThemedText>
          <Link href={{ pathname: '/auth/sign-up', params: { role } }}>
            <ThemedText style={styles.signUpLink}>Create account</ThemedText>
          </Link>
        </View>
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
    width: 34,
    height: 34,
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
    // color: '#1A1D2E',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: FontSizes.md, // 14
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 60,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 60,
  },
  otpBox: {
    width: 55,
    height: 55,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 13,
    fontSize: FontSizes.xl, // 18
    fontWeight: 'bold',
    color: '#1A1D2E',
    textAlign: 'center',
    lineHeight: 1,
  },
  otpBoxFocused: {
    borderColor: '#2D8A4B',
    borderWidth: 2,
  },
  verifyButton: {
    backgroundColor: '#2D8A4B',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md, // 14
    fontWeight: '500',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    fontSize: FontSizes.md, // 14
    color: '#6B7280',
  },
  signUpLink: {
    fontSize: FontSizes.md, // 14
    color: '#2D8A4B',
    fontWeight: '500',
  },
});
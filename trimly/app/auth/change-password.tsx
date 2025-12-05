import { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ChangePasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Get the role from the URL parameters
  const params = useLocalSearchParams();
  const role = params.role || 'customer';

  const handleChangePassword = () => {
    // Here you would typically call your change password API
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        // Handle password mismatch
        return;
      }
      
      // Simulate API call
      setTimeout(() => {
        // Navigate to sign in screen after successful password change
        router.replace({ pathname: '/auth/sign-in', params: { role } });
      }, 1000);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.replace({ pathname: '/auth/otp-verification', params: { role } })}
      >
        <ThemedText style={styles.backIcon}>←</ThemedText>
      </TouchableOpacity>
      
      <ThemedView style={styles.content}>
        {/* Page Header */}
        <ThemedText style={styles.title}>Enter New Password</ThemedText>
        <ThemedText style={styles.subtitle}>Your new password must be different from previously used password.</ThemedText>
        
        {/* Password Input Field */}
        <ThemedText style={styles.label}>Password</ThemedText>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder="Enter new password"
          />
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons 
              name={showPassword ? 'eye-outline' : 'eye-off-outline'} 
              size={24} 
              color="#1A1D2E" 
            />
          </TouchableOpacity>
        </View>
        
        {/* Confirm Password Input Field */}
        <ThemedText style={styles.label}>Confirm Password</ThemedText>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            placeholder="Confirm new password"
          />
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons 
              name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} 
              size={24} 
              color="#1A1D2E" 
            />
          </TouchableOpacity>
        </View>
        
        {/* Change Password Button */}
        <TouchableOpacity 
          style={styles.changePasswordButton} 
          onPress={handleChangePassword}
        >
          <ThemedText style={styles.changePasswordButtonText}>Change Password</ThemedText>
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
    fontSize: 26,
    color: '#1A1D2E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1A1D2E',
    marginBottom: 10,
    lineHeight: 40
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 50,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  input: {
    height: 58,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 18,
    fontSize: 16,
    color: '#1A1D2E',
    marginBottom: 25,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 18,
    top: 20,
  },
  changePasswordButton: {
    backgroundColor: '#2D8A4B',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  changePasswordButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
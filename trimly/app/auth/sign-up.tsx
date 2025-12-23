import { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FontSizes } from '@/constants/theme';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  // Get the role from the URL parameters
  const params = useLocalSearchParams();
  const role = params.role || 'customer';

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 7;
  };

  const handleSignUp = () => {
    // Reset errors
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    
    let isValid = true;
    
    // Validate name
    if (!name) {
      setNameError('Name is required');
      isValid = false;
    }
    
    // Validate email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError('Password must be at least 7 characters');
      isValid = false;
    }
    
    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }
    
    if (isValid) {
      // Navigate to verify email screen
      router.replace({
        pathname: '/auth/verify-email',
        params: { role, email }
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.replace({ pathname: '/auth/getting-started', params: { role } })}
          >
            <ThemedText style={styles.backIcon}>←</ThemedText>
          </TouchableOpacity>
          
          <View style={styles.content}>
            {/* Page Header */}
            <ThemedText style={styles.title}>Create Account</ThemedText>
            <ThemedText style={styles.subtitle}>Join us today to discover amazing services</ThemedText>
            
            {/* Name Input Field */}
            <ThemedText style={styles.label}>Full Name</ThemedText>
            <TextInput
              style={[styles.input, nameError ? styles.inputError : (name && !nameError ? styles.inputSuccess : null)]}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (nameError) setNameError('');
              }}
              placeholder="Enter your full name"
            />
            {nameError ? (
              <View style={styles.errorMessageContainer}>
                <ThemedText style={styles.errorIcon}>!</ThemedText>
                <ThemedText style={styles.errorMessage}>{nameError}</ThemedText>
              </View>
            ) : name && !nameError ? (
              <View style={styles.successMessageContainer}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <ThemedText style={styles.successMessage}>Valid name</ThemedText>
              </View>
            ) : null}
            
            {/* Email Input Field */}
            <ThemedText style={styles.label}>Email</ThemedText>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : (email && !emailError ? styles.inputSuccess : null)]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
            />
            {emailError ? (
              <View style={styles.errorMessageContainer}>
                <ThemedText style={styles.errorIcon}>!</ThemedText>
                <ThemedText style={styles.errorMessage}>{emailError}</ThemedText>
              </View>
            ) : email && !emailError ? (
              <View style={styles.successMessageContainer}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <ThemedText style={styles.successMessage}>Valid email</ThemedText>
              </View>
            ) : null}
            
            {/* Password Input Field */}
            <ThemedText style={styles.label}>Password</ThemedText>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, passwordError ? styles.inputError : (password && !passwordError ? styles.inputSuccess : null)]}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError('');
                }}
                secureTextEntry={!showPassword}
                placeholder="Create a password"
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
            {passwordError ? (
              <View style={styles.errorMessageContainer}>
                <ThemedText style={styles.errorIcon}>!</ThemedText>
                <ThemedText style={styles.errorMessage}>{passwordError}</ThemedText>
              </View>
            ) : password && !passwordError ? (
              <View style={styles.successMessageContainer}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <ThemedText style={styles.successMessage}>Valid password</ThemedText>
              </View>
            ) : null}
            
            {/* Confirm Password Input Field */}
            <ThemedText style={styles.label}>Confirm Password</ThemedText>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, confirmPasswordError ? styles.inputError : (confirmPassword && !confirmPasswordError ? styles.inputSuccess : null)]}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (confirmPasswordError) setConfirmPasswordError('');
                }}
                secureTextEntry={!showConfirmPassword}
                placeholder="Confirm your password"
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
            {confirmPasswordError ? (
              <View style={styles.errorMessageContainer}>
                <ThemedText style={styles.errorIcon}>!</ThemedText>
                <ThemedText style={styles.errorMessage}>{confirmPasswordError}</ThemedText>
              </View>
            ) : confirmPassword && !confirmPasswordError ? (
              <View style={styles.successMessageContainer}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <ThemedText style={styles.successMessage}>Passwords match</ThemedText>
              </View>
            ) : null}
            
            {/* Sign Up Button */}
            <TouchableOpacity 
              style={styles.signUpButton} 
              onPress={handleSignUp}
            >
              <ThemedText style={styles.signUpButtonText}>Create Account</ThemedText>
            </TouchableOpacity>
            
            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <ThemedText style={styles.signInText}>Already have an account? </ThemedText>
              <Link href={{ pathname: '/auth/sign-in', params: { role } }}>
                <ThemedText style={styles.signInLink}>Sign In</ThemedText>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
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
    fontSize: FontSizes.xxl, // 20
    color: '#1A1D2E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 100,
    paddingBottom: 40,
  },
  title: {
    fontSize: FontSizes.titleMd, // 24
    fontWeight: 'bold',
    color: '#1A1D2E',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: FontSizes.md, // 14
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 40,
  },
  label: {
    fontSize: FontSizes.sm, // 12
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
    fontSize: FontSizes.md, // 14
    color: '#1A1D2E',
    marginBottom: 25,
  },
  inputError: {
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  inputSuccess: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 18,
    top: 20,
  },
  errorMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  successMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  errorMessage: {
    fontSize: FontSizes.sm, // 12
    color: '#EF4444',
  },
  successMessage: {
    fontSize: FontSizes.sm, // 12
    color: '#10B981',
    marginLeft: 8,
  },
  signUpButton: {
    backgroundColor: '#2D8A4B',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md, // 14
    fontWeight: '500',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signInText: {
    fontSize: FontSizes.md, // 14
    color: '#6B7280',
  },
  signInLink: {
    fontSize: FontSizes.md, // 14
    color: '#2D8A4B',
    fontWeight: '500',
  },
});
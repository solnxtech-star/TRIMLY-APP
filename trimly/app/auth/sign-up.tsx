import { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FontSizes } from '@/constants/theme';
import authService from '@/services/authService';
import { UserRole } from '@/types/auth.types';
import CustomAlert from '@/components/CustomAlert';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    buttons: Array<{ text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }>;
  }>({ visible: false, title: '', message: '', buttons: [] });
  
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

  const handleSignUp = async () => {
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    
    let isValid = true;
    
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError('Password must be at least 7 characters');
      isValid = false;
    }
    
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }
    
    if (isValid) {
      setIsLoading(true);
      console.log('Starting registration with role:', role);
      
      try {
        const apiRole = role === 'vendor' ? 'salon_owner' : (role as UserRole);
        console.log('Mapped role:', apiRole);
        
        const response = await authService.register({
          email: email.trim(),
          password1: password,
          password2: confirmPassword,
          role: apiRole,
          phone_number: '',
        });
        
        console.log('Registration API response:', response);
        
        // Auto-login after successful registration
        try {
          console.log('Attempting auto-login...');
          const loginResponse = await authService.login({
            email: email.trim(),
            password: password,
          });
          
          console.log('Auto-login successful:', loginResponse);
          
          // Navigate to verify-email screen
          router.replace('/auth/verify-email');
        } catch (loginError: any) {
          console.error('Auto-login failed:', loginError);
          // If auto-login fails, still go to verify email screen
          router.replace('/auth/verify-email');
        }
      } catch (error: any) {
        console.error('Registration failed:', error);
        setIsLoading(false);
        
        if (error.data) {
          if (error.data.email) {
            setEmailError(Array.isArray(error.data.email) ? error.data.email[0] : error.data.email);
          }
          if (error.data.password1) {
            setPasswordError(Array.isArray(error.data.password1) ? error.data.password1[0] : error.data.password1);
          }
          if (error.data.password2) {
            setConfirmPasswordError(Array.isArray(error.data.password2) ? error.data.password2[0] : error.data.password2);
          }
          if (error.data.non_field_errors) {
            const nonFieldError = Array.isArray(error.data.non_field_errors) 
              ? error.data.non_field_errors[0] 
              : error.data.non_field_errors;
            setPasswordError(nonFieldError);
          }
        }
        
        setAlertConfig({
          visible: true,
          title: 'Registration Failed',
          message: error.message || 'Registration failed. Please try again.',
          buttons: [{ text: 'OK', onPress: () => setAlertConfig(prev => ({ ...prev, visible: false })) }],
        });
      }
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
            <ThemedText style={styles.subtitle}>Insert your details to create your account in minutes and start enjoying our services</ThemedText>
            
            {/* Email Input Field */}
            <TextInput
              style={[styles.input, emailFocused && styles.inputFocused, emailError ? styles.inputError : (email && !emailError && email.length > 0 ? styles.inputSuccess : null)]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                // Real-time validation as user types
                if (!text) {
                  setEmailError('Email is required');
                } else if (!validateEmail(text)) {
                  setEmailError('Please enter a valid email address');
                } else {
                  setEmailError('');
                }
              }}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Email"
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
            {/* <ThemedText style={styles.label}>Password</ThemedText> */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, passwordFocused && styles.inputFocused, passwordError ? styles.inputError : (password && !passwordError && password.length > 0 ? styles.inputSuccess : null)]}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  // Real-time validation as user types
                  if (!text) {
                    setPasswordError('Password is required');
                  } else if (!validatePassword(text)) {
                    setPasswordError('Password must be at least 7 characters');
                  } else {
                    setPasswordError('');
                  }
                }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                secureTextEntry={!showPassword}
                placeholder="Password"
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'} 
                  size={20} 
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
            {/* <ThemedText style={styles.label}>Confirm Password</ThemedText> */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, confirmPasswordFocused && styles.inputFocused, confirmPasswordError ? styles.inputError : (confirmPassword && !confirmPasswordError && confirmPassword.length > 0 ? styles.inputSuccess : null)]}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  // Real-time validation as user types
                  if (!text) {
                    setConfirmPasswordError('Please confirm your password');
                  } else if (password !== text) {
                    setConfirmPasswordError('Passwords do not match');
                  } else {
                    setConfirmPasswordError('');
                  }
                }}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
                secureTextEntry={!showConfirmPassword}
                placeholder="Confirm Password"
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} 
                  size={20} 
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
              style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]} 
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <ThemedText style={styles.signUpButtonText}>Register</ThemedText>
              )}
            </TouchableOpacity>
            
            {/* Divider Section */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <ThemedText style={styles.dividerText}>or register</ThemedText>
              <View style={styles.dividerLine} />
            </View>
            
            {/* Social Sign Up Options */}
            <View style={styles.socialLoginContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Image 
                  source={require('@/assets/auth/google.png')} 
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialButton}>
                <Image 
                  source={require('@/assets/auth/facebook.png')} 
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialButton}>
                <Image 
                  source={require('@/assets/auth/apple.png')} 
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            
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
      
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onDismiss={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
      />
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
    fontSize: FontSizes.titleSm, // 24
    fontWeight: '500',
    color: '#1A1D2E',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: FontSizes.sm, // 14
    color: '#6B7280',
    lineHeight: 15,
    marginBottom: 40,
  },
  label: {
    fontSize: FontSizes.sm, // 12
    color: '#6B7280',
    marginBottom: 8,
  },
  input: {
    height: 50,
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
    color: '#EF4444',
  },
  inputSuccess: {
    borderWidth: 2,
    borderColor: '#10B981',
    color: '#10B981',
  },
  inputFocused: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 18,
    top: 15,
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
    borderRadius: 52,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  signUpButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
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
  errorIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    color: '#FFFFFF',
    fontSize: FontSizes.xs, // 10
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 18,
    marginRight: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: FontSizes.md, // 14
    color: '#1A1D2E',
    marginHorizontal: 15,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 50,
    gap: 20,
  },
  socialButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
});
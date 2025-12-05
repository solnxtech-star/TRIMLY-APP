import { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Alert, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SignInScreen() {
  const [email, setEmail] = useState('amy@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Get the role from the URL parameters
  const params = useLocalSearchParams();
  const role = params.role || 'customer';

  const handleSignIn = () => {
    // Here you would typically call your authentication API
    if (email && password) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        // For demo purposes, let's simulate an error
        if (password !== 'correctpassword') {
          setHasError(true);
        } else {
          // Navigate to the appropriate dashboard based on the selected role
          if (role === 'vendor') {
            router.replace('/business/dashboard');
          } else {
            // Default to client dashboard for customer role or any other case
            router.replace('/client/dashboard');
          }
        }
      }, 1000);
    } else {
      Alert.alert('Error', 'Please enter both email and password');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Page Header */}
        <ThemedText style={styles.title}>Login</ThemedText>
        <ThemedText style={styles.subtitle}>Welcome back, enter your email and password to continue</ThemedText>
        
        {/* Email Input Field */}
        <ThemedText style={styles.label}>Email</ThemedText>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        {/* Password Input Field (Error State) */}
        <ThemedText style={styles.label}>Password</ThemedText>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput, hasError && styles.inputError]}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (hasError) setHasError(false);
            }}
            secureTextEntry={!showPassword}
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
        
        {/* Error Message */}
        {hasError && (
          <View style={styles.errorMessageContainer}>
            <ThemedText style={styles.errorIcon}>!</ThemedText>
            <ThemedText style={styles.errorMessage}>Incorrect password or email</ThemedText>
          </View>
        )}
        
        {/* Forgot Password Link */}
        <Link href={{ pathname: '/auth/forgot-password', params: { role } }} style={styles.forgotPasswordLink}>
          <ThemedText style={styles.forgotPasswordText}>Forgot password?</ThemedText>
        </Link>
        
        {/* Login Button (Loading State) */}
        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
          onPress={handleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ThemedText style={styles.loadingText}>●●●</ThemedText>
          ) : (
            <ThemedText style={styles.loginButtonText}>Login</ThemedText>
          )}
        </TouchableOpacity>
        
        {/* Divider Section */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <ThemedText style={styles.dividerText}>or login</ThemedText>
          <View style={styles.dividerLine} />
        </View>
        
        {/* Social Login Options */}
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
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
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
    marginBottom: 30,
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
    marginBottom: 20,
  },
  inputError: {
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
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
  errorIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 18,
    fontSize: 14,
    marginRight: 8,
  },
  errorMessage: {
    fontSize: 13,
    color: '#EF4444',
  },
  forgotPasswordLink: {
    alignSelf: 'flex-start',
    marginBottom: 30,
  },
  forgotPasswordText: {
    fontSize: 15,
    color: '#2D8A4B',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#2D8A4B',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 24,
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
    fontSize: 14,
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    fontSize: 15,
    color: '#6B7280',
  },
  signUpLink: {
    fontSize: 15,
    color: '#2D8A4B',
    fontWeight: '500',
  },
});
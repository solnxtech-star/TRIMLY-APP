import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FontSizes } from '@/constants/theme';
import authService from '@/services/authService';
import CustomAlert from '@/components/CustomAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    buttons: Array<{ text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }>;
  }>({ visible: false, title: '', message: '', buttons: [] });
  
  // Get the role from the URL parameters
  const params = useLocalSearchParams();
  const role = params.role || 'customer';

  const [hasTriedAutoLogin, setHasTriedAutoLogin] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSignIn = async (overrideEmail?: string, overridePassword?: string) => {
    setEmailError('');
    setPasswordError('');
    
    let isValid = true;
    
    const currentEmail = (overrideEmail ?? email).trim();
    const currentPassword = overridePassword ?? password;

    if (!currentEmail) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(currentEmail)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    if (!currentPassword) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!validatePassword(currentPassword)) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    }
    
    if (isValid) {
      setIsLoading(true);
      console.log('Starting login with email:', currentEmail);
      
      try {
        const response = await authService.login({
          email: currentEmail,
          password: currentPassword,
        });
        
        console.log('Login successful, user role:', response.user.role);
        
        if (response.user.role === 'salon_owner' || response.user.role === 'vendor') {
          router.replace('/business/dashboard');
        } else {
          router.replace('/client/dashboard');
        }
      } catch (error: any) {
        console.error('Login failed:', error);
        setIsLoading(false);
        
        let errorMessage = error.message || 'Login failed. Please try again.';
        let errorTitle = 'Login Failed';
        
        if (error.data) {
          if (error.data.email) {
            setEmailError(Array.isArray(error.data.email) ? error.data.email[0] : error.data.email);
          }
          if (error.data.password) {
            setPasswordError(Array.isArray(error.data.password) ? error.data.password[0] : error.data.password);
          }
          if (error.data.non_field_errors) {
            const nonFieldError = Array.isArray(error.data.non_field_errors) 
              ? error.data.non_field_errors[0] 
              : error.data.non_field_errors;
            
            if (nonFieldError.toLowerCase().includes('not verified')) {
              errorTitle = 'Email Not Verified';
              errorMessage = 'Please verify your email address before logging in. Check your inbox for the verification link.';
            } else {
              setPasswordError(nonFieldError);
            }
          }
        }
        
        setAlertConfig({
          visible: true,
          title: errorTitle,
          message: errorMessage,
          buttons: [{ text: 'OK', onPress: () => setAlertConfig(prev => ({ ...prev, visible: false })) }],
        });
      }
    }
  };

  useEffect(() => {
    const attemptAutoLogin = async () => {
      if (hasTriedAutoLogin) {
        return;
      }

      try {
        const [storedEmail, storedPassword] = await AsyncStorage.multiGet([
          'login_email',
          'login_password',
        ]);

        const emailValue = storedEmail[1] || '';
        const passwordValue = storedPassword[1] || '';

        if (emailValue && passwordValue) {
          setEmail(emailValue);
          setPassword(passwordValue);
          setHasTriedAutoLogin(true);
          await handleSignIn(emailValue, passwordValue);
        } else {
          setHasTriedAutoLogin(true);
        }
      } catch (error) {
        setHasTriedAutoLogin(true);
      }
    };

    attemptAutoLogin();
  }, [hasTriedAutoLogin]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Page Header */}
        <ThemedText style={styles.title}>Login</ThemedText>
        <ThemedText style={styles.subtitle}>Welcome back, enter your email and password to continue</ThemedText>
        
        {/* Email Input Field */}
        {/* <ThemedText style={styles.label}>Email</ThemedText> */}
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
          placeholder='Email'
        />
        {emailError ? (
          <View style={styles.errorMessageContainer}>
            <ThemedText style={styles.errorIcon}>!</ThemedText>
            <ThemedText style={styles.errorMessage}>{emailError}</ThemedText>
          </View>
        )
        //   : email && !emailError ? (
        //   <View style={styles.successMessageContainer}>
        //     <Ionicons name="checkmark-circle" size={18} color="#10B981" />
        //     <ThemedText style={styles.successMessage}>Valid email</ThemedText>
        //   </View>
        // )
          : null}
        
        {/* Password Input Field */}
        {/* <ThemedText style={styles.label}>Password</ThemedText> */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput, passwordFocused && styles.inputFocused, passwordError ? styles.inputError : (password && !passwordError && password.length > 0 ? styles.inputSuccess : null)]}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              // Real-time validation as user types
              if (!text) {
                setPasswordError('Password is required');
              } else if (!validatePassword(text)) {
                setPasswordError('Password must be at least 8 characters');
              } else {
                setPasswordError('');
              }
            }}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            secureTextEntry={!showPassword}
            placeholder='Password'
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
        )
          // : password && !passwordError ? (
          // <View style={styles.successMessageContainer}>
          //   <Ionicons name="checkmark-circle" size={18} color="#10B981" />
          //   <ThemedText style={styles.successMessage}>Valid password</ThemedText>
          // </View>
          // )
            : null}
        

        
        {/* Forgot Password Link */}
        <Link href={{ pathname: '/auth/forgot-password', params: { role } }} style={styles.forgotPasswordLink}>
          <ThemedText style={styles.forgotPasswordText}>Forgot password?</ThemedText>
        </Link>
        
        {/* Login Button (Loading State) */}
        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
          onPress={() => handleSignIn()}
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
          <ThemedText style={styles.signUpText}>Don&#39;t have an account? </ThemedText>
          <Link href={{ pathname: '/auth/sign-up', params: { role } }}>
            <ThemedText style={styles.signUpLink}>Create account</ThemedText>
          </Link>
        </View>
      </ThemedView>
      
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
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  title: {
    fontSize: FontSizes.titleSm,
    fontWeight: '500',
    // color: '#1A1D2E',
    marginBottom: 5,
    lineHeight: 40
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: '#6B7280',
    lineHeight: 15,
    marginBottom: 30,
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
    marginBottom: 20,
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
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 18,
    top: 13,
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
  errorIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 18,
    fontSize: FontSizes.sm, // 12
    marginRight: 8,
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
  forgotPasswordLink: {
    alignSelf: 'flex-start',
    marginBottom: 30,
  },
  forgotPasswordText: {
    fontSize: FontSizes.md, // 14
    color: '#2D8A4B',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#2D8A4B',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md, // 14
    fontWeight: '500',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: FontSizes.xl, // 18
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
    color: 'gray',
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
    borderRadius: 50
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
    fontSize: FontSizes.lg,
    color: '#6B7280',
  },
  signUpLink: {
    fontSize: FontSizes.md, 
    color: '#2D8A4B',
    fontWeight: '500',
  },
});

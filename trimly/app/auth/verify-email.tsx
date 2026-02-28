import { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams, router } from 'expo-router';
import { FontSizes } from '@/constants/theme';
import CustomAlert from '@/components/CustomAlert';

export default function VerifyEmailScreen() {
  const [code, setCode] = useState(['', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  // Custom Alert state
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    buttons?: any[];
  }>({
    visible: false,
    title: '',
    message: '',
  });

  const showAlert = (title: string, message: string, buttons?: any[]) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      buttons,
    });
  };

  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };
  
  // Get the role from the URL parameters
  const params = useLocalSearchParams();
  const role = params.role || 'customer';
  const email = params.email || '';

  useEffect(() => {
    // Simulate sending verification email
    console.log(`Sending verification email to ${email}`);
  }, [email]);

  const handleCodeChange = (index: number, value: string) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      // Auto-focus next input if value entered
      if (value && index < 3) {
        setFocusedIndex(index + 1);
      }
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      setFocusedIndex(index - 1);
    }
  };

  const handleResendEmail = () => {
    // Simulate resending verification email
    showAlert(
      'Email Resent',
      'A new verification email has been sent to your inbox.',
      [{ text: 'OK' }]
    );
  };

  const handleVerify = () => {
    // If all digits are filled
    if (code.every(digit => digit !== '')) {
      // Simulate verification success
      showAlert(
        'Email Verified',
        'Your email has been successfully verified.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              if (role === 'vendor') {
                router.replace('/vendor/dashboard');
              } else {
                router.replace('/client/explore');
              }
            }
          }
        ]
      );
    } else {
      showAlert('Invalid Code', 'Please enter the 4-digit verification code.');
    }
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
        
        {/* Code Input Fields */}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              style={[
                styles.codeBox,
                focusedIndex === index && styles.codeBoxFocused
              ]}
              value={digit}
              onChangeText={(value) => handleCodeChange(index, value)}
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
          onPress={handleVerify}
        >
          <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Custom Alert Component */}
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onDismiss={hideAlert}
      />
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
    // color: '#1A1D2E',
      marginBottom: 10,
    lineHeight: 40
  },
  subtitle: {
    fontSize: FontSizes.md, // 14
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 60,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  codeBox: {
    width: 65,
    height: 65,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 13,
    fontSize: FontSizes.titleLg, // 28
    fontWeight: 'bold',
    color: '#1A1D2E',
    textAlign: 'center',
    // lineHeight: 75,
  },
  codeBoxFocused: {
    borderColor: '#2D8A4B',
    borderWidth: 2,
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
    fontSize: FontSizes.md, // 14
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
    fontSize: FontSizes.md, // 14
    fontWeight: '500',
  },
});
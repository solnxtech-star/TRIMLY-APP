import { useState } from 'react';
import { StyleSheet, TextInput, View, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, router } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    // Here you would typically call your password reset API
    if (email) {
      Alert.alert(
        'Password Reset Email Sent',
        'Check your email for instructions to reset your password.',
        [{ text: 'OK', onPress: () => router.replace('/auth/sign-in') }]
      );
    } else {
      Alert.alert('Error', 'Please enter your email address');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Forgot Password</ThemedText>
      <ThemedText style={styles.subtitle}>
        Enter your email address and we'll send you a link to reset your password.
      </ThemedText>
      
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <ThemedView style={styles.button} onTouchEnd={handleResetPassword}>
          <ThemedText style={styles.buttonText}>Send Reset Link</ThemedText>
        </ThemedView>
        
        <Link href="/auth/sign-in" style={styles.link}>
          <ThemedText type="link">Back to Sign In</ThemedText>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7,
  },
  form: {
    gap: 15,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  link: {
    marginTop: 10,
    textAlign: 'center',
  },
});
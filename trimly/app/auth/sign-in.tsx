import { useState } from 'react';
import { StyleSheet, TextInput, View, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, useLocalSearchParams, router } from 'expo-router';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Get the role from the URL parameters
  const params = useLocalSearchParams();
  const role = params.role || 'customer';

  const handleSignIn = () => {
    // Here you would typically call your authentication API
    if (email && password) {
      // Navigate to the appropriate dashboard based on the selected role
      if (role === 'vendor') {
        router.replace('/business/dashboard');
      } else {
        // Default to client dashboard for customer role or any other case
        router.replace('/client/dashboard');
      }
    } else {
      Alert.alert('Error', 'Please enter both email and password');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Sign In as {role === 'vendor' ? 'Vendor' : 'Customer'}</ThemedText>
      
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <ThemedView style={styles.button} onTouchEnd={handleSignIn}>
          <ThemedText style={styles.buttonText}>Sign In</ThemedText>
        </ThemedView>
        
        <Link href="/auth/forgot-password" style={styles.link}>
          <ThemedText type="link">Forgot Password?</ThemedText>
        </Link>
        
        <Link href={{ pathname: '/auth/sign-up', params: { role } }} style={styles.link}>
          <ThemedText type="link">Don't have an account? Sign Up</ThemedText>
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
    marginBottom: 30,
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
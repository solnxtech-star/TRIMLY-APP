import { StyleSheet, View, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const { width, height } = Dimensions.get('window');

export default function GettingStartedScreen() {
  // Get the role from the URL parameters
  const params = useLocalSearchParams();
  const role = params.role || 'customer';

  return (
    <ThemedView style={styles.container}>
      {/* Full-bleed lifestyle image with dark gradient overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/auth/auth2.png')}
          style={styles.heroImage}
          contentFit="cover"
        />
        <View style={styles.overlay} />
      </View>

      {/* Content section */}
      <View style={styles.contentContainer}>
        <ThemedText style={styles.title}>Let's Get Started</ThemedText>
        <ThemedText style={styles.description}>
          Everything starts from here
        </ThemedText>
        
        {/* Login Button - Primary */}
        {/* @ts-ignore */}
        <Link href={{ pathname: '/auth/sign-in', params: { role } }} style={styles.loginButton}>
          <ThemedText style={styles.loginButtonText}>Login</ThemedText>
        </Link>
        
        {/* Sign Up Button - Secondary */}
        {/* @ts-ignore */}
        <Link href={{ pathname: '/auth/sign-up', params: { role } }} style={styles.signUpButton}>
          <ThemedText style={styles.signUpButtonText}>Sign up</ThemedText>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageContainer: {
    position: 'relative',
    height: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay for better text contrast
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 46,
    marginBottom: 12,
    textAlign: 'left',
  },
  description: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 26,
    textAlign: 'left',
    marginBottom: 40,
  },
  loginButton: {
    width: '100%',
    height: 60,
    borderRadius: 14,
    backgroundColor: '#00C853', // Vibrant green
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    textDecorationLine: 'none',
    paddingTop: 15,
    textAlign: 'center'
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.8
  },
  signUpButton: {
    width: '100%',
    height: 60,
    borderRadius: 14,
    backgroundColor: 'transparent',
    borderColor: '#00C853', // Vibrant green border
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    textDecorationLine: 'none',
    paddingTop: 15,
    textAlign: 'center'
  },
  signUpButtonText: {
    color: '#00C853', // Vibrant green text
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.8
  },
});
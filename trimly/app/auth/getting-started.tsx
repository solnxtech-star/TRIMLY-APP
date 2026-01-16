import { StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontSizes } from '@/constants/theme';

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
        
        {/* Divider Section */}
        {/* <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <ThemedText style={styles.dividerText}>or continue with</ThemedText>
          <View style={styles.dividerLine} />
        </View> */}
        
        {/* Social Login Options */}
        {/* <View style={styles.socialLoginContainer}>
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
        </View> */}
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
    fontSize: FontSizes.titleSm,
    fontWeight: '500',
    // lineHeight: 6,
    // marginBottom: 12,
    textAlign: 'left'
  },
  description: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: FontSizes.sm, // 14
    // fontWeight: '500',
    lineHeight: 22,
    textAlign: 'left',
    marginBottom: 18,
  },
  loginButton: {
    width: '100%',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#00C853', // Vibrant green
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    textDecorationLine: 'none',
    paddingTop: 5
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md, // 14
    fontWeight: 400,
    letterSpacing: 0.8,
    textAlign: 'center'
  },
  signUpButton: {
    width: '100%',
    height: 40,
    borderRadius: 10,
    backgroundColor: 'transparent',
    borderColor: '#00C853', // Vibrant green border
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    textDecorationLine: 'none',
    paddingTop: 5
  },
  signUpButtonText: {
    color: '#00C853', // Vibrant green text
    fontSize: FontSizes.md, // 14
    // fontWeight: 'bold',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    fontSize: FontSizes.md, // 14
    color: '#FFFFFF',
    marginHorizontal: 15,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    width: 40,
    height: 40,
    // backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
});
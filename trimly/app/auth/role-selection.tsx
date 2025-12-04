import { StyleSheet, View, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const { width, height } = Dimensions.get('window');

export default function RoleSelectionScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* Full-bleed hero image with dark overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/auth/auth1.png')}
          style={styles.heroImage}
          contentFit="cover"
        />
        <View style={styles.overlay} />
      </View>

      {/* Content section */}
      <View style={styles.contentContainer}>
        <ThemedText style={styles.title}>Choose Your Role</ThemedText>
        <ThemedText style={styles.description}>
          Select how you want to use Trimly
        </ThemedText>
        
        {/* Customer Button - Primary */}
        {/* @ts-ignore */}
        <Link href={{ pathname: '/auth/getting-started', params: { role: 'customer' } }} style={styles.customerButton}>
          <ThemedText style={styles.customerButtonText}>Customer</ThemedText>
        </Link>
        
        {/* Vendor Button - Secondary */}
        {/* @ts-ignore */}
        <Link href={{ pathname: '/auth/getting-started', params: { role: 'vendor' } }} style={styles.vendorButton}>
          <ThemedText style={styles.vendorButtonText}>Vendor</ThemedText>
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
    paddingBottom: 48,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 44,
    marginBottom: 12,
    textAlign: 'left',
  },
  description: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 26,
    textAlign: 'left',
    marginBottom: 40,
  },
  customerButton: {
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
    textAlign: 'center',
    paddingTop: 15
  },
  customerButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold'
  },
  vendorButton: {
    width: '100%',
    height: 60,
    borderRadius: 14,
    backgroundColor: 'transparent',
    borderColor: '#00C853', // Vibrant green border
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    textDecorationLine: 'none',
    textAlign: 'center',
    paddingTop: 15
  },
  vendorButtonText: {
    color: '#00C853', // Vibrant green text
    fontSize: 17,
    fontWeight: 'bold',
  },
});
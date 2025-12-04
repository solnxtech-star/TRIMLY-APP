import { StyleSheet, View, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const { width, height } = Dimensions.get('window');

export default function FeaturesScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* Full-bleed hero image with dark overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/onboarding/Onboarding2.png')}
          style={styles.heroImage}
          contentFit="cover"
        />
        <View style={styles.overlay} />
      </View>

      {/* Content section */}
      <View style={styles.contentContainer}>
        <ThemedText style={styles.title}>Why Choose Trimly?</ThemedText>
        <ThemedText style={styles.description}>
          We've designed the ultimate platform to connect you with top-rated barbers and beauty professionals.
        </ThemedText>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <ThemedText style={styles.featureEmoji}>🔍</ThemedText>
            <ThemedText style={styles.featureTitle}>Easy Discovery</ThemedText>
            <ThemedText style={styles.featureDescription}>
              Find the best salons and beauty professionals in your area
            </ThemedText>
          </View>
          
          <View style={styles.featureItem}>
            <ThemedText style={styles.featureEmoji}>📅</ThemedText>
            <ThemedText style={styles.featureTitle}>Smart Scheduling</ThemedText>
            <ThemedText style={styles.featureDescription}>
              Book appointments 24/7 with real-time availability
            </ThemedText>
          </View>
          
          <View style={styles.featureItem}>
            <ThemedText style={styles.featureEmoji}>💳</ThemedText>
            <ThemedText style={styles.featureTitle}>Secure Payments</ThemedText>
            <ThemedText style={styles.featureDescription}>
              Pay securely through the app with multiple payment options
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Pagination dots */}
      <View style={styles.paginationContainer}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      {/* Next button */}
      {/* @ts-ignore */}
      <Link href="/onboarding/account-type" style={styles.nextButton}>
        <View style={styles.nextButtonBorder} />
        <ThemedText style={styles.nextButtonText}>→</ThemedText>
      </Link>
      
      {/* Back button */}
      {/* @ts-ignore */}
      <Link href="/onboarding/welcome" style={styles.backButton}>
        <ThemedText style={styles.backButtonText}>←</ThemedText>
      </Link>
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
    height: height, // Full screen height
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
    bottom: 120, // Position above pagination and next button
    left: 0,
    right: 0,
    paddingHorizontal: 32,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: 'bold',
    lineHeight: 40,
    marginBottom: 16,
    textAlign: 'left',
  },
  description: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 26,
    textAlign: 'left',
    marginBottom: 30,
    maxWidth: '85%',
  },
  featuresContainer: {
    gap: 20,
  },
  featureItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
  },
  featureEmoji: {
    fontSize: 24,
    marginBottom: 10,
  },
  featureTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featureDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    lineHeight: 22,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 80,
    left: 32,
    flexDirection: 'row',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginRight: 12,
  },
  activeDot: {
    width: 20, // Longer than the others
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00C853', // Vibrant green for active dot
  },
  nextButton: {
    position: 'absolute',
    bottom: 60,
    right: 32,
    width: 56, // Smaller button
    height: 56,
    borderRadius: 28,
    backgroundColor: 'transparent', // Transparent background
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nextButtonBorder: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#00C853', // Vibrant green border
    borderStyle: 'solid',
  },
  nextButtonText: {
    color: '#00C853', // Vibrant green arrow
    fontSize: 32, // Bigger arrow
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    bottom: 60,
    left: 32,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
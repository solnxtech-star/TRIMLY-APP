import { StyleSheet, View, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const { width, height } = Dimensions.get('window');

export default function AccountTypeScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* Full-bleed hero image with dark overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/onboarding/Onboarding3.png')}
          style={styles.heroImage}
          contentFit="cover"
        />
        <View style={styles.overlay} />
      </View>

      {/* Content section */}
      <View style={styles.contentContainer}>
        <ThemedText style={styles.title}>Schedule Appointments in a Few Taps</ThemedText>
        <ThemedText style={styles.description}>
          Pick your preferred Vendor, choose a time slot, and book instantly—no waiting!
        </ThemedText>
      </View>

      {/* Pagination dots */}
      <View style={styles.paginationContainer}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
      </View>

      {/* Next button - Will be enabled after selection */}
      <View style={[styles.nextButton, styles.disabledButton]}>
        <ThemedText style={styles.nextButtonText}>→</ThemedText>
      </View>
      
      {/* Back button - REMOVED as per user request */}
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
    height: "100%"
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
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#00C853', // Vibrant green border
    backgroundColor: '#FFFFFF', // White background
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
  nextButtonText: {
    color: '#00C853', // Vibrant green arrow
    fontSize: 32, // Bigger arrow
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 40, // Match the container height for perfect vertical centering
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

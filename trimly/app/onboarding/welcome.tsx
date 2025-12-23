import { useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontSizes } from '@/constants/theme';
import CircularProgressButton from '@/components/CircularProgressButton';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const [progress, setProgress] = useState(0);
  
  const handleNext = () => {
    // Simulate progress
    setProgress(1); // Complete the progress
    
    // After a short delay, navigate to the next screen
    setTimeout(() => {
      // Navigation is now handled by the button component
    }, 300);
  };
  
  return (
    <ThemedView style={styles.container}>
      {/* Full-bleed hero image with dark overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/onboarding/Onboarding.png')}
          style={styles.heroImage}
          contentFit="cover"
        />
        <View style={styles.overlay} />
      </View>

      {/* Content section */}
      <View style={styles.contentContainer}>
        <ThemedText style={styles.title}>Welcome to Trimly</ThemedText>
        <ThemedText style={styles.description}>
          Find the best barbers near you, book appointments seamlessly, and enjoy top-tier grooming services.
        </ThemedText>
      </View>

      {/* Pagination dots */}
      <View style={styles.paginationContainer}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      {/* Next button */}
      <View style={styles.nextButtonContainer}>
        <CircularProgressButton
          onPress={handleNext}
          progress={progress}
          size={56}
          progressSize={3}
          progressLength={20}
          staticProgressLength={90}
          arrowColor="#ffffff"
          destination="/onboarding/features"
        />
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
    height: '100%'
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
    fontSize: FontSizes.titleSm, // 28
    fontWeight: 'bold',
    lineHeight: 40,
    marginBottom: 16,
    textAlign: 'left',
  },
  description: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: FontSizes.md, // 14
    fontWeight: '400',
    lineHeight: 26,
    textAlign: 'left',
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
  nextButtonContainer: {
    position: 'absolute',
    bottom: 60,
    right: 32,
  },
});
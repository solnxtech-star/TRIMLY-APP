import { StyleSheet, View, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontSizes } from '@/constants/theme';
import CircularProgressButton from '@/components/CircularProgressButton';

const { width, height } = Dimensions.get('window');

export default function GetStartedScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* Full-bleed hero image with dark overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/onboarding/Onboarding4.png')}
          style={styles.heroImage}
          contentFit="cover"
        />
        <View style={styles.overlay} />
      </View>

      {/* Content section */}
      <View style={styles.contentContainer}>
        <ThemedText style={styles.title}>Pay Easily & Securely</ThemedText>
        <ThemedText style={styles.description}>
          Make hassle-free payments via your favorite payment methods, all within the app.
        </ThemedText>
      </View>

      {/* Pagination dots */}
      <View style={styles.paginationContainer}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
      </View>

      {/* Get Started button */}
      <View style={styles.getStartedButtonContainer}>
        <CircularProgressButton
          onPress={() => {}}
          progress={0}
          size={56}
          progressSize={6}
          progressLength={45}
          staticProgressLength={360}
          arrowColor="#ffffff"
          destination="/auth/role-selection"
        />
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
  getStartedButtonContainer: {
    position: 'absolute',
    bottom: 60,
    right: 32,
  },
});
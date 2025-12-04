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
        <ThemedText style={styles.title}>Choose Account Type</ThemedText>
        <ThemedText style={styles.description}>
          Select how you want to use Trimly
        </ThemedText>
        
        <View style={styles.accountCardsContainer}>
          {/* @ts-ignore */}
          <Link href="/onboarding/get-started" style={styles.accountCard}>
            <ThemedText style={styles.cardEmoji}>👤</ThemedText>
            <ThemedText style={styles.cardTitle}>Client</ThemedText>
            <ThemedText style={styles.cardDescription}>
              Book appointments with beauty professionals
            </ThemedText>
          </Link>
          
          {/* @ts-ignore */}
          <Link href="/onboarding/get-started" style={styles.accountCard}>
            <ThemedText style={styles.cardEmoji}>💼</ThemedText>
            <ThemedText style={styles.cardTitle}>Business Owner</ThemedText>
            <ThemedText style={styles.cardDescription}>
              Manage your salon and appointments
            </ThemedText>
          </Link>
        </View>
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
      
      {/* @ts-ignore */}
      <Link href="/onboarding/features" style={styles.backButton}>
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
    height: height * 0.75,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay gradient
  },
  contentContainer: {
    position: 'absolute',
    bottom: height * 0.25 + 80, // Position above pagination
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
  accountCardsContainer: {
    gap: 20,
  },
  accountCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    textDecorationLine: 'none',
  },
  cardEmoji: {
    fontSize: 36,
    marginBottom: 15,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
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
    backgroundColor: '#00C853', // Vibrant green for active dot
  },
  nextButton: {
    position: 'absolute',
    bottom: 60,
    right: 32,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#00C853', // Vibrant green
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
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
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
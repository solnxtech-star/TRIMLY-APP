import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';

export default function SpecialForYou() {
  const router = useRouter();

  const handleSeeAll = () => {
    // Navigate to special offers screen
    console.log('Navigate to special offers');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Special For You</ThemedText>
        <TouchableOpacity onPress={handleSeeAll}>
          <ThemedText style={styles.seeAllText}>See all</ThemedText>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Card 1 - Visible */}
        <View style={styles.card}>
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>Limited Time!</ThemedText>
          </View>
          
          <View style={styles.cardContent}>
            <ThemedText style={styles.discountText}>Get Special Discount</ThemedText>
            <ThemedText style={styles.percentageText}>Up to <ThemedText style={styles.largePercentage}>10%</ThemedText></ThemedText>
            <ThemedText style={styles.termsText}>All saloons available | T&C applied</ThemedText>
          </View>
          
          <TouchableOpacity style={styles.claimButton}>
            <ThemedText style={styles.claimText}>Claim</ThemedText>
          </TouchableOpacity>
        </View>
        
        {/* Card 2 - Partially Visible */}
        <View style={[styles.card, styles.secondCard]}>
          <View style={[styles.badge, styles.comingSoonBadge]}>
            <ThemedText style={styles.badgeText}>Coming Soon!</ThemedText>
          </View>
          
          <View style={styles.cardContent}>
            <ThemedText style={styles.discountText}>Tattoo</ThemedText>
            {/* More content would go here */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#2D8659',
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 280,
    height: 180,
    borderRadius: 16,
    backgroundColor: '#2D8659',
    position: 'relative',
    overflow: 'hidden',
  },
  secondCard: {
    backgroundColor: '#6B6B6B',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    height: 20,
    justifyContent: 'center',
  },
  comingSoonBadge: {
    backgroundColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#000000',
  },
  cardContent: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  discountText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  largePercentage: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  termsText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  claimButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#2D8659',
    borderRadius: 20,
    width: 80,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  claimText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
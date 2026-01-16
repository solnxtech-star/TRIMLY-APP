import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { FontSizes } from '@/constants/theme';

export default function SpecialForYou() {
  const router = useRouter();

  const handleSeeAll = () => {
    router.push('/client/salons');
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
        <TouchableOpacity style={styles.card} onPress={() => router.push('/client/salons')}>
          <Image 
            source={require('@/assets/stock/special.jpg')} 
            style={styles.cardBackground}
            resizeMode="cover"
          />
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>Limited Time!</ThemedText>
          </View>

          <View style={{ position: 'absolute', top: 60, left: 12,}}>
          <ThemedText style={styles.discountText}>Get Special Discount</ThemedText>
            <ThemedText style={styles.percentageText}>Up to <ThemedText style={styles.largePercentage}>10%</ThemedText></ThemedText>
          </View>
          
          <View style={styles.cardContent}>
            <ThemedText style={styles.termsText}>All saloons available | T&C applied</ThemedText>
          </View>
          
          <TouchableOpacity style={styles.claimButton}>
            <ThemedText style={styles.claimText}>Claim</ThemedText>
          </TouchableOpacity>
        </TouchableOpacity>
        
        {/* Card 2 - Partially Visible */}
        <TouchableOpacity style={[styles.card, styles.secondCard]} onPress={() => router.push('/client/salons')}>
          <Image 
            source={require('@/assets/stock/img.png')} 
            style={styles.cardBackground}
            resizeMode="cover"
          />
          <View style={[styles.badge, styles.comingSoonBadge]}>
            <ThemedText style={styles.badgeText}>Coming Soon!</ThemedText>
          </View>
          
          <View style={{ position: 'absolute', top: 60, left: 12,}}>
          <ThemedText style={styles.discountText}>Tatoo</ThemedText>
          </View>
          
          <View style={styles.cardContent}>
            <ThemedText style={styles.termsText}>All saloons available | T&C applied</ThemedText>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    zIndex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: FontSizes.lg, // 18
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: FontSizes.md, // 14
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
    position: 'relative',
    overflow: 'hidden',
  },
  cardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  secondCard: {
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 8,
    height: 25,
    justifyContent: 'center',
    zIndex: 1,
  },
  comingSoonBadge: {
    backgroundColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: FontSizes.sm, // 12
    fontWeight: '400',
    color: '#000000',
  },
  cardContent: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    zIndex: 1,
  },
  discountText: {
    fontSize: FontSizes.lg, // 16
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  percentageText: {
    fontSize: FontSizes.sm, // 12
    fontWeight: '400',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  largePercentage: {
    fontSize: FontSizes.xxl, // 20
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  termsText: {
    fontSize: FontSizes.sm, // 12
    fontWeight: '400',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    zIndex: 1,
  },
  claimText: {
    fontSize: FontSizes.md, // 14
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});